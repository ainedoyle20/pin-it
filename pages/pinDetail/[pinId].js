import React, {useState, useContext } from "react";
import Link from "next/link";
import { StateContext } from "../../context/StateContext";
import { FaDownload } from 'react-icons/fa';
import {GrDown} from 'react-icons/gr';
import { RiDeleteBin7Fill } from 'react-icons/ri';
import {Circles} from 'react-loader-spinner';

import { client, urlFor } from '../../lib/client';
import { pinDetailQuery, similarPinsQuery } from '../../lib/data';
import { removeComment, saveComment } from '../../lib/utils';
import MasonryLayout from '../../components/MasonryLayout';
import PinImage from '../../components/PinImage';
import ChooseBoard from "../../components/ChooseBoard";
import CreateBoard from "../../components/CreateBoard";

const PinDetail = ({ pinDetail, similarPins }) => {
  const { setStatusProps, userDetails, user } = useContext(StateContext);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [deletingComment, setDeletingComment] = useState(false);
  const [deletedCommentKey, setDeletedCommentKey] = useState([]);
  const [postingComment, setPostingComment] = useState(false);
  const [showChooseBoard, setShowChooseBoard] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  const { image, title, about, destination, postedBy, comments, _id } = pinDetail[0];
  const pinUrl = image ? (urlFor(image).url()) : null;

  const handleCreateBoard = () => {
    setShowChooseBoard(false);
    setShowCreateBoard(true);
  };

  const handleAddComment = async () => {
    setPostingComment(true);
    const success = await saveComment(_id, user?.uid, commentText);
    if (success) {
      setStatusProps({ success: true, message: 'Your comment was posted'});
    } else {
      setStatusProps({ success: false });
    }
    setCommentText("");
  }

  const handleRemoveComment = async (commentKey) => {
    setDeletingComment(true);

    const success = await removeComment(_id, commentKey);
    if (success) {
      setStatusProps({ success: true, message: 'Your comment was posted'});
    } else {
      setStatusProps({ success: false });
    }

    setDeletedCommentKey([ ...deletedCommentKey, commentKey ]);
  }

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
    <>
      <div className="min-h-screen overflow-scroll flex flex-col items-center pt-20">
          <div 
              className="shadow-2xl w-[90vw] min-h-[75vh] rounded-2xl flex flex-col md:flex-row mt-8 mb-[50px]"
          >
              <div className='w-full md:w-[50%] border-b-2 md:border-b-[0] md:border-r-2 border-gray-300 p-5'>
                  <PinImage pinUrl={pinUrl} destination={destination} postedBy={postedBy} image={image} />
              </div>

              <div className="flex flex-col p-5 pr-8 w-full md:w-[50%]">
                  <div className="w-full flex flex-row justify-between">
                      <a
                      href={`${image?.asset?.url}?dl=`}
                      download
                      className="bg-white w-14 h-14 p-2 rounded-full flex items-center justify-center text-dark text-lg md:text-2xl hover:shadow-md outline-none"
                      >
                        <FaDownload />
                      </a> 

                      <div className="flex flex-row items-center">
                          <button 
                            onClick={() => setShowChooseBoard(true)} 
                            type="button" 
                            className="bg-[#e60023] hover:bg-[#ff5247] text-[white] h-3/4 px-5 md:text-xl md:p-3.5 md:px-5 md:mx-1 rounded-3xl flex items-center"
                            
                          >
                            Save
                          </button>
                      </div>
                  </div>
                  <div className="flex flex-col">
                      <h2
                          className="text-3xl font-medium mt-8 mb-5"
                      >{title}</h2>
                      <p
                          className="text-lg"
                      >
                          {about}... <Link href={destination}><a className="font-semibold underline hover:font-bold" target="_blank">More</a></Link>
                      </p>
                  </div>
                  <div className="flex flex-col w-full my-8">
                      <span 
                          className="flex flex-row items-center w-full text-2xl font-medium gap-5 cursor-pointer hover:font-semibold"
                          onClick={() => setShowComments(!showComments)}
                      >
                          Comments <GrDown className={showComments ? "font-black" :"-rotate-90 font-black"} />
                      </span>
                      {(comments && showComments) ? comments?.filter((item) => !deletedCommentKey.includes(item._key)).map((item, i) => (
                          <div className="flex gap-2 mt-5 items-center bg-white rounded-lg cursor-default" key={`${item.comment}${i}`}>
                            
                              {item.postedBy?.image && (
                                <img
                                    src={urlFor(item.postedBy?.image).url()}
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                    alt="user-profile"
                                />
                              )}
                              
                              <div className="flex flex-col">
                                  <p className="font-bold">{item.postedBy?.userName}</p>
                                  <p>{item.comment}</p>
                              </div>

                              {item.postedBy?._id === user?.uid ? (
                                <div className="h-full w-8 flex items-center ml-8 group">
                                  {!deletingComment ? (
                                    <RiDeleteBin7Fill 
                                      size={20}
                                      className="cursor-pointer hidden group-hover:block"
                                      onClick={() => handleRemoveComment(item._key)}
                                    /> 
                                  ) : '...'}
                                </div>
                              ) : null}
                          </div>
                      ))
                      :
                      null
                      }
                  </div>
                  <div className="w-full flex flex-col">
                      <div className="w-full flex flex-row items-center gap-2">
                        {userDetails?.image ? (
                          <img 
                            alt="profile pic"
                            src={urlFor(userDetails?.image).url()}
                            className='h-14 w-16 rounded-3xl'
                          />
                        ) : (
                          <button className='h-14 w-16 rounded-3xl bg-gray-200 text-xl'>
                            {userDetails?.userName ? userDetails.userName[0] : 'P'}
                          </button>
                        )}
                          
                        <input
                            type="text"
                            value={commentText}
                            placeholder="Add a comment"
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full text-xl p-3 border-[1px] border-[#d6d6d6] rounded-3xl"
                        /> 
                      </div>
                      <div className={commentText.length ? "w-full flex flex-row justify-end" : 'hidden'}>
                          <button onClick={() => {setCommentText("")}} type="button" className="text-lg px-5 py-3 m-3 rounded-3xl hover:bg-[#e9e9e9]">Cancel</button>
                          <button onClick={handleAddComment} disabled={!commentText.length} type="button" className="text-lg px-5 py-3 m-3 rounded-3xl hover:bg-[#e9e9e9]">
                            {postingComment ? '...' : 'Post'}
                          </button>
                      </div> 
                  </div>
                  <div className="w-full mt-5 h-full flex flex-col justify-end">
                      <Link href={`/profile/${postedBy._id}`}>
                          <a className="flex gap-2 items-center cursor-pointer">
                              <img
                              className="w-10 h-10 rounded-full object-cover"
                              src={urlFor(postedBy?.image).url()}
                              alt="user-profile"
                              /> 
                              <p className="font-semibold capitalize text-lg">
                                {postedBy?.userName}&emsp;<span className="text-xl">&#10088;</span> Creator <span className="text-xl">&#10089;</span>
                              </p>
                          </a>
                      </Link>
                  </div>
              </div>
          </div>

          {similarPins?.length ? (
              <>
                  <h2 className="font-bold text-2xl mb-8">More Like This</h2>

                  <div
                    className="w-full h-full px-14"
                  >
                    <MasonryLayout pins={similarPins} />
                  </div> 
                  
              </>
          )
          : null
          }
          
      </div>

      {showChooseBoard ? <ChooseBoard setShowChooseBoard={setShowChooseBoard} handleCreateBoard={handleCreateBoard} pinId={_id}  /> : null}

      {showCreateBoard ? <CreateBoard setShowCreateBoard={setShowCreateBoard} pinId={_id} /> : null}
    </>
  );
}

export const getServerSideProps = async (context) => {
  const id = context.params.pinId;
  const pinDetailQ = pinDetailQuery(id);

  const pinDetail = await client.fetch(pinDetailQ);
  let similarPins = null;

  if (!context.req.cookies.currentUser) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  if (pinDetail[0]) {
    const similarPinsQ = similarPinsQuery(pinDetail[0]);
    similarPins = await client.fetch(similarPinsQ);
  } else {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      }
    }
  }

  return {
    props: {
        pinDetail,
        similarPins,  
    }
  }
}

export default PinDetail;
