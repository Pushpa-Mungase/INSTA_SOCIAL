import React, { useState, useEffect } from "react";
import apiUrls from "../../utils/apiUrls";
import axiosInstance from "../../utils/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {  Sparkles} from "lucide-react";
import { FaTwitter, FaYoutube, FaFacebook, FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa";
import PostPreviewPanel from "../../components/ui/customComponents/postPreview";
import { YouTubeForm } from "../../components/ui/customComponents/createPostpart/youtubeAddForm";
import { TwitterForm } from "../../components/ui/customComponents/createPostpart/twitterAddForm";
import { MetaForm } from "../../components/ui/customComponents/createPostpart/metaAddForm";

function getMinDateTimeIST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 60 * 60 * 1000);
  const year = ist.getFullYear();
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  const date = String(ist.getDate()).padStart(2, '0');
  const hours = String(ist.getHours()).padStart(2, '0');
  const minutes = String(ist.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${date}T${hours}:${minutes}`;
}

export default function CreatePostModal({ isOpen, setIsOpen, onPostCreated, createType }) {
  // --- NEW: meta multipost state ---
  const [metaPosts, setMetaPosts] = useState([
    { title: "", content: "", imageFiles: [], videoFiles: [] }
  ]);
  // ...existing state...
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    platforms: [],
    scheduledFor: "",
    imageFiles: [],
    videoFiles: [],
    UserPlatformNames: [],
  });

  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [UserPlatformNames, setUserPlatformNames] = useState([]);
  const [minDateTime, setMinDateTime] = useState(getMinDateTimeIST());
  const [isLoading, setIsLoading] = useState(false);
  const [platformObjectId, setPlatformObjectId] = useState(""); // <-- store parent object id

  const isScheduleValid = newPost.scheduledFor
    ? new Date(newPost.scheduledFor).getTime() - new Date().getTime() >= 30 * 60 * 1000
    : false;

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDateTime(getMinDateTimeIST());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        // Use the endpoint that returns the parent object id and platforms array
        const { data } = await axiosInstance.get("/platform/get-user-platformsAllData");
        // Set parent object id
        if (data?.data?._id) setPlatformObjectId(data.data._id);
        // Only show valid platforms
        const validPlatforms = data.data.platforms?.filter(platform => platform.isValid === true) || [];
        setAvailablePlatforms(validPlatforms);
      } catch (err) {
        console.error("Failed to fetch platforms", err);
      }
    };

    if (isOpen) {
      fetchPlatforms();
    }
  }, [isOpen]);

  
  useEffect(() => {
    if (!isOpen) return;
    if (createType === "youtube") {
      setNewPost((prev) => ({
        ...prev,
        platforms: ["youtube"],
      }));
    } else if (createType === "twitter") {
      setNewPost((prev) => ({
        ...prev,
        platforms: ["twitter"],
      }));
    } else if (createType === "meta") {
      // Reset platforms for meta - let user choose
      setNewPost((prev) => ({
        ...prev,
        platforms: [],
      }));
    }
    // Reset metaPosts for meta
    if (createType === "meta") {
      setMetaPosts([{ title: "", content: "", imageFiles: [], videoFiles: [] }]);
    }
  }, [isOpen, createType]);

  const handlePlatformToggle = (platformName) => {
    setNewPost((prev) => {
      const selectedNames = prev.platforms || [];
      const isSelected = selectedNames.includes(platformName);
      return {
        ...prev,
        platforms: isSelected
          ? selectedNames.filter((name) => name !== platformName)
          : [...selectedNames, platformName],
      };
    });
  };
  const handleMetaPostChange = (idx, field, value) => {
    setMetaPosts((prev) =>
      prev.map((post, i) =>
        i === idx ? { ...post, [field]: value } : post
      )
    );
  };
  const handleMetaFileChange = (idx, type, files, action = 'replace') => {
  setMetaPosts(prev =>
    prev.map((post, i) =>
      i === idx
        ? {
            ...post,
            [type]: action === 'replace' 
              ? files 
              : [...post[type], ...files] // Merge for additions
          }
        : post
    )
  );
};

  // Helper function to get platform icon
  const getPlatformIcon = (platformName) => {
    const name = platformName.toLowerCase();
    switch (name) {
      case 'facebook': return <FaFacebook className="w-5 h-5" />;
      case 'instagram': return <FaInstagram className="w-5 h-5" />;
      case 'telegram': return <FaTelegram className="w-5 h-5" />;
      case 'linkedin': return <FaLinkedin className="w-5 h-5" />;
      case 'twitter': return <FaTwitter className="w-5 h-5" />;
      case 'youtube': return <FaYoutube className="w-5 h-5" />;
      default: return '🌐';
    }
  };

  // Helper function to get platform colors
  const getPlatformColors = (platformName) => {
    const name = platformName.toLowerCase();
    switch (name) {
      case 'facebook': return 'bg-blue-500 border-blue-300 text-white';
      case 'instagram': return 'bg-gradient-to-r from-pink-500 to-purple-500 border-pink-300 text-white';
      case 'telegram': return 'bg-blue-400 border-blue-300 text-white';
      case 'linkedin': return 'bg-blue-700 border-blue-500 text-white';
      case 'twitter': return 'bg-sky-500 border-sky-300 text-white';
      case 'youtube': return 'bg-red-500 border-red-300 text-white';
      default: return 'bg-gray-500 border-gray-300 text-white';
    }
  };

  const handleCreatePost = async () => {
    if (createType === "meta") {
     
      for (const post of metaPosts) {
        if (!post.content.trim() && !post.title.trim()) {
          toast.error("Please add content or title for all posts.");
          return;
        }
      }
    } else if (createType === "youtube") {
      if (!newPost.title.trim()) {
        toast.error("Please add a title for YouTube post.");
        return;
      }
      if (!newPost.videoFiles.length) {
        toast.error("Please upload a video for YouTube post.");
        return;
      }
    } else if (createType === "twitter") {
      if (!newPost.content.trim()) {
        toast.error("Please add content for Twitter post.");
        return;
      }
    }
    if (!newPost.platforms || newPost.platforms.length === 0) {
      toast.error("Please select at least one platform.");
      return;
    }
    if (!newPost.scheduledFor) {
      toast.error("Please select a scheduled date and time.");
      return;
    }

    setIsLoading(true);
    try {
      if (createType === "meta") {
       
        for (const post of metaPosts) {
          const formData = new FormData();
          formData.append("title", post.title || "");
          formData.append("content", post.content || "");

          // Format date as DD/MM/YYYY HH:mm
          const scheduledDate = new Date(newPost.scheduledFor);
          const day = String(scheduledDate.getDate()).padStart(2, '0');
          const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
          const year = scheduledDate.getFullYear();
          const hours = String(scheduledDate.getHours()).padStart(2, '0');
          const minutes = String(scheduledDate.getMinutes()).padStart(2, '0');
          const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
          formData.append("scheduledFor", formattedDate);

          // Send platformObjectId as a string
          formData.append("platformObjectId", platformObjectId);

          // Send selectedPlatformName as a JSON string array (use selected platforms)
          formData.append("selectedPlatformName", JSON.stringify(newPost.platforms));

          // Get user ID from localStorage or provide fallback
          const userId = localStorage.getItem("userId") || "default-user";
          formData.append("createdBy", userId);

          // Add media files
          post.imageFiles.forEach((file) => {
            formData.append(`media`, file);
          });
          post.videoFiles.forEach((file) => {
            formData.append(`media`, file);
          });

          await axiosInstance.post(apiUrls.createScheduledPost, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            timeout: 60000 // 60 second timeout
          });
        }
        toast.success("Posts scheduled successfully! 🎉");
      } else {
        const formData = new FormData();
        formData.append("title", newPost.title || "");
        formData.append("content", newPost.content || "");

        // Format date as DD/MM/YYYY HH:mm
        const scheduledDate = new Date(newPost.scheduledFor);
        const day = String(scheduledDate.getDate()).padStart(2, '0');
        const month = String(scheduledDate.getMonth() + 1).padStart(2, '0');
        const year = scheduledDate.getFullYear();
        const hours = String(scheduledDate.getHours()).padStart(2, '0');
        const minutes = String(scheduledDate.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        formData.append("scheduledFor", formattedDate);

        // Send platformObjectId as a string
        formData.append("platformObjectId", platformObjectId);

        // Send selectedPlatformName as a JSON string array
        formData.append("selectedPlatformName", JSON.stringify(newPost.platforms));

        // Get user ID from localStorage or provide fallback
        const userId = localStorage.getItem("userId") || "default-user";
        formData.append("createdBy", userId);

        // Add media files
        if (createType === "youtube") {
          newPost.videoFiles.forEach((file) => formData.append("media", file));
        } else {
          newPost.imageFiles.forEach((file) => {
            formData.append(`media`, file);
          });
          newPost.videoFiles.forEach((file) => {
            formData.append(`media`, file);
          });
        }

        await axiosInstance.post(apiUrls.createScheduledPost, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000 // 60 second timeout
        });

        toast.success("Post scheduled successfully! 🎉");
      }
      // Reset form
      setNewPost({
        title: "",
        content: "",
        platforms: [],
        scheduledFor: "",
        imageFiles: [],
        videoFiles: [],
        UserPlatformNames: [],
      });
      setSelectedMediaType("");
      setUserPlatformNames([]);
      setIsOpen(false);

      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error("Error creating post:", err);

      if (err.response) {
        // Server responded with error status
        const errorMessage = err.response.data?.message || err.response.data?.error || "Server error occurred";
        toast.error(`Failed to create post: ${errorMessage}`);
        console.error("Server error:", err.response.data);
      } else if (err.request) {
        // Request was made but no response
        toast.error("Network error. Please check your connection and try again.");
        console.error("Network error:", err.request);
      } else {
        // Something else happened
        toast.error("Failed to create post. Please try again.");
        console.error("Error:", err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Get available meta platforms
  const metaPlatforms = ["facebook", "instagram", "telegram", "linkedin"];
  const availableMetaPlatforms = availablePlatforms.filter(platform =>
    metaPlatforms.includes(platform.platformName.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="!max-w-5xl !w-[95vw] !h-[90vh] mx-auto rounded-3xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {createType === "meta" && "Create  Post"}
                  {createType === "youtube" && "Create YouTube Post"}
                  {createType === "twitter" && "Create Twitter Post"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-1">
                  {createType === "meta" && "Schedule posts for your connected social media platforms. Select which platforms to post to."}
                  {createType === "youtube" && "Schedule a YouTube video post. Only title and video required."}
                  {createType === "twitter" && "Schedule a Twitter post. Only content required."}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 grid grid-cols-12 gap-6 p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
       
          {createType === "meta" && (
            <MetaForm
              availableMetaPlatforms={availableMetaPlatforms}
              newPost={newPost}
              metaPosts={metaPosts}
              minDateTime={minDateTime}
              handlePlatformToggle={handlePlatformToggle}
              handleMetaPostChange={handleMetaPostChange}
              handleMetaFileChange={handleMetaFileChange}
              setNewPost={setNewPost}
              getPlatformColors={getPlatformColors}
              getPlatformIcon={getPlatformIcon}
            />
          )}

          {createType === "youtube" && (
            <YouTubeForm
              newPost={newPost}
              minDateTime={minDateTime}
              setNewPost={setNewPost}
            />
          )}

          {createType === "twitter" && (
            <TwitterForm
              newPost={newPost}
              minDateTime={minDateTime}
              setNewPost={setNewPost}
            />
          )}
          {/* --- PREVIEW COLUMN --- */}
          <PostPreviewPanel
            createType={createType}
            metaPosts={metaPosts}
            newPost={newPost}
          />

        </div>
        {/* Footer */}
        <DialogFooter className="p-6 pt-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500">
              {(
                (createType === "meta" && metaPosts.length > 0 && newPost.scheduledFor && isScheduleValid && newPost.platforms.length > 0) ||
                (createType === "youtube" && newPost.title && newPost.videoFiles.length > 0 && newPost.scheduledFor && isScheduleValid) ||
                (createType === "twitter" && newPost.content && newPost.scheduledFor && isScheduleValid)
              ) ? (
                <span className="text-green-600">✅ Ready to schedule!</span>
              ) : (
                <span>
                  {newPost.scheduledFor && !isScheduleValid
                    ? "Please select a time at least 30 minutes from now"
                    : createType === "meta" && newPost.platforms.length === 0
                      ? "Please select at least one platform"
                      : "Complete all fields to schedule your post"}
                </span>
              )}
            </div>
            <button
              onClick={handleCreatePost}
              disabled={
                isLoading ||
                !isScheduleValid ||
                (createType === "meta" && (!metaPosts.length || !newPost.scheduledFor || newPost.platforms.length === 0)) ||
                (createType === "youtube" && (!newPost.title || !newPost.videoFiles.length || !newPost.scheduledFor)) ||
                (createType === "twitter" && (!newPost.content || !newPost.scheduledFor))
              }
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold px-6 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scheduling...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Schedule Post</span>
                </div>
              )}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}