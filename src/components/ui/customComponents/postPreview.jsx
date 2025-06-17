import React from "react";
import { Eye, Play, ImageIcon, Video } from "lucide-react";
import { FaYoutube, FaTwitter, FaFacebook, FaInstagram, FaTelegram, FaLinkedin } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PostPreviewPanel = ({ createType, metaPosts = [], newPost = {} }) => {
  const getPlatformIcon = (platform) => {
    const iconMap = {
      facebook: <FaFacebook className="w-4 h-4 text-blue-600" />,
      instagram: <FaInstagram className="w-4 h-4 text-pink-500" />,
      telegram: <FaTelegram className="w-4 h-4 text-sky-500" />,
      linkedin: <FaLinkedin className="w-4 h-4 text-blue-700" />,
    };
    return iconMap[platform.toLowerCase()] || null;
  };

  const platforms = ["Facebook", "Instagram", "Telegram", "LinkedIn"];

  return (
    <div className="col-span-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/60 shadow-xl backdrop-blur-sm flex flex-col overflow-hidden">
      {/* Header with gradient and glassmorphism effect */}
      <div className="p-6 border-b border-slate-200/60 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Post Preview
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">Live preview of your content</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/80 text-slate-700 border-slate-200">
            {createType === "meta" ? `${metaPosts.length} Posts` : createType?.charAt(0).toUpperCase() + createType?.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* META PREVIEW */}
        {createType === "meta" &&
          metaPosts.map((post, idx) => (
            <Card key={idx} className="group hover:shadow-lg transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {platforms.map((platform) => (
                      <div key={platform} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.title && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/60">
                    <h4 className="font-semibold text-slate-900 leading-relaxed">{post.title}</h4>
                  </div>
                )}

                {post.content && (
                  <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                    <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  </div>
                )}

                {post.imageFiles?.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <ImageIcon className="w-4 h-4" />
                      Images ({post.imageFiles.length})
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {post.imageFiles.map((file, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${i + 1}`}
                            className="object-cover h-20 w-full rounded-xl border border-slate-200 group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {post.videoFiles?.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Video className="w-4 h-4" />
                      Videos ({post.videoFiles.length})
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {post.videoFiles.map((file, i) => {
                        const videoRef = React.createRef();

                        const handlePlayPause = () => {
                          const video = videoRef.current;
                          if (video) {
                            if (video.paused) {
                              video.play();
                            } else {
                              video.pause();
                            }
                          }
                        };

                        return (
                          <div key={i} className="relative group">
                            <video
                              ref={videoRef}
                              src={URL.createObjectURL(file)}
                              className="object-cover h-24 w-full rounded-xl border border-slate-200"
                            />
                            <button
                              onClick={handlePlayPause}
                              className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0  transition-opacity"
                            >
                              <Play className="w-6 h-6 text-white" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>
          ))}

        {/* YOUTUBE PREVIEW */}
        {createType === "youtube" && (
          <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden p-0">
            <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-red-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
                  <FaYoutube className="text-white" size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">YouTube</CardTitle>
                  <p className="text-sm text-slate-600">Video content preview</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {newPost.title && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200/60">
                  <h4 className="font-semibold text-slate-900 leading-relaxed">{newPost.title}</h4>
                </div>
              )}

              {newPost.videoFiles?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Video className="w-4 h-4" />
                    Video Content
                  </div>
                  <div className="grid gap-4">
                    {newPost.videoFiles.map((file, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden border border-slate-200">
                        <video
                          src={URL.createObjectURL(file)}
                          controls
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TWITTER PREVIEW */}
        {createType === "twitter" && (
          <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden p-0">
            <CardHeader className="pb-3 bg-gradient-to-r from-sky-50 to-sky-100/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 shadow-lg">
                  <FaTwitter className="text-white" size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800">Twitter</CardTitle>
                  <p className="text-sm text-slate-600">Tweet preview</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {newPost.content && (
                <div className="p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">
                    {newPost.content}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {((createType === "meta" && metaPosts.length === 0) ||
          (createType !== "meta" && !newPost.title && !newPost.content && !newPost.videoFiles?.length)) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4">
                <Eye className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No Content to Preview</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                Start creating your content to see a live preview here. Your posts will appear as they would on each platform.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default PostPreviewPanel;