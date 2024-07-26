const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://chaitanyakhairnar143:f2ucN2oT7eG2kJyt@chaitu.tz09ufj.mongodb.net/?retryWrites=true&w=majority&appName=chaitu'; // Connection string from MongoDB Atlas
const client = new MongoClient(uri);

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
