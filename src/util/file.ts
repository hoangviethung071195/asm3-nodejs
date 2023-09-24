import fs from 'fs';

export const deleteFile = (filePath: string) => {
  fs.unlink(filePath, err => {
    if (err) {
      throw Error(err.message);
    }
  });
};

export const getBase64URL = (file: Express.Multer.File) => {
  return 'data:image/png;base64,' + file.buffer.toString('base64');
};
