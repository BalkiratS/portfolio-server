// secrets.js
const getSecret = async (secret_name) => {
    try {
      // Map secret names to environment variables (all JSON strings)
      const secretMap = {
        "pserver/MDB": process.env.DATABASE_URL,
        "pserver/secret-key": process.env.SECRET_KEY,
        "pserver/bucket-name": process.env.BUCKET_NAME,
        "pserver/email": process.env.EMAIL,
        "pserver/admin-creds": process.env.ADMIN_CREDS,
        "pserver/s3-creds": process.env.S3_CREDS,
      };

      // Get the raw JSON string from the map
      const secretValue = secretMap[secret_name];
      if (!secretValue) {
        throw new Error(`Secret ${secret_name} not found in environment variables`);
      }

      // Parse and return the JSON object
      return JSON.parse(secretValue);
    } catch (error) {
      throw error;
    }
  };

  module.exports = getSecret;
