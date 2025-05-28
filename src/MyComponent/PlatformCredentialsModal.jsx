import { useState } from "react";

export default function PlatformCredentialsModal({ platform, isOpen, setIsOpen, onSave }) {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({ userId: "", password: "" });
  };

  console.log("isOpen",isOpen);
  
  return (
    <div className={`${isOpen ? "block" : "hidden"} fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50` }>
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">
          Enter {platform} Credentials
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="userId"
            placeholder={`${platform} User ID`}
            value={formData.userId}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="password"
            name="password"
            placeholder={`${platform} Password`}
            value={formData.password}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Save

            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
