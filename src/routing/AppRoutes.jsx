











// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Layout from './Layout';
// import HomePage from '../MyComponent/HomePage';
// import EditPostPage from '../MyComponent/EditPostPage';
// import SignupForm from "../MyComponent/auth/SignupForm";
// import LoginForm from '../MyComponent/auth/LoginForm';


// export default function AppRouting() {
//   return (
//     <Routes>
//       <Route path="/" element={<Layout />}>
    
//         <Route index element={<HomePage />} />
//         <Route path="/edit-post/:postId" element={<EditPostPage />} />
//           <Route path="/signup" element={<SignupForm/>}/>
//           <Route path="/login" element={<LoginForm/>}/>
       
//       </Route>
//     </Routes>
//   );


  
//     // <Router>
//     //   <Routes>
//     //     <Route path="/signup" element={<SignupForm />} />
//     //     <Route path="/login" element={<LoginForm />} />
//     //     <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
//     //     <Route path="*" element={<Navigate to="/signup" />} />
//     //   </Routes>
//     // </Router>
//   //);
// }





import React from "react";
import { Routes, Route } from "react-router-dom";


import Home from "../Layout/Home"; // Your layout wrapper
import HomePage from "../MyComponent/HomePage";
import EditPostPage from "../MyComponent/EditPostPage";

export default function AppRouting() {
  return (
    <>
      <Routes>
       

        {/* Private Routes inside Home layout */}
        <Route
          path="/"
          element={
            <Home>
              <HomePage />
            </Home>
          }
        />
        <Route
          path="/edit-post/:postId"
          element={
            <Home>
              <EditPostPage />
            </Home>
          }
        />
      </Routes>
    </>
  );
}


