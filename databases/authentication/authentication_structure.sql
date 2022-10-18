# ************************************************************
# Sequel Ace SQL dump
# Version 20035
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 5.7.34)
# Database: authentication
# Generation Time: 2022-10-18 17:59:56 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table countries
# ------------------------------------------------------------

CREATE TABLE `countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iso` char(2) NOT NULL,
  `name` varchar(80) NOT NULL DEFAULT '',
  `iso3` char(3) DEFAULT NULL,
  `num_code` smallint(6) DEFAULT NULL,
  `phone_code` int(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;



# Dump of table email_verifications
# ------------------------------------------------------------

CREATE TABLE `email_verifications` (
  `id` char(36) NOT NULL DEFAULT '' COMMENT 'internal id',
  `user_id` char(36) DEFAULT NULL COMMENT 'user unix id',
  `email` varchar(100) DEFAULT NULL COMMENT 'emaill address',
  `verified_at` timestamp NULL DEFAULT NULL COMMENT 'Is email address verified',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Project email verifications';



# Dump of table password_resets
# ------------------------------------------------------------

CREATE TABLE `password_resets` (
  `id` char(36) NOT NULL DEFAULT '',
  `user_id` char(36) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table sessions
# ------------------------------------------------------------

CREATE TABLE `sessions` (
  `id` varchar(255) CHARACTER SET latin1 NOT NULL,
  `user_id` char(36) CHARACTER SET latin1 DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET latin1 DEFAULT NULL,
  `user_agent` text CHARACTER SET latin1,
  `payload` text CHARACTER SET latin1 NOT NULL,
  `last_activity` int(11) NOT NULL,
  UNIQUE KEY `sessions_id_unique` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table user_accounts
# ------------------------------------------------------------

CREATE TABLE `user_accounts` (
  `id` char(36) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `options` varchar(255) DEFAULT NULL,
  `enabled_flag` tinyint(1) DEFAULT '0',
  `email_verified_flag` tinyint(1) DEFAULT '0',
  `admin_flag` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
