const mongoose = require('mongoose');
const dns = require('dns');

// Use the OS DNS resolver (fixes SRV lookup issues in some environments)
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Don't exit — allow the server to run and retry
    console.log('⚠️  Server will continue without database. Retrying in 10 seconds...');
    setTimeout(connectDB, 10000);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB error: ${err.message}`);
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

module.exports = connectDB;
