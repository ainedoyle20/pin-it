import React, {useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';

import { handleSignUp } from '../lib/utils';
import { client } from '../lib/client';

const SignUp = () => {
  const [signUpDetails, setSignUpDetails] = useState({
    userName: '',
    websiteLink: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [imageAsset, setImageAsset] = useState();
  const [loading, setLoading] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);

  const router = useRouter();

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    // uploading asset to sanity
    if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
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

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setSignUpDetails({ ...signUpDetails, [name]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signUpDetails.password !== signUpDetails.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const success = await handleSignUp(signUpDetails, imageAsset);
    setSignUpDetails({
      userName: '',
      websiteLink: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    if (!success) {
      alert("Sorry something went wrong, please try again later");
    } else {
      router.replace("/");
    }
  }

  return (
    <div
      className="shadow-2xl w-[80vw] md:w-[55vw] lg:w-[550px] 2xl:w-[35vw] p-5 rounded-3xl flex flex-col items-center"
    >
      {wrongImageType ? <p>Must be: JPG, JPEG, SVG, PNG</p> : null}
      <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-3/4 xs:h-[200px] xs:w-[200px] xs:h-[200px] lg:w-[300px] lg:h-[300px] ">
        {loading && (
          'Loading...'
        )}
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
            </div>
            <input
              type="file"
              name="upload-image"
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

      <form 
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-3 3xl:gap-5 w-full h-full mt-10 xs:mt-0"
      >
        <input
          className='w-[90%] sm:w-3/4 focus:outline-none border-b-[1px] border-gray-500 pt-5 3xl:pt-8 3xl:pb-2 text-lg 3xl:text-3xl' 
          type="text"
          name="userName"
          value={signUpDetails.userName}
          placeholder="User Name"
          onChange={handleOnChange}
          required
        />
        <input
          className='w-[90%] sm:w-3/4 focus:outline-none border-b-[1px] border-gray-500 pt-5 3xl:pt-8 3xl:pb-2 text-lg 3xl:text-3xl' 
          type="text"
          name="websiteLink"
          value={signUpDetails.websiteLink}
          placeholder="Personal Website (optional)"
          onChange={handleOnChange}
        />
        <input
          className='w-[90%] sm:w-3/4 focus:outline-none border-b-[1px] border-gray-500 pt-5 3xl:pt-8 3xl:pb-2 text-lg 3xl:text-3xl' 
          type="email"
          name="email"
          value={signUpDetails.email}
          placeholder="Email"
          onChange={handleOnChange}
          required
        />
        <input
          className='w-[90%] sm:w-3/4 focus:outline-none border-b-[1px] border-gray-500 pt-5 3xl:pt-8 3xl:pb-2 text-lg 3xl:text-3xl' 
          type="password"
          name="password"
          value={signUpDetails.password}
          placeholder="Password"
          onChange={handleOnChange}
          required
        />
        <input
          className='w-[90%] sm:w-3/4 focus:outline-none border-b-[1px] border-gray-500 pt-5 3xl:pt-8 3xl:pb-2 text-lg 3xl:text-3xl' 
          type="password"
          name="confirmPassword"
          value={signUpDetails.confirmPassword}
          placeholder="Confirm Password"
          onChange={handleOnChange}
          required
        />
        <button 
          type='submit'
          className='mt-8 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-3xl 3xl:px-5 3xl:py-3 3xl:text-3xl'
        >
          Sign up
        </button>
      </form>
    </div>
  );
}

export default SignUp