import React, { useState, useEffect } from "react";
import apiUrls from "../utils/apiUrls";
import axiosInstance from "../utils/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreatePostModal({ isOpen, setIsOpen, onPostCreated }) {
  const [newPost, setNewPost] = useState({
    content: "",
    platforms: [],
    scheduledFor: "",
    imageFiles: [],
    videoFiles: [],
  });

  const [availablePlatforms, setAvailablePlatforms] = useState([]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await axiosInstance.get(
          "/platform/get-user-platforms"
        );
        setAvailablePlatforms(response.data.platforms || []);
      } catch (err) {
        console.error("Failed to fetch platforms", err);
      }
    };

    if (isOpen) {
      fetchPlatforms();
    }
  }, [isOpen]);

  const handlePlatformToggle = (platformId) => {
    setNewPost((prev) => {
      const platforms = prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId];
      return { ...prev, platforms };
    });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setNewPost((prev) => ({
      ...prev,
      [type]: files,
    }));
  };

  const handleCreatePost = async () => {
    if (newPost.platforms.length === 0) {
      alert("Please select at least one platform.");
      return;
    }
    if (!newPost.scheduledFor) {
      alert("Please select a scheduled date and time.");
      return;
    }

    try {
      const formData = new FormData();
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

      newPost.platforms.forEach((id) =>
        formData.append("selectedPlatformIds[]", id)
      );
    //   formData.append("createdBy", localStorage.getItem("userId"));
    //   newPost.imageFiles.forEach((file) => formData.append("media", file));
    //   newPost.videoFiles.forEach((file) => formData.append("media", file));




      if (selectedMediaType === "image") {
        newPost.imageFiles.forEach((file) =>
          formData.append("media", file)
        );
      } else if (selectedMediaType === "video") {
        newPost.videoFiles.forEach((file) =>
          formData.append("media", file)
        );
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
        content: "",
        platforms: [],
        scheduledFor: "",
        imageFiles: [],
        videoFiles: [],
      });
      setIsOpen(false);

      if (onPostCreated) onPostCreated(res.data.post || res.data);
    } catch (err) {
      console.error("Error creating post", err);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="!text-xl font-semibold">
            Create Scheduled Post
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Fill out all post details below.
          </DialogDescription>
        </DialogHeader>

          <div className="space-y-5">
          <input type="text"
            placeholder="Write your post title here..."
            value={newPost.title}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
            className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
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
            <div className="flex gap-3 flex-wrap">
              {availablePlatforms.map((platform) => (
                <button
                  key={platform._id}
                  type="button"
                  onClick={() => handlePlatformToggle(platform._id)}
                  className={`px-4 py-2 rounded-full border transition ${
                    newPost.platforms.includes(platform._id)
                      ? "!bg-blue-600 text-white border-blue-600"
                      : "!bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {platform.platformName.charAt(0).toUpperCase() +
                    platform.platformName.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Schedule Date & Time
            </label>
            {/* <input
              type="datetime-local"
              value={newPost.scheduledFor}
              onChange={(e) =>
                setNewPost((prev) => ({
                  ...prev,
                  scheduledFor: e.target.value,
                }))
              }
              className="!w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}

            <input
              type="datetime-local"
              step="1800" // <-- 30 minutes step
              value={newPost.scheduledFor}
              onChange={(e) =>
                setNewPost((prev) => ({
                  ...prev,
                  scheduledFor: e.target.value,
                }))
              }
              className="!w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, "imageFiles")}
              className="!block w-full text-sm text-gray-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileChange(e, "videoFiles")}
              className="!block w-full text-sm text-gray-700 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={handleCreatePost}
            className="!bg-green-600 hover:bg-green-700 transition text-white font-medium px-6 py-2 rounded-lg mt-4"
          >
            Schedule Post
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}