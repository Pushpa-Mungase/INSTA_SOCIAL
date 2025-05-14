import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlusCircle } from "react-icons/fa";

import apiUrls from "../utils/apiUrls";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import CreatePostModal from "./CreatePostModal";
import GetPostModal from "./GetPostModal";
import DeletePostModal from "./DeletePostModal";

const platformsList = ["facebook", "twitter", "linkedin", "instagram"];

export default function HomePage() {
  const { isAuthenticated, login, logout } = useAuth();
  const [authView, setAuthView] = useState("signup"); // or "login"
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    remember: false,
  });

  const [activeMenu, setActiveMenu] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const [selectedPost, setSelectedPost] = useState(null);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        authView === "signup"
          ? "http://127.0.0.1:8000/api/v1/user/create"
          : "http://127.0.0.1:8000/api/v1/auth/login"; // You may need to create this endpoint

      const payload =
        authView === "signup"
          ? {
              name: authData.name,
              email: authData.email,
              password: authData.password,
            }
          : { email: authData.email, password: authData.password };

      const res = await axiosInstance.post(url, payload);

      if (res.data.status) {
        const token = res.data.token || "dummy-token"; // Replace with real token if returned
        const userId = res.data.user?._id;
        login(token, authData.remember);

        // Optional: store user ID globally or in context/localStorage
        localStorage.setItem("userId", userId);
      } else {
        alert("Authentication failed.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Something went wrong during authentication.");
    }
  };



    const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get("/post/get-scheduled-posts");
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };
  const [resget, setResget] = useState([]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-xl font-bold">
          {authView === "signup" ? "Sign Up" : "Login"}
        </h1>
        <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-3">
          {authView === "signup" && (
            <input
              type="text"
              required
              placeholder="Name"
              value={authData.name}
              onChange={(e) =>
                setAuthData({ ...authData, name: e.target.value })
              }
              className="w-full border p-2 rounded"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={authData.email}
            onChange={(e) =>
              setAuthData({ ...authData, email: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={authData.password}
            onChange={(e) =>
              setAuthData({ ...authData, password: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={authData.remember}
              onChange={(e) =>
                setAuthData({ ...authData, remember: e.target.checked })
              }
            />
            Remember Me
          </label>
          <button
            type="submit"
            className="!w-full text-black p-2 rounded bg-amber-700"
          >
            {authView === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>
        <p
          className="!text-sm text-blue-500 cursor-pointer" //style for paragraph means dont have an account signup/login
          onClick={() =>
            setAuthView(authView === "signup" ? "login" : "signup")
          }
        >
          {authView === "signup"
            ? "Already have an account? Login"
            : "Don’t have an account? Sign Up"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 py-2">
      {/* Top bar with logout */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h2 className="text-xl font-bold">Scheduled Posts</h2>
        <button
          onClick={logout}
          className="text-red-500 border px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      {/* Create Button */}
      <div className="self-end mr-5">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="!bg-green-500 rounded-full p-3 hover:!bg-green-600 shadow-lg transition duration-300"
          title="Create New Post"
        >
          <FaPlusCircle size={24} />
        </button>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
      />

      <GetPostModal
        onEdit={(post) => {
          setSelectedPost(post);
          setIsEditModalOpen(true);
        }}
      />


      


    </div>
  );
}
