-- create database
CREATE DATABASE IF NOT EXISTS blog_app;
-- blog_app.users definition
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `role` varchar(100) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- create table posts
-- blog_app.posts definition
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `desc` varchar(1000) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `cat` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `uid` int(11) NOT NULL,
  `text` text DEFAULT NULL,
  `draft` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `uid_idx` (`uid`),
  KEY `posts_FK` (`cat`),
  CONSTRAINT `posts_FK` FOREIGN KEY (`cat`) REFERENCES `categories` (`id`),
  CONSTRAINT `uid` FOREIGN KEY (`uid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;