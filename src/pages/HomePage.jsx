import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import GetPostModal from "../component/post/PostView";
import PlatformCredentialsModal from "../component/platform/PlatformCredentialsModal";

import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiTelegram, SiX, SiYoutube } from "react-icons/si";

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
  const { isAuthenticated } = useAuth(); 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [platformStatusList, setPlatformStatusList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [platformFilter, setPlatformFilter] = useState(null); 
  const [loading, setLoading] = useState(true);

  // Fetch platform status on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { view: "login" } });
    }
    const fetchPlatformStatus = async () => {
      try {
        // Use axiosInstance instead of axios to ensure proper base URL and headers
        const res = await axiosInstance.get("/platform/get-user-platforms");
        console.log("platformStatusList:", res.data.platforms);
        setPlatformStatusList(res.data.platforms || []);
      } catch (error) {
        console.error("Error fetching platform status", error);
       toast.error("Failed to fetch platform status", { toastId: "fetch-platform-status-error" });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) { // Only fetch if user is authenticated
      fetchPlatformStatus();
    }
  }, [isAuthenticated]); // Add isAuthenticated as dependency

  // const handlePlatformClick = (platformKey) => {
  //   console.log("Clicked platform:", platformKey);
  //   setSelectedPlatform([platformKey]);
  //   setIsModalOpen(true);
  // };

  const handleSavePlatformCredentials = async (credentials) => {
    
    const url = "{VITE_API_BASE_URL}/api/v1/platform/create-platform";
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


  return (
    <div className="flex flex-col gap-1  ">

      {/* Platform Status Display with Improved Status Indicators */}
      <div className="flex gap-4 px-4 pb-1 border-b flex-wrap">
        {platforms.map(({ key, icon, color, name }) => {
          const status = platformStatusList.find(p => p.platformName === key);
          const isValid = status?.isValid === true;
          const hasCredentials = status !== undefined; // Check if platform exists in the list

          return (
            <button
              key={key}
              // onClick={() => handlePlatformClick(key)}
              className={`capitalize border !bg-accent !px-2.5 !py-1 !rounded-full transition flex items-center gap-3 ${platformFilter === key ? "bg-blue-100 border-blue-500" : "bg-gray-50 hover:bg-gray-100"
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
              setSelectedPlatform(null);
            }}
            onSave={handleSavePlatformCredentials}
          />
        </>
      )}

    </div>
  );
}


