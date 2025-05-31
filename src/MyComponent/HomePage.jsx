import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from 'react-toastify';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiUrls from "../utils/apiUrls";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import CreatePostModal from "./CreatePostModal";
import GetPostModal from "./GetPostModal";
import DeletePostModal from "./DeletePostModal";
import PlatformCredentialsModal from "./PlatformCredentialsModal";

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
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [posts, setPosts] = useState([]);

  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState([]);

  const handlePlatformClick = (platform) => {
    setSelectedPlatform([platform]);
    setPlatformModalOpen(true);
  };

  const handleSavePlatformCredentials = async (credentials) => {
    // Example API endpoint
    const url = "http://127.0.0.1:8000/api/v1/platform/create-platform";
    try {
      // Include platform name + credentials
      const payload = {
        platforms: selectedPlatform.map((platform) => {
          return {
            platformName: platform,
            platformDetails: {
              userId: credentials.userId,
              password: credentials.password,
            },
          };
        }),
      };

      const res = await axiosInstance.post(url, payload);
  console.log("res.data:", res.data);
      if (res.data.success) {
  toast.success(`${selectedPlatform} credentials saved successfully! Please wait up to 24 hours for your account to be activated.`);
  setTimeout(() => {
     setPlatformModalOpen(false);
  setSelectedPlatform(null);
  },1000)
 
} else {
  toast.error("Failed to save credentials.");
}
    } catch (error) {
      console.error("Error saving platform credentials:", error);
      alert("Error saving platform credentials.");
    }
  };

  // Add filter state for platforms
  const [platformFilter, setPlatformFilter] = useState(null); // null means no filter (show all)

  // Filtered posts based on platformFilter
  const filteredPosts = platformFilter
    ? posts.filter((post) => post.platforms?.includes(platformFilter))
    : posts;

  // Handle platform filter toggle
  const togglePlatformFilter = (platform) => {
    setPlatformFilter((prev) => (prev === platform ? null : platform));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    try {
      const url =
        authView === "signup"
          ? "http://127.0.0.1:8000/api/v1/user/create"
          : "http://127.0.0.1:8000/api/v1/auth/login";

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
        if (authView === "signup") {
          // <-- THIS IS WHERE YOU HANDLE SUCCESSFUL SIGNUP
          alert("Signup successful! Please login now.");
          console.log("Full login response data:", res.data);

          console.log("Full response:", res);
          console.log("User part:", res.data?.user);
          setAuthView("login"); // Switches UI to login form
          setAuthData({ name: "", email: "", password: "", remember: false }); // clears form
        } else {
          console.log(res);

          // <-- THIS IS WHERE YOU HANDLE SUCCESSFUL LOGIN
          const token = res.data.token || "dummy-token";
          const userId = res.data?.data?.id;

          login(token, authData.remember); // Actually logs the user in

          // Optionally store user ID
          localStorage.setItem("userId", userId);
        }
      } else {
        alert("Authentication failed.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      alert("Something went wrong during authentication.");
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post at the top
  };

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
          className="!text-sm text-blue-500 cursor-pointer"
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
          onClick={() => {
            logout();
            setAuthView("login");
          }}
          className="text-red-500 border px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-4 px-4 py-3 border-b">
        {platformsList.map((platform) => (
          <button
            key={platform}
            onClick={() => handlePlatformClick(platform)}
            className="capitalize border px-3 py-1 rounded hover:bg-gray-200 transition"
          >
            {platform}
          </button>
        ))}
      </div>
  <ToastContainer position="top-right" autoClose={5000} />
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
        onPostCreated={(newPost) => {
          if (newPost && newPost._id) {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
          }
        }}
      />

      {/* Get Post Modal */}
      <GetPostModal
        onEdit={(post) => {
          setSelectedPost(post);
          setIsEditModalOpen(true);
        }}
        postsData={posts}
      />

      {/* Platform Credentials Modal */}
      <PlatformCredentialsModal
        platform={selectedPlatform}
        isOpen={platformModalOpen}
        setIsOpen={setPlatformModalOpen}
        onSave={handleSavePlatformCredentials}
      />

      {/* You may want to add DeletePostModal here if you handle deletion */}
      {deleteModalOpen && (
        <DeletePostModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          postId={selectedPostId}
          // add any callback to refresh posts if needed
        />
      )}
    </div>
  );
}

