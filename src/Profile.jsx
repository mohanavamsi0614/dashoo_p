import React from "react";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <p className="text-center text-gray-500 mt-10">No user data available</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 px-6 py-10">
      {/* Profile Section */}
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <img
            src={user.imgUrl}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-red-400"
          />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">📞 {user.phone}</p>
            <p className="mt-2 text-gray-700">{user.bio}</p>
            <p className="mt-1 text-sm text-gray-500">Group: {user.group}</p>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">🎟️ Registered Events</h2>

        {user.registeredEvents && user.registeredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {user.registeredEvents.map((event, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
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
                      <h3 className="text-xl font-semibold">{event.eventTitle}</h3>
                      <p className="text-sm text-gray-500">{event.shortTitle}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <p className="text-gray-700 mb-2">{event.description}</p>
                  <p className="text-gray-600 text-sm">
                    📍 {event.venue}, {event.address}
                  </p>
                  <p className="text-gray-600 text-sm">
                    📅 {event.startDate} | 🕒 {event.startTime}
                  </p>
                  <p className="mt-2 text-sm font-medium text-green-600">
                    Status: {event.status ? "✅ Present" : "❌ Absent"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No registered events found.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
