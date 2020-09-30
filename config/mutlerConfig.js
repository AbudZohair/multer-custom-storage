const multer = require('multer');
const cloudinaryStorage = require('./cloudinary-storage-multer');
const AppError = require('./appError');

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images');
  },
  filename: (req, file, cb) => {
    const uid = Date.now();
    cb(null, `${uid + '_' + file.originalname.replace(/\s/g, '')}`);
  }
});

const fileFileter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const storage = [diskStorage, cloudinaryStorage];

function loadBalanceWrapper() {
  let c = 0;
  return function loadBalance() {
    if (storage.length - 1 === c) {
      const passStorage = storage[c];
      c = 0;
      return passStorage;
    } else {
      const passStorage = storage[c];
      c++;
      return passStorage;
    }
  };
}
const loadBalance = loadBalanceWrapper();

module.exports = {
  fileFileter,
  loadBalance
};
