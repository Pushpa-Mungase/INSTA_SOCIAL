
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EditPostModal({
  postId,
  isOpen,
  setIsOpen,
  post,
  onUpdated,
}) {
  const [updatedPost, setUpdatedPost] = useState({
    title: "",
    content: "",
    platforms: [],
    scheduledFor: "",
    existingMedia: [],
    newImageFiles: [],
    newVideoFiles: [],
  });

  const [userPlatforms, setUserPlatforms] = useState([]);

  // useEffect(() => {
  //   // Fetch user's platforms
  //   const fetchPlatforms = async () => {
  //     try {
  //       const response = await axiosInstance.get("/platforms");
  //       setUserPlatforms(response.data.platforms || []);
  //     } catch (error) {
  //       console.error("Error fetching platforms:", error);
  //     }
  //   };

  //   fetchPlatforms();
  // }, []);

  useEffect(() => {
    if (post) {
      setUpdatedPost({
        title: post.title || "",
        content: post.content || post.description || "",
        platforms: post.platforms || [],
        scheduledFor: post.scheduledFor
          ? new Date(post.scheduledFor).toISOString().slice(0, 16)
          : "",
        existingMedia: post.media || [],
        newImageFiles: [],
        newVideoFiles: [],
      });
    }
  }, [post]);

  const handlePlatformToggle = (platformId) => {
    setUpdatedPost((prev) => {
      const platforms = prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId];
      return { ...prev, platforms };
    });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    setUpdatedPost((prev) => ({ ...prev, [type]: files }));
  };

  const handleUpdatePost = async () => {
    try {
      const formData = new FormData();
      formData.append("title", updatedPost.title);
      formData.append("content", updatedPost.content);
      formData.append("scheduledFor", updatedPost.scheduledFor);
      updatedPost.platforms.forEach((p) =>
        formData.append("selectedPlatformIds[]", p)
      );

      updatedPost.newImageFiles.forEach((file) =>
        formData.append("media", file)
      );
      updatedPost.newVideoFiles.forEach((file) =>
        formData.append("media", file)
      );

      const response = await axiosInstance.put(
        `/post/update-scheduled-post/${postId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

     if (
  response.data?.success==true  
) {
  alert("Post updated successfully!");
  onUpdated();
  setIsOpen(false);
}
    } catch (error) {
      console.error(
        "Error updating post:",
        error.response?.data || error.message
      );
      alert("Failed to update post.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Scheduled Post</DialogTitle>
          <DialogDescription>
            Modify the post, change media, and save your updates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Post Title"
            value={updatedPost.title}
            onChange={(e) =>
              setUpdatedPost((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Post Content"
            value={updatedPost.content}
            onChange={(e) =>
              setUpdatedPost((prev) => ({ ...prev, content: e.target.value }))
            }
            className="w-full border p-2 rounded"
            rows={4}
          />

         

          <input
            type="datetime-local"
            value={updatedPost.scheduledFor}
            onChange={(e) =>
              setUpdatedPost((prev) => ({
                ...prev,
                scheduledFor: e.target.value,
              }))
            }
            className="w-full border p-2 rounded"
          />

          {/* Show existing media (optional thumbnails) */}
          {updatedPost.existingMedia?.length > 0 && (
            <div>
              <p className="font-medium mb-1">Existing Media</p>
              <div className="grid grid-cols-2 gap-3">
                {updatedPost.existingMedia.map((url, index) => (
                  <div key={index} className="border rounded overflow-hidden">
                    {url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                      <img
                        src={url}
                        alt="Media"
                        className="w-full h-24 object-cover"
                      />
                    ) : (
                      <video
                        src={url}
                        controls
                        className="w-full h-24 object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload new media */}
          <div>
            <label className="block font-medium mb-1">Add New Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileChange(e, "newImageFiles")}
              className="block w-full text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Add New Videos</label>
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleFileChange(e, "newVideoFiles")}
              className="block w-full text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            className="!bg-blue-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleUpdatePost}
          >
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}






