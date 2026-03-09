import GoogleAuth from "../config/firebase";
import { BackgroundBeams } from "../components/ui/background-beams";
import { Link } from "react-router-dom";

function Auth() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white p-4 sm:p-6 relative overflow-hidden">
      {/* Abstract background glows */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-600/30 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-600/30 rounded-full blur-[100px]"></div>

      <BackgroundBeams className="fixed inset-0 z-0 opacity-60" />

      <div className="glass-card p-6 sm:p-10 md:p-12 rounded-3xl font-poppins w-full max-w-md relative z-10 flex flex-col items-center text-center">
        <Link to="/" className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 hover:scale-105 transition-transform">
          <span className="text-white font-bold text-3xl font-nerko">D</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-medium mb-3 text-gray-200">
          Welcome back to
        </h1>
        <h2 className="font-nerko text-4xl sm:text-5xl md:text-6xl text-gradient text-glow mb-8">
          Dasho
        </h2>

        <div className="w-full">
          <GoogleAuth />
        </div>

        <p className="mt-8 text-xs text-gray-500 max-w-[250px]">
          By continuing, you agree to Dasho's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Auth;
