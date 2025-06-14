import { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlusCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import apiUrls from "../utils/apiUrls.jsx";
import AuthForm from "../component/auth/AuthForm";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import CreatePostModal from "../component/post/CreatePostModal";
import GetPostModal from "../component/post/GetPostModal";
import DeletePostModal from "../component/post/DeletePostModal";
import PlatformCredentialsModal from "../component/platform/PlatformCredentialsModal";
//import { platforms } from "@/constants/platforms";

import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiTelegram, SiX, SiYoutube } from "react-icons/si";
import EditPostModal from "../component/post/EditPostModal";
import { Settings } from "lucide-react";
//import PlatformStatusCard from "@/Mycomponent/PlatformStatusCard";

export const platforms = [
  {
    key: "linkedin",
    name: "Linkedin",
    icon: <FaLinkedinIn className="text-white" size={16} />,
    color: "bg-blue-600",
  },
  {
    key: "facebook",
    name: "Facebook",
    icon: <FaFacebookF className="text-white" size={16} />,
    color: "bg-blue-700",
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: <FaInstagram className="text-white" size={16} />,
    color: "bg-pink-500",
  },
  {
    key: "twitter",
    name: "Twitter / X",
    icon: <SiX className="text-white" size={16} />,
    color: "bg-cyan-500",
  },
   {
    key: "telegram",
    name: "Telegram",
    icon: <SiTelegram className="text-white" size={16} />,
    color: "bg-blue-500",
  },
  {
    key: "youtube",
    name: "YouTube",
    icon: <SiYoutube className="text-white" size={16} />,
    color: "bg-red-600",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuth();
  const [authView, setAuthView] = useState("signup"); // or "login"
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
    remember: false,
  });

  const [activatedPlatforms, setActivatedPlatforms] = useState({}); 
  // { facebook: true, instagram: false, ... }

  const [activeMenu, setActiveMenu] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platformStatusList, setPlatformStatusList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);

  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState([]);

  // Add filter state for platforms
  const [platformFilter, setPlatformFilter] = useState(null); // null means no filter (show all)
const [showModal, setShowModal] = useState(false);

// const handlePlatformClick = (key) => {
//   setPlatformFilter(key);
//   setShowModal(true); // open modal
// };

  // Fetch platform status on component mount
  useEffect(() => {
    const fetchPlatformStatus = async () => {
      try {
        // Use axiosInstance instead of axios to ensure proper base URL and headers
        const res = await axiosInstance.get("/platform/get-user-platforms");
        console.log("platformStatusList:", res.data.platforms);
        
        setPlatformStatusList(res.data.platforms || []);
      } catch (error) {
        console.error("Error fetching platform status", error);
        toast.error("Failed to fetch platform status");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) { // Only fetch if user is authenticated
      fetchPlatformStatus();
    }
  }, [isAuthenticated]); // Add isAuthenticated as dependency

  const handlePlatformClick = (platformKey) => {
    console.log("Clicked platform:", platformKey);
    setSelectedPlatform([platformKey]);
    setPlatformModalOpen(true);
    setIsModalOpen(true);
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
        
        // Refresh platform status after successful save
        const statusRes = await axiosInstance.get("/platform/get-user-platforms");
        setPlatformStatusList(statusRes.data.platforms || []);
        
        setTimeout(() => {
          setPlatformModalOpen(false);
          setIsModalOpen(false);
          setSelectedPlatform(null);
        }, 1000);
      } else {
        toast.error("Failed to save credentials.");
      }
    } catch (error) {
      console.error("Error saving platform credentials:", error);
      toast.error("Error saving platform credentials.");
    }
  };

  // Filtered posts based on platformFilter
  const filteredPosts = platformFilter
    ? posts.filter((post) => post.platforms?.includes(platformFilter))
    : posts;

  // Handle platform filter toggle
  const togglePlatformFilter = (platform) => {
    setPlatformFilter((prev) => (prev === platform ? null : platform));
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); // Add new post at the top
  };

  return (
    <div className="flex flex-col gap-1  ">

      {/* Platform Status Display with Improved Status Indicators */}
      <div className="flex gap-4 px-4 pb-1  border-b flex-wrap">
   
        {platforms.map(({ key, icon, color, name }) => {
          const status = platformStatusList.find(p => p.platformName === key);
          const isValid = status?.isValid === true;
          const hasCredentials = status !== undefined; // Check if platform exists in the list

          return (
            <button
              key={key}
              onClick={() => handlePlatformClick(key)}
              className={`capitalize border !bg-accent !px-2.5 !py-1 !rounded-full transition flex items-center gap-3 ${
                platformFilter === key ? "bg-blue-100 border-blue-500" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="relative">
                <div className={`${color} p-1.5 rounded-full flex items-center justify-center text-white`}>
                  {icon}
                </div>
                
                {/* Status indicator */}
                {hasCredentials && (
                  <div className="absolute -top-1 -right-1">
                    {isValid ? (
                      // Green blinking dot for valid platforms
                      <div className="h-3 w-3 bg-green-500 border-2 border-white rounded-full animate-pulse shadow-lg">
                        <div className="h-full w-full bg-green-400 rounded-full animate-ping"></div>
                      </div>
                    ) : (
                      // Red solid dot for invalid platforms
                      <div className="h-3 w-3 bg-red-500 border-2 border-white rounded-full shadow-lg">
                        <div className="h-full w-full bg-red-400 rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-xs">{name}</span>
                {hasCredentials && (
                  <span className={`text-[10px] italic ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {isValid ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>





      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Get Post Modal */}
      <GetPostModal
        onEdit={(post) => {
          setSelectedPost(post);
          setIsEditModalOpen(true);
        }}
        postsData={posts}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        onPostCreated={(newPost) => {
          if (newPost && newPost._id) {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
          }
        }}
      />

      {/* Platform Credentials Modal */}
      {isModalOpen && (
        <>
          {console.log("Modal should open for platform:", selectedPlatform)}
          <PlatformCredentialsModal
            platform={selectedPlatform}
            onClose={() => {
              setIsModalOpen(false);
              setPlatformModalOpen(false);
              setSelectedPlatform(null);
            }}
            onSave={handleSavePlatformCredentials}
          />
        </>
      )}

      {/* Edit Post Modal */}
      {isEditModalOpen && (
        <EditPostModal
          isOpen={isEditModalOpen}
          setIsOpen={setIsEditModalOpen}
          post={selectedPost}
          onPostUpdated={(updatedPost) => {
            setPosts((prevPosts) =>
              prevPosts.map((post) =>
                post._id === updatedPost._id ? updatedPost : post
              )
            );
          }}
        />
      )}

      {/* Delete Post Modal */}
      {deleteModalOpen && (
        <DeletePostModal
          isOpen={deleteModalOpen}
          setIsOpen={setDeleteModalOpen}
          postId={selectedPostId}
          onPostDeleted={(deletedPostId) => {
            setPosts((prevPosts) =>
              prevPosts.filter((post) => post._id !== deletedPostId)
            );
          }}
        />
      )}
    </div>
  );
}


