import { useNavigate, useLocation } from "react-router";

function Navbar() {
  const nav = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-4 sm:px-6 md:px-10 py-4">
      <div className="max-w-7xl mx-auto bg-[#f4efe6] rounded-full p-3 sm:p-4 flex justify-between items-center border border-black shadow-[4px_4px_0_0_#000]">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => nav("/")}
        >
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center transition-all">
            <span className="text-white font-bold text-lg font-serif italic">D</span>
          </div>
          <span className="font-black uppercase tracking-tighter text-xl sm:text-2xl text-black">
            Dasho
          </span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => nav("/events")}
            className="font-bold text-sm uppercase tracking-widest text-black hover:underline underline-offset-4 hidden sm:block"
          >
            Events
          </button>
          
          {localStorage.getItem("user") ? (
            <img
              src={JSON.parse(localStorage.getItem("user")).imgUrl}
              alt="Profile"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-black cursor-pointer hover:scale-105 transition-transform"
              onClick={() => nav("/profile")}
            />
          ) : (
            <button
              className="text-xs sm:text-sm px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#7a6cf0] border border-black text-white font-bold uppercase tracking-wider hover:bg-black transition-colors"
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
