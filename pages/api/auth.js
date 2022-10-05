import {client} from '../../lib/client';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const doc = req.body;

    client.createIfNotExists(doc).then(() => res.status(200).json('Success logging in'));
  }
}