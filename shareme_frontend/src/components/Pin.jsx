import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { client, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUsers";
import { AiFillLike } from "react-icons/ai";

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
  const [postHover, setPostHover] = useState(false);
  const navigate = useNavigate();

  const user = fetchUser();

  const alreadySaved = !!save?.filter(
    (item) => item.postedBy._id === user.googleId
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => window.location.reload());
  };

  return (
    <div className="m-2 mb-4">
      <div
        onMouseEnter={() => setPostHover(true)}
        onMouseLeave={() => setPostHover(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-pointer w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="dp"
          className="rounded-lg w-full"
        />
        {postHover && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-1 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md "
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  onClick={(e) => e.stopPropagation()}
                  type="button"
                  className="bg-red-500 opacity-75 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-2xl hover:shadow-md"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-blue-500 opacity-75 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-2xl hover:shadow-md"
                >
                  <AiFillLike />
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full ">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-1 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination.slice(12, 21)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === user.googleId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  type="button"
                  className="bg-red-500  opacity-75 hover:opacity-100 text-black font-bold px-2 py-2 text-base rounded-2xl hover:shadow-md"
                >
                  <AiTwotoneDelete />
                </button>
              )}
              <Link
                to={`user-profile/${postedBy?._id}`}
                className="flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={postedBy?.image}
                  alt="user-profile"
                  className="w-8 h-8 rounded-full border-2 opacity-90 hover:opacity-100 "
                />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
