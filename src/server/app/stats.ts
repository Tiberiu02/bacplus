import { protectedProcedure } from "../trpc";

export const statsRouter = protectedProcedure.query(async ({ ctx }) => {
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

  return {
    leaderboard: contributii
      .map((c) => ({
        name: users.find((u) => u.id === c.author_id)?.name,
        count: c._count.author_id,
      }))
      .sort((a, b) => b.count - a.count),
  };
});
