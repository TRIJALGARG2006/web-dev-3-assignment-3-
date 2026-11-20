const mongoose = require('mongoose');
const { seedStudents } = require('./students');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI?.trim();
  if (!mongoURI) {
    throw new Error('MONGODB_URI is missing. Add it to your .env file.');
  }

  await mongoose.connect(mongoURI);
  await seedStudents();
  console.log('MongoDB connected');
};

module.exports = connectDB;
