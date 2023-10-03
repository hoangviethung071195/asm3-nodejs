import { json } from 'body-parser';
import cors from 'cors';
import { customMulter } from './multer';

export function getThirdParties() {
  return [
    cors({
      credentials: true,
      origin: true
    }),
    json(),
  ];
};