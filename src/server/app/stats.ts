import { protectedProcedure } from "../trpc";

export const statsRouter = protectedProcedure.query(async ({ ctx }) => {
  const users = await ctx.prisma.users.findMany();
  const contributiiSigle = await ctx.prisma.edit_logs.groupBy({
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
  const contributiiImagini = await ctx.prisma.edit_logs.groupBy({
    by: ["author_id"],
    _count: {
      author_id: true,
    },
    where: {
      author_id: {
        not: null,
      },
      field_name: "photo",
    },
  });

  return users.map((user) => ({
    name: user.name,
    sigle:
      contributiiSigle.find((c) => c.author_id === user.id)?._count.author_id ||
      0,
    imagini:
      contributiiImagini.find((c) => c.author_id === user.id)?._count
        .author_id || 0,
  }));
});
