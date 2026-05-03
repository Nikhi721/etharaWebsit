import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing. Add your MongoDB Atlas connection string to backend/.env');
  }

  const connection = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;
