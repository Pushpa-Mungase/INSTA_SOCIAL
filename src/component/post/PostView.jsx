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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import axiosInstance from "../../utils/axiosInstance";
import apiUrls from "../../utils/apiUrls";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";
import CreatePostModal from "./CreatePostModal";
import PostDialogContent from "../../components/ui/customComponents/PostDialogContent"; // Import the separate component
import { Loader2, Clock, CheckCircle2, AlertCircle, List, ListTodo } from "lucide-react";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [createType, setCreateType] = useState(null);

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

  const openPostDialog = (post, mediaIndex = 0) => {
    const postIndex = filteredPosts.findIndex(p => p._id === post._id);
    setCurrentPostIndex(postIndex);
    setCurrentMediaIndex(mediaIndex);
    setSelectedPost(post);
    setDialogOpen(true);
  };

  const navigatePost = (direction) => {
    const newIndex = direction === 'next'
      ? (currentPostIndex + 1) % filteredPosts.length
      : (currentPostIndex - 1 + filteredPosts.length) % filteredPosts.length;

    setCurrentPostIndex(newIndex);
    setSelectedPost(filteredPosts[newIndex]);
    setCurrentMediaIndex(0);
  };

  const navigateMedia = (direction) => {
    if (!selectedPost?.files?.length) return;

    const newIndex = direction === 'next'
      ? (currentMediaIndex + 1) % selectedPost.files.length
      : (currentMediaIndex - 1 + selectedPost.files.length) % selectedPost.files.length;

    setCurrentMediaIndex(newIndex);
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
          <span className="text-xs bg-gray-200 px-1 rounded-md">
            {platform.toUpperCase()}
          </span>
        )}
      </span>
    ));
  };

  // Handler functions for the PostDialogContent
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleEditPost = () => {
    setDialogOpen(false);
    setEditModalOpen(true);
  };

  const handleDeletePost = () => {
    setDialogOpen(false);
    setDeleteModalOpen(true);
  };

  return (
    <div className="px-6 py-2 bg-accent rounded-md shadow-md">
      <div className="mb-4 flex gap-4 items-center justify-between">
        <div className="flex gap-2 items-center bg-white p-1 rounded-md shadow">
          <select
            className="border px-2 py-1 rounded-md text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Scheduled</option>
            <option value="failed">Failed</option>
            <option value="posted">Posted</option>
          </select>
          <select
            className="border px-2 py-1 rounded-md text-sm"
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
            className="!bg-[#1877F2] rounded-md !px-1.5 !py-2 hover:!bg-[#1877F2]/80 shadow-lg transition duration-300"
            title="Create Post (FB, Insta, Telegram, LinkedIn)"
          >
            <span className="flex items-center gap-1 text-white font-semibold text-xs">
              <FaFacebook size={14} />
              <FaInstagram size={14} />
              <FaTelegram size={14} />
              <FaLinkedin size={14} />
            </span>
          </button>
          <button
            onClick={() => {
              setCreateType("youtube");
              setIsCreateModalOpen(true);
            }}
            className="!bg-[#FF0000] rounded-md !px-1.5 !py-2 hover:!bg-[#FF0000]/80 shadow-lg transition duration-300"
            title="Create YouTube Post"
          >
            <span className="flex items-center gap-1 text-white font-semibold text-xs">
              <FaYoutube size={14} />
              <span className="ml-1 hidden md:inline">YouTube</span>
            </span>
          </button>
          <button
            onClick={() => {
              setCreateType("twitter");
              setIsCreateModalOpen(true);
            }}
            className="!bg-[#1DA1F2] rounded-md !px-1.5 !py-2 hover:!bg-[#1DA1F2]/80 shadow-lg transition duration-300"
            title="Create Twitter Post"
          >
            <span className="flex items-center gap-1 text-white font-semibold text-xs">
              <FaTwitter size={14} />
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
        createType={createType}
      />

      {loading ? (
        <div className="flex justify-center py-10 ">
          <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center text-gray-500">No posts found</div>
      ) : (
        Object.entries(groupedByDate)
          .sort(([a], [b]) => {
            // Parse dates in dd/mm/yyyy format
            const [dayA, monthA, yearA] = a.split('/').map(Number);
            const [dayB, monthB, yearB] = b.split('/').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateB - dateA;
          })
          .map(([date, posts]) => (
            <div key={date} className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm font-semibold text-gray-700 bg-background shadow-lg px-2 md:px-4 py-2 rounded-md mb-2 sticky top-[50px] z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-md bg-purple-500"></div>
                  {date}
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock size={16} className="inline" />
                    {posts.filter((p) => p.status === "pending").length}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={16} className="inline" />
                    {posts.filter((p) => p.status === "posted").length}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <AlertCircle size={16} className="inline" />
                    {posts.filter((p) => p.status === "failed").length}
                  </span>
                  <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full flex items-center gap-1 pb-0.5">
                    <ListTodo size={16} className="inline" />
                    {posts.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-0.5 ">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="bg-background border rounded-md shadow-sm hover:shadow-md transition overflow-hidden pb-2"
                  >
                    <div className="relative max-h-72">
                      {post.files?.length > 0 ? (
                        Array.isArray(post.selectedPlatformName) &&
                          post.selectedPlatformName.length === 1 &&
                          post.selectedPlatformName.includes("twitter") ? (
                          <div className="flex justify-center items-center w-full h-32 bg-[#E8F5FD] rounded-b-md cursor-pointer"
                            onClick={() => openPostDialog(post)}>
                            <FaTwitter className="text-[#1DA1F2]" size={40} />
                          </div>
                        ) : post.files.length > 1 ? (
                          <div className="grid grid-cols-2 gap-0.5 h-32">
                            {post.files.slice(0, 2).map((file, idx) =>
                              file.type === "image" ? (
                                <img
                                  key={idx}
                                  src={file.url}
                                  alt={`media-${idx}`}
                                  className="object-cover w-full h-32 rounded-md cursor-pointer hover:border-1 hover:border-[#8e51ff]"
                                  onClick={() => openPostDialog(post, idx)}
                                />
                              ) : (
                                <video
                                  key={idx}
                                  src={file.url}
                                  muted
                                  className="object-cover w-full h-32 rounded-md cursor-pointer hover:border-1 hover:border-[#8e51ff]"
                                  onClick={() => openPostDialog(post, idx)}
                                />
                              )
                            )}
                          </div>
                        ) : post.files[0].type === "image" ? (
                          <img
                            src={post.files[0].url}
                            alt=""
                            className="object-cover w-full h-32 rounded-md cursor-pointer hover:border-1 hover:border-[#8e51ff]"
                            onClick={() => openPostDialog(post, 0)}
                          />
                        ) : (
                          <video
                            src={post.files[0].url}
                            muted
                            className="object-cover w-full h-32 rounded-md cursor-pointer hover:border-1 hover:border-[#8e51ff]"
                            onClick={() => openPostDialog(post, 0)}
                          />
                        )
                      ) : (
                        Array.isArray(post.selectedPlatformName) &&
                        post.selectedPlatformName.length === 1 &&
                        post.selectedPlatformName.includes("twitter") && (
                          <div className="flex justify-center items-center w-full h-32 bg-[#E8F5FD] rounded-b-md cursor-pointer"
                            onClick={() => openPostDialog(post)}>
                            <FaTwitter className="text-[#1DA1F2]" size={40} />
                          </div>
                        )
                      )}

                      <div className="absolute bottom-1 left-1 bg-[#8e51ff] text-white text-xs font-semibold px-1.5 py-0.5 rounded-full shadow">
                        {new Date(post.scheduledFor).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>

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
                      {(post.status === "pending" || post.status === "failed") && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <BsThreeDotsVertical size={16} className="cursor-pointer" />
                          </PopoverTrigger>
                          <PopoverContent className="w-10 p-1">
                            <div className="space-y-1">
                              <button
                                onClick={() => {
                                  setSelectedPost(post);
                                  setEditModalOpen(true);
                                }}
                                className="w-full text-center !px-1 !py-1 !text-[10px] hover:bg-gray-100 rounded !cursor-pointer"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedPost(post);
                                  setDeleteModalOpen(true);
                                }}
                                className="w-full text-center !px-0.5 !py-1 !text-[8px] hover:bg-red-50 text-red-600 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    {(post.content || post.title) && (
                      <div className="px-3  text-xs italic text-gray-800  line-clamp-2 text-ellipsis  overflow-hidden ">
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
          ))
      )}

      {/* Post Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!max-w-4xl w-full p-0 bg-transparent border-none">
          <PostDialogContent
            selectedPost={selectedPost}
            currentMediaIndex={currentMediaIndex}
            onClose={handleCloseDialog}
            onNavigatePost={navigatePost}
            onNavigateMedia={navigateMedia}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            totalPosts={filteredPosts.length}
            currentPostIndex={currentPostIndex}
          />
        </DialogContent>
      </Dialog>

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
    </div>
  );
}