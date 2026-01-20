import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!user) {
    return (
      <p className="text-center text-white mt-10">No user data available</p>
    );
  }

  return (
    <div className="min-h-screen bg-[#212121] font-poppins text-white px-4 sm:px-6 py-6 sm:py-10">
      {/* Profile Section */}
      <div className="max-w-3xl mx-auto mb-6">
        <BackButton />
      </div>
      <div className="max-w-3xl mx-auto bg-[#212121] border border-[#aeaeae4d] shadow-md rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <img
            src={user.imgUrl}
            alt={user.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#aeaeae4d] flex-shrink-0"
          />
          <button onClick={() => localStorage.removeItem("user") && navigate("/")} className=" bg-[#aeaeae4d] px-4 py-2 rounded-lg">Log Out</button>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-nerko font-medium">
              {user.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-300 truncate">
              {user.email}
            </p>
            <p className="text-sm sm:text-base text-gray-300">📞 {user.phone}</p>
            <p className="mt-2 text-sm sm:text-base text-gray-300 break-words">
              {user.bio}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-gray-300">
              Group: {user.group}
            </p>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      <div className="max-w-5xl mx-auto mt-10 sm:mt-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-nerko mb-4">
          Registered Events
        </h2>

        {user.registeredEvents && user.registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {user.registeredEvents.map((event, idx) => (
              <div
                key={idx}
                className="bg-[#212121] border border-[#aeaeae4d] rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {/* Banner */}
                {event.bannerUrl && (
                  <img
                    src={event.bannerUrl}
                    alt={event.eventTitle}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-4 sm:p-5">
                  {/* Logo and Title */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-3">
                    {event.logoUrl && (
                      <img
                        src={event.logoUrl}
                        alt="Event Logo"
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-2xl sm:text-3xl font-nerko font-medium truncate">
                        {event.eventTitle}
                      </h3>
                      <p className="text-xs sm:text-sm italic text-gray-300 truncate">
                        {event.shortTitle}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-5 line-clamp-3">
                    {event.description}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300 truncate">
                    📍 {event.venue}, {event.address}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300">
                    📅 {event.startDate} | 🕒 {event.startTime}
                  </p>
                  <p className="mt-4 sm:mt-5 text-xs sm:text-sm font-medium text-white">
                    Status: {event.status ? "Open" : "Close"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300 text-sm sm:text-base">
            No registered events found.
          </p>
        )}
      </div>
      <div className="text-center mt-10 sm:mt-20 pb-6">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition text-xs sm:text-sm"
        >
          ← Home
        </Link>
      </div>
    </div>
  );
}

export default Profile;
