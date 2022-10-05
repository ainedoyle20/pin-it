import { client } from "../../../lib/client";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userId, websiteUrl } = req.body;

    const data = await client
      .patch(userId)
      .set({website: websiteUrl})
      .commit()

    res.status(200).json(data);
  }
}