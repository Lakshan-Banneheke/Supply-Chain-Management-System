DROP TABLE IF EXISTS Project CASCADE;
DROP TABLE IF EXISTS Estimate CASCADE;
DROP TABLE IF EXISTS MaterialValue CASCADE;
DROP TABLE IF EXISTS Est_Mat CASCADE;
DROP TABLE IF EXISTS Material_Order CASCADE;
DROP TABLE IF EXISTS Order_items CASCADE;
DROP TABLE IF EXISTS Machine_Request CASCADE;
DROP TABLE IF EXISTS Machine CASCADE;
DROP TABLE IF EXISTS Req_Mac CASCADE;

------------------ Tables --------------------

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

-------------------test insert-------------------
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

GRANT ALL ON TABLE public.Project to db_app;
GRANT ALL ON TABLE public.Estimate to db_app;
GRANT ALL ON TABLE public.MaterialValue to db_app;
GRANT ALL ON TABLE public.Est_Mat to db_app;
GRANT ALL ON TABLE public.Material_Order to db_app;
GRANT ALL ON TABLE public.Order_items to db_app;
GRANT ALL ON TABLE public.Machine_Request to db_app;
GRANT ALL ON TABLE public.Machine to db_app;
GRANT ALL ON TABLE public.Req_Mac to db_app;
