import { client } from "../../../lib/client";
import { boardsQuery } from '../../../lib/data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {id} = req.query;

    const query = boardsQuery(id);

    const boards = await client.fetch(query);

    res.status(200).json(boards);
  }
}