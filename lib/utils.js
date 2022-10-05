import { signUp, signIn, logOut } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const handleSignUp = async (userDetails, imageAsset) => {
  const { userName, email, password, websiteLink } = userDetails;

  const userId = await signUp(email, password);

  if (userId) {
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

    await axios.post(`${BASE_URL}/api/auth`, doc);

    // localStorage.setItem('user', JSON.stringify({ userId }));

    // try {
    //   const res = await client.create(doc);
    //   console.log('Successfully created user doc!');
    //   return !!res;
    // } catch (error) {
    //   console.log('Error creating user doc: ', err);
    // }
  } 
}

export const handleSignIn = async (loginDetails) => {
  const { email, password } = loginDetails;

  const userId = await signIn(email, password);

  return !!userId;
}

export const handleSignOut = async () => {
  try {
    await logOut();
  } catch (error) {
    alert('Something went wrong logging out. Please try again later');
  }
}

// DONE
export const editUserImage = async (userId, imageAsset) => {
  if (!userId || !imageAsset) return;

  const {data} = await axios.put(`${BASE_URL}/api/edit/image`, {userId, imageAsset});
  return !!data;

  // client
  //   .patch(userId)
  //   .set({image: {
  //     _type: 'image',
  //     asset: {
  //       _type: 'reference',
  //       _ref: imageAsset?._id,
  //     }
  //   }})
  //   .commit()
  //   .then(() => {
  //     console.log('success editing profile image');
  //     return true;
  //   })
  //   .catch((error) => console.log('error editing user profile image: ', error));
}

// DONE
export const editUserName = async (userId, userName) => {
  if (!userId || !userName) return;

  const {data} = await axios.put(`${BASE_URL}/api/edit/name`, {userId, userName});
  return !!data;

  // client
  //   .patch(userId)
  //   .set({userName})
  //   .commit()
  //   .then(() => {
  //     console.log('success editing userName');
  //     return true;
  //   })
  //   .catch((error) => console.log('error editing userName: ', error));
}

// DONE
export const editUserWebsite = async (userId, websiteUrl) => {
  if (!userId || !websiteUrl) return;

  const {data} = await axios.put(`${BASE_URL}/api/edit/website`, {userId, websiteUrl});
  return !!data;

  // client
  //   .patch(userId)
  //   .set({website: websiteUrl})
  //   .commit()
  //   .then(() => {
  //     console.log('success editing website link');
  //     return true;
  //   })
  //   .catch((error) => console.log('error editing website link: ', error));
}

// export const handleCreateBoard = async (boardName, userId) => {
//   const doc = {
//     _type: 'board',
//     name: boardName,
//     userId,
//     postedBy: {
//       _type: 'postedBy',
//       _ref: userId,
//     },
//   }

//   if (!userId) return;

//   try {
//     const res = client.create(doc);
//     return !!res;
//   } catch (error) {
//     console.log('Error creating board: ', error);
//   }
// }

// DONE
export const handleCreateBoardWithPin = async (boardName, userId, pinId) => {
  const doc = {
    _type: 'board',
    name: boardName,
    userId,
    postedBy: {
      _type: 'postedBy',
      _ref: userId,
    },
    savedPins: [
      {
        _key: uuidv4(),
        _type: 'savedPin',
        _ref: `${pinId}`
      }
    ]
  }

  if (!userId || !pinId) return;

  const {data} = await axios.post(`${BASE_URL}/api/boards`, doc);

  return data;

  // try {
  //   const res = await client.create(doc);
  //   return res;
  // } catch (error) {
  //   console.log('Error creating board: ', error);
  // }
}

// DONE
export const savePin = async (boardId, pinId) => {
  if (!boardId) {
    return;
  }

  const {data} = await axios.put(`${BASE_URL}/api/boards/specific/${boardId}`, { pinId, save: true });
  return data;

  // try {
  //   const res = await client.patch(boardId).setIfMissing({ savedPins: [] })
  //     .insert('after', 'savedPins[-1]', [{
  //       _key: uuidv4(),
  //       _type: 'savedPin',
  //       _ref: `${pinId}`
  //     }])
  //     .commit()

  //   return !!res;
  // } catch (error) {
  //   console.log("Error saving pin: ", error);
  // }
}
// DONE
export const removeSavedPin = async (boardId, pinId) => {
  if (!boardId || !pinId) return;

  const {data} = await axios.put(`${BASE_URL}/api/boards/specific/${boardId}`, { pinId, save: false });

  return data;

  // try {
  //   const res = await client.patch(boardId).unset([`savedPins[_ref=="${pinId}"]`]).commit();
  //   return !!res;
  // } catch (error) {
  //   console.log('Error removing saved pin', error);
  // }
}

// DONE
export const tuneFeed = async (userId, theme) => {
  if (!userId || !theme) return;

  const {data} = await axios.put(`${BASE_URL}/api/feed`, {userId, theme, addTopic: true });
  return !!data;

  // try {
  //   const res = await client.patch(userId).setIfMissing({ tuneFeed: [] })
  //     .insert('after', 'tuneFeed[-1]', [{
  //       _key: uuidv4(),
  //       _type: 'tuneFeed',
  //       image: `${theme.image}`,
  //       name: `${theme.name}`,
  //     }])
  //     .commit();
  //   return !!res;
  // } catch (error) {
  //   console.log('error tuning feed: ', error);
  //   return false;
  // }
}
// DONE
export const removeFromTuneFeed = async (userId, theme) => {
  if (!userId || !theme) {
    console.log("invalid parameters");
    return;
  } 

  const {data} = await axios.put(`${BASE_URL}/api/feed`, {userId, theme, addTopic: false });
  return !!data;

  // try {
  //   const res = await client.patch(userId).unset([`tuneFeed[_key=="${theme}"]`]).commit();
  //   return !!res;
  // } catch (error) {
  //   console.log("error removing theme from tuneFeed", error);
  // }
}

// DONE
export const saveComment = async (pinId, userId, comment) => {
  if (!pinId || !userId || !comment) return;

  const {data} = await axios.put(`${BASE_URL}/api/comment`, {pinId, userId, comment, addComment: true });
  return !!data;

  // try {
    // const res = await client.patch(pinId).setIfMissing({ comments: [] })
    //   .insert('after', 'comments[-1]', [{
    //     _key: uuidv4(),
    //     _type: 'comments',
    //     postedBy: {
    //       _type: 'postedBy',
    //       _ref: `${userId}`,
    //     },
    //     comment: `${comment}`,
    //   }])
    //   .commit();
    
  //   return !!res;
  // } catch (error) {
  //   console.log('Error saving comment');
  // }
}
// DONE
export const removeComment = async (pinId, comment, userId) => {
  if (!pinId || !comment) return;

  const {data} = await axios.put(`${BASE_URL}/api/comment`, {pinId, userId, comment, addComment: false });
  return !!data;

  // try {
  //   const res = await client.patch(pinId).unset([`comments[_key=="${commentKey}"]`]).commit();
  //   return !!res;
  // } catch (error) {
  //   console.log("Error removing comment");
  // }
  
}
