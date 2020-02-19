-- Drops the company_db if it exists currently --
DROP DATABASE IF EXISTS company_db;

-- Creates the "company_db" database --
CREATE DATABASE company_db;

-- Makes it so all of the following code will affect company_db --
USE company_db;

-- Creates the table "department" within company_db --
CREATE TABLE department(
    id INTEGER  AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

-- Creates the table "role" within company_db --
CREATE TABLE role(
    id INTEGER  AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);
 
-- Creates the table "employee" within company_db --
CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER ,
    PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);