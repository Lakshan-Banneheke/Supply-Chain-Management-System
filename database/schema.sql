DROP TABLE IF EXISTS test CASCADE;

CREATE TABLE test (
  name  varchar(30) NOT NULL,
  email varchar(50) NOT NULL,
  password varchar(100) NOT NULL,
  PRIMARY KEY (name)
);

GRANT ALL ON TABLE public.test to db_app;