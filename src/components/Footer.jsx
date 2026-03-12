import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();



  return (
    <footer className="mt-20 border-t border-black bg-[#f4efe6] text-black pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-black pb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
                <span className="text-white font-bold text-lg font-serif italic">D</span>
              </div>
              <h2 className="font-black uppercase tracking-tighter text-3xl">Dasho</h2>
            </div>
            <p className="font-serif italic text-sm text-gray-800 leading-relaxed uppercase pr-4">
              Your premium, one-stop solution for managing hackathons effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b border-black inline-block pb-1">
              Quick Links
            </h3>
            <ul className="space-y-4 font-bold text-sm uppercase">
              <li>
                <a href="/" className="hover:underline underline-offset-4">Home</a>
              </li>
              <li>
                <a href="/profile" className="hover:underline underline-offset-4">Profile</a>
              </li>
              <li>
                <a href="/events" className="hover:underline underline-offset-4 cursor-pointer">Events</a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b border-black inline-block pb-1">
              Resources
            </h3>
            <ul className="space-y-4 font-bold text-sm uppercase">
              <li>
                <a href="#" className="hover:underline underline-offset-4">Documentation</a>
              </li>
              <li>
                <a href="#" className="hover:underline underline-offset-4">Support</a>
              </li>
              <li>
                <a href="#" className="hover:underline underline-offset-4">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-bold uppercase tracking-widest text-sm mb-6 border-b border-black inline-block pb-1">
              Contact
            </h3>
            <ul className="space-y-4 font-sans text-sm font-bold">
              <li className="flex items-center gap-2">
                ✉ mohanavamsi14@gmail.com
              </li>
              <li className="flex items-center gap-2">
                ☏ +91 6281605767
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} Dasho. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
