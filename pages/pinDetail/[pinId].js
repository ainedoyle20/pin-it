import React, {useState, useEffect} from "react";
import Link from "next/link";
import { FaDownload } from 'react-icons/fa';
import { FiChevronDown } from "react-icons/fi";
import {GrDown} from 'react-icons/gr';

import { client, urlFor } from '../../lib/client';
import { pinDetailQuery, similarPinsQuery } from '../../lib/data';
import MasonryLayout from '../../components/MasonryLayout';
import PinImage from '../../components/PinImage';

const PinDetail = ({ pinDetail, similarPins, userId }) => {
    const [selectedCategory, setSelectedCategory] = useState("Profile");
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [alreadySaved, setAlreadySaved] = useState(false);

    const { image, title, about, destination, postedBy, comments, save, _id } = pinDetail[0];
    const pinUrl = image ? (urlFor(image).url()) : null;

    useEffect(() => {
      console.log('running');
      if (!userId) {
        router.replace("/login");
      }
    }, [userId]);

    useEffect(() => {
      if (!userId) return;
      let alreadySaved = !!(save?.filter((item) => item?.postedBy?._id === userId).length);
      // console.log({ alreadySaved });
      setAlreadySaved(alreadySaved);
    }, [userId]);


    const savePin = (id) => {
      if (!alreadySaved) {
        setSavingPost(true);
  
        client
          .patch(id)
          .setIfMissing({ save: [] })
          .insert('after', 'save[-1]', [{
            _key: uuidv4(),
            userId,
            postedBy: {
              _type: 'postedBy',
              _ref: `${userId}`,
            },
          }])
          .commit()
          .then(() => {
            setAlreadySaved(true);
            setSavingPost(false);
            // Deploy success banner
          })
          .catch((err) => console.log('Error saving pin: ', err));
      }
    };

    // console.log(pinDetail);
    // console.log(!!(save?.filter(item => item.postedBy?._id === userId).length));
    // console.log(pinDetail, { similarPins });
    return (
        <div className="h-screen overflow-scroll flex flex-col justify-center items-center pt-3">
            <div 
                className="shadow-2xl w-[80vw] min-h-[55vh] rounded-[5%] flex flex-row"
            >
                <div className='w-[50%] border-r-2 border-r-black p-5'>
                    <PinImage pinUrl={pinUrl} destination={destination} />
                </div>

                <div className="flex flex-col items-center p-5 pr-8 w-[50%]">
                    <div className="w-full flex flex-row justify-between">
                        <a
                        href={`${image?.asset?.url}?dl=`}
                        download
                        className="bg-white w-14 h-14 p-2 rounded-full flex items-center justify-center text-dark text-2xl hover:shadow-md outline-none"
                        >
                            <FaDownload />
                        </a> 

                        <div className="flex flex-row">
                            <span 
                                className="flex justify-center items-center text-xl hover:font-medium p-3.5 px-5 mx-1 rounded-3xl cursor-pointer"
                            >
                                {selectedCategory} <FiChevronDown className="font-black ml-2" />
                            </span>

                            {alreadySaved 
                            ? <button type="button" disabled className="bg-[#e60023] text-[white] text-xl p-3.5 px-5 mx-1 rounded-3xl">
                                Saved
                            </button> 
                            : <button onClick={() => savePin(_id)} type="button" className="bg-[#e60023] hover:bg-[#ff5247] text-[white] text-xl p-3.5 px-5 mx-1 rounded-3xl">
                                Save
                            </button>
                            }
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
                        {(comments && showComments) ? comments?.map((item, i) => (
                            <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={`${item.comment}${i}`}>
                                <img
                                    src={item.postedBy?.image}
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                    alt="user-profile"
                                />
                                <div className="flex flex-col">
                                    <p className="font-bold">{item.postedBy?.userName}</p>
                                    <p>{item.comment}</p>
                                </div>
                            </div>
                        ))
                        :
                        null
                        }
                    </div>
                    <div className="w-full flex flex-col">
                        <div className="w-full flex flex-row items-center gap-2">
                            <button className='h-14 w-16 rounded-[100%] bg-[#e9e9e9] text-xl'>
                                A
                            </button>
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
                            <button onClick={() => {}} disabled={!commentText.length} type="button" className="text-lg px-5 py-3 m-3 rounded-3xl hover:bg-[#e9e9e9]">Post</button>
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
                                <p className="font-semibold capitalize text-lg">{postedBy?.userName}</p>
                            </a>
                        </Link>
                    </div>
                </div>
            </div>

            {similarPins?.length ? (
                <>
                    <h2 className="font-extrabold text-xl mt-10">More Like This</h2> 
                    <MasonryLayout pins={similarPins} />
                </>
            )
            : null
            }
            
        </div>
    );
}

export const getServerSideProps = async (context) => {
    const id = context.params.pinId;
    const pinDetailQ = pinDetailQuery(id);

    const pinDetail = await client.fetch(pinDetailQ);
    let similarPins = null;

    if (pinDetail[0]) {
        const similarPinsQ = similarPinsQuery(pinDetail[0]);
        similarPins = await client.fetch(similarPinsQ);
    }

    return {
        props: {
            pinDetail,
            similarPins,  
        }
    }
}

export default PinDetail;
