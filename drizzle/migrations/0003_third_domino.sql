ALTER TABLE `imports` ADD `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `imports_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;