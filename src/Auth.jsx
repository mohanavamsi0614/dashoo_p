import GoogleAuth from "./firebase";

function Auth() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome to Dasho</h1>
        <GoogleAuth />
      </div>
    </div>
  );
}

export default Auth;
