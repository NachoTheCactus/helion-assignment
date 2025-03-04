import mongoose from 'mongoose';

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined');
    throw new Error('MONGODB_URI must be defined in environment variables');
  }

  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(uri, {
      // Remove deprecated options
      retryWrites: true,
      w: 'majority'
    });

    console.log('✅ Successfully connected to MongoDB Atlas');

    // Optional: Add connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    return mongoose.connection;
  } catch (error:any) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error);
    
    // Provide more context about the connection error
    if (error.name === 'MongoNetworkError') {
      console.error('Network error. Check your connection string and network connectivity.');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('Authentication failed. Verify your username and password.');
    }

    throw error;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

export default connectDB;