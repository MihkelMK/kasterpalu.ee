CREATE TABLE `answers` (
	`id` text PRIMARY KEY NOT NULL,
	`creator` text NOT NULL,
	`content` text NOT NULL,
	`question_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`creator` text NOT NULL,
	`content` text NOT NULL,
	`answer_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `questions_content_unique` ON `questions` (`content`);
