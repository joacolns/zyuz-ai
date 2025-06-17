CREATE DATABASE zyuz_database_local;
USE zyuz_database_local;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
);