import { client } from "../../../../lib/client";
import { similarPinsQuery } from '../../../../lib/data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {category} = req.query;

    const query = similarPinsQuery(category);

    const similarPins = await client.fetch(query);

    res.status(200).json(similarPins);
    
  } 
}