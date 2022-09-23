import React, {useState, useEffect } from 'react';
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
  const [signingUp, setSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wrongImageType, setWrongImageType] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if(signingUp) return;

    console.log('Checking for user', signingUp);

    const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
    if (user) router.replace("/");
  }, [signingUp]);

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

    const res = await handleSignUp(signUpDetails, imageAsset);
    setSignUpDetails({
      userName: '',
      selectedFile: {},
      websiteLink: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setSigningUp(true);

    if (!res) {
      setSigningUp(false);
      alert("Sorry something went wrong, please try again later");
    } else {
      setSigningUp(false);
    }
  }

  return (
    <div className="shadow-2xl w-[55vw] min-h-[70vh] p-5 rounded-3xl flex flex-col">
      {wrongImageType ? <p>Wrong image type</p> : null}
      <div className=" flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
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

              <p className="mt-32 text-gray-400">
                Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
              </p>
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
      <input 
        type="text"
        name="userName"
        value={signUpDetails.userName}
        placeholder="User Name"
        onChange={handleOnChange}
        required
      />
      <label>Optional</label>
      <input 
        type="text"
        name="websiteLink"
        value={signUpDetails.websiteLink}
        placeholder="Add a link to your personal website"
        onChange={handleOnChange}
      />
      <input 
        type="email"
        name="email"
        value={signUpDetails.email}
        placeholder="Email"
        onChange={handleOnChange}
        required
      />
      <input 
        type="password"
        name="password"
        value={signUpDetails.password}
        placeholder="Password"
        onChange={handleOnChange}
        required
      />
      <input 
        type="password"
        name="confirmPassword"
        value={signUpDetails.confirmPassword}
        placeholder="Confirm Password"
        onChange={handleOnChange}
        required
      />
      <button type='button' onClick={handleSubmit} disabled={signingUp}>Sign up</button>
    </div>
  );
}

export default SignUp