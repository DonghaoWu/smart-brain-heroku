# smart-brain-prod

```bash
rm -fr .git
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/DonghaoWu/smart-brain-prod.git
git push -u origin master

```

- local

```bash
npm i
npm run installAll

$ cd
$ cd redis-6.0.6
$ src/redis-server

ps aux | grep redis
```

### local redis

Location: ./backend-smart-brain-api-prod/controllers/register.js

Location: ./backend-smart-brain-api-prod/controllers/signin.js

Location: ./backend-smart-brain-api-prod/middlewares/authorization.js

```js
const redis = require('redis');
const redisClient = redis.createClient();
```

- local database
Location: ./backend-smart-brain-api-prod/server.js

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

- local .env file

- Create postgreSQL database and tables:

1. Create database: postico
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

- Run the application locally.

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

4. 


