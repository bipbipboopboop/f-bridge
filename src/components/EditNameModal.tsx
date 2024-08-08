import React, { useState } from "react";
import Modal from "react-modal";
import { useFunctions } from "../hooks/useFunctions";
import { toast } from "react-toastify";

// Make sure to set the app element for accessibility
Modal.setAppElement("#root");

interface EditNameModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  currentName: string;
}

const EditNameModal: React.FC<EditNameModalProps> = ({ isOpen, onRequestClose, currentName }) => {
  const [newName, setNewName] = useState(currentName);
  const [error, setError] = useState<string>("");
  const { renameUser } = useFunctions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newName.length < 3 || newName.length > 20) {
      toast.error("Name must be between 3 and 20 characters");
      return;
    }

    try {
      const result = await renameUser(newName);
      if (result?.data) {
        toast.success("Name updated successfully");
      }
      onRequestClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Name Modal"
      className="fixed inset-0 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-10"
    >
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-xl font-bold mb-4">Edit Name</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter new name"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end">
            <button type="button" onClick={onRequestClose} className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditNameModal;
