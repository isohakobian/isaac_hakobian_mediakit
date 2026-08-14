CREATE TABLE `collaborations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`translations` text NOT NULL,
	`mediaUrl` varchar(512) NOT NULL,
	`mediaTitle` varchar(255) NOT NULL,
	`publishedAt` timestamp,
	`isPublished` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaborations_id` PRIMARY KEY(`id`)
);
