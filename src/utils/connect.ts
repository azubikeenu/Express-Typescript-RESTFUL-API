import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

async function connect() {
  const dbUri = config.get<string>('dbUri');
  try {
    await mongoose.connect(dbUri);
    log.info('Connected to the database');
  } catch (err) {
    log.error("Couldn't connect to the database");
    process.exit(1);
  }
}

export default connect;
