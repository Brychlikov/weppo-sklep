DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50),
    img_url VARCHAR(100)
);

INSERT INTO products (name, img_url)
VALUES 
('Kuna', 'https://example.com'), 
('Jenot', 'https://example.com/2');
