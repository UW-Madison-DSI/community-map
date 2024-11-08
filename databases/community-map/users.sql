# Dump of table users
# ------------------------------------------------------------

LOCK TABLES `users` WRITE;

INSERT INTO `users` (`id`, `title`, `first_name`, `middle_name`, `last_name`, `homepage`, `profile_photo`, `social_url`, `github_url`, `primary_unit_affiliation_id`, `other_primary_unit_affiliation`, `non_primary_unit_affiliation_ids`, `is_affiliate`, `communities`, `appointment_type`, `building_number`, `degree_institution`, `degree_year`, `orcid_id`, `media`, `research_terms`, `research_summary`, `research_interests`, `created_at`, `updated_at`, `deleted_at`)
VALUES
	(688690,'professor','Petit',NULL,'Prince','http://petitprince.org','profile688690.png','https://twitter.com/petitprince','https://github.com/petitprince','10000',NULL,'[10000]',0,NULL,'faculty',NULL,'University of Wisconsin-Madison','2005','0000-0002-5769-7094',NULL,'Responsible data science,FAIR principles,CARE principles,Reproducibility,Astronomy,Physics,Statistics,Computer Science,Python,C/C++,Jupyter,Outreach','I am quite fond of roses and taming foxes.','Simulation-based inference',NULL,NULL,NULL);

UNLOCK TABLES;