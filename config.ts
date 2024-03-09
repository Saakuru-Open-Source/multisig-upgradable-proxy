import dotenv from 'dotenv';

dotenv.config();

export default {
  VARIANT_TYPE: process.env.VARIANT_TYPE,
  NAME: process.env.NAME,
  SYMBOL: process.env.SYMBOL,
  VALIDATORS: process.env.VALIDATORS.split(',').map((v) => v.trim()),
};