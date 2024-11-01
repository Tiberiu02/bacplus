import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import sharp from "sharp";
import { findStorageZone, uploadFile } from "../../../infra/cdn/bunny";
import { ierarhieLicee, ierarhieScoli } from "~/data/ierarhie";
import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { computeHash } from "../computeHash";
import {
  getImageDims,
  parseImageBase64DataUrl,
  processPhoto,
} from "../image-processing";
import { groupBy } from "~/data/groupBy";
import { getPhotoUrl, getRawFileUrl } from "~/utils/asset-urls";

function getInfoModificare(
  authordId: string | null,
  date: Date,
  authors: { id: string; name: string }[]
) {
  if (!date) {
    return "";
  }
  let info = "";
  const author = authors.find((a) => a.id === authordId);
  if (author) {
    info += `${author.name}, `;
  }
  const dateStr =
    date
      .toISOString()
      .replace("T", ", ")
      .replace(/\.\d+Z/, "") + " UTC";
  info += dateStr;
  return info;
}

export const photosRouter = router({
  institutii: protectedProcedure.query(async ({ ctx }) => {
    const authors = await ctx.prisma.users.findMany();

    const photos = groupBy(
      await ctx.prisma.photos.findMany({
        orderBy: {
          order_priority: "asc",
        },
      }),
      (i) => i.school_code
    );

    const institutii = (await ctx.prisma.institutii.findMany({})).map((i) => {
      const iPhotos = photos[i.cod_siiir] || [];

      return {
        id: i.cod_siiir,
        sigla: i.sigla_xs,
        nume: i.nume,
        cod_judet: i.cod_judet,
        website: i.website,
        ultima_modificare: Math.max(
          ...iPhotos.map((p) => p.modified_date.getTime())
        ),
        adresa: i.adresa,
        rankLiceu: ierarhieLicee[i.cod_siiir]?.[ultimulAnBac],
        rankGimnaziu: ierarhieScoli[i.cod_siiir]?.[ultimulAnEn],
        photos: iPhotos.map((p) => ({
          id: p.id,
          source: p.source,
          file_name: p.file_name,
          created_info: getInfoModificare(
            p.created_by,
            p.created_date,
            authors
          ),
          modified_info: getInfoModificare(
            p.modified_by,
            p.modified_date,
            authors
          ),
        })),
      };
    });

    return institutii;
  }),

  upload: protectedProcedure
    .input(z.object({ schoolId: z.string(), dataUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("received data URL for id", input.schoolId);

      const { ext, buffer } = parseImageBase64DataUrl(input.dataUrl);

      const hash = await computeHash(buffer);
      const fileName = `${hash}.${ext}`;

      const image = sharp(buffer);
      const [width, height] = await getImageDims(image);

      if (!width || !height) {
        throw new Error("Invalid image dimensions");
      }

      const LG_SIZE = 2000;
      const XS_SIZE = 300;

      console.log("processing image", input.schoolId);
      const imageLg = await processPhoto(image, LG_SIZE);
      const imageXs = await processPhoto(image, XS_SIZE);

      const assetsStorageZone = await findStorageZone("bacplus-assets");

      if (!assetsStorageZone) {
        throw new Error("No storage zone found");
      }

      // Upload the new sigla
      await uploadFile(
        getRawFileUrl(fileName, true),
        buffer,
        assetsStorageZone
      );

      const numSchoolPhotos = await ctx.prisma.photos.count({
        where: {
          school_code: input.schoolId,
        },
      });

      const p = await ctx.prisma.photos.create({
        data: {
          file_name: fileName,
          school_code: input.schoolId,
          created_by: ctx.user.id,
          created_date: new Date(),
          modified_by: ctx.user.id,
          modified_date: new Date(),
          width,
          height,
          order_priority: numSchoolPhotos,
        },
      });

      // Log the change
      await ctx.prisma.edit_logs.create({
        data: {
          institution_id: input.schoolId,
          timestamp: new Date(),
          author_id: ctx.user.id,
          field_name: "photo",
          photo_id: p.id,
          old_value: "",
          new_value: fileName,
        },
      });

      // Upload the resized images
      if (imageLg) {
        console.log("uploading lg");
        await uploadFile(
          getPhotoUrl(p.id, "lg", true),
          imageLg,
          assetsStorageZone
        );
      }
      if (imageXs) {
        console.log("uploading xs");
        await uploadFile(
          // `institutii/${input.schoolId}/sigla-xs.webp`,
          getPhotoUrl(p.id, "xs", true),
          imageXs,
          assetsStorageZone
        );
      }

      // // Update the database
      // await ctx.prisma.institutii.update({
      //   where: {
      //     cod_siiir: input.schoolId,
      //   },
      //   data: {
      //     sigla: fileName,
      //     sigla_lg: !!imageLg,
      //     sigla_xs: !!imageXs,
      //     last_updated: Date.now(),
      //     last_author: ctx.user.id,
      //   },
      // });

      return {
        id: p.id,
        source: p.source,
        file_name: p.file_name,
        created_info: getInfoModificare(p.created_by, p.created_date, [
          ctx.user,
        ]),
        modified_info: getInfoModificare(p.modified_by, p.modified_date, [
          ctx.user,
        ]),
      };
    }),

  delete: protectedProcedure
    .input(z.object({ photoId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      console.log("deleting sigla for id", input.photoId);

      // Find old sigla file name
      const photo = await ctx.prisma.photos.delete({
        where: {
          id: input.photoId,
        },
      });

      // Log the change
      await ctx.prisma.edit_logs.create({
        data: {
          institution_id: photo.school_code,
          timestamp: new Date(),
          author_id: ctx.user.id,
          field_name: "photo",
          photo_id: photo.id,
          old_value: null,
          new_value: null,
        },
      });
    }),

  updateSource: protectedProcedure
    .input(z.object({ photoId: z.number(), source: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const oldPhoto = await ctx.prisma.photos.findUnique({
        where: {
          id: input.photoId,
        },
      });

      if (!oldPhoto) {
        throw new Error("Photo not found");
      }

      const newPhoto = await ctx.prisma.photos.update({
        where: {
          id: input.photoId,
        },
        data: {
          source: input.source,
          modified_by: ctx.user.id,
          modified_date: new Date(),
        },
      });

      // Log the change
      await ctx.prisma.edit_logs.create({
        data: {
          institution_id: oldPhoto.school_code,
          timestamp: new Date(),
          author_id: ctx.user.id,
          field_name: "photo_source",
          photo_id: input.photoId,
          old_value: oldPhoto.source,
          new_value: input.source,
        },
      });

      return getInfoModificare(ctx.user.id, newPhoto.modified_date, [ctx.user]);
    }),

  updateOrdering: protectedProcedure
    .input(z.object({ newOrder: z.array(z.number()), schoolId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const photos = await ctx.prisma.photos.findMany({
        where: {
          school_code: input.schoolId,
        },
      });

      const oldPhotoSet = new Set(photos.map((p) => p.id));
      const newPhotoSet = new Set(input.newOrder);
      if (
        oldPhotoSet.size !== newPhotoSet.size ||
        newPhotoSet.size != input.newOrder.length ||
        input.newOrder.some((id) => !oldPhotoSet.has(id))
      ) {
        throw new Error("Invalid ordering");
      }

      const currentDate = new Date();

      for (let i = 0; i < input.newOrder.length; i++) {
        const photoId = input.newOrder[i];
        const oldOrder = photos.find((p) => p.id === photoId)?.order_priority;

        if (oldOrder === undefined) {
          throw new Error("Invalid ordering");
        }
        if (oldOrder === i) {
          continue;
        }

        await ctx.prisma.photos.update({
          where: {
            id: photoId,
          },
          data: {
            order_priority: i,
            modified_by: ctx.user.id,
            modified_date: currentDate,
          },
        });

        // Log the change
        await ctx.prisma.edit_logs.create({
          data: {
            institution_id: input.schoolId,
            timestamp: currentDate,
            author_id: ctx.user.id,
            field_name: "photo_order_priority",
            photo_id: photoId,
            old_value: `${oldOrder}`,
            new_value: `${i}`,
          },
        });
      }
    }),
});
