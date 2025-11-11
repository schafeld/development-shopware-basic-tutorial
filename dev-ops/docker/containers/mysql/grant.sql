-- Create user with mysql_native_password for MariaDB client compatibility
-- MySQL 8.0 still supports mysql_native_password plugin
CREATE USER IF NOT EXISTS 'app'@'%' IDENTIFIED WITH mysql_native_password BY 'app';
GRANT ALL ON *.* TO 'app'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
