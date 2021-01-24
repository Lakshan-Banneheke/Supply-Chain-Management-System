# Supply-Chain-Management-System

### Database setup


Install [postgresql](https://www.postgresql.org/) in the local machine and setup correctly. Use following command on terminal to login to the `psql` shell as postgres user.
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

Then login to `psql` as `db_app`. Enter 'password' as given in the previous step when prompted for the password.

```bash
psql -U db_app supply_chain_db
```

Download `database` directory from this repo and then in the shell,
import the schema. Here give the full path to the schema

```sql
\i 'C:/Users/.../database/schema.sql'
\q
```

An sql file with insert statements for some dummy data is provided. Kindly note that this does not have insert statements to fill all the tables in the database. If you wish to import this, follow the same procedure as importing the schema.

```sql
\i 'C:/Users/.../database/insertStatements.sql'
\q
```

Now the database is set up.
Check if the database exists through the terminal or by logging into to pgAdmin.


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

Create a `.env` file in the root to store the environment variables.


```text
DATABASE_URL=postgres://db_app:password@localhost:5432/supply_chain_db

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


An entry for the admin will be inserted in the database by default. After users registers themselves, the admin can log in to the system using the following credentials and approve or disapprove the users.
Email: admin@gmail.com
Password: admin123

Note: Email and password can be changed by the admin after logging in as above 
