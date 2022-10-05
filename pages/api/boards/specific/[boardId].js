import { v4 as uuidv4 } from 'uuid';
import { client } from "../../../../lib/client";
import { specificBoardQuery } from '../../../../lib/data';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const {boardId} = req.query;

    const query = specificBoardQuery(boardId);

    const boardDetails = await client.fetch(query);

    res.status(200).json(boardDetails[0]);
  } else if (req.method === 'DELETE') {
    const {boardId} = req.query;

    await client.delete(boardId);

    res.status(200).json('Success deleting board');
    
  } else if (req.method === 'PUT') {
    const {boardId} = req.query;
    const {pinId, save} = req.body;

    const data = save
      ? await client.patch(boardId).setIfMissing({ savedPins: [] }).insert('after', 'savedPins[-1]', [{
          _key: uuidv4(),
          _type: 'savedPin',
          _ref: `${pinId}`
        }])
        .commit()

      : await client.patch(boardId).unset([`savedPins[_ref=="${pinId}"]`]).commit();

    res.status(200).json(data);
  }
}