// src/components/GetPostModal.js
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import apiUrls from "../utils/apiUrls";
import axiosInstance from "../utils/axiosInstance";
import EditPostModal from "./EditPostModal";
import DeletePostModal from "./DeletePostModal";

export default function GetPostModal({ onEdit }) {
  const [posts, setPosts] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get(apiUrls.getScheduledPosts);
      setPosts(res.data?.posts || []);
      console.log("Posts fetched successfully:", res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setEditModalOpen(true);
  };

  const handleDelete = async (post) => {
   setSelectedPost(post);
   setDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="relative bg-white border shadow rounded-lg p-4"
          >
            <div className="absolute top-2 right-2">
              <button onClick={() => toggleMenu(post._id)}>
                <BsThreeDotsVertical size={20} />
              </button>
              {activeMenu === post._id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                  {/* <button
                    onClick={() => onEdit(post)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button> */}

                  <button
                    onClick={() => handleEdit(post)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <h2 className="text-lg font-bold mb-2">
              {post.title || "Untitled"}
            </h2>
            <p className="text-gray-600 text-sm">
              {post.description || post.content || "No description"}
            </p>
          </div>
        ))}
      </div>
      <EditPostModal
        isOpen={editModalOpen}
        setIsOpen={setEditModalOpen}
        post={selectedPost}
        onUpdated={fetchPosts}
        postId={selectedPost?._id}
      />


       <DeletePostModal
//   postId={selectedPostId}

  isOpen={deleteModalOpen}
  setIsOpen={setDeleteModalOpen}
  
   postId={selectedPost?._id}
   onDeleted={fetchPosts}
/>
    </div>
  );
}
