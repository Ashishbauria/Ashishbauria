import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import { MdDownloadForOffline } from "react-icons/md";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";





const PinDetails = ({ user }) => {



  const [text, setText] = useState('');
  const [activeBtn, setActiveBtn] = useState("have");
  
    const activeBtnStyles =
      "bg-blue-500  text-white font-bold px-6 py-2 rounded-full w-30  ";
    const notActiveBtnStyles =
      "bg-gray-100 mr-4  text-black font-bold px-4 py-2 rounded-full w-30 ";
  




  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");

  const { pinId } = useParams();

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  const addComment = () => {
    if (comment) {
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();

    return () => {
      clearInterval(pins);
    };
  }, [pinId]);

  console.log(pins);

  if (!pinDetail) return <p>no pin </p>;

  return (
    <div>
      <div
        className="flex flex-col xl:flex-row  m-auto bg-white "
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center  items-center md:items-start flex-initial ">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="rounded-2xl "
            style={{ width: "260px" }}
            alt="logo"
          />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center  text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md "
              >
                <MdDownloadForOffline />
              </a>
            </div>

            <a
              href={pinDetail.destination}
              target="_blank"
              rel="noreferrer"
              className="bg-gray-100 flex items-center gap-2 text-black font-bold p-1 pl-4 pr-4  rounded-full opacity-75 hover:opacity-100 hover:shadow-md"
              onClick={(e) => e.stopPropagation()}
            >
              <BsFillArrowUpRightCircleFill />
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-3xl font-bold break-words mt-2">
              {pinDetail.title}
            </h1>
            <p className="mt-2 ">{pinDetail.about}</p>
          </div>
          <Link
            to={`user-profile/${pinDetail.postedBy?._id}`}
            className="flex items-center ml-1 mt-2 gap-2 bg-white rounde-lg"
          >
            <img
              src={pinDetail.postedBy?.image}
              alt="logo"
              className="w-10 h-10 rounded-full"
            />
            <p>{pinDetail.postedBy.userName}</p>
          </Link>
          <h2 className="mt-5 taxt-2xl">Comments</h2>
          <div className="max-h-350 overflow-y-auto">
            {pinDetail?.comments?.map((item, i) => (
              <div key={i} className="flex gap-2 items-center mt-2">
                <img
                  src={item.postedBy.image}
                  alt="user-profile"
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{item.postedBy.userName}</p>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-4 gap-2">
            <Link
              to={`user-profile/${user?._id}`}
              className="flex items-center my-2 gap-2 "
            >
              <img
                src={user?.image}
                alt="logo"
                className="w-8 h-8 rounded-full"
              />
            </Link>
            <input
              className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add Comment"
            />
            <button
              type="button"
              className="bg-red-500 font-semibold opacity-100 text-black px-6 py-2 text-base rounded-full hover:shadow-md"
              onClick={addComment}
            >
              Post
            </button>
          </div>



          <div className="text-center mt-20 mb-5">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("have");
              }}
              className={`${
                activeBtn === "have" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Have
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("fun");
              }}
              className={`${
                activeBtn === "fun" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              fun
            </button>
          </div>




        </div>
      </div>
      {pins !== "null" ? (
        <div>
          <h1 className="text-center font-bold text-2x mt-8 mb-4">
            More like this...
          </h1>

          <MasonryLayout pins={pins} />
        </div>
      ) : (
        <p> no more Pins</p>
      )}
    </div>
  );
};

export default PinDetails;
