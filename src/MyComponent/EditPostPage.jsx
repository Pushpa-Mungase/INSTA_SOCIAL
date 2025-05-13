import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditPostPage() {
  // Get the post ID from the URL parameters
  const { postId } = useParams();
  const history = useNavigate();

  // Sample posts (In real application, this data would be fetched from an API)
  const posts = [
    { id: 1, title: 'Scheduled Post 1', description: 'This is a scheduled post for item 1', mediaUrl: 'image1.jpg' },
    { id: 2, title: 'Scheduled Post 2', description: 'This is a scheduled post for item 2', mediaUrl: 'image2.jpg' },
    // More posts...
  ];

  // Find the post to edit based on the postId
  const post = posts.find((p) => p.id === parseInt(postId));

  // State to manage the edited post title, description, and media
  const [newTitle, setNewTitle] = useState(post ? post.title : '');
  const [newDescription, setNewDescription] = useState(post ? post.description : '');
  const [newMedia, setNewMedia] = useState(null);  // For new photo/video upload
  const [previewMedia, setPreviewMedia] = useState(post ? post.mediaUrl : ''); // Preview image or video

  // Handle the file selection for photo/video upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewMedia(file);
      setPreviewMedia(URL.createObjectURL(file)); // Show preview
    }
  };

  // Save the edited post
  const handleSave = () => {
    // Here you can make an API call to save the updated post, including the uploaded media
    console.log('Saving post...', { id: post.id, newTitle, newDescription, newMedia });

    // After saving, redirect to the HomePage
    history.push('/');
  };

  // Cancel the editing
  const handleCancel = () => {
    history.push('/');
  };

  // If post is not found, redirect to HomePage
  if (!post) {
    history.push('/');
    return null;
  }

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl mb-4">Edit Post</h3>

        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            id="title"
            className="border p-2 w-full"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
          <textarea
            id="description"
            className="border p-2 w-full"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>

        {/* Media Upload (Photo/Video) */}
        <div className="mb-4">
          <label htmlFor="media" className="block text-sm font-medium mb-2">Upload Photo/Video</label>
          <input
            type="file"
            id="media"
            className="border p-2 w-full"
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Preview of Uploaded Media */}
        {previewMedia && (
          <div className="mb-4">
            {newMedia && newMedia.type.startsWith('image/') ? (
              <img src={previewMedia} alt="Preview" className="w-full h-auto" />
            ) : (
              <video controls className="w-full h-auto">
                <source src={previewMedia} type={newMedia.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
