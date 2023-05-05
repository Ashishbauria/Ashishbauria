import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-3xl bg-white border-2 outline-none focus-within:shadow-sm">
        <IoMdSearch fontSize={21} className="ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          onFocus={() => navigate("/search")}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex flex-row gap-2">
        <Link
          to="create-pin"
          className="bg-white text-black rounder-lg w-10 h-10 flex justify-center items-center focus-within:shadow-sm"
        >
          <IoMdAdd />
        </Link>

        <Link to={`user-profile/${user?._id}`} className="hidden md:block ">
          <img src={user?.image} alt="logo" className="w-10 h-10 rounded-full mr-1" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
