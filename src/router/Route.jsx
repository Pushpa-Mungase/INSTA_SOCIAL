
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from './Layout';
import HomePage from '../MyComponent/HomePage';
import EditPostPage from '../MyComponent/EditPostPage';
import SignupForm from "../MyComponent/auth/SignupForm";
import LoginForm from '../MyComponent/auth/LoginForm';
// import { useAuth } from "./context/AuthContext";


// function App() {
//   const { isAuthenticated } = useAuth();
// }

export default function AppRouting() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
    
        <Route index element={<HomePage />} />
        <Route path="/edit-post/:postId" element={<EditPostPage />} />
          <Route path="/signup" element={<SignupForm/>}/>
          <Route path="/login" element={<LoginForm/>}/>
       
      </Route>
    </Routes>
  );


  
    // <Router>
    //   <Routes>
    //     <Route path="/signup" element={<SignupForm />} />
    //     <Route path="/login" element={<LoginForm />} />
    //     <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
    //     <Route path="*" element={<Navigate to="/signup" />} />
    //   </Routes>
    // </Router>
  //);
}
