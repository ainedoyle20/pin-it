export const categories = [
    {
      name: 'cars',
      image: 'https://i.pinimg.com/750x/eb/47/44/eb4744eaa3b3ccd89749fa3470e2b0de.jpg',
    },
    {
      name: 'fitness',
      image: 'https://i.pinimg.com/236x/25/14/29/251429345940a47490cc3d47dfe0a8eb.jpg',
    },
    {
      name: 'wallpaper',
      image: 'https://i.pinimg.com/236x/03/48/b6/0348b65919fcbe1e4f559dc4feb0ee13.jpg',
    },
    {
      name: 'coding',
      image: 'https://i.pinimg.com/750x/66/b1/29/66b1296d36598122e6a4c5452b5a7149.jpg',
    },
    {
      name: 'photography',
      image: 'https://i.pinimg.com/236x/72/8c/b4/728cb43f48ca762a75da645c121e5c57.jpg',
    },
    {
      name: 'food',
      image: 'https://i.pinimg.com/236x/7d/ef/15/7def15ac734837346dac01fad598fc87.jpg',
    },
    {
      name: 'nature',
      image: 'https://i.pinimg.com/236x/b9/82/d4/b982d49a1edd984c4faef745fd1f8479.jpg',
    },
    {
      name: 'art',
      image: 'https://i.pinimg.com/736x/f4/e5/ba/f4e5ba22311039662dd253be33bf5f0e.jpg',
    }, {
      name: 'travel',
      image: 'https://i.pinimg.com/236x/fa/95/98/fa95986f2c408098531ca7cc78aee3a4.jpg',
    },
    {
      name: 'quotes',
      image: 'https://just65.com/wp-content/uploads/2021/07/01-short-best-friend-quotes.png',
    }, {
      name: 'cats',
      image: 'https://i.pinimg.com/236x/6c/3c/52/6c3c529e8dadc7cffc4fddedd4caabe1.jpg',
    }, {
      name: 'dogs',
      image: 'https://i.pinimg.com/236x/1b/c8/30/1bc83077e363db1a394bf6a64b071e9f.jpg',
    },
];

export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}'] {
    image{
      asset->{
        url
      }
    },
    userName,
    tuneFeed,
    website,
  }`;
  return query;
};

export const pinsQuery = `*[_type == "pin"] | order(_createdAt desc) {
  image{
    asset->{
      url
    }
  },
  _id,
  destination,
  postedBy->{
    _id,
    userName,
    image{
      asset->{
        url
      }
    }
  },
  save[]{
    _key,
    postedBy->{
      _id,
      userName,
      image
    },
    board,
  },
  category,
}`;

export const pinDetailQuery =(pinId) => {
  const query = `*[_type == "pin" && _id == "${pinId}"]{
    image{
      asset->{
        url
      }
    },
    _id,
    title,
    about,
    destination,
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      }
    },
    postedBy->{
      _id,
      userName,
      image
    },
    category,
  }`
 return query;
};

export const similarPinsQuery = (pin) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const savedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && "${userId}" in save[].userId ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image{
        asset->{
          url
        }
      }
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
      board,
    },
  }`;
  return query;
}

export const createdPinsQuery = (userId) => {
  const query = `*[_type == "pin" && userId == "${userId}"] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image{
        asset->{
          url
        }
      }
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
      board,
    },
  }`;

  return query;
}

export const boardsQuery = (userId) => {
  const query = `*[_type == 'board' && userId == "${userId}"]{
    _id,
    name,
    postedBy->{
      _id,
      userName,
      image{
        asset->{
          url
        }
      }
    },
    savedPins[]->{
      _id,
      destination,
      image{
        asset->{
          url
        }
      },
      postedBy->{
        _id,
        userName,
        image{
          asset->{
            url
          }
        }
      }
    }
  }`;
  return query;
}

export const specificBoardQuery = (boardId) => {
  const query = `*[_type == 'board' && _id == "${boardId}"]{
    _id,
    name,
    postedBy->{
      _id,
      userName,
      image{
        asset->{
          url
        }
      }
    },
    savedPins[]->{
      _id,
      destination,
      image{
        asset->{
          url
        }
      },
      postedBy->{
        _id,
        userName,
        image{
          asset->{
            url
          }
        }
      }
    }
  }`;

  return query;
}

//?ezimgfmt=rs:372x478/rscb3/ngcb3/notWebP