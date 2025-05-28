
import { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react"; // Make sure this is installed



export default function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  const openModal = (type) => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  const closeModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between bg-gray-800 text-white p-4 shadow">
        <div className="text-xl font-bold">MyLogo</div>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:text-gray-300">Home</Link>
         
        </div>
      </nav>

      {/* Modal */}
      <Dialog open={isAuthModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              &times;
            </button>
           
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
