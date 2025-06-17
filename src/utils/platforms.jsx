// utils/platforms.js
import { FaLinkedinIn, FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiX } from "react-icons/si";

export const platforms = [
  {
    key: "linkedin",
    name: "Linkedin",
    icon: <FaLinkedinIn className="text-white" size={28} />,
    color: "bg-blue-600",
  },
  {
    key: "facebook",
    name: "Facebook",
    icon: <FaFacebookF className="text-white" size={28} />,
    color: "bg-blue-700",
  },
  {
    key: "instagram",
    name: "Instagram",
    icon: <FaInstagram className="text-white" size={28} />,
    color: "bg-pink-500",
  },
//   {
//     key: "twitter",
//     name: "Twitter / X",
//     icon: <SiX className="text-white" size={28} />,
//     color: "bg-cyan-500",
//   },
];
