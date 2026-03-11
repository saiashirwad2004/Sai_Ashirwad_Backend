const cloudinary = require('cloudinary').v2;

// CLOUDINARY_URL env var auto-configures cloudinary
// Fallback to individual env vars if CLOUDINARY_URL is not set
if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Verify connection
const verifyCloudinary = async () => {
  try {
    const config = cloudinary.config();
    if (config.cloud_name && config.api_key) {
      await cloudinary.api.ping();
      console.log(`✅ Cloudinary connected (${config.cloud_name})`);
    } else {
      console.log('⚠️  Cloudinary not configured — image uploads will use local storage');
    }
  } catch (error) {
    console.log('⚠️  Cloudinary connection failed:', error.message);
  }
};

verifyCloudinary();

module.exports = cloudinary;
