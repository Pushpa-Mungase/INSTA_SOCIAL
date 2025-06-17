import React, { useRef, useState } from 'react';
import {
    FaFacebook,
    FaInstagram,
    FaTwitter,
    FaLinkedin,
    FaTelegram,
    FaYoutube,
} from "react-icons/fa";
import {
    ChevronLeft,
    ChevronRight,
    MessageCircle,
    Calendar,
    Clock,
    Eye,
    Play
} from "lucide-react";

const platformIcons = {
    facebook: <FaFacebook className="text-[#1877F2]" size={18} />,
    instagram: <FaInstagram className="text-[#E1306C]" size={18} />,
    twitter: <FaTwitter className="text-[#1DA1F2]" size={18} />,
    linkedin: <FaLinkedin className="text-[#0A66C2]" size={18} />,
    youtube: <FaYoutube className="text-[#FF0000]" size={18} />,
    telegram: <FaTelegram className="text-[#0088cc]" size={18} />,
};

const PostDialogContent = ({
    selectedPost,
    currentMediaIndex,
    onNavigateMedia,

}) => {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef();

    if (!selectedPost) return null;

    const currentMedia = selectedPost.files?.[currentMediaIndex];
    const hasMedia = selectedPost.files?.length > 0;
    const isTwitterOnly = Array.isArray(selectedPost.selectedPlatformName) &&
        selectedPost.selectedPlatformName.length === 1 &&
        selectedPost.selectedPlatformName.includes("twitter");
    const isYouTube = Array.isArray(selectedPost.selectedPlatformName) &&
        selectedPost.selectedPlatformName.includes("youtube");

    const renderPlatformIcons = (post) => {
        const data = post.selectedPlatformName;
        const platforms = Array.isArray(data)
            ? data
            : typeof data === "string"
                ? data.split(",").map((p) => p.trim().toLowerCase())
                : Object.keys(data || {}).filter((key) => data[key]);

        return platforms.map((platform, idx) => (
            <div
                key={idx}
                title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
                {platformIcons[platform] || (
                    <span className="text-xs font-bold text-gray-600">
                        {platform.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>
        ));
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'posted':
                return 'bg-emerald-500';
            case 'pending':
                return 'bg-amber-500';
            case 'failed':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className="flex h-[85vh] max-h-[700px] bg-white rounded-xl overflow-hidden shadow-xl sm:flex-row flex-col">
            {/* Media */}
            <div className="flex-1 bg-gradient-to-br from-gray-900 to-black relative flex items-center justify-center group">
                {hasMedia && !isTwitterOnly ? (
                    currentMedia?.type === "image" ? (
                        <img
                            src={currentMedia.url}
                            alt="Post media"
                            className="max-w-full max-h-full object-contain rounded-md"
                        />
                    ) : (
                        <div className="relative max-w-full max-h-full w-full h-full flex items-center justify-center">
                            <video
                                ref={videoRef}
                                src={currentMedia.url}
                                controls
                                className="max-w-full max-h-full object-contain rounded-md"
                                onPlay={() => setIsVideoPlaying(true)}
                                onPause={() => setIsVideoPlaying(false)}
                            />
                            {!isVideoPlaying && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                    onClick={() => videoRef.current?.play()}
                                >
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                        <Play size={28} className="text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-4 px-6 text-center">
                        {isTwitterOnly ? (
                            <>
                                <FaTwitter size={80} className="text-[#1DA1F2]" />
                                <p className="text-lg font-medium text-gray-300">Twitter / X</p>
                            </>
                        ) : (
                            <>
                                <div className="text-6xl">📝</div>
                                <p className="text-lg font-medium text-gray-300">Text Post</p>
                                <p className="text-sm text-gray-500">No media attached</p>
                            </>
                        )}
                    </div>
                )}

                {hasMedia && selectedPost.files.length > 1 && (
                    <>
                        <button
                            onClick={() => onNavigateMedia('prev')}
                            className="absolute left-5 top-1/2 transform -translate-y-1/2 !bg-black/30 hover:!bg-black/50 text-white p-1 rounded-full transition-all duration-200"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => onNavigateMedia('next')}
                            className="absolute right-5 top-1/2 transform -translate-y-1/2 !bg-black/30 hover:!bg-black/50 text-white p-1 rounded-full transition-all duration-200"
                        >
                            <ChevronRight size={20} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs !bg-black/30 px-3 py-1 rounded-full">
                            {currentMediaIndex + 1} of {selectedPost.files.length}
                        </div>
                    </>
                )}
            </div>

            {/* Post Details */}
            <div className="w-[360px] bg-white flex flex-col border-l border-gray-100">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md">
                                    <MessageCircle size={20} />
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(selectedPost.status)} rounded-full border-2 border-white`} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Post Preview</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {new Date(selectedPost.scheduledFor).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-600">Publishing to:</span>
                        <div className="flex gap-1">
                            {renderPlatformIcons(selectedPost)}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm">
                    {/* Post Content */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                                <MessageCircle size={12} className="text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-800">Post Content</h3>
                        </div>
                        <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                            <p className="text-gray-700 whitespace-pre-wrap leading-snug">
                                {isYouTube ? selectedPost.title || 'No title provided' : selectedPost.content || 'No content provided'}
                            </p>
                        </div>
                    </div>


                    {/* Scheduled Time */}
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center">
                                <Clock size={12} className="text-purple-600" />
                            </div>
                            <h4 className="font-medium text-gray-800">Scheduled Time</h4>
                        </div>
                        <div className="mt-2 bg-purple-50 rounded-lg px-3 py-2 border border-purple-200 text-xs">
                            <p className="text-gray-900 font-medium">
                                {new Date(selectedPost.scheduledFor).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </p>
                            <p className="text-purple-600 font-semibold mt-0.5">
                                {new Date(selectedPost.scheduledFor).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center">
                                <Eye size={12} className="text-green-600" />
                            </div>
                            <h4 className="font-medium text-gray-800">Status</h4>
                        </div>
                        <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${selectedPost.status === "posted"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : selectedPost.status === "pending"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : selectedPost.status === "failed"
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : "bg-gray-50 text-gray-700 border border-gray-200"
                                }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedPost.status)}`} />
                            {selectedPost.status === "pending"
                                ? "Scheduled"
                                : selectedPost.status?.charAt(0).toUpperCase() + selectedPost.status?.slice(1)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDialogContent;
