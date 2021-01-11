# Supply-Chain-Management-System

## Guide

### Database setup

#### Windows

Install [postgresql](https://www.postgresql.org/) in the local machine and setup correctly. Use following command to login to the `psql` shell as postgres user.Use the following command on terminal

```bash
psql -U postgres
```

 Then enter below commands.

```sql
CREATE ROLE db_app WITH LOGIN PASSWORD 'password';
CREATE DATABASE supply_chain_db;
GRANT ALL PRIVILEGES ON DATABASE  supply_chain_db TO db_app;
\q
```

Then login to `psql` as `db_app`.

```bash
psql -U db_app supply_chain_db
```

Download `database` directory from this repo and then in the shell,
import the current DDL and DML schema. Here give the full path to the schema

```sql
\i 'C:/Users/.../database/schema.sql'
\q
```

Login to pgAdmin (Search on start) using the username and password used in the installation process of postgres.


Then rclick Server>postgres>Databases and check for `supply_chain_db`. Then expand it go to Schemas>Tables>Test>rclick>View edit data>All rows

Now you are done with the database setup.


### Node.js setup

First clone this project directory.

```bash
git clone https://github.com/Lakshan-Banneheke/Supply-Chain-Management-System.git
```

Install

* [node.js](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/get-npm)
* [nodemon](https://www.npmjs.com/package/nodemon)



 After that go to the project directory and run `npm install`.

```bash
cd directory/project
npm install
```

Then create a `.env` file in the root with following content.
You may change database user/password/secret as you may wish.

```text
DATABASE_URL=postgres://database_app:password@localhost:5432/supply_chain_db

SESSION_SECRET=database
PORT=3000
SERVER_ADDRESS=127.0.0.1
```

Then use `nodemon` or `node` to serve the pages.

```bash
nodemon start # If nodemon is installed
node index.js # otherwise
```

Now visit <http://localhost:3000/> and confirm that site is running.
