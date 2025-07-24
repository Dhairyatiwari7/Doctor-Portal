import React, { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaVenusMars,
  FaBirthdayCake,
  FaEdit,
  FaSave,
} from "react-icons/fa";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [userData, setuserData] = useState({
    name: "Dhairya",
    image: assets.profile_pic,
    email: "dhairyatiwari186@gmail.com",
    phone: "9721631005",
    address: {
      line1: "Plot no 29 Gopal Nagar, Yashodanagar",
      line2: "Kanpur",
    },
    gender: "male",
    dob: "2001-01-20",
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-6 py-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <img
          src={userData.image}
          alt={userData.name}
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-blue-500 shadow-lg object-cover"
        />
        <div className="flex-1 text-center sm:text-left">
          {isEdit ? (
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setuserData({ ...userData, name: e.target.value })}
              className="text-3xl font-semibold w-full bg-transparent border-b-2 border-blue-500 focus:outline-none py-1"
              autoFocus
            />
          ) : (
            <h1 className="text-3xl font-semibold text-gray-800">{userData.name}</h1>
          )}
          <p className="text-sm text-gray-500 mt-1 italic">User Profile</p>
        </div>
      </div>

      <div className="border-t mt-8 pt-8 space-y-10">
        {/* Contact Info */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <FaEnvelope className="text-blue-500" /> Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-blue-600 font-medium flex items-center gap-2 mb-1">
                <FaEnvelope /> Email
              </label>
              <p className="text-gray-800 break-all">{userData.email}</p>
            </div>

            <div>
              <label className="text-blue-600 font-medium flex items-center gap-2 mb-1">
                <FaPhone /> Phone
              </label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) => setuserData({ ...userData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{userData.phone}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="text-blue-600 font-medium flex items-center gap-2 mb-1">
                <FaMapMarkerAlt /> Address
              </label>
              {isEdit ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={userData.address.line1}
                    onChange={(e) =>
                      setuserData({
                        ...userData,
                        address: { ...userData.address, line1: e.target.value },
                      })
                    }
                    placeholder="Address line 1"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={userData.address.line2}
                    onChange={(e) =>
                      setuserData({
                        ...userData,
                        address: { ...userData.address, line2: e.target.value },
                      })
                    }
                    placeholder="Address line 2"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <p className="text-gray-800 whitespace-pre-line">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <FaVenusMars className="text-blue-500" /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-blue-600 font-medium flex items-center gap-2 mb-1">
                <FaVenusMars /> Gender
              </label>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) => setuserData({ ...userData, gender: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-800 capitalize">{userData.gender}</p>
              )}
            </div>

            <div>
              <label className="text-blue-600 font-medium flex items-center gap-2 mb-1">
                <FaBirthdayCake /> Date of Birth
              </label>
              {isEdit ? (
                <input
                  type="date"
                  value={userData.dob}
                  onChange={(e) => setuserData({ ...userData, dob: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800">{userData.dob}</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Action Button */}
      <div className="mt-10 text-center">
        {isEdit ? (
          <button
            onClick={() => setIsEdit(false)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow"
          >
            <FaSave /> Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100 transition-all shadow"
          >
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
