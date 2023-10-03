import { Storage } from '@google-cloud/storage';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';

const fileName = 'credentials.json';
const credentials = JSON.parse(readFileSync(fileName).toString());
const projectId = credentials.project_id;
const bucketName = credentials.bucket_name;
export const storage = new Storage({
  projectId,
  keyFilename: fileName
});
export const bucket = storage.bucket(bucketName);

export function uploadFilesToCloudStorage(files: Express.Multer.File[]) {
  const fileIds: string[] = [];

  return new Promise<string[]>(res => {
    if (!files.length) {
      res([]);
      return;
    }

    files.forEach((file, i) => {
      file.originalname = randomUUID() + file.originalname;
      const blob = bucket.file(file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.end(file.buffer);
      blobStream.on('finish', () => {
        const { apiEndpoint } = storage;
        const bucketId = bucket.id;
        const fileId = blob.id;
        const url = `${apiEndpoint}/${bucketId}/${fileId}`;

        fileIds.push(fileId);

        if (fileIds.length === files.length) {
          const sortedFileIds: string[] = [];

          files.forEach(file => {
            const id = fileIds.find(id => id === file.originalname);
            sortedFileIds.push(id);
          });

          res(sortedFileIds);
        }
      });
    });
  });
}

export async function deleteFileInCloudStorage(fileIds: string[]) {
  if (!fileIds?.length) {
    return false;
  }
  try {
    return Promise.all([
      fileIds.map(id => bucket.file(id).delete())
    ]).then(async ([x]) => {
      return Promise.all(x).then(() => true);
    });
  } catch (error) {
    console.log('error ', error);
  }
}