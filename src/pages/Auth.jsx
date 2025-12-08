import GoogleAuth from "../config/firebase";
import { BackgroundBeams } from "../components/ui/background-beams";

function Auth() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#212121] text-white p-4 sm:p-6 relative">
      <BackgroundBeams className="fixed inset-0 z-0" />
      <div className="bg-transparent border border-[#aeaeae4d] p-4 sm:p-6 md:p-8 rounded-2xl font-poppins shadow-lg w-full max-w-md relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-4 sm:mb-6">
          Welcome to{" "}
          <span className="font-nerko text-3xl sm:text-4xl md:text-5xl font-medium">
            Dasho
          </span>
        </h1>
        <GoogleAuth />
      </div>
    </div>
  );
}

export default Auth;
