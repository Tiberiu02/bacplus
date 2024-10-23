import { protectedProcedure, publicProcedure, router } from "./trpc";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { prisma } from "./prisma";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "../env.js"; // todo: fix TS paths is webpack bundler (deploy.ts)
import sharp from "sharp";
import { findStorageZone, purgeUrl, uploadFile } from "../../infra/cdn/bunny";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { ierarhieLicee, ierarhieScoli } from "~/data/ierarhie";
import { ultimulAnBac, ultimulAnEn } from "~/data/dbQuery";
import { computeHash } from "./computeHash";

const User = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});

export type Context = {
  user?: z.infer<typeof User>;
  prisma: typeof prisma;
};

const JWT_SECRET = env.JWT_SECRET;

export const createExpressContext = ({
  req,
  res,
}: CreateExpressContextOptions): Context => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    const user = User.parse(jwt.verify(token, JWT_SECRET));

    return {
      user,
      prisma,
    };
  }

  return { prisma };
};

export const createFetchContext = ({
  req,
}: FetchCreateContextFnOptions): Context => {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (token) {
    const user = User.parse(jwt.verify(token, JWT_SECRET));

    return {
      user,
      prisma,
    };
  }

  return { prisma };
};

export const appRouter = router({
  test: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.users.findMany();
    return {
      message: "Hello from the server!",
      time: new Date().toISOString(),
      users,
    };
  }),
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.users.findFirst({
        where: {
          email: input.email,
        },
      });
      if (!user) {
        return {
          error: "Email invalid",
          user: null,
        };
      }
      if (user.password !== input.password) {
        return {
          error: "Parolă invalidă",
          user: null,
        };
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        JWT_SECRET
      );

      return {
        error: null,
        user: {
          email: user.email,
          name: user.name,
          token: token,
        },
      };
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.users.findMany();
    const contributii = await ctx.prisma.edit_logs.groupBy({
      by: ["author_id"],
      _count: {
        author_id: true,
      },
      where: {
        author_id: {
          not: null,
        },
        field_name: "sigla",
      },
    });

    const institutiiComplet = await ctx.prisma.institutii.aggregate({
      _count: true,
      where: {
        AND: [
          {
            OR: [
              {
                sigla_lg: true,
              },
              {
                sigla_lipsa: true,
              },
            ],
          },
        ],
      },
    });

    const institutiiLipsa = await ctx.prisma.institutii.aggregate({
      _count: true,
      where: {
        sigla_lipsa: false,
        sigla_lg: false,
      },
    });

    return {
      leaderboard: contributii
        .map((c) => ({
          name: users.find((u) => u.id === c.author_id)?.name,
          count: c._count.author_id,
        }))
        .sort((a, b) => b.count - a.count),
      lipsa: institutiiLipsa._count,
      complet: institutiiComplet._count,
    };
  }),

  sigle: router({
    institutii: protectedProcedure.query(async ({ ctx }) => {
      const authors = await ctx.prisma.users.findMany();

      function getInfoModificare(
        authordId: string | null,
        date: bigint | null
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
          new Date(Number(date))
            .toISOString()
            .replace("T", ", ")
            .replace(/\.\d+Z/, "") + " UTC";
        info += dateStr;
        return info;
      }

      const institutii = (await ctx.prisma.institutii.findMany({})).map(
        (i) => ({
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
        })
      );

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
        const imageLg = await processImage(image, LG_SIZE, LG_MIN_SIZE);
        const imageXs = await processImage(image, XS_SIZE);

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
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

async function processImage(
  image: sharp.Sharp,
  maxSize: number,
  minSize?: number
) {
  const metadata = await image.metadata();

  const [width, height] =
    (metadata.orientation || 0) >= 5
      ? [metadata.height, metadata.width]
      : [metadata.width, metadata.height];

  // Skip if smaller than minSize
  if (!width || !height || (minSize && width < minSize && height < minSize)) {
    return null;
  }

  let newImage = image;

  // Make the image square by expanding
  if (width !== height) {
    const new_size = Math.max(width, height);
    const hasTransparency = metadata.hasAlpha;

    console.log("resizing", width, height, new_size);

    const newBuffer = await sharp({
      create: {
        width: new_size,
        height: new_size,
        channels: hasTransparency ? 4 : 3,
        background: hasTransparency
          ? { r: 0, g: 0, b: 0, alpha: 0 }
          : { r: 255, g: 255, b: 255 },
      },
    })
      .composite([{ input: await image.toBuffer(), gravity: "center" }])
      .png()
      .toBuffer();

    newImage = sharp(newBuffer);
  }

  // Resize if larger than maxSize
  if (width > maxSize || height > maxSize) {
    newImage = newImage.resize(maxSize, maxSize);
  }

  // Save the image
  return await newImage.webp().toBuffer();
}

function parseImageBase64DataUrl(dataUrl: string) {
  // const regex = /^data:.+\/(.+);base64,(.*)$/;

  const [header, data, other] = dataUrl.split(",");

  if (other !== undefined || data === undefined || header === undefined) {
    throw new Error("Invalid data URL: failed to split");
  }

  const [_, ext] = header.match(/^data:image\/(.*?);base64/) ?? [];

  if (!ext) {
    throw new Error("Invalid data URL: header failed regex match");
  }

  const buffer = Buffer.from(data, "base64");

  return {
    ext,
    buffer,
  };
}
