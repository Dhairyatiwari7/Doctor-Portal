import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { doctors } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-white px-4 py-6 md:px-12">
      <h1 className="text-2xl font-semibold text-blue-700 mb-6">
        My Appointments
      </h1>

      <div className="grid gap-6">
        {doctors.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="bg-blue-50 shadow-md rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4"
          >
            {/* Doctor Image */}
            <div className="flex-shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 rounded-xl object-cover border border-blue-200"
              />
            </div>

            {/* Doctor Info */}
            <div className="flex-1">
              <p className="text-lg font-bold text-blue-800">{item.name}</p>
              <p className="text-blue-600">{item.speciality}</p>
              <div className="mt-2 text-sm text-gray-700">
                <p className="font-medium">Address:</p>
                <p>{item.address.line1}</p>
                <p>{item.address.line2}</p>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-blue-600">Date & Time:</span>{" "}
                25 July 2025 | 8:30 PM
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Pay Online
              </button>
              <button className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">
                Cancel Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
