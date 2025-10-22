CREATE TABLE `rss_articles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`description` text,
	`published_date` text,
	`author` text,
	`category` text,
	`image_url` text,
	`source` text NOT NULL,
	`estimated_read_time` integer DEFAULT 1,
	`feed_url` text NOT NULL,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
--> statement-breakpoint
CREATE TABLE `saved_items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`url` text NOT NULL,
	`title` text,
	`excerpt` text,
	`image_url` text,
	`word_count` integer,
	`reading_time` integer,
	`domain` text,
	`site_name` text,
	`author` text,
	`content` text,
	`parsing_status` text DEFAULT 'pending',
	`extracted_at` text,
	`is_favorite` integer DEFAULT false,
	`is_archived` integer DEFAULT false,
	`is_deleted` integer DEFAULT false,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP',
	`updated_at` text DEFAULT 'CURRENT_TIMESTAMP'
);
