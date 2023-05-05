import React, { useState, useEffect, useId } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import {
  userSavedPinsQuery,
  userCreatedPinsQuery,
  userQuery,
} from "../utils/data";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import { FcGoogle } from "react-icons/fc";

const randomImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology";

const UserProfile = () => {

  const activeBtnStyles =
    "bg-red-500  text-white font-bold px-6 py-2 rounded-full w-30  ";
  const notActiveBtnStyles =
    "bg-gray-100 mr-4  text-black font-bold px-4 py-2 rounded-full w-30 ";

  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState('');
  const [activeBtn, setActiveBtn] = useState("created");

  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userId]);

  useEffect(() => {
    if (text === "Created") {
      const createdPinQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinQuery).then((data) => setPins(data));
    } else {
      const savededPinQuery = userSavedPinsQuery(userId);
      client.fetch(savededPinQuery).then((data) => setPins(data));
    }
  }, [text, userId]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <p>user not exist</p>;

  return (
    <div className="relative pb-2 h-full flec justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomImage}
              className="w-full h-370 2xl:h-320 shadow-lg object-cover rounded-xl "
              alt="banner"
            />
            <img
              src={user.image}
              className="rounded-full w-25 h-25 -mt-12 shadow-xl object-cover"
              style={{ border: "2px solid white" }}
              alt="user-image"
            />
            <h2 className="font-semibold text-3xl text-center mt-3">
              {user.userName}
            </h2>
            <div className="absolute top-0 z-1 right-0 p-0">
              {userId == user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-white m-3 rounded-full cursor-pointer flex justify-center items-center px-5 p-2 opacity-60 hover:opacity-100"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <FcGoogle className="mr-2" /> Sign Out
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div className="text-center mt-3 mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("created");
              }}
              className={`${
                activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Saved
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
          </div>
          {pins ? (
            <div className="px-2 ">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <p>No pins found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
