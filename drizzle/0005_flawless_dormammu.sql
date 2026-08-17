CREATE TABLE `brandRequests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandName` varchar(255) NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telegram` varchar(128),
	`category` varchar(64) NOT NULL,
	`goal` varchar(64) NOT NULL,
	`format` varchar(128) NOT NULL,
	`budget` varchar(64),
	`description` text NOT NULL,
	`status` enum('new','reviewing','discussion','confirmed','archived') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brandRequests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `caseStudies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`collaborationId` int NOT NULL,
	`clientGoal` text NOT NULL,
	`creativeDirection` text NOT NULL,
	`deliverablesJson` text NOT NULL,
	`resultsSummary` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `caseStudies_id` PRIMARY KEY(`id`)
);
