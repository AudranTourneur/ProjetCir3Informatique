import * as dotenv from 'dotenv' 
import { z } from 'zod';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { checkConnection, createNewUser, initDb, emailExists, resetPassword, setToken, signIn } from './db';
import { sign } from 'crypto';
import { dbGetNumberOfFloors, initImagesApp } from './images';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import * as account from './modules/account';

dotenv.config()

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_STRING: string;
    }
  }
}

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}




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

app.get('/ping', (req, res) => {
  console.log('PING')
  res.send('pong')
})


let counter = 0
app.get('/BLABLA', (req, res) => {
    res.type('txt');
    res.send(JSON.stringify({ a: counter++}));
})




// created for each request
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});
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
    getNumberOfFloors: publicProcedure
      .query(async () => {
        return await dbGetNumberOfFloors()
      })
});

export type AppRouter = typeof appRouter;

app.use('/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

initDb();

initImagesApp(app);

const port = process.env.PORT || 7801;
const IPv4 ='10.224.2.237';
const test=3001 //pour lancer le serveur sur le reseau yncrea_lab

if (app.listen(port)) {
    console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
    console.log(`    =============   PORT: ${port}   =============`);
}

 
async function run() {
console.log("test emailExists (true):", await emailExists("john@john.com"))
console.log("test emailExists (false):", await emailExists("hgfhgdfbj"))
console.log("test signin (success): ",await signIn("john@john.com","1234","token4"))
console.log("test signin (email): ",await signIn("hghdj","1234","token4"))
console.log("test signin (password): ",await signIn("john@john.com","hgjfjfh","token4"))
console.log("test checkconnection (true) :",await checkConnection("john@john.com","token4"))
console.log("test checkconnection (false) :",await checkConnection("john@john.com","fhshfdvjfs"))
console.log("test setToken (true):",await setToken("john@john.com","testtoken"))
console.log("test setToken (false):",await setToken("vjvjhgjffb","testtoken"))
console.log("test resetPassword (true):",await resetPassword("john@john.com","testPW123"))
console.log("test resetPassword (false):",await resetPassword("vjvjhgjffb","testtoken"))
await resetPassword("john@john.com","1234")
}

run()