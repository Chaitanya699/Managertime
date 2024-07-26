const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const connectionString = 'mongodb://127.0.0.1:27017/credentialManager'; // Update if using Atlas

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit process with failure
  });

const db = mongoose.connection;

const credentialSchema = new mongoose.Schema({
  platform: String,
  username: String,
  password: String,
});

const Credential = mongoose.model('Credential', credentialSchema);

app.post('/api/credentials', async (req, res) => {
  const credential = new Credential(req.body);
  try {
    const savedCredential = await credential.save();
    res.status(201).json(savedCredential);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/credentials', async (req, res) => {
  try {
    const credentials = await Credential.find();
    res.json(credentials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.put('/api/credentials/:id', async (req, res) => {
  try {
    const updatedCredential = await Credential.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCredential);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/credentials/:id', async (req, res) => {
  try {
    await Credential.findByIdAndDelete(req.params.id);
    res.json({ message: 'Credential deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
