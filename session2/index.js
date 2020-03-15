const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');

const mongoose = require('mongoose');

const app = express();

const response = require('./utils/response');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('tiny'));

const ENV = process.env.NODE_ENV || 'dev';

const config = dotenv.config({
  path: `./configs/${ENV}.env`
}).parsed;

mongoose
  .connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('successfully connected to database'));

const db = require('./models');

app.use((req, res, next) => {
  req.db = db;
  res.success = response.success(res);
  res.error = response.error(res);
  res.message = response.message(res);

  next();
});

const router = require('./routes');

app.use('/', router);

app.listen(config.PORT, () =>
  console.log(`listening on port ${config.PORT}...`)
);
