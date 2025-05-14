

import { useState } from "react";

import apiUrls from "../utils/apiUrls";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const platformsList = ["facebook", "twitter", "linkedin", "instagram"];

export default function CreatePostModal({ isOpen, setIsOpen }) {
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    platforms: [],
    scheduledFor: "",
  });

  const handleCreatePost = async () => {
    try {
      const payload = {
        createdBy: localStorage.getItem("userId"),
        content: newPost.description,
        platforms: newPost.platforms,
        scheduledFor: newPost.scheduledFor,
        imageUrls: [],
        videoUrls: [],
      };
      const res = await axiosInstance.post(apiUrls.createScheduledPost, payload);
      console.log("Post created successfully", res.data);

      // Reset form
      setNewPost({
        title: "",
        description: "",
        platforms: [],
        scheduledFor: "",
      });

      setIsOpen(false);
    } catch (err) {
      console.error("Error creating post", err);
    }
  };

  const handlePlatformToggle = (platform) => {
    setNewPost((prev) => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>Fill out the form below.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post Title"
            value={newPost.title}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Post Description"
            value={newPost.description}
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full border p-2 rounded"
          />

          <div className="flex gap-2 flex-wrap">
            {platformsList.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => handlePlatformToggle(platform)}
                className={`px-3 py-1 border rounded-full ${
                  newPost.platforms.includes(platform)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>

          <input
            type="datetime-local"
            value={newPost.scheduledFor}
            onChange={(e) =>
              setNewPost((prev) => ({
                ...prev,
                scheduledFor: e.target.value,
              }))
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <DialogFooter>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleCreatePost}
          >
            Create Post
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

