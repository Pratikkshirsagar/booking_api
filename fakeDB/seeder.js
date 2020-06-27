const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FakeDB = require('./FakeDB');
// * Load env vars
dotenv.config({ path: '../config/config.env' });

// * Connect to DB
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
  async () => {
    const fakeDB = new FakeDB();
    console.log('Starting populating DB');
    await fakeDB.populate();
    await mongoose.connection.close();
    console.log('DB has been populated');
  }
);
