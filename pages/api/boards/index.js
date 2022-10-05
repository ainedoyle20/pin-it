import { client } from "../../../lib/client";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const doc = req.body;

    const data = await client.create(doc);

    res.status(200).json(data);
  }
}