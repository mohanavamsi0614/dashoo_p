import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleEventsClick = (e) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const eventsSection = document.getElementById("upcoming-events");
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const eventsSection = document.getElementById("upcoming-events");
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative mt-20 pt-16 pb-8 border-t border-white/10 bg-[#050505] overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg font-nerko">D</span>
              </div>
              <h2 className="font-nerko text-3xl font-medium text-white tracking-wide">Dasho</h2>
            </div>
            <p className="text-gray-400 font-poppins text-sm leading-relaxed">
              Your premium, one-stop solution for managing hackathons effortlessly and
              efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 font-poppins text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-indigo-400 hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-400 hover:text-indigo-400 hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  onClick={handleEventsClick}
                  className="text-gray-400 hover:text-indigo-400 hover:translate-x-1 inline-block transition-all duration-300 cursor-pointer"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">
              Resources
            </h3>
            <ul className="space-y-3 font-poppins text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 hover:translate-x-1 inline-block transition-all duration-300"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 hover:translate-x-1 inline-block transition-all duration-300"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-poppins font-semibold text-white text-lg mb-4">Contact</h3>
            <ul className="space-y-3 font-poppins text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">✉</span> mohanavamsi14@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-400">☏</span> +91 6281605767
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 font-poppins text-xs sm:text-sm">
            &copy; {new Date().getFullYear()} Dasho. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-gray-500 hover:text-white cursor-pointer transition-colors text-sm">Privacy Policy</span>
            <span className="text-gray-500 hover:text-white cursor-pointer transition-colors text-sm">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
