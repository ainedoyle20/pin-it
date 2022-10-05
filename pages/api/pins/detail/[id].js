import { client } from "../../../../lib/client";
import { pinDetailQuery } from '../../../../lib/data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {id} = req.query;

    const query = pinDetailQuery(id);

    const pinDetails = await client.fetch(query);

    res.status(200).json(pinDetails[0]);
    
  } else if (req.method === 'DELETE') {
    const {id} = req.query;

    await client.delete(id);

    res.status(200).json('Success deleting pin');
  }
}