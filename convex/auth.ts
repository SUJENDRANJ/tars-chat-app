import { query } from "./_generated/server";

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    console.log(identity);

    return identity;
  },
});
