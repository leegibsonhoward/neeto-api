const mongoose = require('mongoose');

module.exports = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await global.__MONGO_SERVER__.stop();
  };
  