CREATE USER 'select_only'@'%' IDENTIFIED BY 'password';
GRANT SELECT ON world.* TO 'select_only'@'%';
FLUSH PRIVILEGES;
