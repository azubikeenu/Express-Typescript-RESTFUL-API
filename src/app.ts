import config from 'config';
import log from './utils/logger';
import connect from './utils/connect';

import createServer from './utils/server';
const port = config.get<number>('port');

const app = createServer();

app.listen(port, async () => {
  log.info(`App is running on port : ${port}`);
  await connect();
});
