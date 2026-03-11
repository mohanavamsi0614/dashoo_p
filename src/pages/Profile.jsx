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
          className="px-8 py-3 bg-[#7a6cf0] border border-black text-white font-bold uppercase tracking-widest shadow-[4px_4px_0_0_#000] hover:bg-black transition-colors"
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
      <div className="max-w-4xl mx-auto bg-white border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0_0_#000] mb-16">
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

          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="px-6 py-2 border-2 border-black bg-white hover:bg-red-500 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs shadow-[2px_2px_0_0_#000]"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Registered Events */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-2 inline-block">
          Events
        </h2>

        {user.registeredEvents && user.registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {user.registeredEvents.map((event, idx) => {
              const paymentStatus = event.payment;
              return (
                <div
                  key={idx}
                  className="bg-white border-2 border-black flex flex-col shadow-[6px_6px_0_0_#000] hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] transition-all"
                >
                  {/* Banner */}
                  {event.bannerUrl && (
                    <div className="relative h-48 border-b-2 border-black overflow-hidden bg-black">
                      <img
                        src={event.bannerUrl}
                        alt={event.eventName}
                        className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 opacity-80"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-4">
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 line-clamp-1">
                        {event.eventName}
                      </h3>
                      <span className={`inline-block px-3 py-1 border border-black text-xs font-bold uppercase tracking-widest ${paymentStatus ? 'bg-[#c3cfa1]' : 'bg-red-400 text-white'}`}>
                        {paymentStatus ? "Paid" : "Pending Payment"}
                      </span>
                    </div>

                    <div className="space-y-3 mb-8 font-serif italic text-sm text-gray-800">
                      {event.venue && (
                        <p className="flex items-start gap-2">
                          <span className="font-sans not-italic">📍</span> {event.venue}
                        </p>
                      )}

                      {event.teamId && (
                        <p className="flex items-center gap-2">
                          <span className="font-sans not-italic">👥</span>
                          Team Ref: <span className="font-mono bg-gray-200 px-1 border border-black font-bold not-italic text-black">{event.teamId.slice(-6).toUpperCase()}</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-black">
                      <Link
                        to={`/event/${event.eventId}`}
                        className="font-bold uppercase tracking-widest text-xs hover:underline underline-offset-4"
                      >
                        Details →
                      </Link>

                      {!paymentStatus && (
                        <Link
                          to={`/payment/${event.eventId}/${event.teamId}`}
                          className="px-6 py-2 bg-[#7a6cf0] text-white border border-black text-xs font-bold uppercase tracking-widest shadow-[2px_2px_0_0_#000] hover:bg-black hover:text-white transition-colors"
                        >
                          Pay
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border-2 border-black p-12 text-center shadow-[6px_6px_0_0_#000]">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No Events Yet</h3>
            <p className="font-serif italic text-gray-700 mb-8 max-w-sm mx-auto">
              You haven't registered or joined any teams for events yet. Explore upcoming opportunities!
            </p>
            <Link to="/" className="inline-block px-8 py-3 bg-black text-white font-bold uppercase tracking-widest text-sm hover:bg-[#7a6cf0] border border-black shadow-[4px_4px_0_0_#000] transition-all">
              Explore Events
            </Link>
          </div>
        )}
      </div>

      <div className="text-center mt-20 border-t-2 border-black pt-8">
        <Link
          to="/"
          className="font-bold uppercase tracking-widest text-sm hover:underline underline-offset-4 flex justify-center items-center gap-2"
        >
          <span>←</span> Back Home
        </Link>
      </div>
    </div>
  );
}

export default Profile;
