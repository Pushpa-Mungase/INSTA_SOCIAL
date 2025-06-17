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
import toast from "react-hot-toast";

export default function EditPostModal({
  postId,
  isOpen,
  setIsOpen,
  post,
  onUpdated,
}) {
  const isYouTube = post?.selectedPlatformName?.includes("youtube");
  const isTwitter = post?.selectedPlatformName?.includes("twitter");
  const isAutoPlatform = isYouTube || isTwitter;

  const [updatedPost, setUpdatedPost] = useState({
    title: "",
    content: "",
    media: [],
    selectedPlatformName: [],
    removedMediaUrls: "",
    scheduledFor: "",
    existingImages: [],
    existingVideos: [],
  });
function getISTDateTimeLocalString(date) {
  if (!date) return "";
  // Convert to IST (UTC+5:30)
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 60 * 60 * 1000);
  const year = ist.getFullYear();
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  const day = String(ist.getDate()).padStart(2, '0');
  const hours = String(ist.getHours()).padStart(2, '0');
  const minutes = String(ist.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


 // Format date to DD-MM-YYYY HH:mm for API
 
const formatDateTimeForAPI = (date) => {
  if (!date) return "";
  // Convert to IST
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 60 * 60 * 1000);
  const day = String(ist.getDate()).padStart(2, '0');
  const month = String(ist.getMonth() + 1).padStart(2, '0');
  const year = ist.getFullYear();
  const hours = String(ist.getHours()).padStart(2, '0');
  const minutes = String(ist.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};


  // Initialize with post data
  useEffect(() => {
    if (post) {
      const scheduledDate = post.scheduledFor
        ? new Date(post.scheduledFor)
        : new Date();

setUpdatedPost({
  title: isYouTube ? post.title || "" : "",
  content: isYouTube ? "" : post.content || "",
  media: [],
  selectedPlatformName: post.selectedPlatformName || [],
  removedMediaUrls: "",
  scheduledFor: getISTDateTimeLocalString(scheduledDate), // <-- update here
  existingImages: post.imageUrls || [],
  existingVideos: post.videoUrls || [],
});

    }
  }, [post, isYouTube]);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUpdatedPost(prev => ({
      ...prev,
      media: [...prev.media, ...files]
    }));
  };

  const handleRemoveExistingImage = (index) => {
    setUpdatedPost(prev => {
      const existingImages = [...prev.existingImages];
      const removed = existingImages.splice(index, 1)[0];
      const newRemovedUrls = prev.removedMediaUrls
        ? `${prev.removedMediaUrls},${removed}`
        : removed;
      return {
        ...prev,
        existingImages,
        removedMediaUrls: newRemovedUrls
      };
    });
  };

  const handleRemoveExistingVideo = (index) => {
    setUpdatedPost(prev => {
      const existingVideos = [...prev.existingVideos];
      const removed = existingVideos.splice(index, 1)[0];
      const newRemovedUrls = prev.removedMediaUrls
        ? `${prev.removedMediaUrls},${removed}`
        : removed;
      return {
        ...prev,
        existingVideos,
        removedMediaUrls: newRemovedUrls
      };
    });
  };

  const handleRemoveNewMedia = (index) => {
    setUpdatedPost(prev => {
      const media = [...prev.media];
      media.splice(index, 1);
      return { ...prev, media };
    });
  };

  const handleUpdatePost = async () => {
    try {
      const formData = new FormData();

      // Add appropriate content field based on platform
      if (isYouTube) {
        formData.append("title", updatedPost.title);
      } else {
        formData.append("content", updatedPost.content);
      }

      // Add platforms
      formData.append("selectedPlatformName", JSON.stringify(updatedPost.selectedPlatformName));

      // Add removed media URLs
      if (updatedPost.removedMediaUrls) {
        formData.append("removedMediaUrls", updatedPost.removedMediaUrls);
      }

      // Add scheduled date in DD-MM-YYYY HH:mm format
      if (updatedPost.scheduledFor) {
        const dateObj = new Date(updatedPost.scheduledFor);
        formData.append("scheduledFor", formatDateTimeForAPI(dateObj));
      }

      // Add new media files
      updatedPost.media.forEach(file => {
        formData.append("media", file);
      });

      const response = await axiosInstance.put(
        `/post/update-scheduled-post/${postId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.success) {
        toast.success("Post updated successfully!", {
          duration: 4000,
          position: 'top-center',
          style: {
            background: '#4BB543',
            color: '#fff',
          }
        });
        onUpdated();
        setIsOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update post.", {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#FF0000',
          color: '#fff',
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-lg rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Scheduled Post</DialogTitle>
          <DialogDescription>
            Manage your media and update post details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Conditional field for YouTube vs other platforms */}
          {isYouTube ? (
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={updatedPost.title}
                onChange={(e) => setUpdatedPost(p => ({ ...p, title: e.target.value }))}
                className="w-full border p-2 rounded"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={updatedPost.content}
                onChange={(e) => setUpdatedPost(p => ({ ...p, content: e.target.value }))}
                className="w-full border p-2 rounded"
                rows={4}
              />
            </div>
          )}

          {/* Platform Selection */}
          {!isAutoPlatform ? (
            <div>
              <label className="block text-sm font-medium mb-1">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {['facebook', 'instagram', 'linkedin', 'telegram'].map(platform => (
                  <label key={platform} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={updatedPost.selectedPlatformName.includes(platform)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setUpdatedPost(p => ({
                            ...p,
                            selectedPlatformName: [...p.selectedPlatformName, platform]
                          }));
                        } else {
                          setUpdatedPost(p => ({
                            ...p,
                            selectedPlatformName: p.selectedPlatformName.filter(p => p !== platform)
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="capitalize">{platform}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                Platform automatically selected: {updatedPost.selectedPlatformName.join(", ")}
              </p>
            </div>
          )}

          {/* Schedule Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Scheduled Date</label>
            <input
              type="datetime-local"
              value={updatedPost.scheduledFor}
              onChange={(e) => setUpdatedPost(p => ({ ...p, scheduledFor: e.target.value }))}
              className="w-full border p-2 rounded"
            />
          </div>
          {/* Existing Media Sections */}
          {updatedPost.existingImages.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Existing Images</h3>
              <div className="grid grid-cols-3 gap-2">
                {updatedPost.existingImages.map((url, index) => (
                  <div key={`img-${index}`} className="relative">
                    <div className="aspect-square border rounded-md overflow-hidden">
                      <img
                        src={url}
                        alt={`Image ${index}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveExistingImage(index)}
                      className="absolute top-1 right-1 !bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {updatedPost.existingVideos.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Existing Videos</h3>
              <div className="grid grid-cols-3 gap-2">
                {updatedPost.existingVideos.map((url, index) => (
                  <div key={`vid-${index}`} className="relative">
                    <div className="aspect-square border rounded-md overflow-hidden">
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                        muted
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveExistingVideo(index)}
                      className="absolute top-1 right-1 !bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      title="Remove video"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* New Media Section */}
          {!isTwitter && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Add New Media</h3>

              {updatedPost.media.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {updatedPost.media.map((file, index) => (
                    <div key={`new-${index}`} className="relative">
                      <div className="aspect-square border rounded-md overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={URL.createObjectURL(file)}
                            className="w-full h-full object-cover"
                            muted
                          />
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveNewMedia(index)}
                        className="absolute top-1 right-1 !bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        title="Remove media"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full py-6 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">Images and videos up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}

        </div>

        <DialogFooter className="pt-4 border-t">
          <button
            className="px-4 py-2 rounded border !bg-purple-500 text-white hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded !bg-purple-600 text-white hover:!bg-purple-700"
            onClick={handleUpdatePost}
          >
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}