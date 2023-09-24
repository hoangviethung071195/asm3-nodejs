import { config } from 'dotenv';

config();

const { DB = '', PORT = 5000, API_ENDPOINT } = process.env;

export {
  DB,
  PORT,
  API_ENDPOINT
};