
import React, { useState, useEffect } from "react";
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiTelegram, SiX, SiYoutube } from "react-icons/si";
import { toast } from 'react-toastify';

import axiosInstance from "../utils/axiosInstance";
import PlatformCredentialsModal from "../component/platform/PlatformCredentialsModal";

export const platforms = [
  {
    key: "linkedin",
    name: "Linkedin",
    icon: <FaLinkedinIn className="text-white" size={20} />,
    color: "bg-blue-600",
  },
  {
    key: "facebook",
    name: "Facebook",
    icon: <FaFacebookF className="text-white" size={20} />,
    color: "bg-blue-700",
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: <FaInstagram className="text-white" size={20} />,
    color: "bg-pink-500",
  },
  {
    key: "twitter",
    name: "Twitter / X",
    icon: <SiX className="text-white" size={20} />,
    color: "bg-cyan-500",
  },
  {
    key: "telegram",
    name: "Telegram",
    icon: <SiTelegram className="text-white" size={20} />,
    color: "bg-blue-500",
  },
  {
    key: "youtube",
    name: "YouTube",
    icon: <SiYoutube className="text-white" size={20} />,
    color: "bg-red-600",
  },
];

export default function SettingPage() {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformStatusList, setPlatformStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch platform status on component mount
  useEffect(() => {
    const fetchPlatformStatus = async () => {
      try {
        const res = await axiosInstance.get("/platform/get-user-platforms");
        console.log("platformStatusList:", res.data.platforms);
        setPlatformStatusList(res.data.platforms || []);
      } catch (error) {
        console.error("Error fetching platform status", error);
        toast.error("Failed to fetch platform status");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformStatus();
  }, []);

  const handlePlatformClick = (platformKey) => {
    console.log("Clicked platform:", platformKey);
    setSelectedPlatform(platformKey);
  };

  const handleConnectClick = (platformKey) => {
    setSelectedPlatform(platformKey);
    setIsModalOpen(true);
  };

  const handleSavePlatformCredentials = async (credentials) => {
    try {
      const payload = {
        platforms: [{
          platformName: selectedPlatform,
          platformDetails: {
            userId: credentials.userId,
            password: credentials.password,
          },
        }],
      };

      const res = await axiosInstance.post("/platform/create-platform", payload);
      console.log("res.data:", res.data);
      
      if (res.data.success) {
        toast.success(`${selectedPlatform} credentials saved successfully! Please wait up to 24 hours for your account to be activated.`);
        
        // Refresh platform status after successful save
        const statusRes = await axiosInstance.get("/platform/get-user-platforms");
        setPlatformStatusList(statusRes.data.platforms || []);
        
        setTimeout(() => {
          setIsModalOpen(false);
        }, 1000);
      } else {
        toast.error("Failed to save credentials.");
      }
    } catch (error) {
      console.error("Error saving platform credentials:", error);
      toast.error("Error saving platform credentials.");
    }
  };

  const getPlatformStatus = (platformKey) => {
    const status = platformStatusList.find(p => p.platformName === platformKey);
    return {
      hasCredentials: status !== undefined,
      isValid: status?.isValid === true
    };
  };

  const selectedPlatformData = platforms.find(p => p.key === selectedPlatform);

  return (
  <div className="h-screen flex  justify-center ">
    {/* Sidebar with Platform Icons */}
    <div className="w-64 bg-white shadow border-r overflow-auto">
      <div className="p-3 space-y-2">
        {platforms.map(({ key, icon, name, color }) => {
          const { hasCredentials, isValid } = getPlatformStatus(key);

          return (
            <div
              key={key}
              className={`relative cursor-pointer p-3 rounded-lg border text-sm transition-all hover:shadow-sm ${
                selectedPlatform === key
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
              onClick={() => handlePlatformClick(key)}
            >
              <div className="flex items-center gap-2">
                <div className={`${color} p-2 rounded-full relative`}>
                  {icon}
                  {hasCredentials && (
                    <div className="absolute -top-1 -right-1">
                      {isValid ? (
                        <div className="h-2 w-2 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                      ) : (
                        <div className="h-2 w-2 bg-red-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 text-sm">{name}</h3>
                  <p
                    className={`text-xs ${
                      hasCredentials
                        ? isValid
                          ? "text-green-600"
                          : "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {hasCredentials
                      ? isValid
                        ? "Active"
                        : "Inactive"
                      : "Not Connected"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Main Content Area */}
    <div className="flex-1 overflow-auto p-4">
      {selectedPlatform ? (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${selectedPlatformData?.color}`}>
                {selectedPlatformData?.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedPlatformData?.name}</h3>
                <p className="text-sm text-gray-600">
                  Manage your {selectedPlatformData?.name} connection
                </p>
              </div>
            </div>

            {(() => {
              const { hasCredentials, isValid } = getPlatformStatus(selectedPlatform);

              if (!hasCredentials) {
                return (
                  <div className="space-y-4 text-sm">
                    <div className="bg-gray-50 border border-gray-200 rounded p-4">
                      <h4 className="font-semibold mb-1">
                        Connect your {selectedPlatformData?.name} account
                      </h4>
                      <p className="text-gray-600 mb-3">
                        Click the button below to securely connect your account.
                      </p>
                      <button
                        onClick={() => handleConnectClick(selectedPlatform)}
                        className="!bg-[#8e51ff] text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        + Connect {selectedPlatformData?.name}
                      </button>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded text-xs">
                      <strong>Note:</strong> Your credentials are encrypted. Activation may take up to 24 hours.
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="space-y-4 text-sm">
                    <div
                      className={`rounded p-4 ${
                        isValid
                          ? "bg-green-50 border border-green-200 text-green-800"
                          : "bg-red-50 border border-red-200 text-red-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            Status: {isValid ? "Active" : "Inactive"}
                          </h4>
                          <p className="text-xs mt-1">
                            {isValid
                              ? "Your account is connected and ready."
                              : "Invalid credentials or pending activation."}
                          </p>
                        </div>
                        <div
                          className={`h-3 w-3 rounded-full ${
                            isValid ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnectClick(selectedPlatform)}
                      className="!bg-[#8e51ff] text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Update Credentials
                    </button>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-center text-gray-600">
          <div>
            <svg
              className="w-12 h-12 mx-auto mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
            <h3 className="text-base font-semibold mb-1">Select a Platform</h3>
            <p className="text-sm text-gray-500">
              Click on a platform from the sidebar to manage it
            </p>
          </div>
        </div>
      )}
    </div>

    {/* Modal */}
    {isModalOpen && (
      <PlatformCredentialsModal
        platform={[selectedPlatform]}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlatformCredentials}
      />
    )}
  </div>
);

}