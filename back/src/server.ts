import * as dotenv from 'dotenv' 
dotenv.config()

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_STRING: string;
    }
  }
}

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// import * as account from './modules/account';

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}


// ********** DB Connection **********

// const con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'tikal'
// });
//
// con.connect(err => {
//     if (err) {
//         console.log('Error when connecting to db:', err);
//     } else {
//         console.log('Connected to db for http requests');
//     }
// });

app.post('/userExists', function (req, res) {
    // account.userExists(req.body.username, req.body.email, req.body.language, con, res);
});

app.post('/mailCreateAccount', function (req, res) {
    // account.mailCreateAccount(req.body.username, req.body.password, req.body.email, req.body.language, res);
});

app.post('/checkSignUpToken', function (req, res) {
    // account.checkSignUpToken(req.body.token, req.body.language, res);
});

app.post('/createAccount', function (req, res) {
    // account.createAccount(req.body.token, req.body.language, con, res);
});

app.post('/signIn', function (req, res) {
    // account.signIn(req.body.identifier, req.body.password, req.body.language, con, res);
});

app.post('/checkConnection', (req, res) => {
    // account.checkConnection(req.body.username, req.body.token, con, res);
});

app.post('/getConnectionToken', (req, res) => {
    // account.getConnectionToken(req.body.username, con, res);
});

app.post('/mailResetPassword', function (req, res) {
    // account.mailResetPassword(req.body.email, req.body.language, con, res);
});

app.post('/checkResetPasswordToken', function (req, res) {
    // account.checkResetPasswordToken(req.body.token, req.body.language, res);
});

app.post('/resetPassword', function (req, res) {
    // account.resetPassword(req.body.token, req.body.password, req.body.language, con, res);
});

app.get('/', (req, res) => {
    res.send('Up and running!')
})


let counter = 0
app.get('/test', (req, res) => {
    res.type('txt');
    res.send(JSON.stringify({ a: counter++}));
})



import { z } from 'zod';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { initDb } from './db';
import { initImagesApp } from './images';

// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const router = t.router;
const publicProcedure = t.procedure;

interface User {
  id: string;
  name: string;
}

const userList: User[] = [
  {
    id: '1',
    name: 'TEST USER',
  },
];

const appRouter = router({
  userById: publicProcedure
    .input((val: unknown) => {
      if (typeof val === 'string') return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const input = req.input;
      const user = userList.find((it) => it.id === input);

      return user;
    }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation((req) => {
      const id = `${Math.random()}`;

      const user: User = {
        id,
        name: req.input.name,
      };

      userList.push(user);

      return user;
    }),
});

export type AppRouter = typeof appRouter;

app.use('/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)

initDb()

initImagesApp(app)

const port = process.env.PORT || 8080

if (app.listen(port)) {
    console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
    console.log(`    =============   PORT: ${port}   =============`);
}