// import { useState, useEffect } from "react";
// import apiUrls from "../utils/apiUrls";
// import axiosInstance from "../utils/axiosInstance";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// const platformsList = ["facebook", "twitter", "linkedin", "instagram"];

// export default function EditPostModal({ postId,isOpen, setIsOpen, post, onUpdated }) {
//   const [updatedPost, setUpdatedPost] = useState({
//     title: "",
//     description: "",
//     platforms: [],
//     scheduledFor: "",
//   });

//   useEffect(() => {
//     if (post) {
//       setUpdatedPost({
//         title: post.title || "",
//         description: post.description || post.content || "",
//         platforms: post.platforms || [],
//         scheduledFor: post.scheduledFor
//           ? new Date(post.scheduledFor).toISOString().slice(0, 16) // for datetime-local
//           : "",
//       });
//     }
//   }, [post]);

//   const handlePlatformToggle = (platform) => {
//     setUpdatedPost((prev) => {
//       const platforms = prev.platforms.includes(platform)
//         ? prev.platforms.filter((p) => p !== platform)
//         : [...prev.platforms, platform];
//       return { ...prev, platforms };
//     });
//   };

//   const handleUpdatePost = async () => {
//     try {
//       const payload = {
//         title: updatedPost.title,
//         content: updatedPost.description,
//         platforms: updatedPost.platforms,
//         scheduledFor: updatedPost.scheduledFor,
//       };

//        await axios.put(`/update-scheduled-post/${postId}`, { content: 'new content' });
//   onUpdated(); // refresh posts list
//   setIsOpen(false); // close modal
//     } catch (error) {
//       console.error("Error updating post:", error);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Edit Post</DialogTitle>
//           <DialogDescription>Modify and save your post details.</DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Post Title"
//             value={updatedPost.title}
//             onChange={(e) =>
//               setUpdatedPost((prev) => ({ ...prev, title: e.target.value }))
//             }
//             className="w-full border p-2 rounded"
//           />

//           <textarea
//             placeholder="Post Description"
//             value={updatedPost.description}
//             onChange={(e) =>
//               setUpdatedPost((prev) => ({ ...prev, description: e.target.value }))
//             }
//             className="w-full border p-2 rounded"
//           />

//           <div className="flex gap-2 flex-wrap">
//             {platformsList.map((platform) => (
//               <button
//                 key={platform}
//                 type="button"
//                 onClick={() => handlePlatformToggle(platform)}
//                 className={`px-3 py-1 border rounded-full ${
//                   updatedPost.platforms.includes(platform)
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100"
//                 }`}
//               >
//                 {platform}
//               </button>
//             ))}
//           </div>

//           <input
//             type="datetime-local"
//             value={updatedPost.scheduledFor}
//             onChange={(e) =>
//               setUpdatedPost((prev) => ({
//                 ...prev,
//                 scheduledFor: e.target.value,
//               }))
//             }
//             className="w-full border p-2 rounded"
//           />
//         </div>

//         <DialogFooter>
//           <button
//             className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
//             onClick={handleUpdatePost}
//           >
//             Save Changes
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState, useEffect } from "react";
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

const platformsList = ["facebook", "twitter", "linkedin", "instagram"];

export default function EditPostModal({
  postId,
  isOpen,
  setIsOpen,
  post,
  onUpdated,
}) {
  const [updatedPost, setUpdatedPost] = useState({
    title: "",
    description: "",
    platforms: [],
    scheduledFor: "",
  });

  useEffect(() => {
    if (post) {
      setUpdatedPost({
        title: post.title || "",
        description: post.description || post.content || "",
        platforms: post.platforms || [],
        scheduledFor: post.scheduledFor
          ? new Date(post.scheduledFor).toISOString().slice(0, 16) // for datetime-local
          : "",
      });
    }
  }, [post]);

  const handlePlatformToggle = (platform) => {
    setUpdatedPost((prev) => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

//   const handleUpdatePost = async () => {
//     try {
//       // Correct the axios call to send the proper payload
//       const response=await axiosInstance.put(
//         `/post/update-scheduled-post/${postId}`,
//         updatedPost
//       );

//       // Refresh the posts list and close the modal
//       onUpdated();
//       setIsOpen(false);

//        if (response.data?.message === "Post updated successfully") {
//       // Display a success message or alert
//       alert("Post updated successfully!");
//     } 
// }catch (error) {
//       console.error("Error updating post:", error);
//     }
//   };





const handleUpdatePost = async () => {
  try {
    const payload = {
      title: updatedPost.title,
      content: updatedPost.description, // ✅ convert 'description' to 'content'
      platforms: updatedPost.platforms,
      scheduledFor: updatedPost.scheduledFor,
    };

    const response = await axiosInstance.put(
      `/post/update-scheduled-post/${postId}`,
      payload
    );

    if (response.data?.message === "Post updated successfully") {
      alert("Post updated successfully!");
    }

    onUpdated();
    setIsOpen(false);
  } catch (error) {
    console.error("Error updating post:", error.response?.data || error.message);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Modify and save your post details.
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
            placeholder="Post Description"
            value={updatedPost.description}
            onChange={(e) =>
              setUpdatedPost((prev) => ({
                ...prev,
                description: e.target.value,
              }))
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
                  updatedPost.platforms.includes(platform)
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
            value={updatedPost.scheduledFor}
            onChange={(e) =>
              setUpdatedPost((prev) => ({
                ...prev,
                scheduledFor: e.target.value,
              }))
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <DialogFooter>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleUpdatePost}
          >
            Save Changes
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
