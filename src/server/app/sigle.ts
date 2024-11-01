import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import sharp from "sharp";
import {
  findStorageZone,
  purgeUrl,
  uploadFile,
} from "../../../infra/cdn/bunny";
import { ierarhieLicee, ierarhieScoli } from "~/data/ierarhie";
import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { computeHash } from "../computeHash";
import { parseImageBase64DataUrl, processSigla } from "../image-processing";

export const sigleRouter = router({
  institutii: protectedProcedure.query(async ({ ctx }) => {
    const authors = await ctx.prisma.users.findMany();

    function getInfoModificare(authordId: string | null, date: bigint | null) {
      if (!date) {
        return "";
      }
      let info = "";
      const author = authors.find((a) => a.id === authordId);
      if (author) {
        info += `${author.name}, `;
      }
      const dateStr =
        new Date(Number(date))
          .toISOString()
          .replace("T", ", ")
          .replace(/\.\d+Z/, "") + " UTC";
      info += dateStr;
      return info;
    }

    const institutii = (await ctx.prisma.institutii.findMany({})).map((i) => ({
      id: i.cod_siiir,
      nume: i.nume,
      cod_judet: i.cod_judet,
      website: i.website,
      sigla: i.sigla,
      sigla_xs: i.sigla_xs,
      sigla_lg: i.sigla_lg,
      sigla_lipsa: i.sigla_lipsa,
      info_modificare: getInfoModificare(i.last_author, i.last_updated),
      ultima_modificare: Number(i.last_updated),
      rankLiceu: ierarhieLicee[i.cod_siiir]?.[ultimulAnBac],
      rankGimnaziu: ierarhieScoli[i.cod_siiir]?.[ultimulAnEn],
    }));

    return institutii;
  }),

  upload: protectedProcedure
    .input(z.object({ id: z.string(), dataUrl: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("received data URL for id", input.id);

      const { ext, buffer } = parseImageBase64DataUrl(input.dataUrl);

      const hash = await computeHash(buffer);
      const fileName = `${hash}.${ext}`;

      const image = sharp(buffer);

      const LG_SIZE = 320;
      const LG_MIN_SIZE = 96;
      const XS_SIZE = 32;

      console.log("processing image", input.id);
      const imageLg = await processSigla(image, LG_SIZE, LG_MIN_SIZE);
      const imageXs = await processSigla(image, XS_SIZE);

      const assetsStorageZone = await findStorageZone("bacplus-assets");

      if (!assetsStorageZone) {
        throw new Error("No storage zone found");
      }

      // Find old sigla file name
      const oldSigla = await ctx.prisma.institutii.findUnique({
        where: {
          cod_siiir: input.id,
        },
        select: {
          sigla: true,
        },
      });

      // Log the change
      await ctx.prisma.edit_logs.create({
        data: {
          institution_id: input.id,
          timestamp: new Date(),
          author_id: ctx.user.id,
          field_name: "sigla",
          old_value: oldSigla?.sigla,
          new_value: fileName,
        },
      });

      // Upload the new sigla
      await uploadFile(`files/${fileName}`, buffer, assetsStorageZone);
      await purgeUrl(`https://bacplus-assets.b-cdn.net/files/${fileName}`);

      // Upload the resized images
      if (imageLg) {
        console.log("uploading lg");
        await uploadFile(
          `institutii/${input.id}/sigla-lg.webp`,
          imageLg,
          assetsStorageZone
        );
        await purgeUrl(
          `https://bacplus-assets.b-cdn.net/institutii/${input.id}/sigla-lg.webp`
        );
      }
      if (imageXs) {
        console.log("uploading xs");
        await uploadFile(
          `institutii/${input.id}/sigla-xs.webp`,
          imageXs,
          assetsStorageZone
        );
        await purgeUrl(
          `https://bacplus-assets.b-cdn.net/institutii/${input.id}/sigla-xs.webp`
        );
      }

      // Update the database
      await ctx.prisma.institutii.update({
        where: {
          cod_siiir: input.id,
        },
        data: {
          sigla: fileName,
          sigla_lg: !!imageLg,
          sigla_xs: !!imageXs,
          last_updated: Date.now(),
          last_author: ctx.user.id,
        },
      });

      return imageLg ? "lg" : "xs";
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log("deleting sigla for id", input.id);

      // Find old sigla file name
      const oldSigla = await ctx.prisma.institutii.findUnique({
        where: {
          cod_siiir: input.id,
        },
        select: {
          sigla: true,
        },
      });

      if (!oldSigla?.sigla) {
        return;
      }

      // Log the change
      await ctx.prisma.edit_logs.create({
        data: {
          institution_id: input.id,
          timestamp: new Date(),
          author_id: ctx.user.id,
          field_name: "sigla",
          old_value: oldSigla.sigla,
          new_value: null,
        },
      });

      // Delete the files
      await ctx.prisma.institutii.update({
        where: {
          cod_siiir: input.id,
        },
        data: {
          sigla: null,
          sigla_lg: false,
          sigla_xs: false,
          last_updated: Date.now(),
          last_author: ctx.user.id,
        },
      });
    }),

  marcheazaFaraSigla: protectedProcedure
    .input(z.object({ id: z.string(), faraSigla: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      console.log("marcheaza fara sigla", input.id, input.faraSigla);

      // Find old sigla file name
      const oldSigla = await ctx.prisma.institutii.findUnique({
        where: {
          cod_siiir: input.id,
        },
        select: {
          sigla_lipsa: true,
        },
      });

      // Log the change
      await ctx.prisma.edit_logs.create({
        data: {
          institution_id: input.id,
          timestamp: new Date(),
          author_id: ctx.user.id,
          field_name: "fara_sigla",
          old_value: oldSigla?.sigla_lipsa ? "true" : "false",
          new_value: input.faraSigla ? "true" : "false",
        },
      });

      // Update the database
      await ctx.prisma.institutii.update({
        where: {
          cod_siiir: input.id,
        },
        data: {
          sigla_lipsa: input.faraSigla,
          last_updated: Date.now(),
          last_author: ctx.user.id,
        },
      });
      console.log("updated", input.id);
    }),
});
