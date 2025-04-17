CREATE TABLE `balances` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`currency` varchar(3) NOT NULL,
	`amount` decimal(15,2) NOT NULL DEFAULT '0.00',
	`last_updated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `balances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`type` varchar(20) NOT NULL,
	`amount` decimal(15,2) NOT NULL,
	`currency` varchar(3) NOT NULL,
	`date` timestamp NOT NULL DEFAULT (now()),
	`status` varchar(20) NOT NULL,
	`description` text,
	`payment_intent_id` varchar(255),
	`target_currency` varchar(3),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
CREATE INDEX `user_currency_idx` ON `balances` (`user_id`,`currency`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `transactions` (`date`);