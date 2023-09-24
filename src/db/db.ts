import mongoose from 'mongoose';
import { DB } from '../util/constant/env';

export const db = mongoose
  .connect(DB)
  .catch(err => console.log(err));