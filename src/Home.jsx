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
        <div className="flex text-white justify-center items-center flex-col mt-80">
          <div className="text-3xl font-poppins font-bold mb-5">
            <p>
              The dashboard that does it all -{" "}
              <span className="font-nerko text-5xl font-medium">Dasho</span>
            </p>
          </div>
          <div className="text-3xl font-poppins font-bold mb-5">
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
                style={{ fontSize: "2em", display: "inline-block" }}
                repeat={Infinity}
              />
            </p>
          </div>
        </div>
        <div className="bg-[#ffffff] font-poppins mt-100 text-black p-5 flex justify-center items-center flex-col gap-10">
          <div className="pt-30 pl-30 pr-30 mb-35 text-center font-semibold text-4xl">
            <p>
              <span className="font-nerko text-5xl font-medium">Dasho</span>{" "}
              empowers organizers, judges, and participants with interactive
              dashboards that handle everything — from event registration and
              attendance to scoring and results. It’s your one-stop solution for
              running hackathons effortlessly and efficiently.
            </p>
          </div>
        </div>
        <h1
          id="upcoming-events"
          className="text-6xl font-nerko mt-70 font-bold text-center text-white mb-8"
        >
          Upcoming Events
        </h1>
        <div className="max-w-7xl mx-auto px-4 mb-50 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                onClick={() =>
                  nav(`/event/${event.eventTitle}`, { state: event })
                }
                className="bg-transparent rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:bg-white transition-all duration-300 border border-[#aeaeae4d] group"
              >
                <img
                  src={event.bannerUrl}
                  alt={event.eventTitle}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5 font-poppins">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-light font-nerko text-white group-hover:text-black transition-colors duration-300">
                      {event.eventTitle}
                    </h2>
                    <span className="text-sm text-white group-hover:text-black px-2 py-1 rounded-md font-medium">
                      {event.ticketPrice === "0"
                        ? "Free"
                        : `₹${event.ticketPrice}`}
                    </span>
                  </div>

                  <p className="text-gray-300 group-hover:text-gray-700 transition-colors duration-300 mt-2 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-300 group-hover:text-gray-600 transition-colors duration-300">
                    <div>
                      <p className="font-medium">{event.venue}</p>
                      <p>{event.startDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src={event.logoUrl}
                        alt="Logo"
                        className="w-8 h-8 rounded-full border border-gray-300"
                      />
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nav(`/event/${event.eventId}`, { state: event });
                    }}
                    className="mt-5 cursor-pointer w-full bg-transparent border border-[#aeaeae4d] group-hover:text-black group-hover:border-[#212121] hover:text-white hover:bg-[#212121] text-white font-semibold py-2 rounded-lg transition duration-200"
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
