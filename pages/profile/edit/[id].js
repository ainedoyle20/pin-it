import React, {useState} from 'react';
import Link from 'next/link';
import Image from 'next/future/image';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';

import { client, urlFor } from '../../../lib/client';
import { editUserImage, editUserName, editUserWebsite } from '../../../lib/utils';
import { BASE_URL } from '../../../lib/utils';

const EditProfile = ({userProfile}) => {
  const [profileImage, setProfileImage] = useState();
  const [profileUserName, setProfileUserName] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState(userProfile?.website ? null : "");
  const [submittingChanges, setSubmittingChanges] = useState(false);
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [loading, setLoading] = useState(false);

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
          setProfileImage(document);
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

  const handleSubmit = () => {
    setSubmittingChanges(true);
    
    if (profileImage) {
      console.log('IMAGE');
      editUserImage(userProfile._id, profileImage);
    }

    if (profileUserName && profileUserName.length) {
      console.log('USERNAME');
      editUserName(userProfile._id, profileUserName);
    }

    if (websiteUrl !== null && websiteUrl.length) {
      console.log('WEBSITE');
      editUserWebsite(userProfile._id, websiteUrl);
    }

    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }

  return (
    <div
      className='h-screen w-screen flex justify-center items-center'
    >
      {!submittingChanges ? (
        <div
          className='rounded-3xl shadow-2xl w-[90vw] min-h-[70vh] flex flex-col items-center'
        >
          <span
            className='text-3xl font-medium my-16'
          >
            Your Profile
          </span>

        <div className='flex flex-col gap-3 md:gap-0 md:flex-row items-center w-full my-10'>
          <span 
            className='text-lg font-semibold w-[50%] flex justify-center'
          >
            Your Profile Picture: 
          </span>

          <div className='w-[50%] flex gap-8 items-center justify-center md:justify-start'>
            {userProfile?.image && !showUploadImage ? (
              <Image 
                alt="user pic"
                src={urlFor(userProfile?.image).url()}
                className="w-16 h-16 rounded-3xl"
                width={100}
                height={100}
              />
            ): !showUploadImage ? (
              <div className='w-16 h-16 rounded-3xl bg-gray-100' />
            ) : (
              <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-[200px] h-[150px]">
                {loading && (
                  'Loading...'
                )}
                {
                  wrongImageType && (
                    <p className='text-xs'>Must be: JPG, JPEG, SVG, PNG,.</p>
                  )
                }
                {!profileImage ? (
                  // eslint-disable-next-line jsx-a11y/label-has-associated-control
                  <label>
                    <div className="flex flex-col items-center justify-center h-full cursor-pointer">
                      <div className="flex flex-col justify-center items-center">
                        <p className="font-bold text-2xl">
                          <AiOutlineCloudUpload />
                        </p>
                        <p className="text-xs">Upload</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      name="upload-image"
                      value={profileImage}
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                ) : (
                  <div className="relative h-full">
                    <Image
                      src={profileImage?.url}
                      alt="uploaded-pic"
                      className="h-full w-full"
                      width={50}
                      height={50}
                    />
                    <button
                      type="button"
                      className="absolute bg-white rounded-3xl opacity-75 hover:opacity-100 top-[80%] left-[80%] cursor-pointer outline-none"
                      onClick={() => setProfileImage(null)}
                    >
                      <MdDelete size={25} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {!showUploadImage ? (
              <button
                type='button'
                className='py-2 px-3 h-12 bg-gray-100 hover:bg-gray-200 rounded-3xl text-lg'
                onClick={() => setShowUploadImage(true)}
              >
                Change
              </button>
            ) : null}
            
          </div>
        </div>

        <div className='flex flex-col gap-3 md:gap-0 md:flex-row items-center w-full my-10'>
          <span 
            className='text-lg font-semibold w-[50%] flex justify-center'
          >
            Your Profile UserName: 
          </span>

          <div className='w-[50%] flex gap-8 items-center justify-center md:justify-start'>
            {(userProfile?.userName && profileUserName === null) ? (
              <span
                className='text-2xl font-medium'
              >
                {userProfile?.userName}
              </span>
            ) : (
              <input 
                type="text"
                value={profileUserName}
                onChange={(e) => setProfileUserName(e.target.value)}
                placeholder="Add a new user name"
                className='w-3/5 md:w-3/4 focus:outline-none p-2 text-lg'
              />
            )}

            {profileUserName === null ? (
              <button
                type='button'
                className='py-2 px-3 h-12 bg-gray-100 hover:bg-gray-200 rounded-3xl text-lg'
                onClick={() => setProfileUserName("")}
              >
                Change
              </button>
            ): null}
            
          </div>
        </div>

        <div className='flex flex-col gap-3 md:gap-0 md:flex-row items-center w-full my-10'>
          <span 
            className='text-lg font-semibold w-[50%] flex justify-center'
          >
            Your Personal Website: 
          </span>

          <div className='w-[50%] flex gap-8 items-center md:justify-start'>
            {(userProfile?.website && websiteUrl === null) ? (
              <Link href={userProfile?.website}>
                <a target="_blank">
                  <span
                    className='text-2xl font-medium underline'
                  >
                    {userProfile?.website}
                  </span>
                </a>
              </Link>
              
            ) : (
              <input 
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="Add a link to your personal website"
                className='w-full md:w-3/4 focus:outline-none p-2 text-lg'
              />
            )}

            {(userProfile?.website && websiteUrl === null) ? (
              <button
                type='button'
                className='py-2 px-3 h-12 bg-gray-100 hover:bg-gray-200 rounded-3xl text-lg'
                onClick={() => setWebsiteUrl("")}
              >
                Change
              </button>
            ) : null}
          
          </div>
        </div>

        {(showUploadImage || profileUserName !== null || (websiteUrl !== null && websiteUrl.length)) ? (
          <div className='h-3/4 flex items-center gap-14'>
            <button
              type='button'
              className='h-12 px-3 py-2 text-lg rounded-3xl bg-gray-100 hover:bg-gray-200'
              onClick={() => {
                setShowUploadImage(false);
                setProfileUserName(null);
                setWebsiteUrl(userProfile?.website ? null : "");
              }}
            >
              Undo Changes
            </button>

            <button
              type='button'
              className='h-12 px-3 py-2 text-lg rounded-3xl bg-gray-100 hover:bg-gray-200'
              onClick={handleSubmit}
            >
              Submit Changes
            </button>
          </div>
        ) : (
          null
        )}
      </div>
      ) : (
        <span>Submitting Changes...</span>
      )}
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const userId = context.query.id;
  let userProfile;

  if (userId) {
    const {data} = await axios.get(`${BASE_URL}/api/profile/${userId}`);
    userProfile=data;
  }

  if (!userProfile) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    }
  }

  return {
    props: {
      userProfile,
    }
  }
}

export default EditProfile;