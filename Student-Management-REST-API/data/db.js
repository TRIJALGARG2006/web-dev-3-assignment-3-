const mongoose = require('mongoose');
const { prepareStudentData } = require('./students');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI?.trim();
  if (!mongoURI) {
    throw new Error('MONGODB_URI is missing. Add it to your .env file.');
  }

  await mongoose.connect(mongoURI);
  await prepareStudentData();
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
};

module.exports = connectDB;
