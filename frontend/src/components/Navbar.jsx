import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";

const NavItem = ({ to, label }) => (
  <NavLink to={to} className="relative flex flex-col items-center group">
    {({ isActive }) => (
      <>
        <li className="py-1">{label}</li>
        <hr
          className={`transition-all duration-300 h-0.5 bg-primary w-3/5 m-auto ${isActive ? "block" : "hidden"
            }`}
        />
      </>
    )}
  </NavLink>
);

const Navbar = () => {
  const Navigate = useNavigate();
  //const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);

  const handleLogout = () => {
    setToken(false)
    Navigate("/login")
  }

  return (
    <div className="flex items-center justify-between px-4 text-sm py-4 mb-5 border-b border-b-gray-400">
      <img className="w-44 cursor-pointer" src={assets.logo} alt="logo" onClick={()=>Navigate("/")}/>

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavItem to="/" label="HOME" />
        <NavItem to="/doctors" label="ALL DOCTORS" />
        <NavItem to="/about" label="ABOUT" />
        <NavItem to="/contact" label="CONTACT" />
      </ul>

      <div className="flex items-center gap-4">
        {token ? (
          <div className="relative group">
            <div className="flex items-center gap-2 cursor-pointer">
              <img className="w-8 rounded-full" src={assets.profile_pic} alt="Profile" />
              <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown Icon" />
            </div>

            {/* Dropdown */}
            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-md shadow-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 group-hover:visible invisible transition-opacity duration-200 z-20">
              <p
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => Navigate("/my-profile")}
              >
                My Profile
              </p>
              <p
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => Navigate("/my-appointmets")}
              >
                My Appointments
              </p>
              <p
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </p>
            </div>
          </div>
        ) : (
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-light hidden md:block"
            onClick={() => Navigate("/login")}
          >
            Create Account
          </button>
        )}

      </div>
    </div>
  );
};

export default Navbar;
