import { Calendar, Image, Video, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../card";
import { Label } from "../../label";
import { Input } from "../../input";
import { Button } from "../../button";
import { ScrollArea } from "../../scroll-area";

export function TwitterForm({ newPost, minDateTime, setNewPost }) {
  return (
    <div className="col-span-7 flex flex-col space-y-4">
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <textarea
          placeholder="What's happening?"
          value={newPost.content}
          onChange={e => setNewPost(prev => ({ ...prev, content: e.target.value }))}
          className="w-full p-3 border rounded"
          rows={4}
        />
        <div className="text-xs text-gray-500 mt-1">
          {newPost.content.length} characters
        </div>
      </div>

      {/* Media Attachments */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Media Attachments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Images</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="twitter-image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => setNewPost(prev => ({ 
                    ...prev, 
                    imageFiles: Array.from(e.target.files || []) 
                  }))}
                  className="hidden"
                />
                <Label
                  htmlFor="twitter-image-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Image className="w-6 h-6 mb-2 text-muted-foreground" />
                  <span className="text-sm">Add Images</span>
                  <span className="text-xs text-muted-foreground">Up to 4 images</span>
                </Label>
              </div>
            </div>

            <div>
              <Label>Videos</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="twitter-video-upload"
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={e => setNewPost(prev => ({ 
                    ...prev, 
                    videoFiles: Array.from(e.target.files || []) 
                  }))}
                  className="hidden"
                />
                <Label
                  htmlFor="twitter-video-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Video className="w-6 h-6 mb-2 text-muted-foreground" />
                  <span className="text-sm">Add Video</span>
                  <span className="text-xs text-muted-foreground">MP4 up to 2:20 min</span>
                </Label>
              </div>
            </div>
          </div>

          {(newPost.imageFiles.length > 0 || newPost.videoFiles.length > 0) && (
            <Card className="mt-4">
              <CardHeader className="py-3">
                <CardTitle className="text-sm font-medium">Selected Media</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {newPost.imageFiles.map((file, fileIdx) => (
                      <div key={fileIdx} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[180px]">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground"
                          onClick={() => setNewPost(prev => ({
                            ...prev,
                            imageFiles: prev.imageFiles.filter((_, i) => i !== fileIdx)
                          }))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                    {newPost.videoFiles.map((file, fileIdx) => (
                      <div key={fileIdx} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[180px]">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground"
                          onClick={() => setNewPost(prev => ({
                            ...prev,
                            videoFiles: prev.videoFiles.filter((_, i) => i !== fileIdx)
                          }))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card> */}

      
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