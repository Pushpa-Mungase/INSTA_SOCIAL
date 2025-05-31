

import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import axiosInstance from "../utils/axiosInstance";
import apiUrls from "../utils/apiUrls";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

export default function GetPostModal({ onEdit, postsData }) {
  const [posts, setPosts] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxSlides, setLightboxSlides] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get(apiUrls.getScheduledPosts);
      const fetchedPosts = res.data?.posts || [];

      const normalizedPosts = fetchedPosts.map((post) => {
        const imageFiles = (post.imageUrls || []).map((url) => ({
          url,
          type: "image",
        }));
        const videoFiles = (post.videoUrls || []).map((url) => ({
          url,
          type: "video",
        }));
        return {
          ...post,
          files: [...imageFiles, ...videoFiles],
        };
      });

      setPosts(normalizedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const openLightboxAt = (post, clickedIndex) => {
    const slides = post.files.map((file) =>
      file.type === "image"
        ? { src: file.url }
        : {
            type: "video",
            sources: [{ src: file.url, type: "video/mp4" }],
          }
    );

    setLightboxSlides(slides);
    setCurrentIndex(clickedIndex);
    setLightboxOpen(true);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleDelete = (post) => {
    setSelectedPost(post);
    setDeleteModalOpen(true);
  };
  const handleRetry = (post) => {
    // Open the update post form (reuse edit logic)
    handleEdit({
      ...post,
      status: "scheduled", // Change the status right away for UI or do it on save
    });
  };

  useEffect(() => {
    fetchPosts();
  }, [postsData]);

  console.log(posts.filter(p => p.status === "pending" && p.isPosted));

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="relative bg-white border shadow rounded-lg p-4"
          >
            {/* Status Badge */}
            {post.isPosted ? (
              <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                Posted
              </div>
            ) : post.status === "pending"  ? (
              <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                Scheduled
              </div>
            ) : post.status === "failed" ? (
              <div className="absolute top-2 left-2 bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                Failed
              </div>
            ) : null}

            {/* Options Menu */}
            <Popover>
              <PopoverTrigger>
                <BsThreeDotsVertical size={20} />
              </PopoverTrigger>
              
              <PopoverContent className="w-32 p-2 space-y-2">
                {/* Show Edit when not posted and status is not failed */}
                {!post.isPosted && post.status === "pending" && (
                  <button
                    onClick={() => handleEdit(post)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                )}

                {/* Show Retry only when failed */}
                {!post.isPosted && post.status == "failed" && (
                  <button
                    onClick={() => handleRetry(post)} // This should change status to "scheduled"
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-yellow-700 font-semibold"
                  >
                    Retry
                  </button>
                )}

                {/* Always show Delete */}
                
                <button
                  onClick={() => handleDelete(post)}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Delete
                </button>
              </PopoverContent>
            </Popover>

            {/* Post Content */}
            <p className="text-gray-800 text-sm mb-2">{post.content}</p>

            {/* Media Grid */}
            {post.files?.length > 0 && (
              <div
                className={`grid gap-1 mt-2 rounded overflow-hidden ${
                  post.files.length === 1
                    ? "grid-cols-1"
                    : post.files.length === 2
                    ? "grid-cols-2"
                    : post.files.length === 3
                    ? "grid-cols-2 grid-rows-2"
                    : "grid-cols-2"
                }`}
              >
                {post.files.slice(0, 4).map((file, index) => (
                  <div
                    key={index}
                    className="relative w-full h-48 cursor-pointer"
                    onClick={() => openLightboxAt(post, index)}
                  >
                    {file.type === "image" ? (
                      <img
                        src={file.url}
                        alt={`Media ${index}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <video
                        src={file.url}
                        controls
                        className="object-cover w-full h-full"
                      />
                    )}

                    {index === 3 && post.files.length > 4 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-xl font-bold">
                        +{post.files.length - 4}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <EditPostModal
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        post={selectedPost}
        onUpdated={fetchPosts}
        postId={selectedPost?._id}
      />
      <DeletePostModal
        isOpen={deleteModalOpen}
        setIsOpen={setDeleteModalOpen}
        postId={selectedPost?._id}
        onDeleted={fetchPosts}
      />

      {/* Lightbox Viewer */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentIndex}
        slides={lightboxSlides}
        plugins={[Video]}
      />
    </div>
  );
}
