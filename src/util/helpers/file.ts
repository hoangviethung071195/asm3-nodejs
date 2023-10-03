import fs from 'fs';
import { bucket, storage } from '../../services/cloud-storage';

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

export function getStorageApiEndpoint() {
  const { apiEndpoint } = storage;
  const bucketId = bucket.id;
  const storageApiEndpoint = `${apiEndpoint}/${bucketId}`;
  return storageApiEndpoint;
}