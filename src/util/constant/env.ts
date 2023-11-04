import { config } from 'dotenv';

config();

const { DB = 'mongodb+srv://hoangviethung071195:hungnho123@project0.anbpvsu.mongodb.net/asm3', PORT = 5000, API_ENDPOINT } = process.env;
console.log('DB ', DB);
console.log('PORT ', PORT);
console.log('API_ENDPOINT ', API_ENDPOINT);
export {
  DB,
  PORT,
  API_ENDPOINT
};