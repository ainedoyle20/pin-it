import { client } from "../../lib/client";
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { userId, theme, addTopic } = req.body;

    const data = addTopic
    ?   await client.patch(userId).setIfMissing({ tuneFeed: [] })
        .insert('after', 'tuneFeed[-1]', [{
          _key: uuidv4(),
          _type: 'tuneFeed',
          image: `${theme.image}`,
          name: `${theme.name}`,
        }])
        .commit()

      : await client.patch(userId).unset([`tuneFeed[_key=="${theme._key}"]`]).commit()
    
    res.status(200).json(data);
  }
}