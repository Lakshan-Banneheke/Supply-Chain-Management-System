DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;

CREATE TABLE brands (
	id SERIAL ,
	title varchar(50) not null,
	PRIMARY KEY (id)
);

CREATE TABLE vehicles (
	id SERIAL,
	brand int,
	plate_number varchar(10) not null,
	registrations varchar(100),
	remarks text,
	PRIMARY KEY (id),
	FOREIGN KEY (brand) REFERENCES brands(id)
);