import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const savedItems = sqliteTable('saved_items', {
  id: text('id').primaryKey(),
  user_id: text('user_id').notNull(),
  url: text('url').notNull(),
  title: text('title'),
  excerpt: text('excerpt'),
  image_url: text('image_url'),
  word_count: integer('word_count'),
  reading_time: integer('reading_time'), // in minutes
  domain: text('domain'),
  site_name: text('site_name'),
  author: text('author'),
  content: text('content'), // Full article content
  parsing_status: text('parsing_status').default('pending'), // 'pending', 'parsed', 'failed'
  extracted_at: text('extracted_at'),
  is_favorite: integer('is_favorite', { mode: 'boolean' }).default(false),
  is_archived: integer('is_archived', { mode: 'boolean' }).default(false),
  is_deleted: integer('is_deleted', { mode: 'boolean' }).default(false),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
})

// RSS Articles table for news feed
export const rssArticles = sqliteTable('rss_articles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  description: text('description'),
  published_date: text('published_date'),
  author: text('author'),
  category: text('category'),
  image_url: text('image_url'),
  source: text('source').notNull(),
  estimated_read_time: integer('estimated_read_time').default(1),
  feed_url: text('feed_url').notNull(),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
})

export type SavedItem = typeof savedItems.$inferSelect
export type RssArticle = typeof rssArticles.$inferSelect

export type InsertSavedItem = typeof savedItems.$inferInsert
export type InsertRssArticle = typeof rssArticles.$inferInsert
