const mongoose = require('mongoose');
const dns = require('dns');

// Set DNS servers (Google DNS) to fix SRV lookup issues in some environments
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Use the OS DNS resolver
// dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // Force IPv4
    });
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
