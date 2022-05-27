import express from 'express';
import config from 'config';
import log from './utils/logger';
import connect from './utils/connect';
import routes from './routes';
import deserializeUser from './middleware/deserializeUser';
const port = config.get<number>('port');
const app = express();

app.use(express.json());

app.use(deserializeUser);

app.listen(port, async () => {
  log.info(`App is running on port : ${port}`);
  await connect();
  routes(app);
});
