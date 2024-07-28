import { connectToDatabase } from './mongodb';

export default async function handler(req, res) {
  if (req.url === '/' && req.method === 'GET') {
    res.status(200).send('Hello World');
    return;
  }

  const db = await connectToDatabase();
  const credentials = db.collection('credentials');

  switch (req.method) {
    case 'POST':
      try {
        const result = await credentials.insertOne(req.body);
        res.status(201).json(result);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
      break;

    case 'GET':
      try {
        const result = await credentials.find().toArray();
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id } = req.query;
        const result = await credentials.findOneAndUpdate(
          { _id: new MongoClient.ObjectId(id) },
          { $set: req.body },
          { returnOriginal: false }
        );
        res.status(200).json(result.value);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.query;
        await credentials.deleteOne({ _id: new MongoClient.ObjectId(id) });
        res.status(200).json({ message: 'Credential deleted' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
