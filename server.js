const express = require('express');
const bodyParser = require('body-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { fileFileter, loadBalance } = require('./config/mutlerConfig');
const multer = require('multer');
const adapter = new FileSync('db.json');
const db = low(adapter);
const uuid = require('uuid').v4;
const AppError = require('./config/appError');

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

  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return new AppError(`Error eccoured while uploading: ${err}`, 401);
    } else if (err) {
      return new AppError(`${err}`, 401);
    } else {
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

app.get('/:id', (req, res) => {
  const { id } = req.params;
  const imageData = db.get(`images[${id}]`).value();
  if (!imageData) {
    return new AppError('Image is not found', 400);
  } else {
    res.json(imageData);  
  }
});

// start the app
const port = 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));
