import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const saveUserSettings = mutation({
  args: {
    openRouterApiKey: v.optional(v.string()),
    defaultModel: v.optional(v.string()),
    systemPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = Date.now();

    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) {
      const updateData: any = {};
      if (args.openRouterApiKey !== undefined)
        updateData.openRouterApiKey = args.openRouterApiKey;
      if (args.defaultModel !== undefined)
        updateData.defaultModel = args.defaultModel;
      if (args.systemPrompt !== undefined)
        updateData.systemPrompt = args.systemPrompt;

      await ctx.db.patch(existing._id, updateData);
    } else {
      await ctx.db.insert("userSettings", {
        userId,
        openRouterApiKey: args.openRouterApiKey || "",
        defaultModel: args.defaultModel,
        systemPrompt: args.systemPrompt,
      });
    }
  },
});
