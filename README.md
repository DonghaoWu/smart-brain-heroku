# smart-brain-prod

### Download & connect to your gitHub.

  ```bash
  git clone https://github.com/DonghaoWu/smart-brain-prod.git
  cd smart-brain-prod
  rm -fr .git
  git init
  git add .
  git commit -m "first commit"
  git remote add origin <your-repo-link>
  git push -u origin master
  ```

### Run the application locally.

1. Install dependencies.

  ```bash
  npm i
  npm run installAll
  ```

2. [Download](https://redis.io/download) & Run redis server.

  ```bash
  $ cd
  $ cd redis-6.0.6
  $ src/redis-server
  ```

  #### `Comment:`
  1. 查看正使用的 redis 本地端口。

    ```bash
    $ ps aux | grep redis
    $ kill -9 <port-number> # stop a port redis service
    ```

  2. 进入 redis CLI。

    ```bash
    $ cd
    $ cd redis-6.0.6
    $ src/redis-cli
    ```

3. Local redis setup.

  __`Location: ./backend-smart-brain-api-prod/controllers/register.js`__
  __`Location: ./backend-smart-brain-api-prod/controllers/signin.js`__
  __`Location: ./backend-smart-brain-api-prod/middlewares/authorization.js`__

  ```js
  const redis = require('redis');
  const redisClient = redis.createClient(6379);
  // const redisClient = redis.createClient();
  ```

4. Local .env file.

  __`Location: ./backend-smart-brain-api-prod/.env`__

  ```env
  POSTGRES_CLIENT=<--->
  POSTGRES_HOST=<--->
  POSTGRES_USER=<--->
  POSTGRES_PASSWORD=<--->
  POSTGRES_DB=<--->

  API_KEY=<--->
  JWT_SECRET=<--->
  ```

5. Download, install [postgreSQL](https://www.postgresql.org/) & Local postgreSQL setup.

  __`Location: ./backend-smart-brain-api-prod/server.js`__

  ```js
  const db = knex({
    client: process.env.POSTGRES_CLIENT,
    connection: {
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB
    }
  });
  ```

  #### `Comment:`
  1. 这里的 connection 可以使用 URI 代替，比如：[postgreSQL connection string](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)

6. Create postgreSQL database and tables:

  1. Create database: postico [check here](https://github.com/DonghaoWu/Weather-RNEP-heroku-new/blob/master/README.md)

  2. Create tables:

  ```sql
  CREATE TABLE login (
      id serial PRIMARY KEY,
      hash VARCHAR(100) NOT NULL,
      email text UNIQUE NOT NULL
  );

  CREATE TABLE users (
      id serial PRIMARY KEY,
      name VARCHAR(100),
      email text UNIQUE NOT NULL,
      entries BIGINT DEFAULT 0,
      joined TIMESTAMP NOT NULL,
      pet VARCHAR(100),
      age BIGINT
  );
  ```

7. Run the application locally.

```bash
npm run dev
```

### Heroku deploy

```bash
$ heroku login  # 登录 heroku
$ heroku create smart-brain-prod-2020 # 定制 app 名字
$ heroku addons:create heroku-postgresql:hobby-dev --name=smart-brain-2020-db # 新增一个 postgreSQL 的 database。

$ heroku addons:attach smart-brain-2020-db --app=smart-brain-prod-2020 # 设定 app 和 db 对接

$ heroku pg:psql --app smart-brain-prod-2020 # 进入 app 对应的 db 的命令行
```

```sql
CREATE TABLE login (
    id serial PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email text UNIQUE NOT NULL
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL,
    pet VARCHAR(100),
    age BIGINT
);
```

```bash
\q
heroku addons:create heroku-redis:hobby-dev
```

- package.json

```json
{
  "name": "smart-brain-prod",
  "version": "1.0.0",
  "description": "deploy on heroku without docker",
  "main": "./backend-smart-brain-api-prod/server.js",
  "scripts": {
    "installAll": "concurrently \"npm run installServer\" \"npm run installClient\"",
    "installServer": "cd backend-smart-brain-api-prod && npm install",
    "installClient": "cd frontend-smart-brain-prod && npm install",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "client": "npm start --prefix frontend-smart-brain-prod",
    "server": "npm run server --prefix backend-smart-brain-api-prod",
    "start": "npm start --prefix backend-smart-brain-api-prod",
    "heroku-prebuild": "cd backend-smart-brain-api-prod && npm install",
    "heroku-postbuild": "cd frontend-smart-brain-prod && npm install --only=dev && npm install && npm run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/DonghaoWu/smart-brain-prod.git"
  },
  "keywords": [
    "heroku-deploy-without-docker"
  ],
  "author": "Donghao",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/DonghaoWu/smart-brain-prod/issues"
  },
  "homepage": "https://github.com/DonghaoWu/smart-brain-prod#readme",
  "devDependencies": {
    "concurrently": "^5.3.0"
  }
}
```

- redis and postgreSQL  heroku setup
Location: ./backend-smart-brain-api-prod/controllers/register.js

Location: ./backend-smart-brain-api-prod/controllers/signin.js

Location: ./backend-smart-brain-api-prod/middlewares/authorization.js

```js
const redis = require('redis');
const redisClient = redis.createClient(process.env.REDIS_URL, {no_ready_check: true});
```

- database
Location: ./backend-smart-brain-api-prod/server.js

```js
const pg = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});
```

- static file:

```js
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend-smart-brain-prod/build')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../frontend-smart-brain-prod/build/index.html'));
  })
}
```

- environment variables:

```diff
+ DATABASE_URL
+ HEROKU_POSTGRESQL_GRAY_URL
+ REDIS_URL
+ API_KEY
+ JWT_SECRET
```


- deploy

```bash
git remote -v
heroku git:remote -a smart-brain-prod-2020
git add .
git commit -m'ready for deploy'
git push heroku master
heroku ps:scale web=1
heroku open
```

- others

- pool

```js
const db = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 10 }
});
```

- proxy, __`proxy 是需要的。`__

```json
  "proxy": "http://localhost:4000"
```

- .gitignore 

```json
# production
/build
```

- app.use

```js
// const app = express();
// app.use(morgan('tiny'));
// app.use(cors());
// app.use(bodyParser.json());

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
```

- port ?

- delete

```js
app.get('/', (req, res) => { res.send(`This message is from server.js. You will get this message when visit http://localhost:4000/`) })
```

hard refresh and empty cache.

### 补充：

1. 恢复 port 到 4000，恢复删除 db pool， 使用

```js
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
```

2. 删除 console.log

3. 知道处理错误时 在哪里添加 console.log，上一个未知错误的发现是在 signin.js 中的 signinAuthentication 的 catch block 中 加入 `console.log(err)`



