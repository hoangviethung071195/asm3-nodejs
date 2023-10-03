import multer from 'multer';

export const customMulter = (
  fileSize = 5 * 1024 * 1024,
  mimetypes: string[] = [],
  fieldName = 'files',
  maxCount = 10,
) =>
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize
    },
    fileFilter(req, file, callback) {
      if (!mimetypes.length || mimetypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  }).array(fieldName, maxCount);