DROP TABLE IF EXISTS test CASCADE;
DROP TABLE IF EXISTS User_Profile CASCADE;
DROP TABLE IF EXISTS User_Category CASCADE;


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
  PRIMARY KEY (user_id),
  FOREIGN KEY (cat_id) REFERENCES User_Category(cat_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Site_Request(
    request_id SERIAL NOT NULL,
    project_id int,
    section_id int,
    user_id varchar(255),
    request_state varchar(255) not null,
    request_date date,
    issue_date date,
    primary key (request_id)
);


CREATE TABLE Material_Request(
--     material_request_id SERIAL not null,
    request_id int NOT NULL,
    material_name varchar(255) not null,
    unit varchar(255) not null,
    requested_quntity int not null,
    received_quantity int,
--     primary key(material_request_id),
    foreign key(request_id) references Site_Request(request_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE Stock(
    stock_id SERIAL not null,
    material_name varchar(255) not null,
    material_quantity int not null,
    unit varchar(255) not null,
    primary key(stock_id)
);


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


INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'pasanmadushan','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (1,'Sand','pct',10);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (1,'Plate','pcs',5);

INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'pasanmadushan1','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (2,'Sand','pct',10);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (2,'Plate','pcs',5);

INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'pasanmadushan2','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (3,'Sand','pct',10);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (3,'Plate','pcs',5);


INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'danushka','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (4,'Cement','pcs',100);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (4,'Nuts and balts','pcs',10);

INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'danushka1','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (5,'Cement','pcs',100);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (5,'Nuts and balts','pcs',10);

INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'danushka2','not completed','2020-12-12');
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (6,'Cement','pcs',100);
INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (6,'Nuts and balts','pcs',10);


-----------------------------------------_______-------------


INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor1','storekeeper','unread','expeditor1','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor2','expeditor','unread','expeditor2','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor3','storekeeper','unread','expeditor3','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor4','storekeeper','unread','expeditor4','2020-12-20');



------------------Priviledges----------------------
GRANT ALL ON TABLE public.User_Profile to db_app;
GRANT ALL ON TABLE public.User_Category to db_app;
GRANT ALL ON TABLE public.Site_Request to db_app;
GRANT ALL ON TABLE public.Material_Request to db_app;
GRANT ALL ON TABLE public.Stock to db_app;
GRANT ALL ON TABLE public.Material_Order to db_app;
GRANT ALL ON TABLE public.Order_Item to db_app;
GRANT ALL ON TABLE public.Notification to db_app;





