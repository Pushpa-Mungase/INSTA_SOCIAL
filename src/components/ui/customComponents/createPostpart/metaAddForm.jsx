import { Calendar, Image, Sparkles, Video, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../card";
import { Label } from "../../label";
import { Input } from "../../input";
import { Button } from "../../button";
import { ScrollArea } from "../../scroll-area";

export function MetaForm({
    availableMetaPlatforms,
    newPost,
    metaPosts,
    minDateTime,
    handlePlatformToggle,
    handleMetaPostChange,
    handleMetaFileChange,
    setNewPost,
    getPlatformColors,
    getPlatformIcon,
}) {
    return (
        <div className="col-span-7 flex flex-col space-y-3">
            {/* Platform Selection - Compact */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
                    <Sparkles className="w-3 h-3 mr-2 text-purple-500" />
                    Select Platforms
                </h3>
                <div className="grid grid-cols-2 gap-2 ">
                    {availableMetaPlatforms.map((platform) => (
                        <label
                            key={platform.platformName}
                            className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-all ${newPost.platforms.includes(platform.platformName)
                                    ? `${getPlatformColors(platform.platformName)}`
                                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={newPost.platforms.includes(platform.platformName)}
                                onChange={() => handlePlatformToggle(platform.platformName)}
                                className="hidden"
                            />
                            <div className={`flex items-center space-x-1.5 text-sm ${newPost.platforms.includes(platform.platformName) ? 'text-white' : 'text-gray-700'
                                }`}>
                                {getPlatformIcon(platform.platformName)}
                                <span className="font-medium capitalize">
                                    {platform.platformName}
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Meta Posts - Compact */}
            {metaPosts.map((post, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200 space-y-3">
                    {/* Title */}
                    <div className="space-y-1">
                        <Label htmlFor={`title-${idx}`} className="text-sm">Title (optional)</Label>
                        <Input
                            id={`title-${idx}`}
                            placeholder="Enter title"
                            value={post.title}
                            onChange={e => handleMetaPostChange(idx, "title", e.target.value)}
                            className="h-8 text-sm"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-1">
                        <Label htmlFor={`content-${idx}`} className="text-sm">Content</Label>
                        <textarea
                            id={`content-${idx}`}
                            placeholder="Write your post content"
                            value={post.content}
                            onChange={e => handleMetaPostChange(idx, "content", e.target.value)}
                            className="w-full rounded border p-2 text-sm min-h-[80px]"
                        />
                    </div>

                    {/* File Uploads - Compact */}
                    <div className="grid grid-cols-2 gap-2">
                        {/* Image Upload */}
                        <div>
                            <Label className="text-sm">Images</Label>
                            <div className="relative mt-1">
                                <Input
                                    id={`image-upload-${idx}`}
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        handleMetaFileChange(idx, "imageFiles", files, 'add');
                                        e.target.value = '';
                                    }}
                                    className="hidden"
                                />
                                <Label
                                    htmlFor={`image-upload-${idx}`}
                                    className="flex items-center justify-center h-8 border rounded text-xs cursor-pointer hover:bg-gray-50"
                                >
                                    <Image className="w-3 h-3 mr-1" />
                                    Add Images
                                </Label>
                            </div>
                        </div>

                        {/* Video Upload */}
                        <div>
                            <Label className="text-sm">Videos</Label>
                            <div className="relative mt-1">
                                <Input
                                    id={`video-upload-${idx}`}
                                    type="file"
                                    multiple
                                    accept="video/*"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        handleMetaFileChange(idx, "videoFiles", files, 'add');
                                        e.target.value = '';
                                    }}
                                    className="hidden"
                                />
                                <Label
                                    htmlFor={`video-upload-${idx}`}
                                    className="flex items-center justify-center h-8 border rounded text-xs cursor-pointer hover:bg-gray-50"
                                >
                                    <Video className="w-3 h-3 mr-1" />
                                    Add Videos
                                </Label>
                            </div>
                        </div>
                    </div>

                    {/* Selected Files - Compact */}
                    {(post.imageFiles.length > 0 || post.videoFiles.length > 0) && (
                        <div className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                            {post.imageFiles.map((file, fileIndex) => (
                                <div key={`img-${fileIndex}`} className="flex items-center justify-between p-1 text-xs border rounded">
                                    <div className="flex items-center truncate w-40">
                                        <Image className="w-3 h-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const updatedFiles = post.imageFiles.filter((_, i) => i !== fileIndex);
                                            handleMetaFileChange(idx, "imageFiles", updatedFiles, 'replace');
                                        }}
                                        className="text-red-500 hover:text-red-700 p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {post.videoFiles.map((file, fileIndex) => (
                                <div key={`vid-${fileIndex}`} className="flex items-center justify-between p-1 text-xs border rounded">
                                    <div className="flex items-center truncate w-40">
                                        <Video className="w-3 h-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">{file.name}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const updatedFiles = post.videoFiles.filter((_, i) => i !== fileIndex);
                                            handleMetaFileChange(idx, "videoFiles", updatedFiles, 'replace');
                                        }}
                                        className="text-red-500 hover:text-red-700 p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {/* Compact Schedule Section */}
            <div className="bg-white rounded-lg  p-3 border border-gray-200">
                <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                        Schedule
                    </Label>
                    <Input
                        type="datetime-local"
                        min={minDateTime}
                        value={newPost.scheduledFor}
                        onChange={e => setNewPost(prev => ({ ...prev, scheduledFor: e.target.value }))}
                        className="h-9 text-sm"
                    />
                    {newPost.scheduledFor && (
                        <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded mt-1">
                            📅 Scheduled for {new Date(newPost.scheduledFor).toLocaleString()}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}