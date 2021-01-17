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

CREATE TABLE supplies (
	id SERIAL,
	reference varchar(50),
	created date,
	from_date date,
	to_date date,
	to_address varchar(200),
	remarks text,
	status int,
	PRIMARY KEY (id)
);

CREATE TABLE supply_items (
	id SERIAL,
	supply int,
	vehicle int,
	qty int,
	status int,
	PRIMARY KEY (id),
	FOREIGN KEY (vehicle) REFERENCES vehicles(id),
	FOREIGN KEY (supply) REFERENCES supplies(id)
);