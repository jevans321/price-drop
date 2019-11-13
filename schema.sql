/*
DROP DATABASE IF EXISTS test;

CREATE DATABASE test;

USE test;

CREATE TABLE models (
  id int NOT NULL AUTO_INCREMENT,
  model VARCHAR(50) NULL DEFAULT NULL,
  title VARCHAR(50) NULL DEFAULT NULL,
  image VARCHAR(250) NULL DEFAULT NULL,
  PRIMARY KEY (id)
);


CREATE TABLE prices (
  id int NOT NULL AUTO_INCREMENT,
  model_id INTEGER NULL DEFAULT NULL,
  price VARCHAR(6) NULL DEFAULT NULL,
  date VARCHAR(30) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (model_id),
  REFERENCES models(id)
);
*/

/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/
