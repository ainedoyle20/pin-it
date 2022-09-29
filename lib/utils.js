import { client } from './client';
import { signUp, signIn, logOut } from './firebase';
import { v4 as uuidv4 } from 'uuid';

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

    localStorage.setItem('user', JSON.stringify({ userId }));

    client.create(doc).then(() => {
      console.log('Successfully created user doc!');
    }).catch((err) => {
      console.log('Error creating user doc: ', err);
      localStorage.clear();
    });

    return true;
  } else {
    return false;
  }
}

export const handleSignIn = async (loginDetails) => {
  const { email, password } = loginDetails;

  const userId = await signIn(email, password);

  if (userId) {
    localStorage.setItem('user', JSON.stringify({ userId }));
    console.log('success setting user in local storage!');
    return true;
  } else {
    localStorage.clear();
    console.log('Error signing in');
    return false;
  }
}

export const handleSignOut = async () => {
  await logOut();
  localStorage.clear();
  return true;
}


export const handleCreateBoard = (boardName, userId) => {
  const doc = {
    _type: 'board',
    name: boardName,
    userId,
    postedBy: {
      _type: 'postedBy',
      _ref: userId,
    },
  }

  if (userId) {
    client.create(doc).then(() => {
      console.log('Successfully created board');
    }).catch((err) => {
      console.log('Error creating board: ', err);
    });
    return true;
  } else {
    return false;
  }
}

export const handleCreateBoardWithPin = (boardName, userId, pinId) => {
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

  if (userId && pinId) {
    client.create(doc).then(() => {
      console.log('Successfully created board');
    }).catch((err) => {
      console.log('Error creating board: ', err);
    });
    return true;
  } else {
    return false;
  }
}

export const savePin = (boardId, pinId) => {
  if (!boardId) {
    return;
  }
  client
   .patch(boardId)
   .setIfMissing({ savedPins: [] })
   .insert('after', 'savedPins[-1]', [{
    _key: uuidv4(),
    _type: 'savedPin',
    _ref: `${pinId}`
   }])
   .commit()
   .then(() => {
      console.log('Success saving pin');
      return true;
    })
   .catch(error => {
      console.log("Error saving pin: ", error);
      return false;
  });
}

export const removeSavedPin = (boardId, pinId) => {
  if (!boardId || !pinId) {
    console.log("invalid parameters");
    return;
  } else {
    client
      .patch(boardId)
      .unset([`savedPins[_ref=="${pinId}"]`])
      .commit()
      .then(() => console.log("success removing pins"))
      .catch((error) => console.log(error))
  }
}

export const tuneFeed = (userId, theme) => {
  if (!userId || !theme) return;

  client
    .patch(userId)
    .setIfMissing({ tuneFeed: [] })
    .insert('after', 'tuneFeed[-1]', [{
      _key: uuidv4(),
      _type: 'tuneFeed',
      image: `${theme.image}`,
      name: `${theme.name}`,
    }])
    .commit()
    .then(() => console.log('success tuning feed'))
    .catch((error) => console.log('error tuning feed: ', error));
}

export const removeFromTuneFeed = (userId, topicKey) => {
  if (!userId || !topicKey) {
    console.log("invalid parameters");
    return;
  } else {
    client
      .patch(userId)
      .unset([`tuneFeed[_key=="${topicKey}"]`])
      .commit()
      .then(() => console.log("success removing theme from tuneFeed"))
      .catch((error) => console.log(error))
  }
}
