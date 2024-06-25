import { config } from 'dotenv';

config();

const { DB = 'mongodb+srv://hoangviethung071195:hungnho123@project0.anbpvsu.mongodb.net/asm3', PORT = 5000, API_ENDPOINT, SECRET_BEARER_KEY = "DEFAULT_SECRET_BEARER_KEY" } = process.env;
console.log('DB ', DB);
console.log('PORT ', PORT);
console.log('API_ENDPOINT ', API_ENDPOINT);
console.log('SECRET_BEARER_KEY ', SECRET_BEARER_KEY);
export {
  DB,
  PORT,
  API_ENDPOINT,
  SECRET_BEARER_KEY
};