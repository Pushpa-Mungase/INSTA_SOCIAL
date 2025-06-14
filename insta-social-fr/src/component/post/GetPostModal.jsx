import { useEffect, useState, useMemo } from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaTelegram,
  FaYoutube,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axiosInstance from "../../utils/axiosInstance";
import apiUrls from "../../utils/apiUrls";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import CreatePostModal from "./CreatePostModal";
import { Loader2 } from "lucide-react";
import { FaPlusCircle } from "react-icons/fa";

const platformIcons = {
  facebook: <FaFacebook className="text-[#1877F2]" size={16} />,
  instagram: <FaInstagram className="text-[#E1306C]" size={16} />,
  twitter: <FaTwitter className="text-[#1DA1F2]" size={16} />,
  linkedin: <FaLinkedin className="text-[#0A66C2]" size={16} />,
  youtube: <FaYoutube className="text-[#FF0000]" size={16} />,
  telegram: <FaTelegram className="text-[#0088cc]" size={16} />,
};

export default function TimelinePostsUI({
  isCreateModalOpen,
  setIsCreateModalOpen,
  onPostCreated,
  ...props
}) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSlides, setLightboxSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [createType, setCreateType] = useState(null); // NEW: track which modal type

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(apiUrls.getScheduledPosts);
      const fetchedPosts = res.data?.posts || [];
      const processedPosts = fetchedPosts.map((post) => {
        const imageFiles = (post.imageUrls || []).map((url) => ({ url, type: "image" }));
        const videoFiles = (post.videoUrls || []).map((url) => ({ url, type: "video" }));
        return {
          ...post,
          files: [...imageFiles, ...videoFiles],
        };
      });
      setPosts(processedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) => {
      const statusMatch = statusFilter === "all" || post.status === statusFilter;
      const platformData = post.selectedPlatformName || [];
      const platforms = Array.isArray(platformData)
        ? platformData
        : typeof platformData === "string"
          ? platformData.split(",").map((p) => p.trim().toLowerCase())
          : Object.keys(platformData).filter((key) => platformData[key]);
      const platformMatch =
        platformFilter === "all" || platforms.includes(platformFilter);
      return statusMatch && platformMatch;
    });
    setFilteredPosts(filtered);
  }, [posts, statusFilter, platformFilter]);

  const groupedByDate = useMemo(() => {
    return filteredPosts.reduce((acc, post) => {
      const dateKey = new Date(post.scheduledFor).toLocaleDateString("en-GB");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(post);
      return acc;
    }, {});
  }, [filteredPosts]);

  const openLightboxAt = (post, index) => {
    const slides = post.files.map((file) =>
      file.type === "image"
        ? { src: file.url }
        : { type: "video", sources: [{ src: file.url, type: "video/mp4" }] }
    );
    setLightboxSlides(slides);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const renderPlatformIcons = (post) => {
    const data = post.selectedPlatformName;
    const platforms = Array.isArray(data)
      ? data
      : typeof data === "string"
        ? data.split(",").map((p) => p.trim().toLowerCase())
        : Object.keys(data || {}).filter((key) => data[key]);

    return platforms.map((platform, idx) => (
      <span
        key={idx}
        title={platform}
        className="hover:scale-110 transition-transform"
      >
        {platformIcons[platform] || (
          <span className="text-xs bg-gray-200 px-1 rounded">
            {platform.toUpperCase()}
          </span>
        )}
      </span>
    ));
  };

  return (
    <div className="p-6 bg-accent rounded-md shadow-md">
      <div className="mb-4 flex gap-4 items-center justify-between">
        <div className="flex gap-4 items-center bg-white p-2 rounded shadow">
          <select
            className="border p-2 rounded"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Scheduled</option>
            <option value="failed">Failed</option>
            <option value="posted">Posted</option>
          </select>
          <select
            className="border p-2 rounded"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="all">All Platforms</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>
        {/* Create Post Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCreateType("meta");
              setIsCreateModalOpen(true);
            }}
            className="!bg-[#1877F2] rounded-full p-3 hover:!bg-[#1877F2]/80 shadow-lg transition duration-300"
            title="Create Meta Post (FB, Insta, Telegram, LinkedIn)"
          >
            <span className="flex items-center gap-1 text-white font-semibold">
              <FaFacebook size={18} />
              <FaInstagram size={18} />
              <FaTelegram size={18} />
              <FaLinkedin size={18} />
              <span className="ml-1 hidden md:inline">Meta</span>
            </span>
          </button>
          <button
            onClick={() => {
              setCreateType("youtube");
              setIsCreateModalOpen(true);
            }}
            className="!bg-[#FF0000] rounded-full p-3 hover:!bg-[#FF0000]/80 shadow-lg transition duration-300"
            title="Create YouTube Post"
          >
            <span className="flex items-center gap-1 text-white font-semibold">
              <FaYoutube size={18} />
              <span className="ml-1 hidden md:inline">YouTube</span>
            </span>
          </button>
          <button
            onClick={() => {
              setCreateType("twitter");
              setIsCreateModalOpen(true);
            }}
            className="!bg-[#1DA1F2] rounded-full p-3 hover:!bg-[#1DA1F2]/80 shadow-lg transition duration-300"
            title="Create Twitter Post"
          >
            <span className="flex items-center gap-1 text-white font-semibold">
              <FaTwitter size={18} />
              <span className="ml-1 hidden md:inline">Twitter</span>
            </span>
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        onPostCreated={onPostCreated}
        createType={createType} // NEW: pass type
      />

      {loading ? (
        <div className="flex justify-center py-10 ">
          <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-gray-500">No posts found</div>
      ) : (
        Object.entries(groupedByDate).map(([date, posts]) => (
          <div key={date} className="mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm font-semibold text-gray-700 bg-white shadow-lg px-2 md:px-4 py-2 rounded-lg mb-2 sticky top-16 z-10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                {date}
              </div>
              <div className="flex flex-wrap gap-2 sm:justify-end">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Scheduled: {posts.filter((p) => p.status === "pending").length}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Posted: {posts.filter((p) => p.status === "posted").length}
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  Failed: {posts.filter((p) => p.status === "failed").length}
                </span>
                <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                  Total: {posts.length}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-1.5">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white border rounded-md shadow-sm hover:shadow-md transition overflow-hidden"
                >
                  <div className="relative">
                    {post.files?.length > 0 ? (
                      // Existing logic for files
                      Array.isArray(post.selectedPlatformName) &&
                        post.selectedPlatformName.length === 1 &&
                        post.selectedPlatformName.includes("twitter") ? (
                        <div className="flex justify-center items-center w-full h-32 bg-[#E8F5FD] rounded-b-md">
                          <FaTwitter className="text-[#1DA1F2]" size={40} />
                        </div>
                      ) : post.files.length > 1 ? (
                        <div className="grid grid-cols-2 gap-0.5 h-32">
                          {post.files.slice(0, 4).map((file, idx) =>
                            file.type === "image" ? (
                              <img
                                key={idx}
                                src={file.url}
                                alt={`media-${idx}`}
                                className="object-cover w-full h-32 rounded-md cursor-pointer hover:border-1 hover:border-[#8e51ff]"
                                onClick={() => openLightboxAt(post, idx)}
                              />
                            ) : (
                              <video
                                key={idx}
                                src={file.url}
                                muted
                                className="object-cover w-full h-32 rounded-md cursor-pointer hover:border-1 hover:border-[#8e51ff]"
                                onClick={() => openLightboxAt(post, idx)}
                              />
                            )
                          )}
                        </div>
                      ) : post.files[0].type === "image" ? (
                        <img
                          src={post.files[0].url}
                          alt=""
                          className="object-cover w-full h-32 rounded-md cursor-pointer hover:border-1 hover:border-[#8e51ff]"
                          onClick={() => openLightboxAt(post, 0)}
                        />
                      ) : (
                        <video
                          src={post.files[0].url}
                          muted
                          className="object-cover w-full h-32 rounded-md cursor-pointer hover:border-1 hover:border-[#8e51ff]"
                          onClick={() => openLightboxAt(post, 0)}
                        />
                      )
                    ) : (
                      // Twitter fallback icon when no media
                      Array.isArray(post.selectedPlatformName) &&
                      post.selectedPlatformName.length === 1 &&
                      post.selectedPlatformName.includes("twitter") && (
                        <div className="flex justify-center items-center w-full h-32 bg-[#E8F5FD] rounded-b-md">
                          <FaTwitter className="text-[#1DA1F2]" size={40} />
                        </div>
                      )
                    )}

                    {/* Time Badge */}
                    <div className="absolute bottom-1 left-1 bg-[#8e51ff] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full shadow">
                      {new Date(post.scheduledFor).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`absolute top-1 right-1 text-xs font-semibold px-1.5 py-0.5 rounded-full shadow ${post.status === "posted"
                          ? "bg-green-100 text-green-800"
                          : post.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : post.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {post.status === "pending"
                        ? "Scheduled"
                        : post.status?.charAt(0).toUpperCase() + post.status?.slice(1)}
                    </div>
                  </div>

                  <div className="flex justify-between items-start px-2 py-3">
                    <div className="flex gap-2 items-center">
                      {renderPlatformIcons(post)}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <BsThreeDotsVertical size={16} />
                      </PopoverTrigger>
                      <PopoverContent className="w-10 p-1">
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setEditModalOpen(true);
                            }}
                            className="w-full text-center !px-1 !py-1 !text-[10px] hover:bg-gray-100 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              setDeleteModalOpen(true);
                            }}
                            className="w-full text-center !px-0.5 !py-1 !text-[10px] hover:bg-red-50 text-red-600 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {(post.content || post.title) && (
                    <div className="px-3 pb-3 text-xs italic text-gray-800 text-clip overflow-hidden">
                      {Array.isArray(post.selectedPlatformName) &&
                        post.selectedPlatformName.includes("youtube")
                        ? post.title
                        : post.content}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )))
      }

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
