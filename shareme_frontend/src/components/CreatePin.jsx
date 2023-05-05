import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { client, urlFor } from "../client";
import { categories } from "../utils/data";
import { BsUpload } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setabout] = useState("");
  const [destination, setdestination] = useState("");
  const [loading, setloading] = useState(false);
  const [fields, setfields] = useState(null);
  const [category, setcategory] = useState(null);
  const [imageAsset, setimageAsset] = useState(null);
  const [wrongImageType, setwrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const selectedfile = e.target.files[0];
    const { type, name } = selectedfile;

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setwrongImageType(false);
      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => setimageAsset(document))
        .catch((error) => console.log(error));
    } else setwrongImageType(true);
  };

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {

      

      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      console.log(imageAsset?._id)

      client.create(doc).then( navigate('/'));

    }
     else {
      setfields(true);
      setTimeout(() => {
        setfields(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && <p className="color-red">Please fill all fields</p>}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full ">
        <div className="bg-secondaryColor p-3 flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {loading && <p>loading... </p>}
            {wrongImageType && <p> wrong Image Type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col justify-center items-center ">
                    <p className="font-bold text-2xl">
                      <BsUpload />
                    </p>
                    <p className="text-lg mt-4">Click to upload</p>
                  </div>
                  <p className="mt-10 text-gray-400">
                    {" "}
                    use high quality image less than 20mb
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
                  className="absolute rounded-full bg-white p-3 bottom-3 right-3 cursor-pointer w-10 h-10"
                  onClick={() => setimageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-6 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Add your title"
            className="border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            onChange={(e) => setabout(e.target.value)}
            value={about}
            placeholder="about section"
            className="border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            onChange={(e) => setdestination(e.target.value)}
            value={destination}
            placeholder="Add a destination link"
            className="border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="font-bold  border-gray-200 p-2 mb-5">
                Choose pin category
              </p>
              <select
                onChange={(e) => setcategory(e.target.value)}
                className="w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="other"> Select category</option>
                {categories.map((item) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className=" flex justify-end items-end m-5">
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28"
              >
                Save pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
