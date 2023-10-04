import { config } from 'dotenv';

config();

const { DB = '', PORT = 5000, API_ENDPOINT } = process.env;
console.log('DB ', DB);
console.log('PORT ', PORT);
console.log('API_ENDPOINT ', API_ENDPOINT);
export {
  DB,
  PORT,
  API_ENDPOINT
};