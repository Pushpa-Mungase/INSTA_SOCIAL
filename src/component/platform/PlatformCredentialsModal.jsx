



import { useState, useEffect, useRef } from "react";
import { useCallback } from "react";

export default function PlatformCredentialsModal({ platform, onClose, onSave }) {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus first input when modal opens
  useEffect(() => {
    firstInputRef.current?.focus();

    // Disable background scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scroll when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);






const handleKeyDown = useCallback((e) => {
  if (e.key === "Escape") {
    onClose();
  }

  if (e.key === "Tab") {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  }
}, [onClose]);

useEffect(() => {
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [handleKeyDown]);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Simulate async save (replace with your async call)
      await new Promise((res) => setTimeout(res, 1000));

      onSave(formData);
      setFormData({ userId: "", password: "" });
      onClose();
    } catch (err) {
      setError("Failed to save credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close modal when clicking outside modal content
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn"
      onClick={handleBackgroundClick}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      <div className="!bg-white p-6 rounded shadow-lg w-80 max-w-full relative">
        <h2
          id="modal-title"
          className="text-lg font-bold mb-4 text-center"
          tabIndex={-1}
        >
          Enter {platform} Credentials
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label htmlFor="userId" className="sr-only">
            {platform} User ID
          </label>
          <input
            ref={firstInputRef}
            id="userId"
            type="text"
            name="userId"
            placeholder={`${platform} User ID`}
            value={formData.userId}
            onChange={handleChange}
            required
            disabled={loading}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <label htmlFor="password" className="sr-only">
            {platform} Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder={`${platform} Password`}
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="!px-4 py-2 rounded border hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded !bg-blue-600 text-white !hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* Tailwind animation added below */}
      {/* <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style> */}
    </div>
  );
}

