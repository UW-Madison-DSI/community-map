# ************************************************************
# Sequel Ace SQL dump
# Version 20035
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# Host: 127.0.0.1 (MySQL 5.7.34)
# Database: campus_map
# Generation Time: 2022-10-18 18:02:26 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table buildings
# ------------------------------------------------------------

CREATE TABLE `buildings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `building_number` varchar(16) DEFAULT NULL,
  `department_ids` varchar(256) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `hours` varchar(1024) DEFAULT NULL,
  `geojson_id` varchar(4096) DEFAULT NULL,
  `medium_image` varchar(256) DEFAULT NULL,
  `thumb_image` varchar(256) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `object_type` varchar(32) DEFAULT NULL,
  `street_address` varchar(256) DEFAULT NULL,
  `tag_ids` varchar(1024) DEFAULT NULL,
  `thumbnail` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table departments
# ------------------------------------------------------------

CREATE TABLE `departments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `base_name` varchar(256) DEFAULT NULL,
  `url` varchar(256) DEFAULT NULL,
  `building_id` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table geojson
# ------------------------------------------------------------

CREATE TABLE `geojson` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(16) DEFAULT NULL,
  `coordinates` varchar(16384) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table metadata
# ------------------------------------------------------------

CREATE TABLE `metadata` (
  `cname` varchar(32) NOT NULL DEFAULT '',
  `legacy_building_id` varchar(4) DEFAULT NULL,
  `lname` varchar(32) DEFAULT NULL,
  `sname` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`cname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table parking
# ------------------------------------------------------------

CREATE TABLE `parking` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  `building_number` varchar(8) DEFAULT NULL,
  `department_ids` varchar(256) DEFAULT NULL,
  `description` varchar(1024) DEFAULT NULL,
  `hours` varchar(1024) DEFAULT NULL,
  `geojson_id` varchar(4096) DEFAULT NULL,
  `medium_image` varchar(256) DEFAULT NULL,
  `thumb_image` varchar(256) DEFAULT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `object_type` varchar(32) DEFAULT NULL,
  `street_address` varchar(256) DEFAULT NULL,
  `tag_ids` varchar(1024) DEFAULT NULL,
  `thumbnail` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tags
# ------------------------------------------------------------

CREATE TABLE `tags` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
