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
  verified bool DEFAULT false,
  PRIMARY KEY (user_id),
  FOREIGN KEY (cat_id) REFERENCES User_Category(cat_id) ON DELETE CASCADE ON UPDATE CASCADE
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
INSERT INTO user_category(cat_name) VALUES ('Admin'), ('Quantity Surveyor'), ('Expeditor'), ('On-Site Supervisor'), ('Storekeeper'), ('Fleet Manager');
INSERT INTO user_profile(name, password, email, cat_id, verified) VALUES ('admin', '$2a$10$C7B15U6UIoB2H5E2EvxSVecVXhv9lu.dS9IK8B/2ybNUa1.cyPgm2', 'admin@gmail.com', 1, true);

------------------Priviledges----------------------
GRANT ALL ON TABLE public.User_Profile to db_app;
GRANT ALL ON TABLE public.User_Category to db_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO db_app;