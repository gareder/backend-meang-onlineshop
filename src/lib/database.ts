import chalk from 'chalk';
import MongoClient from 'mongodb';

class Database {
  async init() {
    const MONGO_DB = process.env.DB || 'mongodb+srv://eder:26qvYQLRNY2PwrGy@cluster0.efwft.mongodb.net/meang-online-shop';
    const client = await MongoClient.connect(
      MONGO_DB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    const db = client.db();
    if (client.isConnected()) {
      console.log('=======DATABASE=======');
      console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
      console.log(`NAME: ${chalk.greenBright(db.databaseName)}`);
    }
    return db;
  }
}

export default Database;
// mongodb://localhost:27017/meang-online-shop