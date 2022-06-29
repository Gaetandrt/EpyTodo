CREATE SCHEMA IF NOT EXISTS `epytodo`;
USE `epytodo` ;


CREATE TABLE IF NOT EXISTS `epytodo`.`user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `epytodo`.`todo` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `due_time` DATETIME NOT NULL,
  `status` VARCHAR(255) DEFAULT 'not started',
  `user_id` INT UNSIGNED,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`)
    REFERENCES `epytodo`.`user` (`id`));

