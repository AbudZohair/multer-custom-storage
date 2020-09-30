const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { fileFileter, loadBalance } = require('./config/mutlerConfig');
const multer = require('multer');
const adapter = new FileSync('db.json');
const db = low(adapter);
const uuid = require('uuid').v4;
const { AppError, errorHandler } = require('./config/appError');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

db.defaults({ images: {} }).write();

// create express app
const app = express();

// add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/upload', (req, res, next) => {
  const upload = multer({
    storage: loadBalance(),
    fileFilter: fileFileter
  }).array('image', 2);

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return next(
        new AppError(`Error eccoured while uploading: ${err.message}`, 401)
      );
    } else if (err) {
      return next(new AppError(`${err.message}`, 401));
    } else if (!req.files)
      return next(
        new AppError(`Error You have to upload at least one image`, 401)
      );
    else {
      const result = req.files.map(file => {
        const id = uuid();
        return {
          _id: id,
          url: file.path,
          name: file.originalname
        };
      });
      result.forEach(image => {
        db.set(`images.${image._id}`, image).write();
      });
      res.json(result);
    }
  });
});

app.get('/:id', (req, res, next) => {
  const { id } = req.params;
  const imageData = db.get(`images[${id}]`).value();
  if (!imageData) {
    return next(new AppError('Image is not found', 400));
  } else {
    res.json(imageData);
  }
});

app.use(errorHandler);

// start the app
const port = 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
