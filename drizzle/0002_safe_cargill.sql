ALTER TABLE `analytics` ADD `deviceType` varchar(20);--> statement-breakpoint
ALTER TABLE `analytics` ADD `country` varchar(100);--> statement-breakpoint
ALTER TABLE `analytics` ADD `region` varchar(100);--> statement-breakpoint
ALTER TABLE `analytics` ADD `pageUrl` varchar(512);--> statement-breakpoint
ALTER TABLE `analytics` ADD `sessionId` varchar(64);--> statement-breakpoint
ALTER TABLE `analytics` ADD `timeOnPage` int;