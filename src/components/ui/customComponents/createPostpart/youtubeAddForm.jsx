import { Calendar, Video, Upload, X } from "lucide-react";
import { Label } from "../../label";
import { Input } from "../../input";

export function YouTubeForm({ newPost, minDateTime, setNewPost }) {
  return (
    <div className="col-span-7 flex flex-col space-y-3">
      {/* Compact Video Upload Section */}
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Video Title</Label>
          <Input
            type="text"
            placeholder="Enter YouTube video title"
            value={newPost.title}
            onChange={e => setNewPost(prev => ({ ...prev, title: e.target.value }))}
            className="h-9 text-sm"
          />
        </div>

        <div className="mt-3 space-y-2">
          <Label className="text-sm font-medium">Video Upload</Label>
          <div className="relative">
            <Input
              id="youtube-video-upload"
              type="file"
              accept="video/*"
              multiple
              onChange={e => setNewPost(prev => ({ 
                ...prev, 
                videoFiles: Array.from(e.target.files || []) 
              }))}
              onClick={e => e.target.value = null} // Reset file input
              className="hidden"
            />
            <Label
              htmlFor="youtube-video-upload"
              className="flex flex-col items-center justify-center h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className=" bg-blue-50 rounded-full ">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">Upload Video</p>
              <p className="text-xs text-gray-500 ">MP4, MOV, or AVI files</p>
            </Label>
          </div>
          
          {newPost.videoFiles.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {newPost.videoFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 text-xs border rounded bg-gray-50">
                  <div className="flex items-center truncate">
                    <Video className="w-3 h-3 mr-2 text-gray-500 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button 
                    onClick={() => setNewPost(prev => ({
                      ...prev,
                      videoFiles: prev.videoFiles.filter((_, i) => i !== index)
                    }))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Compact Schedule Section */}
      <div className="bg-white rounded-lg p-3 border border-gray-200">
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