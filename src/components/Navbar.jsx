import { useNavigate, useLocation } from "react-router";

function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  // Optionally hide on auth page, but let's keep it consistent
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-10 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto glass rounded-2xl p-3 sm:p-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => nav("/")}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-all">
            <span className="text-white font-bold text-lg font-nerko">D</span>
          </div>
          <span className="font-nerko text-2xl sm:text-3xl text-white tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300">
            Dasho
          </span>
        </div>

        <div>
          {localStorage.getItem("user") ? (
            <img
              src={JSON.parse(localStorage.getItem("user")).imgUrl}
              alt="Profile"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border-2 border-indigo-400/50 cursor-pointer hover:border-indigo-400 shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:scale-105"
              onClick={() => nav("/profile")}
            />
          ) : (
            <button
              className="text-sm sm:text-base px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/40 hover:from-indigo-400 hover:to-purple-500 transform hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => nav("/auth")}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
