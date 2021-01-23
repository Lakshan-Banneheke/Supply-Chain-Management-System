DROP TABLE IF EXISTS User_Profile CASCADE;
DROP TABLE IF EXISTS User_Category CASCADE;
DROP TABLE IF EXISTS Site_Request CASCADE;
DROP TABLE IF EXISTS Material_Request CASCADE;
DROP TABLE IF EXISTS Stock CASCADE;
DROP TABLE IF EXISTS Material_Order CASCADE;
DROP TABLE IF EXISTS Order_Item CASCADE;
DROP TABLE IF EXISTS Notification CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS project_section CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS vehicles CASCADE;
DROP TABLE IF EXISTS supplies CASCADE;
DROP TABLE IF EXISTS supply_items CASCADE;
DROP TABLE IF EXISTS Project CASCADE;
DROP TABLE IF EXISTS Estimate CASCADE;
DROP TABLE IF EXISTS MaterialValue CASCADE;
DROP TABLE IF EXISTS Est_Mat CASCADE;
DROP TABLE IF EXISTS Material_Order CASCADE;
DROP TABLE IF EXISTS Order_items CASCADE;
DROP TABLE IF EXISTS Machine_Request CASCADE;
DROP TABLE IF EXISTS Machine CASCADE;
DROP TABLE IF EXISTS Req_Mac CASCADE;


DROP DOMAIN IF EXISTS UUID4 CASCADE;

DROP PROCEDURE IF EXISTS registerUser CASCADE;

DROP TYPE IF EXISTS gender_enum CASCADE;


------------------------------------DOMAIN SCHEMA ---------------------------------------
CREATE DOMAIN UUID4 AS char(36)
CHECK (VALUE ~ '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}');


------------------------------------ENUMS----------------------------------------
CREATE TYPE gender_enum AS ENUM (
'Male',
'Female',
'Other'
);


--------------------------Functions----------------------------------
CREATE OR REPLACE FUNCTION generate_uuid4 ()
    RETURNS char(36)
AS $$
DECLARE
    var_uuid char(36);
BEGIN
    SELECT
        uuid_in(overlay(overlay(md5(random()::text || ':' || clock_timestamp()::text)
            PLACING '4' FROM 13)
        PLACING to_hex(floor(random() * (11 - 8 + 1) + 8)::int)::text FROM 17)::cstring) INTO var_uuid;
    RETURN var_uuid;
END
$$
LANGUAGE PLpgSQL;


------------------ Tables --------------------
CREATE TABLE User_Category (
  cat_id SERIAL,
  cat_name varchar(20),
  PRIMARY KEY (cat_id)
);

CREATE TABLE User_Profile (
  user_id UUID4 DEFAULT generate_uuid4(),
  name varchar(70) NOT NULL,
  password varchar(70) NOT NULL,
  email varchar(70) NOT NULL,
  cat_id int NOT NULL,
  contact_num varchar(20),
  gender gender_enum,
  date_joined date,
  verified bool DEFAULT false,
  PRIMARY KEY (user_id),
  FOREIGN KEY (cat_id) REFERENCES User_Category(cat_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE project (
    project_id SERIAL not null,
    project_name varchar(255) NOT NULL,
    PRIMARY KEY (project_id)
);

CREATE TABLE project_section (
    section_id SERIAL not null,
    section_name varchar(255) NOT NULL,
    project_id int NOT NULL,
    PRIMARY KEY (section_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id)
);

CREATE TABLE site_request (
    request_id SERIAL not null,
    project_id int NOT NULL,
    section_id int NOT NULL,
    user_id uuid4 NOT NULL,
    request_state  varchar(20),
    request_date  DATE NOT NULL,
    issue_date DATE ,
    request_note varchar(255),

    PRIMARY KEY (request_id),
    FOREIGN KEY (section_id) REFERENCES project_section(section_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id),
    FOREIGN KEY (user_id) REFERENCES user_profile(user_id)
);


CREATE TABLE material_request (
    mr_id SERIAL not null,
    request_id int NOT NULL,
    material_name varchar(255) NOT NULL,
    requested_quantity int NOT NULL,
    received_quantity int ,
    PRIMARY KEY (mr_id),
    FOREIGN KEY (request_id) REFERENCES site_request(request_id)
);


CREATE TABLE Stock(
    stock_id SERIAL not null,
    material_name varchar(255) not null,
    material_quantity int not null,
    unit varchar(255) not null,
    primary key(stock_id)
);

---------------------------new material order tables--------------
CREATE TABLE MaterialValue (
  M_id SERIAL,
  m_name varchar(30) NOT NULL,
  m_amount varchar(20) NOT NULL,
  m_cost DECIMAL NOT NULL,
  PRIMARY KEY (M_id)
);


CREATE TABLE Material_Order(
    order_id SERIAL not null,
    project_id int not null,
    shop_name varchar(255) not null,
    order_date date,
    received_date date,
    order_state varchar(255) not null,
    ordered boolean,
    primary key(order_id),
    FOREIGN KEY (project_id) REFERENCES Project(project_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Order_item(
  order_id int NOT NULL,
  M_id int NOT NULL,
  ordered_quantity int NOT NULL,
  received_quantity int,
  PRIMARY KEY (order_id,M_id),
  FOREIGN KEY (order_id) REFERENCES Material_Order(order_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (M_id) REFERENCES MaterialValue(M_id) ON DELETE CASCADE ON UPDATE CASCADE
);
------------------------------------------------------------------

CREATE TABLE Material_Order(
    order_id SERIAL not null,
    shop_name varchar(255) not null,
    order_date date not null,
    received_date date,
    order_state varchar(255) not null,
    primary key(order_id)
);


CREATE TABLE Order_Item(
    order_item_id SERIAL not null,
    order_id int not null,
    material_name varchar(255) not null,
    unit varchar(255) not null,
    ordered_quantity int not null,
    received_quantity int,
    primary key(order_item_id),
    foreign key(order_id) references Material_Order(order_id)

);


CREATE TABLE Notification(
    notifi_id SERIAL not null,
    message varchar(200),
    to_designation varchar(20),
    state varchar(10),
    from_designation varchar(20),
    date date
);




-----------Fleet Manager------
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

---expedi/qs ----
CREATE TABLE Project (
  P_id SERIAL,
  name varchar(30) NOT NULL,
  start_date date,
  duration varchar(30),
  PRIMARY KEY (P_id)
);

CREATE TABLE Estimate (
  E_id SERIAL,
  P_id int NOT NULL,
  create_date date NOT NULL,
  submit_status boolean,
  submit_date date,
  PRIMARY KEY (E_id),
  FOREIGN KEY (P_id) REFERENCES Project(P_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MaterialValue (
  M_id SERIAL,
  m_name varchar(30) NOT NULL,
  m_amount varchar(20) NOT NULL,
  m_cost DECIMAL NOT NULL,
  PRIMARY KEY (M_id)
);

CREATE TABLE Est_Mat (
  E_id int NOT NULL,
  M_id int NOT NULL,
  quantity int NOT NULL,
  PRIMARY KEY (E_id,M_id),
  FOREIGN KEY (E_id) REFERENCES Estimate(E_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (M_id) REFERENCES MaterialValue(M_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Material_Order (
  O_id SERIAL,
  P_id int NOT NULL,
  shop_name varchar(30) NOT NULL,
  order_date date,
  ordered boolean,
  received boolean,
  PRIMARY KEY (O_id),
  FOREIGN KEY (P_id) REFERENCES Project(P_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Order_items (
  O_id int NOT NULL,
  M_id int NOT NULL,
  quantity int NOT NULL,
  PRIMARY KEY (O_id,M_id),
  FOREIGN KEY (O_id) REFERENCES Material_Order(O_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (M_id) REFERENCES MaterialValue(M_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Machine_Request (
  R_id int NOT NULL,
  P_id int NOT NULL,
  request_date date NOT NULL,
  duration varchar(30),
  PRIMARY KEY (R_id),
  FOREIGN KEY (P_id) REFERENCES Project(P_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Machine (
  machine_name varchar(30),
  PRIMARY KEY (machine_name)
);

CREATE TABLE Req_Mac (
  R_id int NOT NULL,
  machine_name varchar(30),
  quantity int NOT NULL,
  PRIMARY KEY (R_id,machine_name),
  FOREIGN KEY (R_id) REFERENCES Machine_Request(R_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (machine_name) REFERENCES Machine(machine_name) ON DELETE CASCADE ON UPDATE CASCADE
);


--------------------------Procedures------------------------
CREATE OR REPLACE PROCEDURE addMaterialValue(
    val_mname VARCHAR(30),
    val_mamount VARCHAR(20),
    val_mcost DECIMAL

)

LANGUAGE plpgsql
AS $$
DECLARE
    existing_materials VARCHAR(30) := (SELECT m_name from MaterialValue WHERE m_name = val_mname AND m_amount = val_mamount);
BEGIN
    IF (existing_materials is null) THEN
        INSERT INTO MaterialValue(m_name, m_amount, m_cost) VALUES (val_mname,val_mamount, val_mcost);
    ELSE
        RAISE EXCEPTION '% % is already exit', val_mname,val_mamount;
    END IF;
END;
$$;



CREATE OR REPLACE PROCEDURE addOrderItems(
    materials integer[],
    quantiies integer[],
    o_id int

)

LANGUAGE plpgsql
AS $$
DECLARE
    arraylength int := array_length(materials, 1);
    i int;
BEGIN
    for  i in 1..arraylength
    loop
      INSERT INTO Order_items (O_id, M_id, quantity) VALUES(o_id, materials[i], quantiies[i]);
    end loop;

END;
$$;


--------------------------Procedures------------------------
CREATE OR REPLACE PROCEDURE registerUser(
    val_name VARCHAR(70),
    val_password VARCHAR(70),
    val_email VARCHAR(70),
    val_cat_id integer,
    val_contact_num VARCHAR(20),
    val_gender gender_enum,
    val_date_joined date
)

LANGUAGE plpgsql
AS $$
DECLARE
    existing_email VARCHAR(70) := (SELECT email from user_profile WHERE email = val_email);
BEGIN
    IF (existing_email is null) THEN
        INSERT INTO user_profile(name, password, email, cat_id, contact_num, gender, date_joined) VALUES (val_name, val_password, val_email, val_cat_id, val_contact_num, val_gender, val_date_joined);
    ELSE
        RAISE EXCEPTION 'Email % is already registered', val_email;
    END IF;
END;
$$;



----------------Insert statements------------------

INSERT INTO user_category(cat_name) VALUES ('Quantity Surveyor'), ('Expeditor'), ('On-Site Supervisor'), ('Storekeeper'), ('Fleet Manager');

INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Cement',100,'pct');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Sand',100,'cube');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Plate',100,'pcs');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Nuts and balts',100,'pcs');

INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha1 constructions','2020-10-12','2020-11-12','not complete');
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (1,'Sand','cube',10);
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (1,'Plate','pcs',5);

INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('lakshan1 constructions','2020-10-12','2020-11-12','not complete');
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (2,'Cement','pct',10);
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (2,'Nuts and balts','pcs',5);

INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha2 constructions','2020-10-12','2020-11-12','not complete');
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (3,'Sand','cube',10);
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (3,'Plate','pcs',5);

INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha3 constructions','2020-10-12','2020-11-12','not complete');
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (4,'Sand','cube',10);
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (4,'Plate','pcs',5);

INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha4 constructions','2020-10-12','2020-11-12','not complete');
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (5,'Sand','cube',10);
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (5,'Plate','pcs',5);

INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha5 constructions','2020-10-12','2020-11-12','not complete');
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (6,'Sand','cube',10);
INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (6,'Plate','pcs',5);

-----------------------


INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (1,'Sand','pct',10);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (1,'Plate','pcs',5);

INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (2,'Sand','pct',10);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (2,'Plate','pcs',5);

INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (3,'Sand','pct',10);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (3,'Plate','pcs',5);


INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (4,'Cement','pcs',100);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (4,'Nuts and balts','pcs',10);

INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (5,'Cement','pcs',100);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (5,'Nuts and balts','pcs',10);

INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (6,'Cement','pcs',100);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (6,'Nuts and balts','pcs',10);


-----------------------------------------_______-------------


INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor1','storekeeper','unread','expeditor1','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor2','expeditor','unread','expeditor2','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor3','storekeeper','unread','expeditor3','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor4','storekeeper','unread','expeditor4','2020-12-20');

------------QS/Expeditor-------------------
INSERT INTO project(name,start_date,duration) VALUES ('First project','2021-01-01','3 months');
INSERT INTO project(name,start_date,duration) VALUES ('Second project','2021-01-05','5 months');
INSERT INTO project(name,start_date,duration) VALUES ('Third project','2021-01-15','6 months');

INSERT INTO estimate(p_id,create_date,submit_status,submit_date) VALUES (1,'2021-01-02','1','2021-01-05');
INSERT INTO estimate(p_id,create_date,submit_status,submit_date) VALUES (1,'2021-01-06','1','2021-01-09');
INSERT INTO estimate(p_id,create_date,submit_status,submit_date) VALUES (2,'2021-01-16','1','2021-01-19');
INSERT INTO estimate(p_id,create_date,submit_status) VALUES (3,'2021-01-19','0');

INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Concrete','Cubic yard',10000);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Steel','7ft x 80in',40000);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Pine','2in x 4in - 12ft',600);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Pine','2in x 4in - 16ft',800);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Latex Paint','Gallon 2 coats',3000);

INSERT INTO est_mat(e_id,m_id,quantity) VALUES (1,1,5);
INSERT INTO est_mat(e_id,m_id,quantity) VALUES (1,2,3);
INSERT INTO est_mat(e_id,m_id,quantity) VALUES (1,4,1);
INSERT INTO est_mat(e_id,m_id,quantity) VALUES (2,2,10);
INSERT INTO est_mat(e_id,m_id,quantity) VALUES (2,4,8);
INSERT INTO est_mat(e_id,m_id,quantity) VALUES (3,1,4);
INSERT INTO est_mat(e_id,m_id,quantity) VALUES (3,2,6);
INSERT INTO est_mat(e_id,m_id,quantity) VALUES (4,1,6);


INSERT INTO user_category(cat_name) VALUES ('Admin'), ('Quantity Surveyor'), ('Expeditor'), ('On-Site Supervisor'), ('Storekeeper'), ('Fleet Manager');
INSERT INTO user_profile(name, password, email, cat_id, verified) VALUES ('admin', '$2a$10$C7B15U6UIoB2H5E2EvxSVecVXhv9lu.dS9IK8B/2ybNUa1.cyPgm2', 'admin@gmail.com', 1, true);


------------------Priviledges----------------------
GRANT ALL ON TABLE public.User_Profile to db_app;
GRANT ALL ON TABLE public.User_Category to db_app;
GRANT ALL ON TABLE public.Site_Request to db_app;
GRANT ALL ON TABLE public.Material_Request to db_app;
GRANT ALL ON TABLE public.Stock to db_app;
GRANT ALL ON TABLE public.Material_Order to db_app;
GRANT ALL ON TABLE public.Order_Item to db_app;
GRANT ALL ON TABLE public.Notification to db_app;
GRANT ALL ON TABLE public.project to db_app;
GRANT ALL ON TABLE public.project_section to db_app;
GRANT ALL ON TABLE public.brands to db_app;
GRANT ALL ON TABLE public.vehicles to db_app;
GRANT ALL ON TABLE public.supplies to db_app;
GRANT ALL ON TABLE public.supply_items to db_app;

GRANT ALL ON TABLE public.Project to db_app;
GRANT ALL ON TABLE public.Estimate to db_app;
GRANT ALL ON TABLE public.MaterialValue to db_app;
GRANT ALL ON TABLE public.Est_Mat to db_app;
GRANT ALL ON TABLE public.Material_Order to db_app;
GRANT ALL ON TABLE public.Order_items to db_app;
GRANT ALL ON TABLE public.Machine_Request to db_app;
GRANT ALL ON TABLE public.Machine to db_app;
GRANT ALL ON TABLE public.Req_Mac to db_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO db_app;