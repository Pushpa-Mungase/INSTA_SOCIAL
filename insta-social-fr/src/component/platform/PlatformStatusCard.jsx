// import React from "react";

// const PlatformStatusCard = ({ platformItem, platforms }) => {
//   const platformConfig = platforms.find((p) => p.key === platformItem.platformName.toLowerCase());
//   const statusColor = platformItem.isValid ? "bg-green-500" : "bg-yellow-400";

//   return (
//     <div className="flex items-center gap-3 p-3 border rounded">
//       {/* Platform icon with colored background */}
//       <div className={`w-10 h-10 flex items-center justify-center rounded-full ${platformConfig?.color || "bg-gray-400"}`}>
//         {platformConfig?.icon}
//       </div>

//       {/* Platform Name & Status Dot */}
//       <div className="flex-1">
//         <div className="flex items-center justify-between">
//           <p className="font-medium capitalize">{platformItem.platformName}</p>
//           <span
//             className={`inline-block w-3 h-3 rounded-full ${statusColor}`}
//             title={platformItem.isValid ? "Verified" : "Pending"}
//           ></span>
//         </div>
//         <p className="text-sm text-gray-500">{platformItem.platformDetails?.userId}</p>
//       </div>
//     </div>
//   );
// };

// export default PlatformStatusCard;
