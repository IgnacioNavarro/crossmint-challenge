import express from 'express';
import routes from './controllers/routes';
import { basicConfig } from './utils/basicConfig';
import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create a new express application instance with custom port
const app = express();
const port = basicConfig.port;

//add middleware to parse json
app.use(express.json());

//add routes
app.use('/api', routes);

axiosRetry(axios, {
  retries: 5,
  retryDelay: (...arg) => axiosRetry.exponentialDelay(...arg, 1000),
  retryCondition(error) {
    console.log("retry?", error.response?.status);
    return error.response?.status === 429;
  },
  onRetry(retryCount) {
    console.log("we are retrying", retryCount);
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
