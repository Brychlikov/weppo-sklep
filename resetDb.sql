-- session table, used by connect-pg-simple
DROP TABLE IF EXISTS "session";
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");



DROP TABLE IF EXISTS products;

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
('Jenot', 20, 'cholera wie co', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Nyctereutes_procyonoides_viverrinus.jpg/1024px-Nyctereutes_procyonoides_viverrinus.jpg'),
('Opos', 15, 'trochę creepy', 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Opossum_%28Mar_2021%29.jpg'),
('Opos WINTER EDITION', 20, 'cold boi', 'https://upload.wikimedia.org/wikipedia/commons/2/27/Opossum_2.jpg'),
('Opos ZESTAW', 80, 'oszczędzasz 6zł na oposie', 'https://upload.wikimedia.org/wikipedia/commons/0/07/Didelphis_virginiana_with_young.JPG');

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(50) NOT NULL
);

INSERT INTO categories (name) VALUES ('Zwierzę'), ('Drapieżnik');

DROP TABLE IF EXISTS product_categories;
CREATE TABLE product_categories (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id int NOT NULL,
  category_id int NOT NULL,
  CONSTRAINT fk_product_id FOREIGN KEY (product_id) REFERENCES products (id),
  CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES categories (id)
);


DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(50) NOT NULL
);