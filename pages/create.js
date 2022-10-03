import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { StateContext } from '../context/StateContext';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { categories } from '../lib/data';
import { client, urlFor } from '../lib/client';
import {Circles} from 'react-loader-spinner';

const CreatePin = () => {
  const { setStatusProps, user, userDetails } = useContext(StateContext);

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState("");
  const [fields, setFields] = useState();
  const [category, setCategory] = useState();
  const [imageAsset, setImageAsset] = useState();
  const [wrongImageType, setWrongImageType] = useState(false);

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (selectedFile.type === 'image/png' || 
        selectedFile.type === 'image/svg' || 
        selectedFile.type === 'image/jpeg' || 
        selectedFile.type === 'image/gif' || 
        selectedFile.type === 'image/tiff'
    ) {
      setWrongImageType(false);
      setLoading(true);
      client.assets
        .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log('Upload failed:', error.message);
        });
    } else {
      setLoading(false);
      setWrongImageType(true);
    }
  };

  const postPin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user?.uid,
        postedBy: {
          _type: 'postedBy',
          _ref: user?.uid,
        },
        category,
      };
      client.create(doc).then(() => {
        setStatusProps({ message: 'Your pin was created', success: true })
        setTitle("");
        setAbout("");
        setDestination("");
        setImageAsset();
      }).catch((error) => {
        console.log('error creating pin: ', error);
        setStatusProps({ success: false });
      });
    } else {
      setFields(true);

      setTimeout(
        () => {
          setFields(false);
        },
        2000,
      );
    }
  };

  if (!user) {
    return (
      <div className='w-screen h-screen flex justify-center items-center'>
        <Circles
          height="80"
          width="80"
          color="#65B2FF"
          ariaLabel="circles-loading"
          visible={true}
        />
      </div>
    );
  }

  return (
    <div className='w-screen h-screen flex justify-center items-center pt-20 sm:pt-24 lg:pt-0'>
      <div className="flex flex-col justify-center items-center p-5 lg:py-14 shadow-2xl rounded-3xl w-[85vw] sm:w-[70vw]">
        {fields && (
          <p className="text-red-500 mb-5 text-xl">Please add all fields.</p>
        )}
        <div className="flex lg:flex-row flex-col justify-center items-center bg-white w-full h-full">
          <div className="p-3 flex w-full sm:w-4/5 xl:w-2/4 h-full">
            <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-[200px] sm:h-[300px] xl:h-[400px] 3xl:h-[600px]">
              {loading && (
                // <Spinner />
                'Loading...'
              )}
              {
                wrongImageType && (
                  <p>Wrong file type.</p>
                )
              }
              {!imageAsset ? (
                // eslint-disable-next-line jsx-a11y/label-has-associated-control
                <label>
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col justify-center items-center">
                      <p className="font-bold text-2xl">
                        <AiOutlineCloudUpload />
                      </p>
                      <p className="text-lg">Click to upload</p>
                    </div>

                    <p className="text-gray-400 text-sm">
                     Use JPG, JPEG, SVG, PNG less than 20MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    value={imageAsset}
                    onChange={uploadImage}
                    className="w-0 h-0"
                  />
                </label>
              ) : (
                <div className="relative h-full">
                  <img
                    src={imageAsset?.url}
                    alt="uploaded-pic"
                    className="h-full w-full"
                  />
                  <button
                    type="button"
                    className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                    onClick={() => setImageAsset(null)}
                  >
                    <MdDelete />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 lg:mt-0 w-full">
            {userDetails && (
              <div className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg ">
                <img
                  src={urlFor(userDetails.image).url()}
                  className="w-14 h-12 rounded-full"
                  alt="user-profile"
                />
                <p className="font-bold">{userDetails.userName}</p>
              </div>
            )}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add your title"
              className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
            />
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Tell everyone what your Pin is about"
              className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            />
            <input
              type="url"
              vlaue={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Add a destination link"
              className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            />

            <div className="flex flex-col">
              <div>
                <p className="mb-2 font-semibold text:lg sm:text-xl">Choose Pin Category</p>
                <select
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
                >
                  <option value="art" className="sm:text-bg bg-white">Select Category</option>
                  {categories.map((item) => (
                    <option key={item.name} className="text-base border-0 outline-none capitalize bg-white text-black" value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end items-end mt-5">
                <button
                  type="button"
                  onClick={postPin}
                  className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
                >
                  Post Pin
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  if (!context.req.cookies.currentUser) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

export default CreatePin;
