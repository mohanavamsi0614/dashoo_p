import GoogleAuth from "../config/firebase";
import { Link } from "react-router-dom";

function Auth() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4efe6] text-black p-4 sm:p-6 font-sans">
      <div className="border-[4px] border-black bg-white p-8 sm:p-12 md:p-16 w-full max-w-2xl relative flex flex-col items-center text-center shadow-[16px_16px_0_0_#000]">
        
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest mb-4 border-b-[4px] border-black pb-2 px-4 inline-block">
          Welcome back
        </h1>
        
        <h2 className="font-black uppercase text-5xl sm:text-6xl md:text-7xl tracking-tighter mb-10">
          Dasho
        </h2>

        <div className="w-full flex justify-center border-t-[4px] border-black pt-8">
          <GoogleAuth />
        </div>

        <p className="mt-8 text-xs font-serif italic text-gray-700 max-w-[250px]">
          By continuing, you agree to Dasho's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default Auth;
