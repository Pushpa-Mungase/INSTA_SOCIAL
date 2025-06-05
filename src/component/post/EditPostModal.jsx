
// import { useState, useEffect } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import apiUrls from "../../utils/apiUrls";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";




// function getMinDateTimeIST() {
//   const now = new Date();

//   // Convert to IST (UTC + 5:30)
//   const utc = now.getTime() + now.getTimezoneOffset() * 60000;
//   const ist = new Date(utc + 5.5 * 60 * 60 * 1000);

//   const year = ist.getFullYear();
//   const month = String(ist.getMonth() + 1).padStart(2, "0");
//   const date = String(ist.getDate()).padStart(2, "0");
//   const hours = String(ist.getHours()).padStart(2, "0");
//   const minutes = String(ist.getMinutes()).padStart(2, "0");

//   return `${year}-${month}-${date}T${hours}:${minutes}`;
// }


// export default function EditPostModal({
//   postId,
//   isOpen,
//   setIsOpen,
//   post,
//   onUpdated,
// }) {

//    const [availablePlatforms, setAvailablePlatforms] = useState([]);
//     const [selectedMediaType, setSelectedMediaType] = useState(""); // "image" or "video"
//     const [UserPlatformNames, setUserPlatformNames] = useState([]);
//     const [platformId, setPlatformId] = useState("");
//     const [minDateTime, setMinDateTime] = useState(getMinDateTimeIST());
//   const [updatedPost, setUpdatedPost] = useState({
//     title: "",
//     content: "",
//     platforms: [],
//     scheduledFor: "",
//     existingMedia: [],
//     newImageFiles: [],
//     newVideoFiles: [],
//   });

//   const [userPlatforms, setUserPlatforms] = useState([]);

//   // useEffect(() => {
//   //   // Fetch user's platforms
//   //   const fetchPlatforms = async () => {
//   //     try {
//   //       const response = await axiosInstance.get("/platforms");
//   //       setUserPlatforms(response.data.platforms || []);
//   //     } catch (error) {
//   //       console.error("Error fetching platforms:", error);
//   //     }
//   //   };

//   //   fetchPlatforms();
//   // }, []);

//   useEffect(() => {
//     if (post) {
//       setUpdatedPost({
//         title: post.title || "",
//         content: post.content || post.description || "",
//         selectedPlatformName: post.selectedPlatformName || []
        
//         scheduledFor: post.scheduledFor
//           ? new Date(post.scheduledFor).toISOString().slice(0, 16)
//           : "",
//         existingMedia: post.media || [],
//         newImageFiles: [],
//         newVideoFiles: [],
//       });
//     }
//   }, [post]);



//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMinDateTime(getMinDateTimeIST());
//     }, 60000); // refresh every 1 minute
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const fetchPlatforms = async () => {
//       try {
//         const { data } = await axiosInstance.get(
//           "/platform/get-user-platformsAllData"
//         );
//         console.log("platforms:", data);
//         console.log("platformsID:", data.data._id);
//         console.log("platformsIDInner:", data.data.platforms);

//         data?.data?._id && setPlatformId(data?.data?._id);
//         setAvailablePlatforms(data.data.platforms || "");
//         console.log("Available platforms:", availablePlatforms);
//       } catch (err) {
//         console.error("Failed to fetch platforms", err);
//       }
//     };

//    if (isOpen) {
//       fetchPlatforms();
//     }
//   }, [isOpen]);


//  const handlePlatformToggle = (platformName) => {
//     setUpdatedPost((prev) => {
//       const selectedNames = prev.selectedPlatformName || [];
//       const isSelected = selectedNames.includes(platformName);

//       return {
//         ...prev,
//         selectedPlatformName: isSelected
//           ? selectedNames.filter((name) => name !== platformName)
//           : [...selectedNames, platformName],
//       };
//     });
//   };


//   // const handlePlatformToggle = (platformId) => {
//   //   setUpdatedPost((prev) => {
//   //     const platforms = prev.platforms.includes(platformId)
//   //       ? prev.platforms.filter((p) => p !== platformId)
//   //       : [...prev.platforms, platformId];
//   //     return { ...prev, platforms };
//   //   });
//   // };

//   const handleFileChange = (e, type) => {
//     const files = Array.from(e.target.files);
//     setUpdatedPost((prev) => ({ ...prev, [type]: files }));
//   };

//   const handleUpdatePost = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("title", updatedPost.title);
//       formData.append("content", updatedPost.content);
//       formData.append("scheduledFor", updatedPost.scheduledFor);
//       updatedPost.platforms.forEach((p) =>
//         formData.append("selectedPlatformIds[]", p)
//       );

//       updatedPost.newImageFiles.forEach((file) =>
//         formData.append("media", file)
//       );
//       updatedPost.newVideoFiles.forEach((file) =>
//         formData.append("media", file)
//       );

//       const response = await axiosInstance.put(
//         `/post/update-scheduled-post/${postId}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//      if (
//   response.data?.success==true  
// ) {
//   alert("Post updated successfully!");
//   onUpdated();
//   setIsOpen(false);
// }
//     } catch (error) {
//       console.error(
//         "Error updating post:",
//         error.response?.data || error.message
//       );
//       alert("Failed to update post.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent className="max-w-lg rounded-2xl">
//         <DialogHeader>
//           <DialogTitle>Edit Scheduled Post</DialogTitle>
//           <DialogDescription>
//             Modify the post, change media, and save your updates.
//           </DialogDescription>
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
//             placeholder="Post Content"
//             value={updatedPost.content}
//             onChange={(e) =>
//               setUpdatedPost((prev) => ({ ...prev, content: e.target.value }))
//             }
//             className="w-full border p-2 rounded"
//             rows={4}
//           />

         
//           <div>
//             <p className="font-medium mb-2">Select Platforms:</p>
//             <div className="flex gap-3 flex-wrap">
//               {availablePlatforms.map((platform) => (
//                 <button
//                   key={platform._id}
//                   type="button"
//                   onClick={() => handlePlatformToggle(platform.platformName)}
//                   className={`px-4 py-2 rounded-full border transition ${
//                     updatedPost.selectedPlatformName?.includes(
//                       platform.platformName
//                     )
//                       ? "!bg-blue-600 text-white border-blue-600"
//                       : "!bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   }`}
//                 >
//                   {platform.platformName.charAt(0).toUpperCase() +
//                     platform.platformName.slice(1)}
//                 </button>
//               ))}
//             </div>
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














//           {/* Show existing media (optional thumbnails) */}
//           {updatedPost.existingMedia?.length > 0 && (
//             <div>
//               <p className="font-medium mb-1">Existing Media</p>
//               <div className="grid grid-cols-2 gap-3">
//                 {updatedPost.existingMedia.map((url, index) => (
//                   <div key={index} className="border rounded overflow-hidden">
//                     {url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//                       <img
//                         src={url}
//                         alt="Media"
//                         className="w-full h-24 object-cover"
//                       />
//                     ) : (
//                       <video
//                         src={url}
//                         controls
//                         className="w-full h-24 object-cover"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Upload new media */}
//           <div>
//             <label className="block font-medium mb-1">Add New Images</label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={(e) => handleFileChange(e, "newImageFiles")}
//               className="block w-full text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1">Add New Videos</label>
//             <input
//               type="file"
//               accept="video/*"
//               multiple
//               onChange={(e) => handleFileChange(e, "newVideoFiles")}
//               className="block w-full text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <button
//             className="!bg-blue-600 text-white px-4 py-2 rounded mt-4"
//             onClick={handleUpdatePost}
//           >
//             Save Changes
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }















// import { useState, useEffect } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import apiUrls from "../../utils/apiUrls";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function getMinDateTimeIST() {
//   const now = new Date();

//   // Convert to IST (UTC + 5:30)
//   const utc = now.getTime() + now.getTimezoneOffset() * 60000;
//   const ist = new Date(utc + 5.5 * 60 * 60 * 1000);

//   const year = ist.getFullYear();
//   const month = String(ist.getMonth() + 1).padStart(2, "0");
//   const date = String(ist.getDate()).padStart(2, "0");
//   const hours = String(ist.getHours()).padStart(2, "0");
//   const minutes = String(ist.getMinutes()).padStart(2, "0");

//   return `${year}-${month}-${date}T${hours}:${minutes}`;
// }

// export default function EditPostModal({
//   postId,
//   isOpen,
//   setIsOpen,
//   post,
//   onUpdated,
// }) {
//   const [availablePlatforms, setAvailablePlatforms] = useState([]);
//   const [selectedMediaType, setSelectedMediaType] = useState(""); // "image" or "video"
//   const [UserPlatformNames, setUserPlatformNames] = useState([]);
//   const [platformId, setPlatformId] = useState("");
//   const [minDateTime, setMinDateTime] = useState(getMinDateTimeIST());
  
//   const [updatedPost, setUpdatedPost] = useState({
//     title: "",
//     content: "",
//     selectedPlatformName: [],
//     scheduledFor: "",
//     existingMedia: [],
//     imageFiles: [],
//     videoFiles: [],
//   });

//   const [showOptions, setShowOptions] = useState(true);

//   useEffect(() => {
//     if (post) {
//       setUpdatedPost({
//         title: post.title || "",
//         content: post.content || post.description || "",
//         selectedPlatformName: post.selectedPlatformName || [],
//         scheduledFor: post.scheduledFor
//           ? new Date(post.scheduledFor).toISOString().slice(0, 16)
//           : "",
//         existingMedia: post.media || [],
//         imageFiles: [],
//         videoFiles: [],
//       });
      
//       // Set selectedMediaType based on existing media
//       if (post.media && post.media.length > 0) {
//         const firstMedia = post.media[0];
//         if (firstMedia.match(/\.(jpeg|jpg|png|gif)$/i)) {
//           setSelectedMediaType("image");
//         } else {
//           setSelectedMediaType("video");
//         }
//       }
//     }
//   }, [post]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMinDateTime(getMinDateTimeIST());
//     }, 60000); // refresh every 1 minute
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const fetchPlatforms = async () => {
//       try {
//         const { data } = await axiosInstance.get(
//           "/platform/get-user-platformsAllData"
//         );
//         console.log("platforms:", data);
//         console.log("platformsID:", data.data._id);
//         console.log("platformsIDInner:", data.data.platforms);

//         data?.data?._id && setPlatformId(data?.data?._id);
//         setAvailablePlatforms(data.data.platforms || "");
//         console.log("Available platforms:", availablePlatforms);
//       } catch (err) {
//         console.error("Failed to fetch platforms", err);
//       }
//     };

//     if (isOpen) {
//       fetchPlatforms();
//     }
//   }, [isOpen]);

//   const handlePlatformToggle = (platformName) => {
//     setUpdatedPost((prev) => {
//       const selectedNames = prev.selectedPlatformName || [];
//       const isSelected = selectedNames.includes(platformName);

//       return {
//         ...prev,
//         selectedPlatformName: isSelected
//           ? selectedNames.filter((name) => name !== platformName)
//           : [...selectedNames, platformName],
//       };
//     });
//   };

  
//   const handleFileChange = (e, type) => {
//     const files = Array.from(e.target.files);

//     if (type === "image") {
//       setUpdatedPost((prev) => ({
//         ...prev,
//         imageFiles: [...prev.imageFiles, ...files],
//         videoFiles: [], // clear videos if images added
//       }));
//       setSelectedMediaType("image");
//     } else if (type === "video") {
//       setUpdatedPost((prev) => ({
//         ...prev,
//         videoFiles: [...prev.videoFiles, ...files],
//         imageFiles: [], // clear images if videos added
//       }));
//       setSelectedMediaType("video");
//     }
//   };

//   const handleFileSelect = (type) => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = type === "image" ? "image/*" : "video/*";
//     input.multiple = true;
//     input.onchange = (e) => {
//       if (e.target.files.length > 0) {
//         handleFileChange(e, type);
//       }
//     };
//     input.click();
//   };

//   // Remove specific image
//   const removeImage = (indexToRemove) => {
//     setUpdatedPost((prev) => ({
//       ...prev,
//       imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove),
//     }));
    
//     // If no images left, reset media type
//     if (updatedPost.imageFiles.length === 1) {
//       setSelectedMediaType("");
//     }
//   };

//   // Remove specific video
//   const removeVideo = (indexToRemove) => {
//     setUpdatedPost((prev) => ({
//       ...prev,
//       videoFiles: prev.videoFiles.filter((_, index) => index !== indexToRemove),
//     }));
    
//     // If no videos left, reset media type
//     if (updatedPost.videoFiles.length === 1) {
//       setSelectedMediaType("");
//     }
//   };

//   // Clear all media
//   const clearAllMedia = () => {
//     setUpdatedPost((prev) => ({
//       ...prev,
//       imageFiles: [],
//       videoFiles: [],
//     }));
//     setSelectedMediaType("");
//   };

//   const getISTDate = () => {
//     const now = new Date();
//     const utc = now.getTime() + now.getTimezoneOffset() * 60000;
//     return new Date(utc + 5.5 * 60 * 60 * 1000);
//   };

//   const formatToDateTimeLocal = (date) => {
//     const pad = (n) => String(n).padStart(2, "0");
//     const year = date.getFullYear();
//     const month = pad(date.getMonth() + 1);
//     const day = pad(date.getDate());
//     const hours = pad(date.getHours());
//     const minutes = pad(date.getMinutes());
//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   };

//   const updateMinDateTime = () => {
//     const nowIST = getISTDate();
//     setMinDateTime(formatToDateTimeLocal(nowIST));
//   };

//   useEffect(() => {
//     updateMinDateTime(); // initial
//     const interval = setInterval(updateMinDateTime, 30000); // every 30s
//     return () => clearInterval(interval);
//   }, []);

//   const handleUpdatePost = async () => {
//     if (updatedPost.selectedPlatformName.length === 0) {
//       alert("Please select at least one platform.");
//       return;
//     }
//     if (!updatedPost.scheduledFor) {
//       alert("Please select a scheduled date and time.");
//       return;
//     }

//     console.log(updatedPost);

//     try {
//       const formData = new FormData();
//       formData.append("title", updatedPost.title);
//       formData.append("content", updatedPost.content);
      
//       const rawTime = new Date(updatedPost.scheduledFor);
//       const istFormatted = rawTime
//         .toLocaleString("en-GB", {
//           timeZone: "Asia/Kolkata",
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//         })
//         .replace(",", "");
//       formData.append("scheduledFor", istFormatted);
      
//       formData.append(
//         "selectedPlatformName",
//         JSON.stringify(updatedPost.selectedPlatformName)
//       );

//       formData.append("createdBy", localStorage.getItem("userId"));

//       if (selectedMediaType === "image") {
//         updatedPost.imageFiles.forEach((file) => formData.append("media", file));
//         console.log("imageFiles:", updatedPost.imageFiles);
//       } else if (selectedMediaType === "video") {
//         updatedPost.videoFiles.forEach((file) => formData.append("media", file));
//         console.log("videoFiles:", updatedPost.videoFiles);
//       }

//       const response = await axiosInstance.put(
//         `/post/update-scheduled-post/${postId}`,
//          formData,
//          { headers: { "Content-Type": "multipart/form-data" } }
//        );

//       if (response.data?.success == true) {
//         alert("Post updated successfully!");
//         onUpdated();
//         setIsOpen(false);
//       }
//     } catch (error) {
//       console.error(
//         "Error updating post:",
//         error.response?.data || error.message
//       );
//       alert("Failed to update post.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
//         <DialogHeader>
//           <DialogTitle className="!text-xl font-semibold">Edit Scheduled Post</DialogTitle>
//           <DialogDescription className="text-sm text-gray-500">
//             Modify the post, change media, and save your updates.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-5">
//           <input
//             type="text"
//             placeholder="Write your post title here..."
//             value={updatedPost.title}
//             onChange={(e) =>
//               setUpdatedPost((prev) => ({ ...prev, title: e.target.value }))
//             }
//             className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <textarea
//             placeholder="Write your post content here..."
//             value={updatedPost.content}
//             onChange={(e) =>
//               setUpdatedPost((prev) => ({ ...prev, content: e.target.value }))
//             }
//             className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows={4}
//           />

//           <div>
//             <p className="font-medium mb-2">Select Platforms:</p>
//             <div className="flex gap-3 flex-wrap">
//               {availablePlatforms.map((platform) => (
//                 <button
//                   key={platform._id}
//                   type="button"
//                   onClick={() => handlePlatformToggle(platform.platformName)}
//                   className={`px-4 py-2 rounded-full border transition ${
//                     updatedPost.selectedPlatformName?.includes(
//                       platform.platformName
//                     )
//                       ? "!bg-blue-600 text-white border-blue-600"
//                       : "!bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   }`}
//                 >
//                   {platform.platformName.charAt(0).toUpperCase() +
//                     platform.platformName.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block font-medium mb-1">
//               Schedule Date & Time
//             </label>
//             <input
//               type="datetime-local"
//               min={minDateTime}
//               value={updatedPost.scheduledFor}
//               onChange={(e) => {
//                 const selected = new Date(e.target.value);
//                 const istNow = getISTDate();
//                 const selectedDate = selected.toISOString().slice(0, 10);
//                 const nowDate = istNow.toISOString().slice(0, 10);

//                 if (selectedDate === nowDate) {
//                   const minTime = istNow.getTime() + 30 * 60 * 1000;
//                   if (selected.getTime() < minTime) {
//                     toast.warning(
//                       "Please select a time at least 30 minutes from now."
//                     );
//                     return;
//                   }
//                 }

//                 setUpdatedPost((prev) => ({
//                   ...prev,
//                   scheduledFor: e.target.value,
//                 }));
//               }}
//               className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Show existing media (optional thumbnails) */}
//           {updatedPost.existingMedia?.length > 0 && (
//             <div>
//               <p className="font-medium mb-1">Existing Media</p>
//               <div className="grid grid-cols-2 gap-3">
//                 {updatedPost.existingMedia.map((url, index) => (
//                   <div key={index} className="border rounded overflow-hidden">
//                     {url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//                       <img
//                         src={url}
//                         alt="Media"
//                         className="w-full h-24 object-cover"
//                       />
//                     ) : (
//                       <video
//                         src={url}
//                         controls
//                         className="w-full h-24 object-cover"
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Media Upload Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center justify-between mb-3">
//               <p className="font-medium">Media Upload</p>
//               {(updatedPost.imageFiles.length > 0 || updatedPost.videoFiles.length > 0) && (
//                 <button
//                   onClick={clearAllMedia}
//                   className="text-sm text-red-500 hover:text-red-700 transition"
//                 >
//                   Clear All
//                 </button>
//               )}
//             </div>

//             {/* Upload Buttons */}
//             {showOptions && (
//               <div className="flex flex-wrap gap-3 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => handleFileSelect("image")}
//                   disabled={selectedMediaType === "video"}
//                   className={`px-4 py-2 border-2 border-dashed rounded-lg transition flex items-center gap-2 ${
//                     selectedMediaType === "video"
//                       ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
//                       : "border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600"
//                   }`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   Upload Images
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleFileSelect("video")}
//                   disabled={selectedMediaType === "image"}
//                   className={`px-4 py-2 border-2 border-dashed rounded-lg transition flex items-center gap-2 ${
//                     selectedMediaType === "image"
//                       ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
//                       : "border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600"
//                   }`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                   </svg>
//                   Upload Videos
//                 </button>
//               </div>
//             )}

//             {/* Image Preview Grid */}
//             {updatedPost.imageFiles.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   New Images ({updatedPost.imageFiles.length})
//                 </p>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {updatedPost.imageFiles.map((file, index) => (
//                     <div key={index} className="relative group">
//                       <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={`Preview ${index + 1}`}
//                           className="w-full h-full object-cover"
//                           onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
//                         />
//                       </div>
//                       {/* Remove button */}
//                       <button
//                         onClick={() => removeImage(index)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
//                         type="button"
//                       >
//                         ×
//                       </button>
//                       {/* File name */}
//                       <p className="text-xs text-gray-600 mt-1 truncate">
//                         {file.name}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Video Preview */}
//             {updatedPost.videoFiles.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   New Videos ({updatedPost.videoFiles.length})
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {updatedPost.videoFiles.map((file, index) => (
//                     <div key={index} className="relative group">
//                       <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
//                         <video
//                           src={URL.createObjectURL(file)}
//                           className="w-full h-40 object-cover"
//                           controls
//                           onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
//                         />
//                       </div>
//                       {/* Remove button */}
//                       <button
//                         onClick={() => removeVideo(index)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
//                         type="button"
//                       >
//                         ×
//                       </button>
//                       {/* File info */}
//                       <div className="mt-1">
//                         <p className="text-xs text-gray-600 truncate">{file.name}</p>
//                         <p className="text-xs text-gray-500">
//                           {(file.size / 1024 / 1024).toFixed(1)} MB
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <DialogFooter>
//           <button
//             className="!bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-6 py-2 rounded-lg mt-4"
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
import axiosInstance from "../../utils/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiUrls from "../../utils/apiUrls";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function getMinDateTimeIST() {
  const now = new Date();

  // Convert to IST (UTC + 5:30)
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const ist = new Date(utc + 5.5 * 60 * 60 * 1000);

  const year = ist.getFullYear();
  const month = String(ist.getMonth() + 1).padStart(2, "0");
  const date = String(ist.getDate()).padStart(2, "0");
  const hours = String(ist.getHours()).padStart(2, "0");
  const minutes = String(ist.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${date}T${hours}:${minutes}`;
}

export default function EditPostModal({
  postId,
  isOpen,
  setIsOpen,
  post,
  onUpdated,
}) {
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [selectedMediaType, setSelectedMediaType] = useState(""); // "image" or "video"
  const [UserPlatformNames, setUserPlatformNames] = useState([]);
  const [platformId, setPlatformId] = useState("");
  const [minDateTime, setMinDateTime] = useState(getMinDateTimeIST());
  const [isUploading, setIsUploading] = useState(false);
  
  const [updatedPost, setUpdatedPost] = useState({
    title: "",
    content: "",
    selectedPlatformName: [],
    scheduledFor: "",
    existingMedia: [],
    imageFiles: [],
    videoFiles: [],
  });

  const [showOptions, setShowOptions] = useState(true);

  // File validation
  const validateFile = (file, type) => {
    const maxSizeImage = 10 * 1024 * 1024; // 10MB for images
    const maxSizeVideo = 100 * 1024 * 1024; // 100MB for videos
    
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/flv'];
    
    if (type === 'image') {
      if (!imageTypes.includes(file.type)) {
        toast.error(`Invalid image format. Supported: JPEG, PNG, GIF, WebP`);
        return false;
      }
      if (file.size > maxSizeImage) {
        toast.error(`Image size too large. Maximum: 10MB`);
        return false;
      }
    } else if (type === 'video') {
      if (!videoTypes.includes(file.type)) {
        toast.error(`Invalid video format. Supported: MP4, MOV, AVI, WMV, FLV`);
        return false;
      }
      if (file.size > maxSizeVideo) {
        toast.error(`Video size too large. Maximum: 100MB`);
        return false;
      }
    }
    
    return true;
  };

  useEffect(() => {
    if (post) {
      setUpdatedPost({
        title: post.title || "",
        content: post.content || post.description || "",
        selectedPlatformName: post.selectedPlatformName || [],
        scheduledFor: post.scheduledFor
          ? new Date(post.scheduledFor).toISOString().slice(0, 16)
          : "",
        existingMedia: post.media || [],
        imageFiles: [],
        videoFiles: [],
      });
      
      // Set selectedMediaType based on existing media
      if (post.media && post.media.length > 0) {
        const firstMedia = post.media[0];
        if (firstMedia.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
          setSelectedMediaType("image");
        } else {
          setSelectedMediaType("video");
        }
      }
    }
  }, [post]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMinDateTime(getMinDateTimeIST());
    }, 60000); // refresh every 1 minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/platform/get-user-platformsAllData"
        );
        console.log("platforms:", data);
        console.log("platformsID:", data.data._id);
        console.log("platformsIDInner:", data.data.platforms);

        data?.data?._id && setPlatformId(data?.data?._id);
        setAvailablePlatforms(data.data.platforms || "");
        console.log("Available platforms:", availablePlatforms);
      } catch (err) {
        console.error("Failed to fetch platforms", err);
        toast.error("Failed to load platforms");
      }
    };

    if (isOpen) {
      fetchPlatforms();
    }
  }, [isOpen]);

  const handlePlatformToggle = (platformName) => {
    setUpdatedPost((prev) => {
      const selectedNames = prev.selectedPlatformName || [];
      const isSelected = selectedNames.includes(platformName);

      return {
        ...prev,
        selectedPlatformName: isSelected
          ? selectedNames.filter((name) => name !== platformName)
          : [...selectedNames, platformName],
      };
    });
  };

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => validateFile(file, type));
    
    if (validFiles.length === 0) return;

    // Check total file count limit
    const currentCount = type === 'image' 
      ? updatedPost.imageFiles.length 
      : updatedPost.videoFiles.length;
    
    const maxFiles = type === 'image' ? 10 : 5;
    
    if (currentCount + validFiles.length > maxFiles) {
      toast.warning(`Maximum ${maxFiles} ${type}s allowed`);
      return;
    }

    if (type === "image") {
      setUpdatedPost((prev) => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...validFiles],
        videoFiles: [], // clear videos if images added
      }));
      setSelectedMediaType("image");
    } else if (type === "video") {
      setUpdatedPost((prev) => ({
        ...prev,
        videoFiles: [...prev.videoFiles, ...validFiles],
        imageFiles: [], // clear images if videos added
      }));
      setSelectedMediaType("video");
    }

    // Reset file input
    e.target.value = '';
  };

  const handleFileSelect = (type) => {
    if (isUploading) {
      toast.warning("Please wait for current upload to complete");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.multiple = true;
    input.onchange = (e) => {
      if (e.target.files.length > 0) {
        handleFileChange(e, type);
      }
    };
    input.click();
  };

  // Remove specific image
  const removeImage = (indexToRemove) => {
    setUpdatedPost((prev) => {
      const newImageFiles = prev.imageFiles.filter((_, index) => index !== indexToRemove);
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(URL.createObjectURL(prev.imageFiles[indexToRemove]));
      
      return {
        ...prev,
        imageFiles: newImageFiles,
      };
    });
    
    // If no images left, reset media type
    if (updatedPost.imageFiles.length === 1) {
      setSelectedMediaType("");
    }
  };

  // Remove specific video
  const removeVideo = (indexToRemove) => {
    setUpdatedPost((prev) => {
      const newVideoFiles = prev.videoFiles.filter((_, index) => index !== indexToRemove);
      
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(URL.createObjectURL(prev.videoFiles[indexToRemove]));
      
      return {
        ...prev,
        videoFiles: newVideoFiles,
      };
    });
    
    // If no videos left, reset media type
    if (updatedPost.videoFiles.length === 1) {
      setSelectedMediaType("");
    }
  };

  // Clear all media
  const clearAllMedia = () => {
    // Revoke all object URLs to prevent memory leaks
    updatedPost.imageFiles.forEach(file => {
      URL.revokeObjectURL(URL.createObjectURL(file));
    });
    updatedPost.videoFiles.forEach(file => {
      URL.revokeObjectURL(URL.createObjectURL(file));
    });

    setUpdatedPost((prev) => ({
      ...prev,
      imageFiles: [],
      videoFiles: [],
    }));
    setSelectedMediaType("");
    toast.success("All media cleared");
  };

  // Remove existing media
  const removeExistingMedia = (indexToRemove) => {
    setUpdatedPost((prev) => ({
      ...prev,
      existingMedia: prev.existingMedia.filter((_, index) => index !== indexToRemove),
    }));
    toast.success("Media removed");
  };

  const getISTDate = () => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 5.5 * 60 * 60 * 1000);
  };

  const formatToDateTimeLocal = (date) => {
    const pad = (n) => String(n).padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const updateMinDateTime = () => {
    const nowIST = getISTDate();
    setMinDateTime(formatToDateTimeLocal(nowIST));
  };

  useEffect(() => {
    updateMinDateTime(); // initial
    const interval = setInterval(updateMinDateTime, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);


  
  const validateScheduleTime = (scheduledTime) => {
    if (!scheduledTime) {
      setIsValidScheduleTime(false);
      return false;
    }

    const selected = new Date(scheduledTime);
    const istNow = getISTDate();
    const minValidTime = istNow.getTime() + 30 * 60 * 1000; // 30 minutes from now

    const isValid = selected.getTime() >= minValidTime;
    setIsValidScheduleTime(isValid);
    return isValid;
  };


  const handleUpdatePost = async () => {
    // Validation
    if (!updatedPost.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!updatedPost.content.trim()) {
      toast.error("Please enter content");
      return;
    }
    
    if (updatedPost.selectedPlatformName.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }
    
    if (!updatedPost.scheduledFor) {
      toast.error("Please select a scheduled date and time");
      return;
    }

    // Check if scheduled time is in the future
    const scheduledTime = new Date(updatedPost.scheduledFor);
    const now = getISTDate();
    const minTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes from now
    
    if (scheduledTime < minTime) {
      toast.error("Please schedule at least 30 minutes in the future");
      return;
    }

    console.log(updatedPost);
    
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", updatedPost.title.trim());
      formData.append("content", updatedPost.content.trim());
      
      const rawTime = new Date(updatedPost.scheduledFor);
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
      
      formData.append(
        "selectedPlatformName",
        JSON.stringify(updatedPost.selectedPlatformName)
      );

      formData.append("createdBy", localStorage.getItem("userId"));

      // Append existing media URLs (if any should be kept)
      if (updatedPost.existingMedia.length > 0) {
        formData.append("existingMedia", JSON.stringify(updatedPost.existingMedia));
      }

      if (selectedMediaType === "image") {
        updatedPost.imageFiles.forEach((file) => formData.append("media", file));
        console.log("imageFiles:", updatedPost.imageFiles);
      } else if (selectedMediaType === "video") {
        updatedPost.videoFiles.forEach((file) => formData.append("media", file));
        console.log("videoFiles:", updatedPost.videoFiles);
      }

      const response = await axiosInstance.put(
        `/post/update-scheduled-post/${postId}`,
         formData,
         { 
           headers: { "Content-Type": "multipart/form-data" },
           onUploadProgress: (progressEvent) => {
             const percentCompleted = Math.round(
               (progressEvent.loaded * 100) / progressEvent.total
             );
             console.log(`Upload Progress: ${percentCompleted}%`);
           }
         }
       );

      if (response.data?.success == true) {
        toast.success("Post updated successfully!");
        onUpdated();
        setIsOpen(false);
        
        // Clear file URLs to prevent memory leaks
        updatedPost.imageFiles.forEach(file => {
          URL.revokeObjectURL(URL.createObjectURL(file));
        });
        updatedPost.videoFiles.forEach(file => {
          URL.revokeObjectURL(URL.createObjectURL(file));
        });
      }
    } catch (error) {
      console.error(
        "Error updating post:",
        error.response?.data || error.message
      );
      
      const errorMessage = error.response?.data?.message || "Failed to update post";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Calculate total file size for display
  const getTotalFileSize = () => {
    const imageSize = updatedPost.imageFiles.reduce((total, file) => total + file.size, 0);
    const videoSize = updatedPost.videoFiles.reduce((total, file) => total + file.size, 0);
    return (imageSize + videoSize) / (1024 * 1024); // Convert to MB
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="!text-xl font-semibold">Edit Scheduled Post</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Modify the post, change media, and save your updates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Write your post title here..."
            value={updatedPost.title}
            onChange={(e) =>
              setUpdatedPost((prev) => ({ ...prev, title: e.target.value }))
            }
            className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={200}
          />
          <div className="text-right text-xs text-gray-500">
            {updatedPost.title.length}/200 characters
          </div>

          <textarea
            placeholder="Write your post content here..."
            value={updatedPost.content}
            onChange={(e) =>
              setUpdatedPost((prev) => ({ ...prev, content: e.target.value }))
            }
            className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            maxLength={2000}
          />
          <div className="text-right text-xs text-gray-500">
            {updatedPost.content.length}/2000 characters
          </div>

          <div>
            <p className="font-medium mb-2">Select Platforms:</p>
            <div className="flex gap-3 flex-wrap">
              {availablePlatforms.length === 0 ? (
                <p className="text-gray-500 text-sm">Loading platforms...</p>
              ) : (
                availablePlatforms.map((platform) => (
                  <button
                    key={platform._id}
                    type="button"
                    onClick={() => handlePlatformToggle(platform.platformName)}
                    className={`px-4 py-2 rounded-full border transition ${
                      updatedPost.selectedPlatformName?.includes(
                        platform.platformName
                      )
                        ? "!bg-blue-600 text-white border-blue-600"
                        : "!bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {platform.platformName.charAt(0).toUpperCase() +
                      platform.platformName.slice(1)}
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">
              Schedule Date & Time (IST)
            </label>
            <input
              type="datetime-local"
              min={minDateTime}
              value={updatedPost.scheduledFor}
              onChange={(e) => {
                const selected = new Date(e.target.value);
                const istNow = getISTDate();
                const selectedDate = selected.toISOString().slice(0, 10);
                const nowDate = istNow.toISOString().slice(0, 10);

                if (selectedDate === nowDate) {
                  const minTime = istNow.getTime() + 30 * 60 * 1000;
                  if (selected.getTime() < minTime) {
                    toast.warning(
                      "Please select a time at least 30 minutes from now."
                    );
                     setIsValidScheduleTime(false);
                    setUpdatedPost((prev) => ({
                      ...prev,
                      scheduledFor: e.target.value,
                    }));
                    return;
                  }
                }

                setUpdatedPost((prev) => ({
                  ...prev,
                  scheduledFor: e.target.value,
                }));
                validateScheduleTime(e.target.value);
              }}
              className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 30 minutes from current time
            </p>
          </div>

          {/* Show existing media with remove option */}
          {updatedPost.existingMedia?.length > 0 && (
            <div>
              <p className="font-medium mb-1">Current Media</p>
              <div className="grid grid-cols-2 gap-3">
                {updatedPost.existingMedia.map((url, index) => (
                  <div key={index} className="relative group border rounded overflow-hidden">
                    {url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
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
                    <button
                      onClick={() => removeExistingMedia(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                      type="button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Media Upload Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">Media Upload</p>
              <div className="flex items-center gap-2">
                {getTotalFileSize() > 0 && (
                  <span className="text-xs text-gray-500">
                    Total: {getTotalFileSize().toFixed(1)} MB
                  </span>
                )}
                {(updatedPost.imageFiles.length > 0 || updatedPost.videoFiles.length > 0) && (
                  <button
                    onClick={clearAllMedia}
                    className="text-sm text-red-500 hover:text-red-700 transition"
                    disabled={isUploading}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Upload Buttons */}
            {showOptions && (
              <div className="flex flex-wrap gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleFileSelect("image")}
                  disabled={selectedMediaType === "video" || isUploading}
                  className={`px-4 py-2 border-2 border-dashed rounded-lg transition flex items-center gap-2 ${
                    selectedMediaType === "video" || isUploading
                      ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
                      : "border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Images
                  <span className="text-xs">(Max 10, 10MB each)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFileSelect("video")}
                  disabled={selectedMediaType === "image" || isUploading}
                  className={`px-4 py-2 border-2 border-dashed rounded-lg transition flex items-center gap-2 ${
                    selectedMediaType === "image" || isUploading
                      ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
                      : "border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Upload Videos
                  <span className="text-xs">(Max 5, 100MB each)</span>
                </button>
              </div>
            )}

            {/* Image Preview Grid */}
            {updatedPost.imageFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  New Images ({updatedPost.imageFiles.length}/10)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {updatedPost.imageFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                        type="button"
                        disabled={isUploading}
                      >
                        ×
                      </button>
                      {/* File info */}
                      <div className="mt-1">
                        <p className="text-xs text-gray-600 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Preview */}
            {updatedPost.videoFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  New Videos ({updatedPost.videoFiles.length}/5)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {updatedPost.videoFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                        <video
                          src={URL.createObjectURL(file)}
                          className="w-full h-40 object-cover"
                          controls
                          preload="metadata"
                        />
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeVideo(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
                        type="button"
                        disabled={isUploading}
                      >
                        ×
                      </button>
                      {/* File info */}
                      <div className="mt-1">
                        <p className="text-xs text-gray-600 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-3 w-full justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              className="!bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUpdatePost}
              disabled={isUploading}
            >
              {isUploading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
















// import { useState, useEffect } from "react";
// import axiosInstance from "../../utils/axiosInstance";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import apiUrls from "../../utils/apiUrls";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function getMinDateTimeIST() {
//   const now = new Date();

//   // Convert to IST (UTC + 5:30)
//   const utc = now.getTime() + now.getTimezoneOffset() * 60000;
//   const ist = new Date(utc + 5.5 * 60 * 60 * 1000);

//   const year = ist.getFullYear();
//   const month = String(ist.getMonth() + 1).padStart(2, "0");
//   const date = String(ist.getDate()).padStart(2, "0");
//   const hours = String(ist.getHours()).padStart(2, "0");
//   const minutes = String(ist.getMinutes()).padStart(2, "0");

//   return `${year}-${month}-${date}T${hours}:${minutes}`;
// }

// export default function EditPostModal({
//   postId,
//   isOpen,
//   setIsOpen,
//   post,
//   onUpdated,
// }) {
//   const [availablePlatforms, setAvailablePlatforms] = useState([]);
//   const [selectedMediaType, setSelectedMediaType] = useState(""); // "image" or "video"
//   const [UserPlatformNames, setUserPlatformNames] = useState([]);
//   const [platformId, setPlatformId] = useState("");
//   const [minDateTime, setMinDateTime] = useState(getMinDateTimeIST());
  
//   const [updatedPost, setUpdatedPost] = useState({
//     title: "",
//     content: "",
//     selectedPlatformName: [],
//     scheduledFor: "",
//     existingMedia: [],
//     imageFiles: [],
//     videoFiles: [],
//     mediaToDelete: [], // Track media URLs to delete from database
//   });

//   const [showOptions, setShowOptions] = useState(true);

//   useEffect(() => {
//     if (post) {
//       setUpdatedPost({
//         title: post.title || "",
//         content: post.content || post.description || "",
//         selectedPlatformName: post.selectedPlatformName || [],
//         scheduledFor: post.scheduledFor
//           ? new Date(post.scheduledFor).toISOString().slice(0, 16)
//           : "",
//         existingMedia: post.media || [],
//         imageFiles: [],
//         videoFiles: [],
//         mediaToDelete: [],
//       });
      
//       // Set selectedMediaType based on existing media
//       if (post.media && post.media.length > 0) {
//         const firstMedia = post.media[0];
//         if (firstMedia.match(/\.(jpeg|jpg|png|gif)$/i)) {
//           setSelectedMediaType("image");
//         } else {
//           setSelectedMediaType("video");
//         }
//       }
//     }
//   }, [post]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMinDateTime(getMinDateTimeIST());
//     }, 60000); // refresh every 1 minute
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const fetchPlatforms = async () => {
//       try {
//         const { data } = await axiosInstance.get(
//           "/platform/get-user-platformsAllData"
//         );
//         console.log("platforms:", data);
//         console.log("platformsID:", data.data._id);
//         console.log("platformsIDInner:", data.data.platforms);

//         data?.data?._id && setPlatformId(data?.data?._id);
//         setAvailablePlatforms(data.data.platforms || "");
//         console.log("Available platforms:", availablePlatforms);
//       } catch (err) {
//         console.error("Failed to fetch platforms", err);
//       }
//     };

//     if (isOpen) {
//       fetchPlatforms();
//     }
//   }, [isOpen]);

//   const handlePlatformToggle = (platformName) => {
//     setUpdatedPost((prev) => {
//       const selectedNames = prev.selectedPlatformName || [];
//       const isSelected = selectedNames.includes(platformName);

//       return {
//         ...prev,
//         selectedPlatformName: isSelected
//           ? selectedNames.filter((name) => name !== platformName)
//           : [...selectedNames, platformName],
//       };
//     });
//   };

//   const handleFileChange = (e, type) => {
//     const files = Array.from(e.target.files);

//     if (type === "image") {
//       setUpdatedPost((prev) => ({
//         ...prev,
//         imageFiles: [...prev.imageFiles, ...files],
//         videoFiles: [], // clear videos if images added
//         existingMedia: prev.existingMedia.filter(url => !url.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)), // Keep only existing images
//         mediaToDelete: [...prev.mediaToDelete, ...prev.existingMedia.filter(url => url.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i))] // Mark existing videos for deletion
//       }));
//       setSelectedMediaType("image");
//     } else if (type === "video") {
//       setUpdatedPost((prev) => ({
//         ...prev,
//         videoFiles: [...prev.videoFiles, ...files],
//         imageFiles: [], // clear images if videos added
//         existingMedia: prev.existingMedia.filter(url => !url.match(/\.(jpeg|jpg|png|gif)$/i)), // Keep only existing videos
//         mediaToDelete: [...prev.mediaToDelete, ...prev.existingMedia.filter(url => url.match(/\.(jpeg|jpg|png|gif)$/i))] // Mark existing images for deletion
//       }));
//       setSelectedMediaType("video");
//     }
//   };

//   const handleFileSelect = (type) => {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = type === "image" ? "image/*" : "video/*";
//     input.multiple = true;
//     input.onchange = (e) => {
//       if (e.target.files.length > 0) {
//         handleFileChange(e, type);
//       }
//     };
//     input.click();
//   };

//   // Remove specific image
//   const removeImage = (indexToRemove) => {
//     setUpdatedPost((prev) => ({
//       ...prev,
//       imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove),
//     }));
    
//     // If no images left, reset media type
//     if (updatedPost.imageFiles.length === 1) {
//       setSelectedMediaType("");
//     }
//   };

//   // Remove specific video
//   const removeVideo = (indexToRemove) => {
//     setUpdatedPost((prev) => ({
//       ...prev,
//       videoFiles: prev.videoFiles.filter((_, index) => index !== indexToRemove),
//     }));
    
//     // If no videos left, reset media type
//     if (updatedPost.videoFiles.length === 1) {
//       setSelectedMediaType("");
//     }
//   };

//   // Remove existing media (mark for deletion)
//   const removeExistingMedia = (indexToRemove, mediaUrl) => {
//     setUpdatedPost((prev) => ({
//       ...prev,
//       existingMedia: prev.existingMedia.filter((_, index) => index !== indexToRemove),
//       mediaToDelete: [...prev.mediaToDelete, mediaUrl]
//     }));
//   };

//   // Clear all media
//   const clearAllMedia = () => {
//     setUpdatedPost((prev) => ({
//       ...prev,
//       imageFiles: [],
//       videoFiles: [],
//       existingMedia: [],
//       mediaToDelete: [...prev.mediaToDelete, ...prev.existingMedia] // Mark all existing for deletion
//     }));
//     setSelectedMediaType("");
//   };

//   const getISTDate = () => {
//     const now = new Date();
//     const utc = now.getTime() + now.getTimezoneOffset() * 60000;
//     return new Date(utc + 5.5 * 60 * 60 * 1000);
//   };

//   const formatToDateTimeLocal = (date) => {
//     const pad = (n) => String(n).padStart(2, "0");
//     const year = date.getFullYear();
//     const month = pad(date.getMonth() + 1);
//     const day = pad(date.getDate());
//     const hours = pad(date.getHours());
//     const minutes = pad(date.getMinutes());
//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   };

//   const updateMinDateTime = () => {
//     const nowIST = getISTDate();
//     setMinDateTime(formatToDateTimeLocal(nowIST));
//   };

//   useEffect(() => {
//     updateMinDateTime(); // initial
//     const interval = setInterval(updateMinDateTime, 30000); // every 30s
//     return () => clearInterval(interval);
//   }, []);

//   const handleUpdatePost = async () => {
//     if (updatedPost.selectedPlatformName.length === 0) {
//       alert("Please select at least one platform.");
//       return;
//     }
//     if (!updatedPost.scheduledFor) {
//       alert("Please select a scheduled date and time.");
//       return;
//     }

//     console.log(updatedPost);

//     try {
//       const formData = new FormData();
//       formData.append("title", updatedPost.title);
//       formData.append("content", updatedPost.content);
      
//       const rawTime = new Date(updatedPost.scheduledFor);
//       const istFormatted = rawTime
//         .toLocaleString("en-GB", {
//           timeZone: "Asia/Kolkata",
//           day: "2-digit",
//           month: "2-digit",
//           year: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: false,
//         })
//         .replace(",", "");
//       formData.append("scheduledFor", istFormatted);
      
//       formData.append(
//         "selectedPlatformName",
//         JSON.stringify(updatedPost.selectedPlatformName)
//       );

//       formData.append("createdBy", localStorage.getItem("userId"));

//       // Send media URLs to delete
//       if (updatedPost.mediaToDelete.length > 0) {
//         formData.append("mediaToDelete", JSON.stringify(updatedPost.mediaToDelete));
//       }

//       if (selectedMediaType === "image") {
//         updatedPost.imageFiles.forEach((file) => formData.append("media", file));
//         console.log("imageFiles:", updatedPost.imageFiles);
//       } else if (selectedMediaType === "video") {
//         updatedPost.videoFiles.forEach((file) => formData.append("media", file));
//         console.log("videoFiles:", updatedPost.videoFiles);
//       }

//       const response = await axiosInstance.put(
//         `/post/update-scheduled-post/${postId}`,
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (response.data?.success == true) {
//         alert("Post updated successfully!");
//         onUpdated();
//         setIsOpen(false);
//       }
//     } catch (error) {
//       console.error(
//         "Error updating post:",
//         error.response?.data || error.message
//       );
//       alert("Failed to update post.");
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
//         <DialogHeader>
//           <DialogTitle className="!text-xl font-semibold">Edit Scheduled Post</DialogTitle>
//           <DialogDescription className="text-sm text-gray-500">
//             Modify the post, change media, and save your updates.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-5">
//           <input
//             type="text"
//             placeholder="Write your post title here..."
//             value={updatedPost.title}
//             onChange={(e) =>
//               setUpdatedPost((prev) => ({ ...prev, title: e.target.value }))
//             }
//             className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />

//           <textarea
//             placeholder="Write your post content here..."
//             value={updatedPost.content}
//             onChange={(e) =>
//               setUpdatedPost((prev) => ({ ...prev, content: e.target.value }))
//             }
//             className="!w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows={4}
//           />

//           <div>
//             <p className="font-medium mb-2">Select Platforms:</p>
//             <div className="flex gap-3 flex-wrap">
//               {availablePlatforms.map((platform) => (
//                 <button
//                   key={platform._id}
//                   type="button"
//                   onClick={() => handlePlatformToggle(platform.platformName)}
//                   className={`px-4 py-2 rounded-full border transition ${
//                     updatedPost.selectedPlatformName?.includes(
//                       platform.platformName
//                     )
//                       ? "!bg-blue-600 text-white border-blue-600"
//                       : "!bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   }`}
//                 >
//                   {platform.platformName.charAt(0).toUpperCase() +
//                     platform.platformName.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block font-medium mb-1">
//               Schedule Date & Time
//             </label>
//             <input
//               type="datetime-local"
//               min={minDateTime}
//               value={updatedPost.scheduledFor}
//               onChange={(e) => {
//                 const selected = new Date(e.target.value);
//                 const istNow = getISTDate();
//                 const selectedDate = selected.toISOString().slice(0, 10);
//                 const nowDate = istNow.toISOString().slice(0, 10);

//                 if (selectedDate === nowDate) {
//                   const minTime = istNow.getTime() + 30 * 60 * 1000;
//                   if (selected.getTime() < minTime) {
//                     toast.warning(
//                       "Please select a time at least 30 minutes from now."
//                     );
//                     return;
//                   }
//                 }

//                 setUpdatedPost((prev) => ({
//                   ...prev,
//                   scheduledFor: e.target.value,
//                 }));
//               }}
//               className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Show existing media with remove option */}
//           {updatedPost.existingMedia?.length > 0 && (
//             <div className="mb-4">
//               <p className="text-sm font-medium text-gray-700 mb-2">
//                 Existing Media ({updatedPost.existingMedia.length})
//               </p>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {updatedPost.existingMedia.map((url, index) => (
//                   <div key={index} className="relative group">
//                     <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
//                       {url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
//                         <img
//                           src={url}
//                           alt={`Existing Media ${index + 1}`}
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <video
//                           src={url}
//                           className="w-full h-full object-cover"
//                           controls
//                         />
//                       )}
//                     </div>
//                     {/* Remove button */}
//                     <button
//                       onClick={() => removeExistingMedia(index, url)}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
//                       type="button"
//                       title="Remove this media"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Media Upload Section */}
//           <div className="border-t pt-4">
//             <div className="flex items-center justify-between mb-3">
//               <p className="font-medium">Media Upload</p>
//               {(updatedPost.imageFiles.length > 0 || updatedPost.videoFiles.length > 0 || updatedPost.existingMedia.length > 0) && (
//                 <button
//                   onClick={clearAllMedia}
//                   className="text-sm text-red-500 hover:text-red-700 transition"
//                 >
//                   Clear All
//                 </button>
//               )}
//             </div>

//             {/* Upload Buttons */}
//             {showOptions && (
//               <div className="flex flex-wrap gap-3 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => handleFileSelect("image")}
//                   disabled={selectedMediaType === "video"}
//                   className={`px-4 py-2 border-2 border-dashed rounded-lg transition flex items-center gap-2 ${
//                     selectedMediaType === "video"
//                       ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
//                       : "border-blue-300 hover:border-blue-500 hover:bg-blue-50 text-blue-600"
//                   }`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                   </svg>
//                   {updatedPost.imageFiles.length > 0 ? 'Add More Images' : 'Upload Images'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleFileSelect("video")}
//                   disabled={selectedMediaType === "image"}
//                   className={`px-4 py-2 border-2 border-dashed rounded-lg transition flex items-center gap-2 ${
//                     selectedMediaType === "image"
//                       ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300"
//                       : "border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-600"
//                   }`}
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
//                   </svg>
//                   {updatedPost.videoFiles.length > 0 ? 'Add More Videos' : 'Upload Videos'}
//                 </button>
//               </div>
//             )}

//             {/* Image Preview Grid */}
//             {updatedPost.imageFiles.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   New Images ({updatedPost.imageFiles.length})
//                 </p>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                   {updatedPost.imageFiles.map((file, index) => (
//                     <div key={index} className="relative group">
//                       <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
//                         <img
//                           src={URL.createObjectURL(file)}
//                           alt={`Preview ${index + 1}`}
//                           className="w-full h-full object-cover"
//                           onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
//                         />
//                       </div>
//                       {/* Remove button */}
//                       <button
//                         onClick={() => removeImage(index)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
//                         type="button"
//                       >
//                         ×
//                       </button>
//                       {/* File name */}
//                       <p className="text-xs text-gray-600 mt-1 truncate">
//                         {file.name}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Video Preview */}
//             {updatedPost.videoFiles.length > 0 && (
//               <div className="mb-4">
//                 <p className="text-sm font-medium text-gray-700 mb-2">
//                   New Videos ({updatedPost.videoFiles.length})
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {updatedPost.videoFiles.map((file, index) => (
//                     <div key={index} className="relative group">
//                       <div className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
//                         <video
//                           src={URL.createObjectURL(file)}
//                           className="w-full h-40 object-cover"
//                           controls
//                           onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
//                         />
//                       </div>
//                       {/* Remove button */}
//                       <button
//                         onClick={() => removeVideo(index)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition shadow-lg opacity-0 group-hover:opacity-100"
//                         type="button"
//                       >
//                         ×
//                       </button>
//                       {/* File info */}
//                       <div className="mt-1">
//                         <p className="text-xs text-gray-600 truncate">{file.name}</p>
//                         <p className="text-xs text-gray-500">
//                           {(file.size / 1024 / 1024).toFixed(1)} MB
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <DialogFooter>
//           <button
//             className="!bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-6 py-2 rounded-lg mt-4"
//             onClick={handleUpdatePost}
//           >
//             Save Changes
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
