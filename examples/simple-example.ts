import express from 'express';
import correlator from '../src/index';
import type { CorrelationIdRequest } from '../src/types';

const app = express();

app.use(correlator());

app.get('*', (req: CorrelationIdRequest, res) => {
  console.log(`${req.correlationId()} requested url ${req.url}`);

  res.on('finish', () => {
    console.log(`ID within finish is ${req.correlationId()}`);
  });

  getRandomNumber((err, randomNumber) => {
    res.send(`Random number: ${randomNumber}`);
  });
});

function getRandomNumber (callback: (err: Error | null, randomNumber: number) => void) {
  setTimeout(() => {
    console.log(`${correlator.getId()} getting random number`);

    callback(null, Math.floor(Math.random() * 1000));
  }, 3000);
}

app.listen(3000, (err?: Error) => {
  if (err) {
    return console.error(err);
  }
  console.log('Example app listening on port 3000');
});
