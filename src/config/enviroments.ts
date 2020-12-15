import dotenv from 'dotenv';

const enviroment = dotenv.config({
  path: './src/.env'
});

if (process.env.NODE_ENV !== 'production') {
  if (enviroment.error) {
    throw enviroment.error;
  }
}

export default enviroment;