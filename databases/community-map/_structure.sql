# ************************************************************
# Sequel Ace SQL dump
# Version 20077
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: maps.datascience.wisc.edu (MySQL 5.7.44-log)
# Database: community_map
# Generation Time: 2024-11-08 18:27:29 +0000
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



# Dump of table institution_units
# ------------------------------------------------------------

CREATE TABLE `institution_units` (
  `id` int(11) unsigned NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `baseName` varchar(128) DEFAULT NULL,
  `institutionId` varchar(32) DEFAULT NULL,
  `isPrimary` tinyint(1) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `building` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



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
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table users
# ------------------------------------------------------------

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL,
  `title` varchar(32) DEFAULT NULL,
  `first_name` varchar(32) DEFAULT NULL,
  `middle_name` varchar(32) DEFAULT NULL,
  `last_name` varchar(32) DEFAULT NULL,
  `homepage` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `social_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `primary_unit_affiliation_id` varchar(255) DEFAULT NULL,
  `other_primary_unit_affiliation` varchar(255) DEFAULT NULL,
  `non_primary_unit_affiliation_ids` varchar(255) DEFAULT NULL,
  `is_affiliate` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `communities` varchar(255) DEFAULT NULL,
  `appointment_type` varchar(64) DEFAULT NULL,
  `building_number` int(11) DEFAULT NULL,
  `degree_institution` varchar(128) DEFAULT NULL,
  `degree_year` year(4) DEFAULT NULL,
  `orcid_id` varchar(19) DEFAULT NULL,
  `media` varchar(255) DEFAULT NULL,
  `research_terms` mediumtext,
  `research_summary` mediumtext,
  `research_interests` varchar(1024) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
