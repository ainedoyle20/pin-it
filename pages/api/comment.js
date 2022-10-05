import { client } from "../../lib/client";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { pinId, userId, comment, addComment } = req.body;

    const data = addComment
      ? await client.patch(pinId).setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          _key: uuidv4(),
          _type: 'comments',
          postedBy: {
            _type: 'postedBy',
            _ref: userId,
          },
          comment: comment,
        }])
        .commit()

      : await client.patch(pinId).unset([`comments[_key=="${comment._key}"]`]).commit()
    
    res.status(200).json(data);
  }
}