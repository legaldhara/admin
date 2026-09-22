import { useState, ReactNode } from "react";

export const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [Content, setContent] = useState<ReactNode>(null);

  const openPopup = (component: React.ReactNode) => {
    setContent(component);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    setContent(null);
  };

  const Popup = () =>
  isOpen && Content ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-400 rounded-lg shadow-lg relative overflow-y-auto">
        <button
          onClick={closePopup}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl"
        >
          &times;
        </button>
        {Content}
      </div>
    </div>
  ) : null;

  return { openPopup, closePopup, Popup };
};

