----------------Insert statements------------------

------------QS-------------------
INSERT INTO project(project_name,start_date) VALUES ('First project','2021-01-01');
INSERT INTO project(project_name,start_date) VALUES ('Second project','2021-01-05');
INSERT INTO project(project_name,start_date) VALUES ('Third project','2021-01-15');

INSERT INTO project_section(section_name,project_id) VALUES ('Floor',1);
INSERT INTO project_section(section_name,project_id) VALUES ('Roof',1);
INSERT INTO project_section(section_name,project_id) VALUES ('Floor',2);
INSERT INTO project_section(section_name,project_id) VALUES ('Roof',2);

INSERT INTO estimate(project_id,create_date,submit_status,submit_date) VALUES (1,'2021-01-02','1','2021-01-05');
INSERT INTO estimate(project_id,create_date,submit_status,submit_date) VALUES (1,'2021-01-06','1','2021-01-09');
INSERT INTO estimate(project_id,create_date,submit_status,submit_date) VALUES (2,'2021-01-16','1','2021-01-19');
INSERT INTO estimate(project_id,create_date,submit_status) VALUES (3,'2021-01-19','0');

INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Steel','7ft x 80in',40000);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Concrete','Cubic yard',10000);
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

--------------------------------------------------------




INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Cement',100,'pct');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Steel',100,'pct');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Sand',100,'cube');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Plate',100,'pcs');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Nuts and balts',100,'pcs');

INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor1','storekeeper','unread','expeditor1','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor2','expeditor','unread','expeditor2','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor3','storekeeper','unread','expeditor3','2020-12-20');
INSERT INTO Notification(message,to_designation,state,from_designation,date) VALUES ('Request received from expeditor4','storekeeper','unread','expeditor4','2020-12-20');


INSERT INTO Project(project_name,start_date) VALUES ('first proj','2020-12-12');
INSERT INTO Project(project_name,start_date) VALUES ('second proj','2021-01-12');

INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Concrete',100,'Cubic yard');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Steel',100,'7ft x 80in');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Pine1',100,'2in x 4in - 12ft');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Pine2',100,'2in x 4in - 16ft');
INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Latex Paint',100,'Gallon 2 coats');


INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Concrete','Cubic yard',10000);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Steel','7ft x 80in',40000);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Pine1','2in x 4in - 12ft',600);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Pine2','2in x 4in - 16ft',800);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Latex Paint','Gallon 2 coats',3000);
INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Pine3','2in x 4in - 16ft',800);


INSERT INTO Material_Order(project_id,shop_name,order_date,order_state,ordered) VALUES (1,'ABC Suppliers','2020-12-12','not completed',true);
INSERT INTO Material_Order(project_id,shop_name,order_date,order_state,ordered) VALUES (2,'ABC Suppliers1','2020-12-12','not completed',true);

INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (1,1,100);
INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (1,2,100);

INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (2,3,200);
INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (2,4,200);
INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (2,6,200);


INSERT INTO site_request(project_id,section_id,user_id,request_state,request_date) VALUES(1,1,a1eca4a3-dbde-4989-9af0-b2766f0496c1,'not completed','2020-12-20');
INSERT INTO material_request(request_id,material_name,requested_quantity) VALUES(1,'Pine',100);


------------------------error------------------------------------
------------------------------------------------------------

-- INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha1 constructions','2020-10-12','2020-11-12','not complete');
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (1,'Sand','cube',10);
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (1,'Plate','pcs',5);
--
-- INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('lakshan1 constructions','2020-10-12','2020-11-12','not complete');
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (2,'Cement','pct',10);
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (2,'Nuts and balts','pcs',5);
--
-- INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha2 constructions','2020-10-12','2020-11-12','not complete');
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (3,'Sand','cube',10);
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (3,'Plate','pcs',5);
--
-- INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha3 constructions','2020-10-12','2020-11-12','not complete');
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (4,'Sand','cube',10);
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (4,'Plate','pcs',5);
--
-- INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha4 constructions','2020-10-12','2020-11-12','not complete');
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (5,'Sand','cube',10);
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (5,'Plate','pcs',5);
--
-- INSERT INTO Material_Order(shop_name,order_date,received_date,order_state) VALUES ('uditha5 constructions','2020-10-12','2020-11-12','not complete');
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (6,'Sand','cube',10);
-- INSERT INTO Order_Item(order_id,material_name,unit,ordered_quantity) VALUES (6,'Plate','pcs',5);

-----------------------


-- INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (1,'Sand','pct',10);
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (1,'Plate','pcs',5);

-- INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (2,'Sand','pct',10);
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (2,'Plate','pcs',5);

-- INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (1,2,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (3,'Sand','pct',10);
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (3,'Plate','pcs',5);


-- INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (4,'Cement','pcs',100);
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (4,'Nuts and balts','pcs',10);

-- INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (5,'Cement','pcs',100);
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (5,'Nuts and balts','pcs',10);

-- INSERT INTO Site_Request(project_id,section_id,user_id,request_state,request_date) VALUES (2,4,'2d913d0a-4aa2-499d-a15b-962b280e299d','not completed','2020-12-12');
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (6,'Cement','pcs',100);
-- INSERT INTO Material_Request(request_id,material_name,unit,requested_quntity) VALUES (6,'Nuts and balts','pcs',10);

