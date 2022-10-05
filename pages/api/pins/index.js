import { client } from "../../../lib/client";
import { pinsQuery } from '../../../lib/data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const query = pinsQuery();
    const pins = await client.fetch(query);

    res.status(200).json(pins);
  } else if (req.method === 'POST') {
    const doc = req.body;

    await client.create(doc);

    res.status(201).json('Success creating pin');
  }
}