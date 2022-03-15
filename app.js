const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const viewRouter = require('./routes/viewRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const nodeCron = require('node-cron');
const scrapper = require('./controllers/ScrapperController');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
//const productsRouter = require('./routes/productsRoutes');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

// const job = nodeCron.schedule('*/15 * * * *', () => {
//   console.log(new Date().toLocaleString());
//   scrapper.scrapeData();
// });
//scrapper.scrapeData();
module.exports = app;
