import express, { Request, Response } from 'express';
import client from 'prom-client';
import log from './logger';

const app = express();

export const restResponseTimeHistogram = new client.Histogram({
  name: 'rest_response_time_duration_histogram',
  help: 'REST API response time in seconnds ',
  labelNames: ['method', 'route', 'status_code'],
});

export const dbResponseTimeHistogram = new client.Histogram({
  name: 'db_response_time_duration_histogram',
  help: 'Database response time in seconnds ',
  labelNames: ['operation', 'success'],
});

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
app.get('/metrics', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', client.register.contentType);
  return res.send(await client.register.metrics());
});

export const startMetricsServer = () => {
  const PORT = 9100;
  app.listen(PORT, () => {
    log.info(`Metric server started ,listening at ${PORT}`);
  });
};
