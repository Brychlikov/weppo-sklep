DROP TABLE IF EXISTS products, users;

CREATE TABLE products (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    img_url VARCHAR(500) NOT NULL
);

INSERT INTO products (name, price, description, img_url)
VALUES 
('Kuna', 10, 'ssak drapieżny', 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Martes_martes_crop.jpg'), 
('Jenot', 20, 'cholera wie co', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Nyctereutes_procyonoides_viverrinus.jpg/1024px-Nyctereutes_procyonoides_viverrinus.jpg');

CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL,
);