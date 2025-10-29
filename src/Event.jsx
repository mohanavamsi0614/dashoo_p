import { Link, useLocation, useNavigate, useParams } from "react-router";

function Event() {
  const { name } = useParams();
  const { state } = useLocation();
  const nav = useNavigate();

  if (!state) {
    return (
      <div className="flex flex-col items-center font-poppins justify-center min-h-screen bg-[#212121] text-white px-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">
          Event not found ⚠️
        </h1>
        <Link
          to="/"
          className="text-red-500 hover:underline hover:text-red-600 transition text-sm sm:text-base"
        >
          Go back to events
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#212121] font-poppins min-h-screen pb-0">
      {/* Banner at Top */}
      <div className="w-full h-48 sm:h-64 md:h-96">
        <img
          src={state.bannerUrl}
          alt={state.eventTitle}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Event Info Section */}
      <div className="max-w-4xl mx-4 sm:mx-6 md:mx-auto bg-[#2a2a2a] shadow-lg rounded-2xl -mt-12 sm:-mt-16 relative z-10 p-4 sm:p-6 md:p-8">
        {/* Logo + Title */}
        <div className="flex flex-col items-center text-center">
          {state.logoUrl && (
            <img
              src={state.logoUrl}
              alt="Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 border-[#2a2a2a] shadow-lg -mt-8 sm:-mt-10 md:-mt-12 mb-4 bg-white object-cover"
            />
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-nerko font-medium text-white">
            {state.eventTitle}
          </h1>
          {state.shortTitle && (
            <p className="text-sm sm:text-base text-gray-300 italic mt-1">
              {state.shortTitle}
            </p>
          )}
        </div>

        {/* Event Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div>
            <h3 className="text-base sm:text-lg font-nerko font-medium text-white mb-1">
              📅 Date
            </h3>
            <p className="text-sm sm:text-base text-gray-300">
              {state.startDate} – {state.endDate}
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-nerko font-medium text-white mb-1">
              ⏰ Time
            </h3>
            <p className="text-sm sm:text-base text-gray-300">
              {state.startTime || "TBA"}
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-nerko font-medium text-white mb-1">
              📍 Venue
            </h3>
            <p className="text-sm sm:text-base text-gray-300">{state.venue}</p>
            <p className="text-sm sm:text-base text-gray-300">
              {state.address}
            </p>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-nerko font-medium text-white mb-1">
              🎟 Capacity
            </h3>
            <p className="text-sm sm:text-base text-gray-300">
              {state.capacity} participants
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-nerko font-medium text-white mb-2">
            📖 Description
          </h3>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {state.description}
          </p>
        </div>

        {/* Gallery */}
        {(state.photo1Url || state.photo2Url) && (
          <div className="mt-8 sm:mt-10">
            <h3 className="text-base sm:text-lg font-nerko font-medium text-white mb-3">
              📸 Event Gallery
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {state.photo1Url && (
                <img
                  src={state.photo1Url}
                  alt="Event Photo 1"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                />
              )}
              {state.photo2Url && (
                <img
                  src={state.photo2Url}
                  alt="Event Photo 2"
                  className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl shadow-md hover:scale-[1.02] transition-transform"
                />
              )}
            </div>
          </div>
        )}

        {/* Register Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <button
            onClick={() => nav("/reg", { state })}
            className="bg-transparent cursor-pointer hover:bg-white hover:text-black border border-[#aeaeae4d] text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition duration-300 w-full sm:w-auto"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-4 sm:mt-6 pb-4 sm:pb-6">
        <Link
          to="/"
          className="text-gray-400 cursor-pointer hover:text-white transition text-xs sm:text-sm"
        >
          ← Home
        </Link>
      </div>
    </div>
  );
}

export default Event;
