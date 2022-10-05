import { client } from "../../../lib/client";
import { userQuery } from '../../../lib/data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {id} = req.query;

    const query = userQuery(id);

    const userDetails = await client.fetch(query);

    res.status(200).json(userDetails[0]);
  }
}