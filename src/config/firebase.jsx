import axios from "axios";
import api from "../lib/api";
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

function GoogleAuth({ text }) {
  const [newUser, setNewUser] = useState(false);
  const [data, setData] = useState({
    name: "",
    group: "",
    email: "",
    phone: "",
    bio: "",
    imgUrl: "",
  });

  // loading states
  const [authLoading, setAuthLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

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
    if (!data.name.trim() || !data.group.trim() || !data.email.trim() || !data.phone.trim()) {
      alert("Please fill in all fields");
      return;
    }
    setRegLoading(true);
    try {
      const res = await api.post(
        "/participant/register",
        data
      );
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/");
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed!");
    } finally {
      setRegLoading(false);
    }
  };

  // 🔹 Google Sign-in
  const signIn = async () => {
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const res = await api.post(
        "/participant/auth",
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
        nav("/");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Google sign-in failed!");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="text-center">
      {!newUser ? (
        <button
          onClick={signIn}
          disabled={authLoading}
          aria-busy={authLoading}
          className={`border cursor-pointer border-[#aeaeae4d] transition-colors text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium w-full text-sm sm:text-base ${authLoading ? 'opacity-80 cursor-wait' : 'hover:bg-white hover:text-black'}`}
        >
          {authLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            text || "Sign in with Google"
          )}
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
            disabled
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
            <p>Optional</p>
            <button
              onClick={() => wid.current && wid.current.open()}
              disabled={regLoading}
              className={`bg-trasparent w-full sm:w-auto border rounded-lg border-[#aeaeae4d] transition-colors duration-300 px-4 py-2 text-sm sm:text-base text-white ${regLoading ? 'opacity-80 cursor-wait' : 'hover:bg-white hover:text-black'}`}
            >
              {regLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Upload Image'
              )}
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
            disabled={regLoading}
            aria-busy={regLoading}
            className={`mt-3 sm:mt-4 bg-trasparent border rounded-lg border-[#aeaeae4d] transition-colors duration-300 px-4 sm:px-6 py-2 sm:py-3 font-nerko text-xl sm:text-2xl font-normal text-white ${regLoading ? 'opacity-80 cursor-wait' : 'hover:bg-white hover:text-black'}`}
          >
            {regLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Createing...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default GoogleAuth;
