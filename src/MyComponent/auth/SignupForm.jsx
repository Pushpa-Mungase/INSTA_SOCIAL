// // // src/components/Auth/SignupForm.jsx
// // import { useState } from "react";
// // import { signup } from "../../services/authService";

// // const SignupForm = () => {
// //   const [form, setForm] = useState({ name: "", email: "", password: "" });
// //   const [message, setMessage] = useState("");

// //   const handleChange = (e) =>
// //     setForm({ ...form, [e.target.name]: e.target.value });

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const res = await signup(form);
// //       setMessage("Signup successful. You can now log in.");
// //     } catch (err) {
// //       setMessage(err.response?.data?.message || "Signup failed");
// //     }
// //   };

// //   return (
// //     <div className="max-w-md mx-auto mt-10">
// //       <h2 className="text-xl font-bold mb-4">Sign Up</h2>
// //       <form onSubmit={handleSubmit} className="space-y-4">
// //         <input
// //           type="text"
// //           name="name"
// //           placeholder="Name"
// //           value={form.name}
// //           onChange={handleChange}
// //           className="w-full p-2 border rounded"
// //           required
// //         />
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
// //         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
// //           Sign Up
// //         </button>
// //         {message && <p className="text-sm mt-2">{message}</p>}
// //       </form>
// //     </div>
// //   );
// // };

// // export default SignupForm;



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SignupForm = () => {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Replace with your signup API
//       await fakeSignup(form);
//       setMessage("Signup successful. Redirecting to login...");
//       setTimeout(() => navigate("/login"), 1000);
//     } catch {
//       setMessage("Signup failed");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="name" onChange={handleChange} required />
//       <input name="email" onChange={handleChange} required />
//       <input name="password" onChange={handleChange} type="password" required />
//       <button>Sign Up</button>
//       <p>{message}</p>
//     </form>
//   );
// };

// export default SignupForm;

// // Dummy API
// const fakeSignup = (data) => new Promise((resolve) => setTimeout(resolve, 500));

import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // Simulate signup
    alert("Signup successful!");
    navigate("/login");
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Sign Up</h2>
  
      <input type="name" placeholder="Name" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
       
     
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignupForm;
