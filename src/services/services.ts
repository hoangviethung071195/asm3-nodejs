import { json } from 'body-parser';
import cors from 'cors';
import multer from 'multer';

export function getThirdParties() {
  return [
    cors({
      credentials: true,
      origin: true
    }),
    json(),
    multer().array('image', 4)
  ];
};