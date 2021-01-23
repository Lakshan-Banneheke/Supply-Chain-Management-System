DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS supplies CASCADE;
DROP TABLE IF EXISTS supply_items CASCADE;

CREATE TABLE brands (
	id SERIAL ,
	title varchar(50) not null,
	PRIMARY KEY (id)
);

CREATE TABLE vehicles (
	id SERIAL,
	title varchar(50),
	brand int,
	plate_number varchar(10) not null,
	registrations varchar(100),
	remarks text,
	PRIMARY KEY (id),
	FOREIGN KEY (brand) REFERENCES brands(id) ON DELETE CASCADE
);

CREATE TABLE supplies (
	id SERIAL,
	reference varchar(50),
	created date,
	from_date date,
	to_date date,
	to_address varchar(200),
	remarks text,
	address varchar(100),
	status int,
	PRIMARY KEY (id)
);

CREATE TABLE supply_items (
	id SERIAL,
	supply int,
	vehicle int,
	qty int,
	amount DOUBLE PRECISION,
	description varchar(50),
	status int,
	PRIMARY KEY (id),
	FOREIGN KEY (vehicle) REFERENCES vehicles(id) ON DELETE CASCADE,
	FOREIGN KEY (supply) REFERENCES supplies(id) ON DELETE CASCADE
);

GRANT ALL ON TABLE public.brands to db_app;
GRANT ALL ON TABLE public.vehicles to db_app;
GRANT ALL ON TABLE public.supplies to db_app;
GRANT ALL ON TABLE public.supply_items to db_app;
