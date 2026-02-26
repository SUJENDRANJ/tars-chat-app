import { query } from "./_generated/server";

export const testAuth = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.auth.getUserIdentity();
  },
});
