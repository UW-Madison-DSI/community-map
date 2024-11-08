# Dump of table user_accounts
# ------------------------------------------------------------

LOCK TABLES `user_accounts` WRITE;

INSERT INTO `user_accounts` (`id`, `username`, `password`, `email`, `options`, `enabled_flag`, `email_verified_flag`, `admin_flag`, `last_login`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	('500','admin','admin','amegahed@wisc.edu',NULL,1,1,1,'2024-08-06 18:04:52',NULL,'2024-08-06 18:04:52',NULL),
	('688690','petitprince','PetitPrince123','petitprince@wisc.edu','receive-newsletter,receive-updates,receive-ospo-updates',1,1,0,'2024-04-26 19:05:50','2022-12-07 22:23:15','2024-06-10 20:45:54',NULL);

UNLOCK TABLES;