import React from "react";
import { Link, NavLink } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";

import logo from "../assets/logo.png";
import {categories} from '../utils/data'
import {BiCategoryAlt} from 'react-icons/bi'

const isNotActiveStyle =
  "flex items-center pr-2 gap-3 text-black hover:text-black transition-all duration-200 ease-in-out capatalize hover:bg-gray-200";
const isActiveStyle =
  "flex items-center pr-2 gap-3 font-semibold bg-gray-300 transition-all duration-200 ease-in-out capatalize";

const SideBar = ({ user, closeToggle }) => {


  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5 p-5 -mt-4">
          <NavLink
            to="/"
            onClick={handleCloseSidebar}
            style={{borderRadius:'18px',height:'40px',width:'100px',padding:'10px'}}
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-2 pr-5 flex items-center justify-center gap-2 text-base 2xl:text-xl">
            <BiCategoryAlt/>
            Discover Catagories
          </h3>
          {categories.slice(0, categories.length).map((category) => (
            <NavLink
              to={`/category/${category.name}`}
              onClick={handleCloseSidebar}
              style={{borderRadius:'18px',marginRight:'25px'}}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              key={category.name}
            >
              <img src={category.image} alt='image' className="rounded-full w-10 h-10"/>
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user &&(
        <Link to={`user-profile/${user?._id}`} className="flex items-center m-3 gap-3 shadow-md rounded-full ">
        <img src={user?.image} alt="logo" className="w-10 h-10 rounded-full" />
        <p>{user.userName}</p>
      </Link>
      )}
    </div>
  );
};

export default SideBar;
