CREATE TABLE `imports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`import_id` varchar(50) NOT NULL,
	`company_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`status` varchar(50) NOT NULL,
	`origin` varchar(255) NOT NULL,
	`destination` varchar(255) NOT NULL,
	`eta` varchar(50) NOT NULL,
	`last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`progress` int NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `imports_id` PRIMARY KEY(`id`),
	CONSTRAINT `imports_import_id_unique` UNIQUE(`import_id`)
);
--> statement-breakpoint
ALTER TABLE `imports` ADD CONSTRAINT `imports_company_id_companies_id_fk` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;