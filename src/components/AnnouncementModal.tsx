import React from "react";
import { Announcement } from "types/Annoucement";
import { useSpring, animated } from "react-spring";
import Button from "./buttons/button";

interface AnnouncementModalProps {
  announcement: Announcement;
  onClose: () => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({ announcement, onClose }) => {
  const modalAnimation = useSpring({
    from: { top: "-50%", opacity: 1 },
    to: { top: "50%", opacity: 1 },
  });

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <animated.div
          style={modalAnimation}
          className="rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
        >
          <div className="bg-teal-400 text-black px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg leading-6">{announcement.title}</h3>
                <div className="mt-2">
                  <p className="text-sm">{announcement.content}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-teal-400 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button theme="orange" onClick={onClose} size={1}>
              Close
            </Button>
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default AnnouncementModal;
