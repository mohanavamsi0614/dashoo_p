import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "./Navbar";
import { TypeAnimation } from "react-type-animation";
import { BackgroundBeams } from "./components/ui/background-beams";
import Footer from "./Footer";

function Home() {
  const nav = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("https://dasho-backend.onrender.com/participant/eventslist")
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-[#212121] relative min-h-screen">
      <BackgroundBeams className="fixed inset-0 z-0" />
      <div className="relative z-10">
        <Navbar />
        <div className="flex text-white justify-center items-center flex-col mt-40 md:mt-60 lg:mt-80 px-4">
          <div className="text-xl sm:text-2xl md:text-3xl font-poppins font-bold mb-5 text-center">
            <p>
              The dashboard that does it all -{" "}
              <span className="font-nerko text-3xl sm:text-4xl md:text-5xl font-medium">
                Dasho
              </span>
            </p>
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-poppins font-bold mb-5 text-center">
            <p>
              <TypeAnimation
                sequence={[
                  "Manage less, acheive more",
                  1000,
                  "Manage, Grow, Track",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                repeat={Infinity}
              />
            </p>
          </div>
        </div>
        <div className="bg-[#ffffff] font-poppins mt-20 md:mt-40 lg:mt-100 text-black p-5 md:p-10 flex justify-center items-center flex-col gap-10 hidden md:block">
          <div className="pt-10 md:pt-20 lg:pt-30 px-5 md:px-20 lg:px-30 mb-10 md:mb-20 lg:mb-35 text-center font-semibold text-2xl md:text-3xl lg:text-4xl">
            <p>
              <span className="font-nerko text-3xl md:text-4xl lg:text-5xl font-medium">
                Dasho
              </span>{" "}
              empowers organizers, judges, and participants with interactive
              dashboards that handle everything — from event registration and
              attendance to scoring and results. It's your one-stop solution for
              running hackathons effortlessly and efficiently.
            </p>
          </div>
        </div>
        <h1
          id="upcoming-events"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-nerko mt-10 md:mt-20 lg:mt-70 font-bold text-center text-white mb-6 md:mb-8 px-4"
        >
          Upcoming Events
        </h1>
        <div className="max-w-7xl mx-auto px-4 mb-20 md:mb-30 lg:mb-50 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                onClick={() =>
                  nav(`/event/${event.eventTitle}`, { state: event })
                }
                className="bg-transparent rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:bg-white transition-all duration-300 border border-[#aeaeae4d] group cursor-pointer"
              >
                <img
                  src={event.bannerUrl}
                  alt={event.eventTitle}
                  className="w-full h-48 md:h-56 object-cover"
                />

                <div className="p-4 md:p-5 font-poppins">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl md:text-2xl font-light font-nerko text-white group-hover:text-black transition-colors duration-300 truncate">
                      {event.eventTitle}
                    </h2>
                    <span className="text-xs md:text-sm text-white group-hover:text-black px-2 py-1 rounded-md font-medium whitespace-nowrap">
                      {event.ticketPrice === "0"
                        ? "Free"
                        : `₹${event.ticketPrice}`}
                    </span>
                  </div>

                  <p className="text-sm md:text-base text-gray-300 group-hover:text-gray-700 transition-colors duration-300 mt-2 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs md:text-sm text-gray-300 group-hover:text-gray-600 transition-colors duration-300">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{event.venue}</p>
                      <p className="truncate">{event.startDate}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <img
                        src={event.logoUrl}
                        alt="Logo"
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nav(`/event/${event.eventId}`, { state: event });
                    }}
                    className="mt-4 md:mt-5 cursor-pointer w-full bg-transparent border border-[#aeaeae4d] group-hover:text-black group-hover:border-[#212121] hover:text-white hover:bg-[#212121] text-white font-semibold py-2 rounded-lg transition duration-200 text-sm md:text-base"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
