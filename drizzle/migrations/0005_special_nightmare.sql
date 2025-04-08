ALTER TABLE `imports` MODIFY COLUMN `user_id` int;--> statement-breakpoint
ALTER TABLE `imports` MODIFY COLUMN `status` varchar(50) NOT NULL DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE `imports` MODIFY COLUMN `eta` varchar(50);--> statement-breakpoint
ALTER TABLE `imports` MODIFY COLUMN `progress` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `imports` ADD `created_at` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
ALTER TABLE `imports` DROP COLUMN `createdAt`;