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
import { Calendar, Clock, Image, Video, X, Upload, Sparkles, Eye } from "lucide-react";
import { FaTwitter, FaYoutube } from "react-icons/fa";

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

  // --- NEW: auto-select platforms based on createType ---
  useEffect(() => {
    if (!isOpen) return;
    if (createType === "meta") {
      setNewPost((prev) => ({
        ...prev,
        platforms: ["facebook", "instagram", "telegram", "linkedin"],
      }));
    } else if (createType === "youtube") {
      setNewPost((prev) => ({
        ...prev,
        platforms: ["youtube"],
      }));
    } else if (createType === "twitter") {
      setNewPost((prev) => ({
        ...prev,
        platforms: ["twitter"],
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

  const getISTDate = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 5.5 * 60 * 60 * 1000);
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setNewPost((prev) => ({
      ...prev,
      [type]: files,
    }));
  };

  // --- NEW: handle meta multipost add/remove ---
  const handleAddMetaPost = () => {
    setMetaPosts((prev) => [...prev, { title: "", content: "", imageFiles: [], videoFiles: [] }]);
  };
  const handleRemoveMetaPost = (idx) => {
    setMetaPosts((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleMetaPostChange = (idx, field, value) => {
    setMetaPosts((prev) =>
      prev.map((post, i) =>
        i === idx ? { ...post, [field]: value } : post
      )
    );
  };
  const handleMetaFileChange = (idx, type, files) => {
    setMetaPosts((prev) =>
      prev.map((post, i) =>
        i === idx ? { ...post, [type]: files } : post
      )
    );
  };

  const handleCreatePost = async () => {
    // ...existing validation...
    if (createType === "meta") {
      // Validate all meta posts
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
        // Send each meta post as a separate request (or batch if supported)
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

          // Send selectedPlatformName as a JSON string array
          formData.append("selectedPlatformName", JSON.stringify(["facebook", "instagram", "telegram", "linkedin"]));

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
            timeout: 30000 // 30 second timeout
          });
        }
        toast.success("Meta posts scheduled successfully! 🎉");
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

        console.log("Sending post data:", {
          title: newPost.title,
          content: newPost.content,
          platforms: newPost.platforms,
          scheduledFor: scheduledDate.toISOString(),
          mediaType: selectedMediaType,
          mediaCount: selectedMediaType === "image" ? newPost.imageFiles.length : newPost.videoFiles.length
        });

        await axiosInstance.post(apiUrls.createScheduledPost, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000 // 30 second timeout
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

  const getPlatformIcon = (platformName) => {
    const name = platformName.toLowerCase();
    switch (name) {
      case 'facebook': return '📘';
      case 'instagram': return '📷';
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      case 'youtube': return '📺';
      case 'tiktok': return '🎵';
      default: return '🌐';
    }
  };

  const getPlatformStyle = (platformName) => {
    const name = platformName.toLowerCase();
    switch (name) {
      case 'facebook': return 'from-blue-600 to-blue-700 border-blue-200';
      case 'instagram': return 'from-pink-600 to-purple-600 border-pink-200';
      case 'twitter': return 'from-sky-500 to-sky-600 border-sky-200';
      case 'linkedin': return 'from-blue-700 to-blue-800 border-blue-200';
      case 'youtube': return 'from-red-600 to-red-700 border-red-200';
      case 'tiktok': return 'from-black to-gray-800 border-gray-200';
      default: return 'from-gray-500 to-gray-600 border-gray-200';
    }
  };

  // Filter by platform name instead of ID
  const selectedPlatformObjects = availablePlatforms.filter(platform =>
    newPost.platforms.includes(platform.platformName)
  );

  // --- MODIFIED: Render different forms based on createType ---
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="!max-w-7xl !w-[95vw] !h-[95vh] mx-auto rounded-3xl border-0 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {createType === "meta" && "Create Meta Post"}
                  {createType === "youtube" && "Create YouTube Post"}
                  {createType === "twitter" && "Create Twitter Post"}
                </DialogTitle>
                <DialogDescription className="text-gray-500 mt-1">
                  {createType === "meta" && "Schedule posts for Facebook, Instagram, Telegram, and LinkedIn. Add multiple posts if needed."}
                  {createType === "youtube" && "Schedule a YouTube video post. Only title and video required."}
                  {createType === "twitter" && "Schedule a Twitter post. Only content required."}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 grid grid-cols-12 gap-6 p-6 max-h-[calc(95vh-200px)] overflow-y-auto">
          {/* --- META FORM --- */}
          {createType === "meta" && (
            <div className="col-span-7 flex flex-col space-y-4">
              {metaPosts.map((post, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-gray-800">
                      Meta Post #{idx + 1}
                    </h3>
                    {metaPosts.length > 1 && (
                      <button
                        onClick={() => handleRemoveMetaPost(idx)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Title (optional)"
                    value={post.title}
                    onChange={e => handleMetaPostChange(idx, "title", e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                  />
                  <textarea
                    placeholder="Content"
                    value={post.content}
                    onChange={e => handleMetaPostChange(idx, "content", e.target.value)}
                    className="w-full p-2 mb-2 border rounded"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => handleMetaFileChange(idx, "imageFiles", Array.from(e.target.files))}
                      className="flex-1 text-xs"
                    />
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={e => handleMetaFileChange(idx, "videoFiles", Array.from(e.target.files))}
                      className="flex-1 text-xs"
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {post.imageFiles.length > 0 && `${post.imageFiles.length} image(s) selected. `}
                    {post.videoFiles.length > 0 && `${post.videoFiles.length} video(s) selected.`}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMetaPost}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-sm w-fit"
              >
                + Add Another Post
              </button>
              {/* Schedule Section */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                  Schedule
                </h3>
                <input
                  type="datetime-local"
                  min={minDateTime}
                  value={newPost.scheduledFor}
                  onChange={e => setNewPost(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 text-sm"
                />
                {newPost.scheduledFor && (
                  <div className="mt-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                    📅 {new Date(newPost.scheduledFor).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* --- YOUTUBE FORM --- */}
          {createType === "youtube" && (
            <div className="col-span-7 flex flex-col space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <input
                  type="text"
                  placeholder="YouTube Video Title"
                  value={newPost.title}
                  onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 mb-3 border rounded"
                />
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={e => setNewPost(prev => ({ ...prev, videoFiles: Array.from(e.target.files) }))}
                  className="w-full text-xs"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newPost.videoFiles.length > 0 && `${newPost.videoFiles.length} video(s) selected.`}
                </div>
              </div>
              {/* Schedule Section */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                  Schedule
                </h3>
                <input
                  type="datetime-local"
                  min={minDateTime}
                  value={newPost.scheduledFor}
                  onChange={e => setNewPost(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 text-sm"
                />
                {newPost.scheduledFor && (
                  <div className="mt-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                    📅 {new Date(newPost.scheduledFor).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* --- TWITTER FORM --- */}
          {createType === "twitter" && (
            <div className="col-span-7 flex flex-col space-y-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <textarea
                  placeholder="What's happening?"
                  value={newPost.content}
                  onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 border rounded"
                  rows={4}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newPost.content.length} characters
                </div>
              </div>
              {/* Schedule Section */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                  Schedule
                </h3>
                <input
                  type="datetime-local"
                  min={minDateTime}
                  value={newPost.scheduledFor}
                  onChange={e => setNewPost(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 text-sm"
                />
                {newPost.scheduledFor && (
                  <div className="mt-2 text-xs text-purple-600 bg-purple-50 p-2 rounded-lg">
                    📅 {new Date(newPost.scheduledFor).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
          {/* --- PREVIEW COLUMN --- */}
          <div className="col-span-5 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-indigo-500" />
                Post Preview
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {/* --- META PREVIEW --- */}
              {createType === "meta" && (
                <div className="space-y-4">
                  {metaPosts.map((post, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                      <div className="p-3">
                        <div className="font-semibold text-gray-900 mb-1">Meta Post #{idx + 1}</div>
                        {post.title && <div className="font-medium text-gray-900 mb-1">{post.title}</div>}
                        {post.content && <div className="text-gray-800 mb-2 whitespace-pre-wrap">{post.content}</div>}
                        {post.imageFiles.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {post.imageFiles.map((file, i) => (
                              <img
                                key={i}
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${i + 1}`}
                                className="object-cover h-20 w-20 rounded"
                              />
                            ))}
                          </div>
                        )}
                        {post.videoFiles.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {post.videoFiles.map((file, i) => (
                              <video
                                key={i}
                                src={URL.createObjectURL(file)}
                                controls
                                className="object-cover h-20 w-20 rounded"
                              />
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Platforms: Facebook, Instagram, Telegram, LinkedIn
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* --- YOUTUBE PREVIEW --- */}
              {createType === "youtube" && (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaYoutube className="text-[#FF0000]" size={20} />
                      <span className="font-semibold text-gray-900">YouTube</span>
                    </div>
                    {newPost.title && <div className="font-medium text-gray-900 mb-2">{newPost.title}</div>}
                    {newPost.videoFiles.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {newPost.videoFiles.map((file, i) => (
                          <video
                            key={i}
                            src={URL.createObjectURL(file)}
                            controls
                            className="object-cover h-32 w-32 rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* --- TWITTER PREVIEW --- */}
              {createType === "twitter" && (
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FaTwitter className="text-[#1DA1F2]" size={20} />
                      <span className="font-semibold text-gray-900">Twitter</span>
                    </div>
                    {newPost.content && <div className="text-gray-800 whitespace-pre-wrap">{newPost.content}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Footer */}
        <DialogFooter className="p-6 pt-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-gray-500">
              {(
                (createType === "meta" && metaPosts.length > 0 && newPost.scheduledFor && isScheduleValid) ||
                (createType === "youtube" && newPost.title && newPost.videoFiles.length > 0 && newPost.scheduledFor && isScheduleValid) ||
                (createType === "twitter" && newPost.content && newPost.scheduledFor && isScheduleValid)
              ) ? (
                <span className="text-green-600">✅ Ready to schedule!</span>
              ) : (
                <span>
                  {newPost.scheduledFor && !isScheduleValid
                    ? "Please select a time at least 30 minutes from now"
                    : "Complete all fields to schedule your post"}
                </span>
              )}
            </div>
            <button
              onClick={handleCreatePost}
              disabled={
                isLoading ||
                !isScheduleValid ||
                (createType === "meta" && (!metaPosts.length || !newPost.scheduledFor)) ||
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