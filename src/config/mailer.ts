import chalk from 'chalk';
import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL, // generated ethereal user
    pass: process.env.USER_PASSWORD, // generated ethereal password
  }
});

transport.verify().then(() => {
  console.log('=======NODEMAILER CONNECTION=======');
  console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
}).catch(error => {
  console.log('=======NODEMAILER CONNECTION=======');
  console.log(`STATUS: ${chalk.redBright('OFFLINE')}`);
  console.log(`STATUS: ${chalk.redBright(error)}`);
});