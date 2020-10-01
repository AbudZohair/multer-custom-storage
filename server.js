const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid').v4;
const imageController = require('./controllers/imageController');
const { AppError, errorHandler } = require('./utils/appError');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// create express app
const app = express();

// add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/upload', imageController.uploadImages);

app.get('/:id', imageController.getImages);

app.use(errorHandler);

// start the app
const port = 3001;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
