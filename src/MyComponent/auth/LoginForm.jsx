// // // src/components/Auth/LoginForm.jsx
// // import { useState } from "react";
// // import { login } from "../../services/authService";

// // const LoginForm = () => {
// //   const [form, setForm] = useState({ email: "", password: "" });
// //   const [message, setMessage] = useState("");

// //   const handleChange = (e) =>
// //     setForm({ ...form, [e.target.name]: e.target.value });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await login(form);
// //       localStorage.setItem("token", res.data.token);
// //       setMessage("Login successful!");
// //       // Optional: redirect or update global state
// //     } catch (err) {
// //       setMessage(err.response?.data?.message || "Login failed");
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto mt-10">
// //       <h2 className="text-xl font-bold mb-4">Login</h2>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="email"
// //           name="email"
// //           placeholder="Email"
// //           value={form.email}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
// //         <input
// //           type="password"
// //           name="password"
// //           placeholder="Password"
// //           value={form.password}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
// //         <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
// //           Login
// //         </button>
// //         {message && <p className="text-sm mt-2">{message}</p>}
// //       </form>
// //     </div>
// //   );
// // };

// // export default LoginForm;



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { setToken } from "../../utils/tokenUtils";

// const LoginForm = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Replace with real login API
//       const token = "mock_token";
//       setToken(token);
//       login();
//       navigate("/home");
//     } catch {
//       setMessage("Login failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="email" onChange={handleChange} required />
//       <input name="password" type="password" onChange={handleChange} required />
//       <button>Login</button>
//       <p>{message}</p>
//     </form>
//   );
// };

// export default LoginForm;



import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate token
    login("fake-token");
    navigate("/home");
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
