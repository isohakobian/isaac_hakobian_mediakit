CREATE TABLE `backupOperations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`operationType` enum('export','import','safety_backup') NOT NULL,
	`status` enum('started','success','failed') NOT NULL DEFAULT 'started',
	`fileName` varchar(255),
	`stage` varchar(120),
	`progress` int NOT NULL DEFAULT 0,
	`processedRecords` int NOT NULL DEFAULT 0,
	`totalRecords` int NOT NULL DEFAULT 0,
	`recordSummary` text,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `backupOperations_id` PRIMARY KEY(`id`)
);
