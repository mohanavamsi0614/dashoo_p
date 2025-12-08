import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleEventsClick = (e) => {
    e.preventDefault();

    if (location.pathname !== "/") {
      // If not on home page, navigate to home first
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const eventsSection = document.getElementById("upcoming-events");
        if (eventsSection) {
          eventsSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const eventsSection = document.getElementById("upcoming-events");
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-[#1a1a1a] text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h2 className="font-nerko text-4xl font-medium mb-4">Dasho</h2>
            <p className="text-gray-400 font-poppins text-sm">
              Your one-stop solution for managing hackathons effortlessly and
              efficiently.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-poppins font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 font-poppins text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/profile"
                  className="text-gray-400 hover:text-white transition"
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href="#events"
                  onClick={handleEventsClick}
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  Events
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-poppins font-semibold text-lg mb-4">
              Resources
            </h3>
            <ul className="space-y-2 font-poppins text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-poppins font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 font-poppins text-sm text-gray-400">
              <li>Email: mohanavamsi14@gmail.com</li>
              <li>Phone: +91 6281605767</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 font-poppins text-sm">
            &copy; {new Date().getFullYear()} Dashoo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
