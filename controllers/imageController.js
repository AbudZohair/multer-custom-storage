const multer = require('multer');
const { fileFileter, loadBalance } = require('../config/mutlerConfig');
const { db } = require('./dbController');
const { AppError, errorHandler } = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')
const cloudinaryStorage = require('../config/cloudinary-storage-multer');
const { diskStorage } = require('multer');

const uploader = catchAsync(() => {
  (req, res, function (err) {
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

exports.localProvider = (req, res, next) => {
  const upload = multer({
    storage: diskStorage,
    fileFilter: fileFileter
  }).array('image', 2);

  upload(uploader());
};

exports.cloudinaryProvider = (req, res, next) => {
  const upload = multer({
    storage: cloudinaryStorage,
    fileFilter: fileFileter
  }).array('image', 2);

  upload(uploader());
};

exports.getImages = (req, res, next) => {
  const { id } = req.params;
  const imageData = db.get(`images[${id}]`).value();
  if (!imageData) {
    return next(new AppError('Image is not found', 400));
  } else {
    res.json(imageData);
  }
};