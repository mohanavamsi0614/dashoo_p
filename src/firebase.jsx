import axios from "axios";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAlx6nKoPwrMuI-VGsaIgUza4iCG5MDsCU",
  authDomain: "dasho-84421.firebaseapp.com",
  projectId: "dasho-84421",
  storageBucket: "dasho-84421.firebasestorage.app",
  messagingSenderId: "763118217493",
  appId: "1:763118217493:web:e94e3cd616ca04b8c5a11c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function GoogleAuth() {
  const [newUser, setNewUser] = useState(false);
  const [data, setData] = useState({
    name: "",
    group: "",
    email: "",
    phone: "",
    bio: "",
    imgUrl: "",
  });

  const wid = useRef();
  const nav = useNavigate();

  // 🔹 Setup Cloudinary widget once
  useEffect(() => {
    if (!window.cloudinary) {
      console.warn("Cloudinary not found. Add Cloudinary script in index.html");
      return;
    }
    wid.current = window.cloudinary.createUploadWidget(
      {
        cloudName: "dfseckyjx",
        uploadPreset: "qbvu3y5j",
        multiple: false,
        folder: "users",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setData((prev) => ({ ...prev, imgUrl: result.info.secure_url }));
        } else if (error) {
          console.error("Cloudinary error:", error);
          alert("Error uploading image!");
        }
      }
    );
  }, []);

  const provider = new GoogleAuthProvider();

  // 🔹 Register new user
  const register = async () => {
    try {
      const res = await axios.post(
        "https://dasho-backend.onrender.com/participant/register",
        data
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/profile");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed!");
    }
  };

  // 🔹 Google Sign-in
  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await axios.post(
        "https://dasho-backend.onrender.com/participant/auth",
        {
          email: user.email,
        }
      );

      if (res.data.newUser) {
        setNewUser(true);
        setData((prev) => ({
          ...prev,
          email: user.email,
          name: user.displayName || "",
        }));
      } else {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        nav("/profile");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Google sign-in failed!");
    }
  };

  return (
    <div className="text-center">
      {!newUser ? (
        <button
          onClick={signIn}
          className="border cursor-pointer border-[#aeaeae4d] hover:bg-white hover:text-black transition-colors text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium w-full text-sm sm:text-base"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="flex mt-6 sm:mt-10 flex-col gap-3 sm:gap-4 text-left">
          <input
            className="p-2 sm:p-3 text-sm sm:text-base bg-transparent text-gray-300 border rounded-lg border-[#aeaeae4d] focus:outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40"
            placeholder="Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <input
            className="p-2 sm:p-3 text-sm sm:text-base rounded-lg bg-transparent text-gray-300 border border-[#aeaeae4d] focus:outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40"
            placeholder="College / Company"
            value={data.group}
            onChange={(e) => setData({ ...data, group: e.target.value })}
          />
          <input
            className="p-2 sm:p-3 text-sm sm:text-base rounded-lg bg-transparent text-gray-300 border border-[#aeaeae4d] focus:outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            className="p-2 sm:p-3 text-sm sm:text-base rounded-lg bg-transparent text-gray-300 border border-[#aeaeae4d] focus:outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40"
            placeholder="Phone"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <textarea
            className="p-2 sm:p-3 text-sm sm:text-base rounded-lg bg-transparent text-gray-300 border border-[#aeaeae4d] focus:outline-none focus:ring-2 focus:ring-[#8989894d] transition-all duration-300 placeholder:opacity-40"
            placeholder="Bio"
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <button
              onClick={() => wid.current && wid.current.open()}
              className="bg-trasparent w-full sm:w-auto border rounded-lg border-[#aeaeae4d] hover:bg-white hover:text-black transition-colors duration-300 px-4 py-2 text-sm sm:text-base text-white"
            >
              Upload Image
            </button>
            {data.imgUrl && (
              <img
                src={data.imgUrl}
                alt="Profile"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border"
              />
            )}
          </div>

          <button
            onClick={register}
            className="mt-3 sm:mt-4 bg-trasparent border rounded-lg border-[#aeaeae4d] hover:bg-white hover:text-black transition-colors duration-300 px-4 sm:px-6 py-2 sm:py-3 font-nerko text-xl sm:text-2xl font-normal text-white"
          >
            Submit Registration
          </button>
        </div>
      )}
    </div>
  );
}

export default GoogleAuth;
