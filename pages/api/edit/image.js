import { client } from "../../../lib/client";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const {userId, imageAsset} = req.body;

    const data =  await client
      .patch(userId)
      .set({image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset?._id,
        }
      }})
      .commit();

    res.status(200).json(data);
  }
}