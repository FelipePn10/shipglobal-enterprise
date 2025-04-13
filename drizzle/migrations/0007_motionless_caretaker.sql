CREATE TABLE `exchange_rates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`base_currency` varchar(10) NOT NULL,
	`rates` text NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `exchange_rates_id` PRIMARY KEY(`id`)
);
