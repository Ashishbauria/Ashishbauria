import React, { useEffect } from "react";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import Logo from "../assets/logowhite.png";
import { gapi } from "gapi-script";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({
        client_id:
          "117610163178-qnfkg0l878vmgjb4c13k1hhp83linsd6.apps.googleusercontent.com",
      });
    });
  }, []);

  const responseGoogle = (response) => {
    localStorage.setItem("user", JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl } = response.profileObj;
    const doc = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
    };
    client.createIfNotExists(doc).then(() => {
      navigate("/", { replace: true });
    });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative h-full w-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          muted
          autoPlay
          controls={false}
          className=" h-full w-full object-cover"
        />
        <div className="bg-blackOverlay absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0  ">
          <div className="p-5">
            <img src={Logo} alt="logo" width="130px" />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              clientId="117610163178-qnfkg0l878vmgjb4c13k1hhp83linsd6.apps.googleusercontent.com"
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-white flex rounded-full cursor-pointer justify-center items-center px-5 py-2"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-2" /> Sign in with Google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
