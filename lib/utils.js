import { client } from './client';
import { signUp } from './firebase';

export const handleSignUp = async (userDetails, imageAsset) => {
  const { userName, selectedFile, email, password, websiteLink } = userDetails;

  const userId = await signUp(email, password);
  console.log({userId});

  if (userId) {
    console.log('got in here');
    const doc = {
      _id: userId,
      _type: 'user',
      userName,
      website: websiteLink,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAsset?._id,
        },
      },
    }  

    localStorage.setItem('user', JSON.stringify({ userId }));

    console.log('got here 2');

    client.create(doc).then(() => {
      console.log('Successfully created user doc!');
    }).catch((err) => {
      console.log('Error creating user doc: ', err);
      localStorage.clear();
    });

    return true;
  } else {
    console.log('got here');
    return false;
  }
}