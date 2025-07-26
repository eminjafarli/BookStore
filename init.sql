CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    username VARCHAR(50),
    password TEXT,
    role VARCHAR(20)
    );

INSERT INTO users (id, name, username, password, role)
VALUES (1, 'Admin', 'admin', '$2a$10$PZM8xGgCu9XlhISw2zgwK.XVOWG7kdSZchOoRVYtFWngAT41v7W/y', 'ADMIN');
