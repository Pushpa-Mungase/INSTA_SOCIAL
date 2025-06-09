
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";
import apiUrls from "../../utils/apiUrls";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const platformIcons = {
  facebook: <FaFacebook className="text-[#1877F2]" size={16} />,
  instagram: <FaInstagram className="text-[#E1306C]" size={16} />,
  twitter: <FaTwitter className="text-[#1DA1F2]" size={16} />,
  linkedin: <FaLinkedin className="text-[#0A66C2]" size={16} />,
  fb: <FaFacebook className="text-[#1877F2]" size={16} />,
  ig: <FaInstagram className="text-[#E1306C]" size={16} />,
  tw: <FaTwitter className="text-[#1DA1F2]" size={16} />,
  li: <FaLinkedin className="text-[#0A66C2]" size={16} />,
};

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

      const processedPosts = fetchedPosts.map((post) => {
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

      // Sort posts by creation date (latest first)
      const sortedPosts = processedPosts.sort((a, b) => {
        // Try to use createdAt field first, then fall back to _id (if using MongoDB ObjectId)
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(parseInt(b._id.substring(0, 8), 16) * 1000);
        
        return dateB - dateA; // Descending order (latest first)
      });

      setPosts(sortedPosts);
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
    handleEdit({
      ...post,
      status: "scheduled",
    });
  };

  useEffect(() => {
    fetchPosts();
  }, [postsData]);

  const renderPlatformIcons = (post) => {
    const platformData = post.selectedPlatformName;

    if (!platformData) {
      return null;
    }

    let platforms = [];

    // Handle different data formats
    if (Array.isArray(platformData)) {
      platforms = platformData.filter(
        (platform) => platform && typeof platform === "string"
      );
    } else if (typeof platformData === "string") {
      platforms = platformData.includes(",")
        ? platformData
            .split(",")
            .map((p) => p.trim())
            .filter((p) => p)
        : [platformData];
    } else if (typeof platformData === "object") {
      // Extract platform names from object
      if (platformData.facebook) platforms.push("facebook");
      if (platformData.instagram) platforms.push("instagram");
      if (platformData.twitter) platforms.push("twitter");
      if (platformData.linkedin) platforms.push("linkedin");
    }

    if (platforms.length === 0) {
      return null;
    }

    return platforms.map((platformName, index) => {
      const normalizedName = platformName.toLowerCase().trim();
      const icon = platformIcons[normalizedName];

      if (!icon) {
        return (
          <span
            key={index}
            className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded text-[10px]"
            title={platformName}
          >
            {platformName.substring(0, 2).toUpperCase()}
          </span>
        );
      }

      return (
        <span
          key={index}
          title={platformName}
          className="hover:scale-110 transition-transform duration-200"
        >
          {icon}
        </span>
      );
    });
  };

  const getStatusInfo = (post) => {
    switch (post.status) {
      case "pending":
      case "scheduled":
        return {
          label: "Scheduled",
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "failed":
        return {
          label: "Failed",
          className: "bg-red-100 text-red-800 border-red-200",
        };
      case "posted":
        return {
          label: "Posted",
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "draft":
        return {
          label: "Draft",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
      default:
        // Don't show status badge for unknown statuses
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => {
          const statusInfo = getStatusInfo(post);

          return (
            <div
              key={post._id}
              className="relative bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden"
            >
              {/* Header Row - Status, Platform Icons, and Menu */}
              <div className="flex items-center justify-between p-3 pb-0">
                {/* Status Badge */}
                <div className="flex-shrink-0">
                  {statusInfo && (
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                  )}
                </div>

                {/* Platform Icons and Menu */}
                <div className="flex items-center gap-2">
                  {/* Platform Icons */}
                  <div className="flex items-center gap-1">
                    {renderPlatformIcons(post)}
                  </div>

                  {/* Options Menu */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors bg-white/80 backdrop-blur-sm">
                        <BsThreeDotsVertical
                          size={16}
                          className="text-gray-600"
                        />
                      </button>
                    </PopoverTrigger>

                    <PopoverContent className="w-36 p-1" align="end">
                      <div className="space-y-1">
                        {(post.status === "pending" ||
                          post.status === "scheduled") && (
                            <button
                              onClick={() => handleEdit(post)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                            >
                              Edit
                            </button>
                        )}

                        {post.status === "failed" && (
                          <button
                            onClick={() => handleRetry(post)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-yellow-50 text-yellow-700 font-medium rounded transition-colors"
                          >
                            Retry
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(post)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-red-50 text-red-600 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-3 pt-2">
                {/* Scheduled Time - Only show for scheduled/pending posts and failed posts */}
                {post.scheduledFor && 
                 (post.status === "scheduled" || 
                  post.status === "pending" || 
                  post.status === "failed") && (
                  <div className="mb-3">
                    <div className="flex items-center justify-start">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">
                          {post.status === "failed" ? "Was scheduled:" : "Scheduled:"}
                        </span>{" "}
                        {new Date(post.scheduledFor).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Post Content */}
                {post.content && (
                  <div className="mb-4">
                    <p className="text-gray-800 text-sm leading-relaxed line-clamp-3 text-left">
                      {post.content}
                    </p>
                  </div>
                )}

                {/* Media Grid */}
                {post.files?.length > 0 && (
                  <div
                    className={`grid gap-1 rounded-lg overflow-hidden ${
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
                        className={`relative cursor-pointer hover:opacity-90 transition-opacity ${
                          post.files.length === 3 && index === 0
                            ? "row-span-2"
                            : "aspect-square"
                        }`}
                        onClick={() => openLightboxAt(post, index)}
                      >
                        {file.type === "image" ? (
                          <img
                            src={file.url}
                            alt={`Media ${index + 1}`}
                            className="object-cover w-full h-full rounded"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <video
                              src={file.url}
                              className="object-cover w-full h-full rounded"
                              muted
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded">
                              <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[6px] border-l-gray-700 border-y-[4px] border-y-transparent ml-1"></div>
                              </div>
                            </div>
                          </div>
                        )}

                        {index === 3 && post.files.length > 4 && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white text-lg font-semibold rounded">
                            +{post.files.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No posts found</div>
          <p className="text-gray-500 text-sm">
            Your scheduled posts will appear here
          </p>
        </div>
      )}

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
        carousel={{ finite: true }}
        render={{
          buttonPrev: lightboxSlides.length <= 1 ? () => null : undefined,
          buttonNext: lightboxSlides.length <= 1 ? () => null : undefined,
        }}
      />
    </div>
  );
}
