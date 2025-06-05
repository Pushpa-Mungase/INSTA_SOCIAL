// components/auth/AuthForm.jsx
import React from "react";

export default function AuthForm({ authView, authData, setAuthData, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
      {authView === "signup" && (
        <input
          type="text"
          required
          placeholder="Name"
          value={authData.name}
          onChange={(e) =>
            setAuthData({ ...authData, name: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      )}
      <input
        type="email"
        required
        placeholder="Email"
        value={authData.email}
        onChange={(e) =>
          setAuthData({ ...authData, email: e.target.value })
        }
        className="w-full border p-2 rounded"
      />
      <input
        type="password"
        required
        placeholder="Password"
        value={authData.password}
        onChange={(e) =>
          setAuthData({ ...authData, password: e.target.value })
        }
        className="w-full border p-2 rounded"
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={authData.remember}
          onChange={(e) =>
            setAuthData({ ...authData, remember: e.target.checked })
          }
        />
        <label>Remember me</label>
      </div>
      <button className="w-full bg-blue-600 text-white py-2 rounded">
        {authView === "signup" ? "Sign Up" : "Login"}
      </button>
    </form>
  );
}
