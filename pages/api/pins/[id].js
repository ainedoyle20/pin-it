import { client } from "../../../lib/client";
import { createdPinsQuery } from '../../../lib/data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {id} = req.query;

    const query = createdPinsQuery(id);
    const createdPins = await client.fetch(query);

    res.status(200).json(createdPins);
  } else if (req.method === 'DELETE') {
    const {id} = req.query;

    await client.delete(id);

    res.status(200).json('Deleted pin successfully');
  }
}