// import React from "react";
// import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
// import { SiTelegram, SiX, SiYoutube } from "react-icons/si";
// export const platforms = [
//   {
//     key: "linkedin",
//     name: "Linkedin",
//     icon: <FaLinkedinIn className="text-white" size={16} />,
//     color: "bg-blue-600",
//   },
//   {
//     key: "facebook",
//     name: "Facebook",
//     icon: <FaFacebookF className="text-white" size={16} />,
//     color: "bg-blue-700",
//   },
//   {
//     key: "instagram",
//     name: "Instagram",
//     icon: <FaInstagram className="text-white" size={16} />,
//     color: "bg-pink-500",
//   },
//   {
//     key: "twitter",
//     name: "Twitter / X",
//     icon: <SiX className="text-white" size={16} />,
//     color: "bg-cyan-500",
//   },
//    {
//     key: "telegram",
//     name: "Telegram",
//     icon: <SiTelegram className="text-white" size={16} />,
//     color: "bg-blue-500",
//   },
//   {
//     key: "youtube",
//     name: "YouTube",
//     icon: <SiYoutube className="text-white" size={16} />,
//     color: "bg-red-600",
//   },
// ];
// // Adjust path as needed

// export default function SettingPage() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
//       <div className="bg-white rounded-xl border-2 border-black flex w-4/5 h-[80vh]">
        
//         {/* Sidebar with Icons */}
//         <div className="w-1/5 border-r-2 border-black flex flex-col items-center gap-6 py-6">
//           {platforms.map(({ key, icon, name, color }) => (
//             <div key={key} className={`p-3 rounded-full ${color}`}>
//               {icon}
//             </div>
//           ))}
//         </div>

//         {/* Right Content Area */}
//         <div className="flex-1 p-6">
//           <h2 className="text-xl font-bold mb-4">Settings Content</h2>
//           {/* Add your settings form/content here */}
//         </div>
//       </div>
//     </div>
//   );
// }



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
    <div className=" bg-gray-50 flex">
      
      {/* Sidebar with Platform Icons */}
      <div className="w-64 bg-white shadow-lg border-r flex flex-col">
      
        <div className="flex-1 p-4 space-y-3">
          {platforms.map(({ key, icon, name, color }) => {
            const { hasCredentials, isValid } = getPlatformStatus(key);
            
            return (
              <div
                key={key}
                className={`relative cursor-pointer p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  selectedPlatform === key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => handlePlatformClick(key)}
              >
                <div className="flex items-center gap-3">
                  <div className={`${color} p-3 rounded-full relative`}>
                    {icon}
                    
                    {/* Status indicator */}
                    {hasCredentials && (
                      <div className="absolute -top-1 -right-1">
                        {isValid ? (
                          <div className="h-1 w-3 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                        ) : (
                          <div className="h-3 w-3 bg-red-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{name}</h3>
                    {hasCredentials ? (
                      <p className={`text-xs ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {isValid ? 'Connected & Active' : 'Connected but Inactive'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">Not Connected</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        {selectedPlatform ? (
          <div className="max-w-2xl mx-auto max-w-2xl">
            <div className="bg-white rounded-lg justify-between shadow-lg p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-full ${selectedPlatformData?.color}`}>
                  {selectedPlatformData?.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedPlatformData?.name}</h3>
                  <p className="text-gray-600">Manage your {selectedPlatformData?.name} connection</p>
                </div>
              </div>

              {(() => {
                const { hasCredentials, isValid } = getPlatformStatus(selectedPlatform);
                
                if (!hasCredentials) {
                  return (
                    <div className="space-y-6">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          Connect your {selectedPlatformData?.name} account
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Click the button below to securely connect your {selectedPlatformData?.name} account.
                        </p>
                        
                        <button
                          onClick={() => handleConnectClick(selectedPlatform)}
                          className="!bg-blue-600 !text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors !font-semibold flex items-center gap-2"
                        >
                          <span>+ Connect {selectedPlatformData?.name}</span>
                        </button>
                      </div>
                      
                      <div className="!bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> Your credentials will be securely stored and encrypted. 
                          It may take up to 24 hours for your account to be activated after connection.
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="space-y-6">
                      <div className={`rounded-lg p-6 ${
                        isValid 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`text-lg font-semibold ${
                              isValid ? 'text-green-800' : 'text-red-800'
                            }`}>
                              Status: {isValid ? 'Connected & Active' : 'Connected but Inactive'}
                            </h4>
                            <p className={`text-sm mt-1 ${
                              isValid ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isValid 
                                ? 'Your account is successfully connected and ready to use.'
                                : 'Your account connection is inactive. This may be due to invalid credentials or pending activation.'
                              }
                            </p>
                          </div>
                          <div className={`h-4 w-4 rounded-full ${
                            isValid ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleConnectClick(selectedPlatform)}
                          className="!px-6 py-3 !bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          Update Credentials
                        </button>
                        
                    
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          </div> 
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Platform</h3>
              <p className="text-gray-500">Click on a platform from the sidebar to manage its settings</p>
            </div>
          </div>
        )}
      </div>

      {/* Platform Credentials Modal */}
      {isModalOpen && (
        <PlatformCredentialsModal
          platform={[selectedPlatform]}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSave={handleSavePlatformCredentials}
        />
      )}
    </div>
  );
}