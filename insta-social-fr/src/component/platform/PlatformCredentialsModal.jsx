

import { useState, useEffect, useRef } from "react";
import { useCallback } from "react";
 
export default function PlatformCredentialsModal({
  platform,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  //const isTelegram = platform.toLowerCase() === "telegram";
 
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
 
  const handleKeyDown = useCallback(
    (e) => {
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
    },
    [onClose]
  );
 
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
      className="fixed inset-0  bg-opacity-100 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn"
      onClick={handleBackgroundClick}
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 max-w-full relative border border-gray-100">
        <h2
          id="modal-title"
          className="text-xl font-bold mb-6 text-center text-gray-800"
          tabIndex={-1}
        >
          Enter {platform} Credentials
        </h2>
        <div onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
            ref={firstInputRef}
            id="userId"
            type="text"
            name="userId"
            placeholder={
              platform == "telegram"
                ? "enter your bot-father token"
                : `${platform} User ID`
            }
            value={formData.userId}
            onChange={handleChange}
            required
            disabled={loading}
            className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
          />
          <label htmlFor="password" className="sr-only">
            {platform} Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder={
              platform == "telegram"
                ? "enter channel chat-id"
                : `${platform} Password`
            }
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            className="border-2 border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
          />
 
          {error && <p className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}
 
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="!px-6 py-3 rounded-xl border-2 border-gray-200 !hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 font-medium text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl !bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
 
      {/* Tailwind animation added below */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}