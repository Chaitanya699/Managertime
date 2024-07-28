const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'your_default_local_mongo_uri_here';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db = null;

const connectToDatabase = async () => {
  if (db) return db;

  try {
    await client.connect();
    db = client.db('credentialManager'); // Replace with your database name
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
};

module.exports = { connectToDatabase };
