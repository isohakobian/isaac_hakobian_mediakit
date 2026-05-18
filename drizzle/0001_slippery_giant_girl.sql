CREATE TABLE `analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventType` varchar(50) NOT NULL,
	`eventData` text,
	`referrer` varchar(512),
	`userAgent` varchar(512),
	`ipHash` varchar(64),
	`language` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`brandName` varchar(255) NOT NULL,
	`quote` text NOT NULL,
	`authorName` varchar(255) NOT NULL,
	`authorRole` varchar(255),
	`brandLogo` varchar(512),
	`rating` int DEFAULT 5,
	`language` varchar(10) NOT NULL DEFAULT 'en',
	`isPublished` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `testimonials_id` PRIMARY KEY(`id`)
);
