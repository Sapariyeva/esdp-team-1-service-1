import dotenv from 'dotenv';
import * as process from 'process';

dotenv.config();

type TEnvConfig = {
  port: number;
  dbUri: string;
  qrBaseUrl: string;
  secret: string;
};

export const params: TEnvConfig = {
  port: parseInt(process.env.PORT),
  dbUri: process.env.DB_URI,
  qrBaseUrl: process.env.QR_BASE_URL,
  secret: process.env.SECRET,
};
