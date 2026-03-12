import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import api from "@/lib/api";

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [loading, setLoading] = useState(!user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await api.get("/participant/my/profile", {
          headers: {
            authorization: token,
          },
        });
        if (res.data) {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4efe6] flex items-center justify-center font-sans">
        <div className="text-4xl font-black uppercase tracking-tighter animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f4efe6] flex flex-col items-center justify-center font-sans text-center p-6 text-black">
        <p className="text-xl font-bold uppercase tracking-widest mb-6">No user data available.</p>
        <button
          onClick={() => navigate("/auth")}
          className="px-8 py-4 bg-[#7a6cf0] border-[4px] border-black text-white font-black uppercase tracking-widest shadow-[8px_8px_0_0_#000] hover:bg-black hover:translate-y-1 hover:shadow-none transition-all"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4efe6] font-sans text-black px-4 sm:px-6 py-6 sm:py-10 pt-28">
      <div className="max-w-4xl mx-auto mb-6">
        <BackButton />
      </div>

      {/* Profile Header Card */}
      <div className="max-w-4xl mx-auto bg-white border-[4px] border-black p-8 sm:p-12 shadow-[16px_16px_0_0_#000] mb-20 relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          <div className="relative">
            <img
              src={user.imgUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.name}
              alt={user.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-black bg-[#c3cfa1]"
            />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              {user.name}
            </h1>
            <div className="space-y-1 mb-6 font-bold uppercase tracking-widest text-sm">
              <p className="flex items-center justify-center sm:justify-start gap-2">
                ✉ {user.email}
              </p>
              {user.phone && (
                <p className="flex items-center justify-center sm:justify-start gap-2">
                  ☏ {user.phone}
                </p>
              )}
            </div>

            <p className="font-serif italic text-lg leading-relaxed max-w-2xl border-l-[3px] border-black pl-4">
              {user.bio || "No bio provided."}
            </p>
            {user.group && (
              <p className="mt-4 inline-block px-4 py-2 bg-black text-white font-bold uppercase tracking-widest text-xs border border-white">
                Group: {user.group}
              </p>
            )}
          </div>

          <div className="mt-4 sm:mt-0 absolute top-6 right-6 sm:static">
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="px-6 py-3 border-[3px] border-black bg-white hover:bg-red-500 hover:text-white transition-colors font-black uppercase tracking-widest text-xs shadow-[4px_4px_0_0_#000] hover:translate-y-1 hover:shadow-none"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-10 border-b-[4px] border-black pb-4 inline-block">
          Events
        </h2>

        {user.registeredEvents && user.registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {user.registeredEvents.map((event, idx) => {
              const paymentStatus = event.payment;
              return (
                <div
                  key={idx}
                  className="bg-white border-[4px] border-black flex flex-col shadow-[8px_8px_0_0_#000] hover:-translate-y-2 hover:shadow-[12px_12px_0_0_#000] transition-all"
                >
                  {/* Banner */}
                  {event.bannerUrl && (
                    <div className="relative h-56 border-b-[4px] border-black overflow-hidden bg-black">
                      <img
                        src={event.bannerUrl}
                        alt={event.eventName}
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 opacity-90"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 line-clamp-1 leading-none">
                        {event.eventName}
                      </h3>
                      <span className={`inline-block px-4 py-2 border-[2px] border-black text-xs font-black uppercase tracking-widest ${paymentStatus ? 'bg-[#c3cfa1]' : 'bg-red-400 text-white'}`}>
                        {paymentStatus ? "Paid" : "Pending Payment"}
                      </span>
                    </div>

                    <div className="space-y-4 mb-10 font-serif italic text-base text-gray-800">
                      {event.venue && (
                        <p className="flex items-start gap-4">
                          <span className="font-sans not-italic text-black font-black">📍</span> {event.venue}
                        </p>
                      )}

                      {event.teamId && (
                        <p className="flex items-center gap-4">
                          <span className="font-sans not-italic text-black font-black">👥</span>
                          Team Ref: <span className="font-mono bg-white px-2 border-[2px] border-black font-black not-italic text-black tracking-widest">{event.teamId.slice(-6).toUpperCase()}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-6 mt-auto border-t-[3px] border-black">
                      <Link
                        to={`/event/${event.eventId}`}
                        className="font-bold uppercase tracking-widest text-xs hover:underline underline-offset-4"
                      >
                        Details →
                      </Link>

                      {!paymentStatus && (
                        <Link
                          to={`/payment/${event.eventId}/${event.teamId}`}
                          className="px-6 py-3 bg-[#7a6cf0] text-white border-[3px] border-black text-xs font-black uppercase tracking-widest shadow-[4px_4px_0_0_#000] hover:bg-black hover:text-white transition-all hover:translate-y-1 hover:shadow-none"
                        >
                          PAY NOW
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#c3cfa1] border-[4px] border-black p-16 text-center shadow-[12px_12px_0_0_#000]">
            <div className="text-6xl mb-6">🎯</div>
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-black">No Events Yet</h3>
            <p className="font-serif italic text-gray-800 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              You haven't registered or joined any teams for events yet. Explore upcoming opportunities!
            </p>
            <Link to="/events" className="inline-block px-10 py-5 bg-black text-white font-black uppercase tracking-widest text-base border-[3px] border-black shadow-[6px_6px_0_0_#000] hover:bg-white hover:text-black hover:translate-y-1 hover:shadow-none transition-all">
              Explore Events
            </Link>
          </div>
        )}
      </div>

      <div className="text-center mt-24 border-t-[4px] border-black pt-12">
        <Link
          to="/"
          className="font-black uppercase tracking-widest text-base hover:text-[#7a6cf0] transition-colors flex justify-center items-center gap-4"
        >
          <span className="text-xl">←</span> Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default Profile;
