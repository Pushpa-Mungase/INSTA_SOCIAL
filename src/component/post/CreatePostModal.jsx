
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

function getMinDateTimeIST() {
  const now = new Date();

  // Convert to IST (UTC + 5:30)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 60 * 60 * 1000);

  const year = ist.getFullYear();
  const month = String(ist.getMonth() + 1).padStart(2, "0");
  const date = String(ist.getDate()).padStart(2, "0");
  const hours = String(ist.getHours()).padStart(2, "0");
  const minutes = String(ist.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${date}T${hours}:${minutes}`;
}

export default function CreatePostModal({ isOpen, setIsOpen, onPostCreated }) {
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    platformObjectId: "",
    selectedPlatformName: [],
    scheduledFor: "",
    imageFiles: [],
    videoFiles: [],
  });

  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [selectedMediaType, setSelectedMediaType] = useState(""); // "image" or "video"
  const [UserPlatformNames, setUserPlatformNames] = useState([]);
  const [platformId, setPlatformId] = useState("");
  const [minDateTime, setMinDateTime] = useState(getMinDateTimeIST());
  const [isValidScheduleTime, setIsValidScheduleTime] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDateTime(getMinDateTimeIST());
    }, 60000); // refresh every 1 minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/platform/get-user-platformsAllData"
        );
        console.log("platforms:", data);
        console.log("platformsID:", data.data._id);
        console.log("platformsIDInner:", data.data.platforms);

        data?.data?._id && setPlatformId(data?.data?._id);
        // Filter platforms to only show those where isValid is true
        const validPlatforms = data.data.platforms?.filter(platform => platform.isValid === true) || [];
        setAvailablePlatforms(validPlatforms);
        console.log("Available platforms:", validPlatforms);
      } catch (err) {
        console.error("Failed to fetch platforms", err);
      }
    };

    if (isOpen) {
      fetchPlatforms();
    }
  }, [isOpen]);

  const handlePlatformToggle = (platformName) => {
    setNewPost((prev) => {
      const selectedNames = prev.selectedPlatformName || [];
      const isSelected = selectedNames.includes(platformName);

      return {
        ...prev,
        selectedPlatformName: isSelected
          ? selectedNames.filter((name) => name !== platformName)
          : [...selectedNames, platformName],
      };
    });
  };

  const [showOptions, setShowOptions] = useState(true);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);

    if (type === "image") {
      setNewPost((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...files],
        videoFiles: [], // clear videos if images added
      }));
      setSelectedMediaType("image");
    } else if (type === "video") {
      setNewPost((prev) => ({
        ...prev,
        videoFiles: [...prev.videoFiles, ...files],
        imageFiles: [], // clear images if videos added
      }));
      setSelectedMediaType("video");
    }
  };

  const handleFileSelect = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.multiple = true;
    input.onchange = (e) => {
      if (e.target.files.length > 0) {
        handleFileChange(e, type);
      }
    };
    input.click();
  };

  // Remove specific image
  const removeImage = (indexToRemove) => {
    setNewPost((prev) => ({
      ...prev,
      imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove),
    }));
    
    // If no images left, reset media type
    if (newPost.imageFiles.length === 1) {
      setSelectedMediaType("");
    }
  };

  // Remove specific video
  const removeVideo = (indexToRemove) => {
    setNewPost((prev) => ({
      ...prev,
      videoFiles: prev.videoFiles.filter((_, index) => index !== indexToRemove),
    }));
    
    // If no videos left, reset media type
    if (newPost.videoFiles.length === 1) {
      setSelectedMediaType("");
    }
  };

  // Clear all media
  const clearAllMedia = () => {
    setNewPost((prev) => ({
      ...prev,
      imageFiles: [],
      videoFiles: [],
    }));
    setSelectedMediaType("");
  };

  const getISTDate = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 5.5 * 60 * 60 * 1000);
  };

  const formatToDateTimeLocal = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const updateMinDateTime = () => {
    const nowIST = getISTDate();
    setMinDateTime(formatToDateTimeLocal(nowIST));
  };

  useEffect(() => {
    updateMinDateTime(); // initial
    const interval = setInterval(updateMinDateTime, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  // Check if scheduled time is valid (at least 30 minutes from now)
  const validateScheduleTime = (scheduledTime) => {
    if (!scheduledTime) {
      setIsValidScheduleTime(false);
      return false;
    }

    const selected = new Date(scheduledTime);
    const istNow = getISTDate();
    const minValidTime = istNow.getTime() + 30 * 60 * 1000; // 30 minutes from now

    const isValid = selected.getTime() >= minValidTime;
    setIsValidScheduleTime(isValid);
    return isValid;
  };

  // Check if create post button should be enabled
  const isCreatePostEnabled = () => {
    return (
      newPost.selectedPlatformName.length > 0 &&
      newPost.scheduledFor &&
      isValidScheduleTime
    );
  };

  const handleCreatePost = async () => {
    if (newPost.selectedPlatformName.length === 0) {
      alert("Please select at least one platform.");
      return;
    }
    if (!newPost.scheduledFor) {
      alert("Please select a scheduled date and time.");
      return;
    }
    if (!isValidScheduleTime) {
      alert("Please select a time at least 30 minutes from now.");
      return;
    }

    console.log(newPost);

    try {
      const formData = new FormData();
      formData.append("title", newPost.title);
      formData.append("content", newPost.content);
      const rawTime = new Date(newPost.scheduledFor);
      const istFormatted = rawTime
        .toLocaleString("en-GB", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(",", "");
      formData.append("scheduledFor", istFormatted);
      formData.append("platformObjectId", platformId);

      formData.append(
        "selectedPlatformName",
        JSON.stringify(newPost.selectedPlatformName)
      );

      formData.append("createdBy", localStorage.getItem("userId"));

      if (selectedMediaType === "image") {
        newPost.imageFiles.forEach((file) => formData.append("media", file));
        console.log("imageFiles:", newPost.imageFiles);
      } else if (selectedMediaType === "video") {
        newPost.videoFiles.forEach((file) => formData.append("media", file));
        console.log("videoFiles:", newPost.videoFiles);
      }

      const res = await axiosInstance.post(
        apiUrls.createScheduledPost,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Post created successfully", res.data);

      setNewPost({
        title: "",
        content: "",
        platformObjectId: "",
        scheduledFor: "",
        imageFiles: [],
        videoFiles: [],
        selectedPlatformName: [],
      });
      setSelectedMediaType("");
      setIsValidScheduleTime(false);
      setIsOpen(false);

      if (onPostCreated) onPostCreated(res.data.post || res.data);
      console.log("res.data.post....", res.data.post);
    } catch (err) {
      console.error("Error creating post", err);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="!text-xl font-semibold">
            Create Scheduled Post
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill out all post details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Write your post title here..."
            value={newPost.title}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
            className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Write your post content here..."
            value={newPost.content}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, content: e.target.value }))
            }
            className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          <div>
            <p className="font-medium mb-2">Select Platforms:</p>
            {availablePlatforms.length === 0 ? (
              <p className="text-gray-500 text-sm">No valid platforms available</p>
            ) : (
              <div className="flex gap-3 flex-wrap">
                {availablePlatforms.map((platform) => (
                  <button
                    key={platform._id}
                    type="button"
                    onClick={() => handlePlatformToggle(platform.platformName)}
                    className={`px-4 py-2 rounded-full border transition ${
                      newPost.selectedPlatformName?.includes(
                        platform.platformName
                      )
                        ? "!bg-blue-600 text-white border-blue-600"
                        : "!bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {platform.platformName.charAt(0).toUpperCase() +
                      platform.platformName.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">
              Schedule Date & Time
            </label>
            <input
              type="datetime-local"
              min={minDateTime}
              value={newPost.scheduledFor}
              onChange={(e) => {
                const selected = new Date(e.target.value);
                const istNow = getISTDate();
                const selectedDate = selected.toISOString().slice(0, 10);
                const nowDate = istNow.toISOString().slice(0, 10);

                if (selectedDate === nowDate) {
                  const minTime = istNow.getTime() + 30 * 60 * 1000;
                  if (selected.getTime() < minTime) {
                    toast.warning(
                      "Please select a time at least 30 minutes from now."
                    );
                    setIsValidScheduleTime(false);
                    setNewPost((prev) => ({
                      ...prev,
                      scheduledFor: e.target.value,
                    }));
                    return;
                  }
                }

                setNewPost((prev) => ({
                  ...prev,
                  scheduledFor: e.target.value,
                }));
                validateScheduleTime(e.target.value);
              }}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {newPost.scheduledFor && !isValidScheduleTime && (
              <p className="text-red-500 text-sm mt-1">
                Please select a time at least 30 minutes from now
              </p>
            )}
          </div>

          {/* Media Upload Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">Media Upload</p>
              {(newPost.imageFiles.length > 0 || newPost.videoFiles.length > 0) && (
                <button
                  onClick={clearAllMedia}
                  className="text-sm text-red-500 hover:text-red-700 transition"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Upload Buttons */}
            {showOptions && (
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleFileSelect("image")}
                  disabled={selectedMediaType === "video"}
                  className={`px-4 py-2 border-2 border-dashed rounded-lg transition flex items-center gap-2 ${
                    selectedMediaType === "video"
                      ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
                      : "border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Images
                </button>
                <button
                  type="button"
                  onClick={() => handleFileSelect("video")}
                  disabled={selectedMediaType === "image"}
                  className={`px-4 py-2 border-2 border-dashed rounded-lg transition flex items-center gap-2 ${
                    selectedMediaType === "image"
                      ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
                      : "border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Upload Videos
                </button>
              </div>
            )}

            {/* Image Preview Grid */}
            {newPost.imageFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Images ({newPost.imageFiles.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {newPost.imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                        />
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                        type="button"
                      >
                        ×
                      </button>
                      {/* File name */}
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Preview */}
            {newPost.videoFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Selected Videos ({newPost.videoFiles.length})
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {newPost.videoFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-40 object-cover"
                          controls
                          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                        />
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeVideo(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                        type="button"
                      >
                        ×
                      </button>
                      {/* File info */}
                      <div className="mt-1">
                        <p className="text-xs text-gray-600 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleCreatePost}
            disabled={!isCreatePostEnabled()}
            className={`font-medium px-6 py-2 rounded-lg mt-4 transition ${
              isCreatePostEnabled()
                ? "!bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                : "!bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Schedule Post
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}