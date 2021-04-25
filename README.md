# smart-brain-heroku (Updated on 4/24/2021)

## :gem::gem::gem:  This documentation is about how to download this repo and deploy it on Heroku.

### Application link: [https://smart-brains-2021.herokuapp.com/](https://smart-brains-2021.herokuapp.com/)

### <span id="30.1">`Download & connect to your gitHub.`</span>

```bash
$ git clone https://github.com/DonghaoWu/smart-brain-heroku.git
$ cd smart-brain-heroku
$ rm -fr .git
$ git init
$ git add .
$ git commit -m "first commit"
$ git remote add origin <your-repo-link>
$ git push -u origin master
```

### <span id="30.1">`Add AWS Lambda endpoint in front end.`</span>

:gem:Visit here [AWS LAMBDA ENDPOINT.](https://github.com/DonghaoWu/WebDev-tools-demo/blob/master/AWS/AWS.md)

### <span id="30.2">`Run the application locally.`</span>

1. Install dependencies.

    ```bash
    $ npm i
    $ npm run installAll
    ```

2. [Download Redis](https://redis.io/download) & Run redis server(6.2.2).

    - Download
    ```bash
    $ cd
    $ wget https://download.redis.io/releases/redis-6.2.2.tar.gz
    $ tar xzf redis-6.2.2.tar.gz
    $ cd redis-6.2.2
    $ make
    ```

    - :gem: Run redis server locally (in a seperate terminal).
    ```bash
    $ cd
    $ cd redis-6.2.2
    $ src/redis-server
    ```

3. Connect redis in backend code.

    __`Location: ./backend/middlewares/authorization.js`__

    ```js
    const redis = require('redis');
    const redisClient = redis.createClient(process.env.REDIS_URL || 6379, { no_ready_check: true });
    ```

4. Add Local .env file.

    __`Location: ./backend/.env`__

    ```env
    POSTGRES_CLIENT=<--->
    POSTGRES_HOST=<--->
    POSTGRES_USER=<--->
    POSTGRES_PASSWORD=<--->
    POSTGRES_DB=<--->

    API_KEY=<--->
    JWT_SECRET=<--->
    ```

5. Download, install [postgreSQL](https://www.postgresql.org/) and connect.

    __`Location: ./backend/dbConnection.js`__

    ```js
    const { Client } = require('pg');
    const dbSetting = process.env.DATABASE_URL ?
        {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        }
        :
        {
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_LOCAL_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
        }

    const db = new Client(dbSetting);

    db.connect();

    module.exports = db;
    ```

6. Create local postgreSQL database and tables:

    1. Tables sql files:

        - ./sql/account.sql
        ```sql
        CREATE TABLE account (
            id serial PRIMARY KEY,
            hash VARCHAR(100) NOT NULL,
            email text UNIQUE NOT NULL
        );
        ```

        - ./sql/accountProfile.sql

        ```sql
        CREATE TABLE accountprofile (
            id serial PRIMARY KEY,
            name VARCHAR(100),
            email text UNIQUE NOT NULL,
            "imageNum" BIGINT DEFAULT 0,
            joined TIMESTAMP NOT NULL,
            pet VARCHAR(100),
            age BIGINT
        );
        ```

    2. ./configure_db_local.sh

    ```bash
    #!/bin/bash
    echo "Configuring smart-brain-local db..."

    dropdb smart-brain-local
    createdb smart-brain-local

    psql smart-brain-local < ./sql/account.sql
    psql smart-brain-local < ./sql/accountProfile.sql

    echo "smart-brain-local db configured!"
    ```

    3. Add a script in package.json

    ```json
    "configure-db-local": "sh ./configure_db_local.sh",
    ```

    4. Run the script.

    ```bash
    $ npm run configure-db-local
    ```

7. Run the application locally.

    ```bash
    $ npm run dev
    ```

8. sql local commands:

    ```bash
    $ psql --username=postgres # run postgre server cli

    postgres=# \l
    postgres=# \c smart-brain-local

    smart-brain-local=# \dt
    smart-brain-local=# select * from account;
    ```

### <span id="30.3">`Heroku deploy the application.`</span>


1. Create heroku app and addon redis & postgreSQL.

    ```bash
    $ heroku login

    $ git remote rm heroku 

    $ heroku create <your-heroku-app-name>

    $ heroku addons:create heroku-redis:hobby-dev --name=<your-heroku-addon-redis-name> 

    $ heroku addons:create heroku-postgresql:hobby-dev --name=<your-heroku-addon-db-name> 

    $ heroku addons:attach <your-heroku-addon-db-name> --app=<your-heroku-app-name>

    $ heroku pg:psql --app <your-heroku-app-name> # Access heroku postgre cli
    ```

2. ./configure_db_heroku.sh
    ```bash
    #!/bin/bash

    echo "Configuring heroku postgre database..."

    heroku pg:reset DATABASE

    heroku pg:psql < ./sql/account.sql
    heroku pg:psql < ./sql/accountProfile.sql

    echo "Heroku postgre database configured!"
    ```

3. Add a script in package.json

    ```json
    "configure-db-heroku": "sh ./configure_db_heroku.sh",
    ```

4. Run the script.

    ```bash
    $ npm run configure-db-heroku
    ```

5. Heroku environment variables setup.

    ```diff
    + API_KEY
    + JWT_SECRET
    ```

    <p align="center">
    <img src="./assets/p30-01.png" width=90%>
    </p>

    ------------------------------------------------------------

    <p align="center">
    <img src="./assets/p30-02.png" width=90%>
    </p>

    ------------------------------------------------------------

6. Connect redis in backend code.

    __`Location: ./backend/middlewares/authorization.js`__

    ```js
    const redis = require('redis');
    const redisClient = redis.createClient(process.env.REDIS_URL || 6379, { no_ready_check: true });
    ```

7. PostgreSQL database setup.

    __`Location: ./backend/dbConnection.js`__

    ```js
    const { Client } = require('pg');
    const dbSetting = process.env.DATABASE_URL ?
        {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        }
        :
        {
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_LOCAL_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
        }

    const db = new Client(dbSetting);

    db.connect();

    module.exports = db;
    ```

8. Deploy.

    ```bash
    $ git remote -v
    $ git remote rm heroku 
    $ heroku git:remote -a <your-heroku-app-name>
    $ git add .
    $ git commit -m'ready for deploy'
    $ git push heroku master
    $ heroku ps:scale web=1
    $ heroku open
    ```

#### For more detail, please [visit here.](https://github.com/DonghaoWu/smart-brain-doc/blob/master/README.md)



