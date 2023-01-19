import * as dotenv from 'dotenv'
import { z } from 'zod';
import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getImagesList, initDb, isAdmin } from './modules/db';

import * as account from './modules/account';
import * as uploadPlan from './modules/uploadPlan';

// *******************************************************************************
//                          TODO CHANGE URLFRONT IN ACCOUNT.JS
// *******************************************************************************

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
app.use(cors({ origin: '*' }));
app.use('/files', express.static('files'));

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
}

app.post('/userExists', async function (req, res) {
  await account.exitUserExists(req.body.email, res);
});

app.post('/createAccount', async function (req, res) {
  await account.createAccount(req.body.email, req.body.password, res);
});

app.post('/signIn', async function (req, res) {
  await account.signIn(req.body.email, req.body.password, res);
});

app.post('/checkConnection', async function (req, res) {
  await account.checkConnection(req.body.email, req.body.token, res);
});

app.post('/setToken', async function (req, res) {
  await account.setToken(req.body.email, res);
});

app.post('/mailResetPassword', async function (req, res) {
  await account.mailResetPassword(req.body.email, req.body.language, res);
});

app.post('/checkResetPasswordToken', async function (req, res) {
  await account.checkResetPasswordToken(req.body.token, res);
});

app.post('/resetPassword', async function (req, res) {
  await account.resetPassword(req.body.token, req.body.password, res);
});

app.get('/getImagesList', async function (req, res) {
  await uploadPlan.getImagesList(res);
});

app.get('/getAllPlans', async function (req, res) {
  await uploadPlan.getAllPlans(res);
});

app.get('/getPlan/:planId', async function (req, res) {
  const planId = req.params.planId.split('.')[0];
  await uploadPlan.getPlan(planId, res);
});

app.post('/updatePlan', async function (req, res) {
  console.log('ici')
  console.log('update plan', req.body)
  console.log('update plan 2', JSON.stringify(req.body))
  await uploadPlan.updatePlan(req.body.email, req.body.token, req.body.plan, res);
});

app.delete('/deletePlan', async function (req, res) {
  await uploadPlan.deletePlan(req.body.email, req.body.token, req.body.planId, res);
});

app.get('/isAdmin', async function (req, res) {
  await uploadPlan.isAdmin(req.body.email, req.body.token, res);
});

app.get('/getAllReservationsForPlanByDate/:planId', async function (req, res) {
  const planId = req.params.planId.split('.')[0];
  await uploadPlan.getAllReservationsForPlanByDate(planId, req.body.displayedDate, res);
});

app.get('/getCoeffSupperpositionByRoomByHour', async function (req, res){
  //await uploadPlan.getCoeffSupperpositionByRoomByHour(res);
});

app.post('/bookRoom', async function (req, res) {
  await uploadPlan.bookRoom(req.body.planId, req.body.roomName, req.body.startTime, req.body.endTime, req.body.email, req.body.token, res);
});

app.get('/myReservations', async function (req, res) {
  await uploadPlan.myReservations(req.body.email, req.body.token, res);
});

app.delete('/deleteReservation', async function (req, res) {
  await uploadPlan.deleteReservation(req.body.planId, req.body.startTime, req.body.roomName, req.body.email, req.body.token, res);
});

app.get('/', async function (req, res) {
  await res.send('Hello World!');
});

// created for each request
const createContext = ({ req, res, }: trpcExpress.CreateExpressContextOptions) => ({});
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
      return userList.find((it) => it.id === input);
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
      return await uploadPlan.dbGetNumberOfFloors();
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

uploadPlan.initImagesApp(app);

app.post('/createPlan', async (req, res) => {
  console.log(req.body)
  const dbResponse = await uploadPlan.uploadPlanData(req.body);
  return res.send({ id: dbResponse })
})

const port = process.env.PORT || 7801;
const test = 3001 //pour lancer le serveur sur le reseau yncrea_lab

if (app.listen(test)) {
  console.log('=========== SERVER STARTED FOR HTTP RQ ===========');
  console.log(`    =============   PORT: ${test}   =============`);
}

async function runTest() {
  console.log(await isAdmin("lucas@lucas.com"));

}
runTest()