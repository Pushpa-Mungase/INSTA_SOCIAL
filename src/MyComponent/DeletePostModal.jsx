import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "../utils/axiosInstance";

export default function DeletePostModal({ postId, isOpen, setIsOpen, onDeleted }) {
  const handleDelete = async () => {
    try {
        console.log("postId", postId);
        
      const deleteUrl = (postId) => `/post/delete-scheduled-post/${postId}`;
axiosInstance.delete(deleteUrl(postId));


      if (response.data?.message === "Post deleted successfully") {
        alert("Post deleted successfully!");
        onDeleted(); // refresh posts list
        setIsOpen(false); // close modal
      }
    } catch (error) {
      console.error("Error deleting post:", error.response?.data || error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-4 mt-4">
          <button
            className="px-4 py-2 border rounded bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white"
            onClick={handleDelete}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
