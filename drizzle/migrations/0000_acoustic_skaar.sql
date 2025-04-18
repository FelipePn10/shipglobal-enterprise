CREATE TABLE `balances` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`currency` varchar(3) NOT NULL,
	`amount` decimal(15,2) NOT NULL DEFAULT '0.00',
	`last_updated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `balances_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`cnpj` varchar(14) NOT NULL,
	`corporateEmail` varchar(255) NOT NULL,
	`industry` varchar(255) NOT NULL,
	`country` varchar(255) NOT NULL,
	`state` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`street` varchar(255) NOT NULL,
	`number` varchar(50) NOT NULL,
	`adminFirstName` varchar(255) NOT NULL,
	`adminLastName` varchar(255) NOT NULL,
	`adminPhone` varchar(20) NOT NULL,
	`companyPhone` varchar(20) NOT NULL,
	`password` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`hasPurchaseManager` boolean NOT NULL DEFAULT false,
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	CONSTRAINT `companies_id` PRIMARY KEY(`id`),
	CONSTRAINT `companies_cnpj_unique` UNIQUE(`cnpj`),
	CONSTRAINT `companies_corporateEmail_unique` UNIQUE(`corporateEmail`)
);
--> statement-breakpoint
CREATE TABLE `company_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`company_id` int NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'member',
	`invited_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`accepted_at` datetime,
	CONSTRAINT `company_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exchange_rates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`base_currency` varchar(10) NOT NULL,
	`rates` text NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `exchange_rates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`import_id` varchar(50) NOT NULL,
	`user_id` int,
	`company_id` int,
	`title` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`origin` varchar(255) NOT NULL,
	`destination` varchar(255) NOT NULL,
	`progress` int NOT NULL DEFAULT 0,
	`eta` varchar(50),
	`created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `imports_id` PRIMARY KEY(`id`),
	CONSTRAINT `imports_import_id_unique` UNIQUE(`import_id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sender_id` int NOT NULL,
	`receiver_id` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`is_read` boolean NOT NULL DEFAULT false,
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
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
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL,
	`stripe_account_id` varchar(50),
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `company_members` ADD CONSTRAINT `company_members_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `company_members` ADD CONSTRAINT `company_members_company_id_companies_id_fk` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `imports_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `imports_company_id_companies_id_fk` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_sender_id_users_id_fk` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_receiver_id_users_id_fk` FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_currency_idx` ON `balances` (`user_id`,`currency`);--> statement-breakpoint
CREATE INDEX `user_company_idx` ON `company_members` (`user_id`,`company_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `transactions` (`user_id`);--> statement-breakpoint
CREATE INDEX `date_idx` ON `transactions` (`date`);