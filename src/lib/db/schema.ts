import { relations } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core'

// Users table
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).unique().notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 100 }).notNull(),
  bio: text('bio'),
  profilePicture: text('profile_picture'),
  isVerified: boolean('is_verified').default(false),
  isPrivate: boolean('is_private').default(false),
  followerCount: integer('follower_count').default(0),
  followingCount: integer('following_count').default(0),
  postCount: integer('post_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Posts table
export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  caption: text('caption'),
  imageUrl: text('image_url').notNull(),
  imageAlt: text('image_alt'),
  likeCount: integer('like_count').default(0),
  commentCount: integer('comment_count').default(0),
  shareCount: integer('share_count').default(0),
  location: varchar('location', { length: 255 }),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Likes table
export const likes = pgTable('likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userPostPk: primaryKey(table.userId, table.postId),
}))

// Comments table
export const comments = pgTable('comments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  postId: uuid('post_id').references(() => posts.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  likeCount: integer('like_count').default(0),
  parentCommentId: uuid('parent_comment_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Follows table
export const follows = pgTable('follows', {
  id: uuid('id').defaultRandom().primaryKey(),
  followerId: uuid('follower_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  followingId: uuid('following_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  followerFollowingPk: primaryKey(table.followerId, table.followingId),
}))

// Stories table
export const stories = pgTable('stories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),
  viewCount: integer('view_count').default(0),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Messages table for real-time chat
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  senderId: uuid('sender_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  receiverId: uuid('receiver_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  messageType: varchar('message_type', { length: 20 }).default('text'), // text, image, etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Conversations table
export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  participant1Id: uuid('participant1_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  participant2Id: uuid('participant2_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  lastMessageId: uuid('last_message_id').references(() => messages.id),
  lastMessageAt: timestamp('last_message_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  participantsPk: primaryKey(table.participant1Id, table.participant2Id),
}))

// Notifications table
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  fromUserId: uuid('from_user_id').references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // like, comment, follow, mention
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false),
  relatedPostId: uuid('related_post_id').references(() => posts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  likes: many(likes),
  comments: many(comments),
  followers: many(follows, { relationName: 'follower' }),
  following: many(follows, { relationName: 'following' }),
  stories: many(stories),
  sentMessages: many(messages, { relationName: 'sender' }),
  receivedMessages: many(messages, { relationName: 'receiver' }),
  notifications: many(notifications),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  likes: many(likes),
  comments: many(comments),
}))

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  parentComment: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
  }),
  replies: many(comments),
}))

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: 'follower',
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: 'following',
  }),
}))

export const storiesRelations = relations(stories, ({ one }) => ({
  user: one(users, {
    fields: [stories.userId],
    references: [users.id],
  }),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: 'receiver',
  }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  fromUser: one(users, {
    fields: [notifications.fromUserId],
    references: [users.id],
  }),
  relatedPost: one(posts, {
    fields: [notifications.relatedPostId],
    references: [posts.id],
  }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type Like = typeof likes.$inferSelect
export type Comment = typeof comments.$inferSelect
export type Follow = typeof follows.$inferSelect
export type Story = typeof stories.$inferSelect
export type Message = typeof messages.$inferSelect
export type Conversation = typeof conversations.$inferSelect
export type Notification = typeof notifications.$inferSelect
