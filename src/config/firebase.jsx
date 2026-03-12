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
                localStorage.setItem('token',res.data.token)
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
    <div className="text-center w-full">
      {!newUser ? (
        <button
          onClick={signIn}
          disabled={authLoading}
          aria-busy={authLoading}
          className={`px-8 py-5 sm:py-6 bg-white border-[4px] border-black text-black font-black uppercase tracking-widest text-lg sm:text-xl shadow-[8px_8px_0_0_#000] w-full transition-all ${authLoading ? 'opacity-80 cursor-wait' : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:bg-black hover:text-white'}`}
        >
          {authLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
        <div className="flex mt-8 flex-col gap-5 text-left bg-white border-[4px] border-black p-6 sm:p-10 shadow-[12px_12px_0_0_#000] w-full">
          <h3 className="text-3xl font-black uppercase tracking-tighter text-black border-b-[4px] border-black pb-4 mb-4">Complete Profile</h3>
          
          <input
            className="w-full bg-white border-[3px] border-black text-black rounded-none px-4 py-3 outline-none focus:ring-0 focus:border-[#7a6cf0] transition-all duration-300 placeholder:font-serif placeholder:italic shadow-[4px_4px_0_0_#000] font-bold text-base"
            placeholder="Full Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <input
            className="w-full bg-white border-[3px] border-black text-black rounded-none px-4 py-3 outline-none focus:ring-0 focus:border-[#7a6cf0] transition-all duration-300 placeholder:font-serif placeholder:italic shadow-[4px_4px_0_0_#000] font-bold text-base"
            placeholder="College / Company"
            value={data.group}
            onChange={(e) => setData({ ...data, group: e.target.value })}
          />
          <input
            className="w-full bg-gray-200 border-[3px] border-black text-black rounded-none px-4 py-3 outline-none transition-all duration-300 placeholder:font-serif placeholder:italic shadow-[4px_4px_0_0_#000] font-bold text-base cursor-not-allowed"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            disabled
          />
          <input
            className="w-full bg-white border-[3px] border-black text-black rounded-none px-4 py-3 outline-none focus:ring-0 focus:border-[#7a6cf0] transition-all duration-300 placeholder:font-serif placeholder:italic shadow-[4px_4px_0_0_#000] font-bold text-base"
            placeholder="Phone Number"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <textarea
            className="w-full bg-white border-[3px] border-black text-black rounded-none px-4 py-3 outline-none focus:ring-0 focus:border-[#7a6cf0] transition-all duration-300 placeholder:font-serif placeholder:italic shadow-[4px_4px_0_0_#000] font-bold text-base min-h-[100px]"
            placeholder="Short Bio"
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-[#c3cfa1] border-[2px] border-black px-2 py-1 shadow-[2px_2px_0_0_#000]">Optional Image</span>
            <button
              onClick={() => wid.current && wid.current.open()}
              disabled={regLoading}
              className={`px-4 py-3 border-[3px] border-black bg-white text-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0_0_#000] ${regLoading ? 'opacity-80 cursor-wait' : 'hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none hover:bg-black hover:text-white transition-all'}`}
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
              <div className="p-1 border-[3px] border-black bg-white shadow-[4px_4px_0_0_#000]">
                <img
                  src={data.imgUrl}
                  alt="Profile"
                  className="h-12 w-12 object-cover border-[2px] border-black"
                />
              </div>
            )}
          </div>

          <button
            onClick={register}
            disabled={regLoading}
            aria-busy={regLoading}
            className={`mt-6 w-full px-6 py-4 bg-[#7a6cf0] border-[4px] border-black text-white font-black uppercase tracking-widest shadow-[8px_8px_0_0_#000] ${regLoading ? 'opacity-80 cursor-wait' : 'hover:bg-black hover:translate-y-1 hover:shadow-none transition-all'}`}
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
