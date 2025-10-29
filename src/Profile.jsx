import React from "react";
import { Link } from "react-router-dom";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <p className="text-center text-white mt-10">No user data available</p>
    );
  }

  return (
    <div className="min-h-screen bg-[#212121] font-poppins text-white px-6 py-10">
      {/* Profile Section */}
      <div className="max-w-3xl mx-auto bg-[#212121] border border-[#aeaeae4d] shadow-md rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <img
            src={user.imgUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-[#aeaeae4d] flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-nerko font-medium">{user.name}</h1>
            <p className="text-gray-300">{user.email}</p>
            <p className="text-gray-300">📞 {user.phone}</p>
            <p className="mt-2 text-gray-300 break-words">{user.bio}</p>
            <p className="mt-1 text-sm text-gray-300">Group: {user.group}</p>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      <div className="max-w-5xl mx-auto mt-20">
        <h2 className="text-5xl font-bold font-nerko mb-4">
          Registered Events
        </h2>

        {user.registeredEvents && user.registeredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
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
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Logo and Title */}
                  <div className="flex items-center gap-4 mb-3">
                    {event.logoUrl && (
                      <img
                        src={event.logoUrl}
                        alt="Event Logo"
                        className="w-12 h-12 object-contain"
                      />
                    )}
                    <div>
                      <h3 className="text-3xl font-nerko font-medium">
                        {event.eventTitle}
                      </h3>
                      <p className="text-sm italic text-gray-300">
                        {event.shortTitle}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <p className="text-gray-300 mb-5">{event.description}</p>
                  <p className="text-gray-300 text-sm">
                    📍 {event.venue}, {event.address}
                  </p>
                  <p className="text-gray-300 text-sm">
                    📅 {event.startDate} | 🕒 {event.startTime}
                  </p>
                  <p className="mt-5 text-sm font-medium text-white">
                    Status: {event.status ? "✅ Present" : "❌ Absent"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">No registered events found.</p>
        )}
      </div>
      <div className="text-center mt-20 pb-6">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition text-sm"
        >
          ← Home
        </Link>
      </div>
    </div>
  );
}

export default Profile;
