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
      const res = await axios.post("https://dasho-backend.onrender.com/participant/register", data);
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

      const res = await axios.post("https://dasho-backend.onrender.com/participant/auth", {
        email: user.email,
      });

      if (res.data.newUser) {
        setNewUser(true);
        setData((prev) => ({ ...prev, email: user.email, name: user.displayName || "" }));
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
          className="bg-red-500 hover:bg-red-600 transition-colors text-white px-6 py-3 rounded-lg font-medium w-full"
        >
          Sign in with Google
        </button>
      ) : (
        <div className="flex flex-col gap-4 text-left">
          <h2 className="text-xl font-semibold text-center mb-2">Complete Your Profile</h2>
          <input
            className="p-2 rounded bg-gray-700 focus:outline-none"
            placeholder="Name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <input
            className="p-2 rounded bg-gray-700 focus:outline-none"
            placeholder="College / Company"
            value={data.group}
            onChange={(e) => setData({ ...data, group: e.target.value })}
          />
          <input
            className="p-2 rounded bg-gray-700 focus:outline-none"
            placeholder="Email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <input
            className="p-2 rounded bg-gray-700 focus:outline-none"
            placeholder="Phone"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <textarea
            className="p-2 rounded bg-gray-700 focus:outline-none"
            placeholder="Bio"
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => wid.current && wid.current.open()}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
            >
              Upload Image
            </button>
            {data.imgUrl && (
              <img
                src={data.imgUrl}
                alt="Profile"
                className="h-12 w-12 rounded-full object-cover border"
              />
            )}
          </div>

          <button
            onClick={register}
            className="mt-4 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white font-semibold"
          >
            Submit Registration
          </button>
        </div>
      )}
    </div>
  );
}

export default GoogleAuth;
