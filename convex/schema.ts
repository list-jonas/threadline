import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Auth-Tabellen für Nutzer & Sessions
  ...authTables,

  // 2. User Settings
  userSettings: defineTable({
    userId: v.id("users"),
    openRouterApiKey: v.optional(v.string()),
    defaultModel: v.optional(v.string()),
    systemPrompt: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // 3. Folders
  folders: defineTable({
    userId: v.id("users"),
    name: v.string(),
  }).index("by_user", ["userId"]),

  // 4. Conversations
  conversations: defineTable({
    userId: v.id("users"),
    folderId: v.optional(v.id("folders")),
    title: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_folder", ["folderId"]),

  // 5. Messages
  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("system"),
      v.literal("user"),
      v.literal("assistant")
    ),
    content: v.string(),
    metadata: v.optional(v.any()),
  }).index("by_conversation", ["conversationId"]),
});
