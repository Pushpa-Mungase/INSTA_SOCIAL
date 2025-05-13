// import { useState } from "react";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { FiPlusCircle } from "react-icons/fi";
// import { FaPlusCircle } from "react-icons/fa";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// export default function HomePage() {
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [newPost, setNewPost] = useState({ title: "", description: "" });

//   const posts = Array.from({ length: 9 }, (_, i) => ({
//     id: i + 1,
//     title: `Scheduled Post ${i + 1}`,
//     description: `This is a scheduled post for item ${i + 1}`,
//   }));

//   const toggleMenu = (id) => {
//     setActiveMenu(activeMenu === id ? null : id);
//   };

//   const handleEdit = (id) => {
//     console.log("Edit post", id);
//     // add navigation or modal logic here
//   };

//   const handleDelete = (id) => {
//     console.log("Delete post", id);
//     // add confirmation & delete logic here
//   };

//   return (
//     <>
//       <div className="flex flex-col gap-2 py-2">
//         <div className="self-end mr-5">
//           <button
//             onClick={() => setIsCreateModalOpen(true)}
//             className="!bg-green-500 rounded-full p-3 hover:!bg-green-600 shadow-lg transition duration-300"
//             title="Create New Post"
//           >
//             <FaPlusCircle size={24} />
//           </button>
//         </div>

//         <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Create New Post</DialogTitle>
//               <DialogDescription>Add a new post below.</DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 value={newPost.title}
//                 onChange={(e) =>
//                   setNewPost((prev) => ({ ...prev, title: e.target.value }))
//                 }
//                 className="w-full border p-2 rounded"
//                 placeholder="Post Title"
//               />
//               <textarea
//                 value={newPost.description}
//                 onChange={(e) =>
//                   setNewPost((prev) => ({
//                     ...prev,
//                     description: e.target.value,
//                   }))
//                 }
//                 className="w-full border p-2 rounded"
//                 placeholder="Post Description"
//               />
//               <input type="file" accept="image/*,video/*" className="w-full" />
//             </div>

//             <DialogFooter>
//               <button
//                 className="bg-green-600 text-white px-4 py-2 rounded mt-4"
//                 onClick={() => {
//                   console.log("Create post", newPost);
//                   setNewPost({ title: "", description: "" });
//                   setIsCreateModalOpen(false);
//                 }}
//               >
//                 Create Post
//               </button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         <div className="p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Edit Post</DialogTitle>
//                   <DialogDescription>
//                     You can update the title and description below.
//                   </DialogDescription>
//                 </DialogHeader>

//                 <div className="space-y-4">
//                   <input
//                     type="text"
//                     value={selectedPost?.title || ""}
//                     onChange={(e) =>
//                       setSelectedPost((prev) => ({
//                         ...prev,
//                         title: e.target.value,
//                       }))
//                     }
//                     className="w-full border p-2 rounded"
//                     placeholder="Post Title"
//                   />
//                   <textarea
//                     value={selectedPost?.description || ""}
//                     onChange={(e) =>
//                       setSelectedPost((prev) => ({
//                         ...prev,
//                         description: e.target.value,
//                       }))
//                     }
//                     className="w-full border p-2 rounded"
//                     placeholder="Post Description"
//                   />
//                   <input
//                     type="file"
//                     accept="image/*,video/*"
//                     className="w-full"
//                   />
//                 </div>

//                 <DialogFooter>
//                   <button
//                     className="bg-blue-600 px-4 py-2 rounded mt-4"
//                     onClick={() => {
//                       console.log("Save updated post", selectedPost);
//                       setIsEditModalOpen(false);
//                     }}
//                   >
//                     Save Changes
//                   </button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>

//             {posts.map((post) => (
//               <div
//                 key={post.id}
//                 className="relative bg-white border shadow rounded-lg p-4"
//               >
//                 {/* 3-dot menu */}
//                 <div className="absolute top-2 right-2">
//                   <button
//                     onClick={() => toggleMenu(post.id)}
//                     className="text-gray-600"
//                   >
//                     <BsThreeDotsVertical size={20} />
//                   </button>
//                   {activeMenu === post.id && (
//                     <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
//                       <button
//                         onClick={() => {
//                           setSelectedPost(post);
//                           setIsEditModalOpen(true);
//                         }}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                       >
//                         Edit
//                       </button>

//                       <button
//                         onClick={() => handleDelete(post.id)}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Card Content */}
//                 <h2 className="text-lg font-bold mb-2">{post.title}</h2>
//                 <p className="text-gray-600 text-sm">{post.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





// import { useState } from "react";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { FaPlusCircle } from "react-icons/fa";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import apiUrls from "../utils/apiUrls";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";



// const platformsList = ["facebook", "twitter", "linkedin", "instagram"];

// export default function HomePage() {
//   const [activeMenu, setActiveMenu] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [newPost, setNewPost] = useState({
//     title: "",
//     description: "",
//     platforms: [],
//     scheduledFor: "",
//   });



//   // const { logout } = useAuth();
//   // const navigate = useNavigate();

//   // const handleLogout = () => {
//   //   logout();
//   //   navigate("/login");
//   // };

//   // return (
//   //   <div>
//   //     <h1>Welcome to the Home Page!</h1>
//   //     <button onClick={handleLogout}>Logout</button>
//   //   </div>
//   // );

//   const toggleMenu = (id) => setActiveMenu(activeMenu === id ? null : id);

//   const handleDelete = (id) => {
//     console.log("Delete post", id);
//     // Add delete logic
//   };

//   const handleCreatePost = async () => {
//     try {
//       const payload = {
//         createdBy: "681aede8921b39c6cecde76a", // Replace with real user ID (from auth)
//         content: newPost.description,
//         platforms: newPost.platforms,
//         scheduledFor: newPost.scheduledFor,
//         imageUrls: [], // For now empty
//         videoUrls: [], // For now empty
//       };
//       console.log(payload, "response")
//       console.log("Type of platforms:", typeof newPost.platforms);
// console.log("Platforms value:", newPost.platforms);


//       const res = await axiosInstance.post(apiUrls.createScheduledPost, payload);
//       console.log("Post created successfully", res.data); 

//       setNewPost({ title: "", description: "", platforms: [], scheduledFor: "" });
//       setIsCreateModalOpen(false);
//     } catch (err) {
//       console.error("Error creating post", err);
//     }
//   };

//   const handlePlatformToggle = (platform) => {
//     setNewPost((prev) => {
//       const platforms = prev.platforms.includes(platform)
//         ? prev.platforms.filter((p) => p !== platform)
//         : [...prev.platforms, platform];
//       return { ...prev, platforms };
//     });
//   };

//   const posts = Array.from({ length: 9 }, (_, i) => ({
//     id: i + 1,
//     title: `Scheduled Post ${i + 1}`,
//     description: `This is a scheduled post for item ${i + 1}`,
//   }));

//   return (
//     <>
//       <div className="flex flex-col gap-2 py-2">
//         {/* Create Button */}
//         <div className="self-end mr-5">
//           <button
//             onClick={() => setIsCreateModalOpen(true)}
//             className="!bg-green-500 rounded-full p-3 hover:!bg-green-600 shadow-lg transition duration-300"
//             title="Create New Post"
//           >
//             <FaPlusCircle size={24} />
//           </button>
//         </div>

//         {/* Create Modal */}
//         <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Create New Post</DialogTitle>
//               <DialogDescription>Fill out the form below.</DialogDescription>
//             </DialogHeader>

//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Post Title"
//                 value={newPost.title}
//                 onChange={(e) =>
//                   setNewPost((prev) => ({ ...prev, title: e.target.value }))
//                 }
//                 className="w-full border p-2 rounded"
//               />

//               <textarea
//                 placeholder="Post Description"
//                 value={newPost.description}
//                 onChange={(e) =>
//                   setNewPost((prev) => ({ ...prev, description: e.target.value }))
//                 }
//                 className="w-full border p-2 rounded"
//               />

//               <div className="flex gap-2 flex-wrap">
//                 {platformsList.map((platform) => (
//                   <button
//                     key={platform}
//                     type="button"
//                     onClick={() => handlePlatformToggle(platform)}
//                     className={`px-3 py-1 border rounded-full ${
//                       newPost.platforms.includes(platform)
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-100"
//                     }`}
//                   >
//                     {platform}
//                   </button>
//                 ))}
//               </div>

//               <input
//                 type="datetime-local"
//                 value={newPost.scheduledFor}
//                 onChange={(e) =>
//                   setNewPost((prev) => ({ ...prev, scheduledFor: e.target.value }))
//                 }
//                 className="w-full border p-2 rounded"
//               />
//             </div>

//             <DialogFooter>
//               <button
//                 className="bg-green-600 text-white px-4 py-2 rounded mt-4"
//                 onClick={handleCreatePost}
//               >
//                 Create Post
//               </button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Post Cards */}
//         <div className="p-6">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//             {posts.map((post) => (
//               <div
//                 key={post.id}
//                 className="relative bg-white border shadow rounded-lg p-4"
//               >
//                 {/* 3-dot menu */}
//                 <div className="absolute top-2 right-2">
//                   <button onClick={() => toggleMenu(post.id)}>
//                     <BsThreeDotsVertical size={20} />
//                   </button>
//                   {activeMenu === post.id && (
//                     <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
//                       <button
//                         onClick={() => {
//                           setSelectedPost(post);
//                           setIsEditModalOpen(true);
//                         }}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(post.id)}
//                         className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <h2 className="text-lg font-bold mb-2">{post.title}</h2>
//                 <p className="text-gray-600 text-sm">{post.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }






// import { useState } from "react";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import { FaPlusCircle } from "react-icons/fa";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import apiUrls from "../utils/apiUrls";
// import axiosInstance from "../utils/axiosInstance";
// import { useAuth } from "../context/AuthContext";

// const platformsList = ["facebook", "twitter", "linkedin", "instagram"];

// export default function HomePage() {
//   const { isAuthenticated, login, logout } = useAuth();
//   const [authView, setAuthView] = useState("signup"); // or "login"
//   const [authData, setAuthData] = useState({ name: "",email: "", password: "", remember: false });

//   const [activeMenu, setActiveMenu] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [newPost, setNewPost] = useState({
//     title: "",
//     description: "",
//     platforms: [],
//     scheduledFor: "",
//   });

//   const toggleMenu = (id) => setActiveMenu(activeMenu === id ? null : id);

//   const handleDelete = (id) => {
//     console.log("Delete post", id);
//   };

//   const handleCreatePost = async () => {
//     try {
//       const payload = {
//         createdBy: "681aede8921b39c6cecde76a", // Replace with actual user ID
//         content: newPost.description,
//         platforms: newPost.platforms,
//         scheduledFor: newPost.scheduledFor,
//         imageUrls: [],
//         videoUrls: [],
//       };
//       const res = await axiosInstance.post(apiUrls.createScheduledPost, payload);
//       console.log("Post created successfully", res.data);

//       setNewPost({ title: "", description: "", platforms: [], scheduledFor: "" });
//       setIsCreateModalOpen(false);
//     } catch (err) {
//       console.error("Error creating post", err);
//     }
//   };

//   const handlePlatformToggle = (platform) => {
//     setNewPost((prev) => {
//       const platforms = prev.platforms.includes(platform)
//         ? prev.platforms.filter((p) => p !== platform)
//         : [...prev.platforms, platform];
//       return { ...prev, platforms };
//     });
//   };

//   const handleAuthSubmit = (e) => {
//     e.preventDefault();
//     // Simulate success
//     const fakeToken = "fake-auth-token";
//     login(fakeToken, authData.remember);
//   };

//   const posts = Array.from({ length: 9 }, (_, i) => ({
//     id: i + 1,
//     title: `Scheduled Post ${i + 1}`,
//     description: `This is a scheduled post for item ${i + 1}`,
//   }));

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center flex-col gap-4">
//         <h1 className="text-xl font-bold">
//           {authView === "signup" ? "Sign Up" : "Login"}
//         </h1>
//         <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-3">
//             {/* <input
//             type="name"
//             required
//             placeholder="Name"
//             value={authData.name}
//             onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
//             className="w-full border p-2 rounded"
//           /> */}


//           {authView === "signup" && (
//   <input
//     type="text"
//     required
//     placeholder="Name"
//     value={authData.name}
//     onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
//     className="w-full border p-2 rounded"
//   />
// )}
//           <input
//             type="email"
//             required
//             placeholder="Email"
//             value={authData.email}
//             onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
//             className="w-full border p-2 rounded"
//           />
//           <input
//             type="password"
//             required
//             placeholder="Password"
//             value={authData.password}
//             onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
//             className="w-full border p-2 rounded"
//           />
          
//           <label className="flex items-center gap-2 text-sm">
//             <input
//               type="checkbox"
//               checked={authData.remember}
//               onChange={(e) =>
//                 setAuthData({ ...authData, remember: e.target.checked })
//               }
//             />
//             Remember Me
//           </label>
//           <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
//             {authView === "signup" ? "Sign Up" : "Login"}
//           </button>
//         </form>
//         <p
//           className="text-sm text-blue-600 cursor-pointer"
//           onClick={() => setAuthView(authView === "signup" ? "login" : "signup")}
//         >
//           {authView === "signup"
//             ? "Already have an account? Login"
//             : "Don’t have an account? Sign Up"}
//         </p>
//       </div>
//     );
//   }



// //   {!isAuthenticated && (
// //   <div className="min-h-screen flex items-center justify-center flex-col gap-4">
// //     <h1 className="text-xl font-bold">
// //       {authView === "signup" ? "Sign Up" : "Login"}
// //     </h1>

// //     <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-3">
// //       {authView === "signup" && (
// //         <input
// //           type="text"
// //           required
// //           placeholder="Name"
// //           value={authData.name}
// //           onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
// //           className="w-full border p-2 rounded"
// //           pattern="^[A-Za-z\s]{3,40}$"
// //           title="Name should be 3-40 characters and contain only letters and spaces"
// //         />
// //       )}

// //       <input
// //         type="email"
// //         required
// //         placeholder="Email"
// //         value={authData.email}
// //         onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
// //         className="w-full border p-2 rounded"
// //         pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
// //         title="Enter a valid email address"
// //       />

// //       <input
// //         type="password"
// //         required
// //         placeholder="Password"
// //         value={authData.password}
// //         onChange={(e) =>
// //           setAuthData({ ...authData, password: e.target.value })
// //         }
// //         className="w-full border p-2 rounded"
// //         pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
// //         title="Password must be at least 6 characters long and include both letters and numbers"
// //       />

// //       <label className="flex items-center gap-2 text-sm">
// //         <input
// //           type="checkbox"
// //           checked={authData.remember}
// //           onChange={(e) =>
// //             setAuthData({ ...authData, remember: e.target.checked })
// //           }
// //         />
// //         Remember Me
// //       </label>

// //       <button
// //         type="submit"
// //         className="w-full bg-blue-600 text-white p-2 rounded"
// //       >
// //         {authView === "signup" ? "Sign Up" : "Login"}
// //       </button>
// //     </form>

// //     <p
// //       className="text-sm text-blue-600 cursor-pointer"
// //       onClick={() =>
// //         setAuthView(authView === "signup" ? "login" : "signup")
// //       }
// //     >
// //       {authView === "signup"
// //         ? "Already have an account? Login"
// //         : "Don’t have an account? Sign Up"}
// //     </p>
// //   </div>
// // )}


//   return (
//     <div className="flex flex-col gap-2 py-2">
//       {/* Top bar with logout */}
//       <div className="flex justify-between items-center px-4 py-2 border-b">
//         <h2 className="text-xl font-bold">Scheduled Posts</h2>
//         <button onClick={logout} className="text-red-500 border px-3 py-1 rounded">
//           Logout
//         </button>
//       </div>

//       {/* Create Button */}
//       <div className="self-end mr-5">
//         <button
//           onClick={() => setIsCreateModalOpen(true)}
//           className="!bg-green-500 rounded-full p-3 hover:!bg-green-600 shadow-lg transition duration-300"
//           title="Create New Post"
//         >
//           <FaPlusCircle size={24} />
//         </button>
//       </div>

//       {/* Create Modal */}
//       <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Post</DialogTitle>
//             <DialogDescription>Fill out the form below.</DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             <input
//               type="text"
//               placeholder="Post Title"
//               value={newPost.title}
//               onChange={(e) =>
//                 setNewPost((prev) => ({ ...prev, title: e.target.value }))
//               }
//               className="w-full border p-2 rounded"
//             />

//             <textarea
//               placeholder="Post Description"
//               value={newPost.description}
//               onChange={(e) =>
//                 setNewPost((prev) => ({ ...prev, description: e.target.value }))
//               }
//               className="w-full border p-2 rounded"
//             />

//             <div className="flex gap-2 flex-wrap">
//               {platformsList.map((platform) => (
//                 <button
//                   key={platform}
//                   type="button"
//                   onClick={() => handlePlatformToggle(platform)}
//                   className={`px-3 py-1 border rounded-full ${
//                     newPost.platforms.includes(platform)
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100"
//                   }`}
//                 >
//                   {platform}
//                 </button>
//               ))}
//             </div>

//             <input
//               type="datetime-local"
//               value={newPost.scheduledFor}
//               onChange={(e) =>
//                 setNewPost((prev) => ({
//                   ...prev,
//                   scheduledFor: e.target.value,
//                 }))
//               }
//               className="w-full border p-2 rounded"
//             />
//           </div>

//           <DialogFooter>
//             <button
//               className="bg-green-600 text-white px-4 py-2 rounded mt-4"
//               onClick={handleCreatePost}
//             >
//               Create Post
//             </button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Post Cards */}
//       <div className="p-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {posts.map((post) => (
//             <div
//               key={post.id}
//               className="relative bg-white border shadow rounded-lg p-4"
//             >
//               <div className="absolute top-2 right-2">
//                 <button onClick={() => toggleMenu(post.id)}>
//                   <BsThreeDotsVertical size={20} />
//                 </button>
//                 {activeMenu === post.id && (
//                   <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
//                     <button
//                       onClick={() => {
//                         setSelectedPost(post);
//                         setIsEditModalOpen(true);
//                       }}
//                       className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(post.id)}
//                       className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <h2 className="text-lg font-bold mb-2">{post.title}</h2>
//               <p className="text-gray-600 text-sm">{post.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }








import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlusCircle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import apiUrls from "../utils/apiUrls";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const platformsList = ["facebook", "twitter", "linkedin", "instagram"];

export default function HomePage() {
  const { isAuthenticated, login, logout } = useAuth();
  const [authView, setAuthView] = useState("signup"); // or "login"
  const [authData, setAuthData] = useState({ name: "",email: "", password: "", remember: false });

  const [activeMenu, setActiveMenu] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    platforms: [],
    scheduledFor: "",
  });

  const toggleMenu = (id) => setActiveMenu(activeMenu === id ? null : id);

  const handleDelete = (id) => {
    console.log("Delete post", id);
  };

  const handleCreatePost = async () => {
    try {
      const payload = {
        createdBy: localStorage.getItem("userId"), // Fetch stored ID

        content: newPost.description,
        platforms: newPost.platforms,
        scheduledFor: newPost.scheduledFor,
        imageUrls: [],
        videoUrls: [],
      };
      const res = await axiosInstance.post(apiUrls.createScheduledPost, payload);
      console.log("Post created successfully", res.data);

      setNewPost({ title: "", description: "", platforms: [], scheduledFor: "" });
      setIsCreateModalOpen(false);
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

  // const handleAuthSubmit = (e) => {
  //   e.preventDefault();
  //   // Simulate success
  //   const fakeToken = "fake-auth-token";
  //   login(fakeToken, authData.remember);
  // };




  const handleAuthSubmit = async (e) => {
  e.preventDefault();

  try {
    const url =
      authView === "signup"
        ? "http://127.0.0.1:8000/api/v1/user/create"
        : "http://127.0.0.1:8000/api/v1/auth/login"; // You may need to create this endpoint

    const payload =
      authView === "signup"
        ? { name: authData.name, email: authData.email, password: authData.password }
        : { email: authData.email, password: authData.password };

    const res = await axiosInstance.post(url, payload);

    if (res.data.status) {
      const token = res.data.token || "dummy-token"; // Replace with real token if returned
      const userId = res.data.user?._id;
      login(token, authData.remember);

      // Optional: store user ID globally or in context/localStorage
      localStorage.setItem("userId", userId);
    } else {
      alert("Authentication failed.");
    }
  } catch (err) {
    console.error("Auth error:", err);
    alert("Something went wrong during authentication.");
  }
};


  const posts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    title: `Scheduled Post ${i + 1}`,
    description: `This is a scheduled post for item ${i + 1}`,
  }));

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-xl font-bold">
          {authView === "signup" ? "Sign Up" : "Login"}
        </h1>
        <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-3">
            {/* <input
            type="name"
            required
            placeholder="Name"
            value={authData.name}
            onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
            className="w-full border p-2 rounded"
          /> */}


          {authView === "signup" && (
  <input
    type="text"
    required
    placeholder="Name"
    value={authData.name}
    onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
    className="w-full border p-2 rounded"
  />
)}
          <input
            type="email"
            required
            placeholder="Email"
            value={authData.email}
            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={authData.password}
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            className="w-full border p-2 rounded"
          />
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={authData.remember}
              onChange={(e) =>
                setAuthData({ ...authData, remember: e.target.checked })
              }
            />
            Remember Me
          </label>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            {authView === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>
        <p
          className="text-sm text-blue-600 cursor-pointer"
          onClick={() => setAuthView(authView === "signup" ? "login" : "signup")}
        >
          {authView === "signup"
            ? "Already have an account? Login"
            : "Don’t have an account? Sign Up"}
        </p>
      </div>
    );
  }



//   {!isAuthenticated && (
//   <div className="min-h-screen flex items-center justify-center flex-col gap-4">
//     <h1 className="text-xl font-bold">
//       {authView === "signup" ? "Sign Up" : "Login"}
//     </h1>

//     <form onSubmit={handleAuthSubmit} className="w-full max-w-sm space-y-3">
//       {authView === "signup" && (
//         <input
//           type="text"
//           required
//           placeholder="Name"
//           value={authData.name}
//           onChange={(e) => setAuthData({ ...authData, name: e.target.value })}
//           className="w-full border p-2 rounded"
//           pattern="^[A-Za-z\s]{3,40}$"
//           title="Name should be 3-40 characters and contain only letters and spaces"
//         />
//       )}

//       <input
//         type="email"
//         required
//         placeholder="Email"
//         value={authData.email}
//         onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
//         className="w-full border p-2 rounded"
//         pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
//         title="Enter a valid email address"
//       />

//       <input
//         type="password"
//         required
//         placeholder="Password"
//         value={authData.password}
//         onChange={(e) =>
//           setAuthData({ ...authData, password: e.target.value })
//         }
//         className="w-full border p-2 rounded"
//         pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
//         title="Password must be at least 6 characters long and include both letters and numbers"
//       />

//       <label className="flex items-center gap-2 text-sm">
//         <input
//           type="checkbox"
//           checked={authData.remember}
//           onChange={(e) =>
//             setAuthData({ ...authData, remember: e.target.checked })
//           }
//         />
//         Remember Me
//       </label>

//       <button
//         type="submit"
//         className="w-full bg-blue-600 text-white p-2 rounded"
//       >
//         {authView === "signup" ? "Sign Up" : "Login"}
//       </button>
//     </form>

//     <p
//       className="text-sm text-blue-600 cursor-pointer"
//       onClick={() =>
//         setAuthView(authView === "signup" ? "login" : "signup")
//       }
//     >
//       {authView === "signup"
//         ? "Already have an account? Login"
//         : "Don’t have an account? Sign Up"}
//     </p>
//   </div>
// )}


  return (
    <div className="flex flex-col gap-2 py-2">
      {/* Top bar with logout */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h2 className="text-xl font-bold">Scheduled Posts</h2>
        <button onClick={logout} className="text-red-500 border px-3 py-1 rounded">
          Logout
        </button>
      </div>

      {/* Create Button */}
      <div className="self-end mr-5">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="!bg-green-500 rounded-full p-3 hover:!bg-green-600 shadow-lg transition duration-300"
          title="Create New Post"
        >
          <FaPlusCircle size={24} />
        </button>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
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

      {/* Post Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-white border shadow rounded-lg p-4"
            >
              <div className="absolute top-2 right-2">
                <button onClick={() => toggleMenu(post.id)}>
                  <BsThreeDotsVertical size={20} />
                </button>
                {activeMenu === post.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                    <button
                      onClick={() => {
                        setSelectedPost(post);
                        setIsEditModalOpen(true);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-lg font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 text-sm">{post.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

