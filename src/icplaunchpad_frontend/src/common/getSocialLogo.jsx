import React from "react";
import {
  FaLinkedin,
  FaTwitter, // Changed from FaXTwitter to FaTwitter
  FaGithub,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaReddit,
  FaTiktok,
  FaSnapchat,
  FaWhatsapp,
  FaMedium,
} from "react-icons/fa";
import { GrLanguage } from "react-icons/gr";

export const getSocialLogo = (url) => {
  try {
    const domain = new URL(url).hostname.split(".").slice(-2).join(".");
    const size = "text-2xl"; // Updated size to a valid CSS class (assuming Tailwind or similar framework)
    const icons = {
      "linkedin.com": <FaLinkedin className={`text-blue-600 ${size}`} />,
      "twitter.com": <FaTwitter className={`text-blue-400 ${size}`} />, // Changed to FaTwitter
      "github.com": <FaGithub className={`text-gray-700 ${size}`} />,
      "telegram.com": <FaTelegram className={`text-blue-400 ${size}`} />, // Corrected domain for Telegram
      "facebook.com": <FaFacebook className={`text-blue-400 ${size}`} />,
      "instagram.com": <FaInstagram className={`text-pink-600 ${size}`} />,
      "youtube.com": <FaYoutube className={`text-red-600 ${size}`} />,
      "reddit.com": <FaReddit className={`text-orange-500 ${size}`} />,
      "tiktok.com": <FaTiktok className={`text-black ${size}`} />,
      "snapchat.com": <FaSnapchat className={`text-yellow-400 ${size}`} />,
      "whatsapp.com": <FaWhatsapp className={`text-green-600 ${size}`} />,
      "medium.com": <FaMedium className={`text-black ${size}`} />,
    };
    return icons[domain] || <h1 className="text-2xl"> <GrLanguage /></h1>;
  } catch (error) {
    return <GrLanguage />;
  }
};


