import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";

export default function DeletePostModal({ postId,isOpen, setIsOpen, onDeleted,
}) {
  const handleDelete = async () => {
    try {
      console.log("postId", postId);
      const deleteUrl = (postId) => `/post/delete-scheduled-post/${postId}`;
      const response = await axiosInstance.delete(deleteUrl(postId));
      if (response.data?.message?.includes("deleted")) {
        toast.success("✅ Post deleted successfully!");
        alert("post deleted successfully!");
        onDeleted();
        setIsOpen(false);
      } else {
        toast.error("❌ Failed to delete post.");
      }
    } catch (error) {
      console.error(
        "Error deleting post:",
        error.response?.data || error.message
      );
      toast.error(
        "❌ " + (error.response?.data?.message || "Failed to delete post.")
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-4 mt-4">
          <button
            className="!px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="!px-4 py-2 rounded bg-red-600  hover:bg-red-700"
            onClick={handleDelete}
          >
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
