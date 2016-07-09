import express from 'express';
import sample from './sample';

export default index;

function index(app, options) {
  const router = express.Router();
  sample(app, options);
  app.use('/api', router);
};