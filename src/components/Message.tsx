import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../Store/Store";
import { hideMessage } from "../Store/MessageSlice";

const Message = () => {
  const dispatch = useDispatch();
  const { message, type, open, autoHideDuration } = useSelector(
    (state: RootState) => state.message
  );

  useEffect(() => {
    if (open && message) {
      const timer = setTimeout(() => {
        dispatch(hideMessage());
      }, autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [open, message, autoHideDuration, dispatch]);

  if (!open || !message) {
    return null;
  }

  // Define colors based on message type
  const getToastClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500 text-green-700";
      case "error":
        return "bg-red-100 border-red-500 text-red-700";
      case "warning":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      default:
        return "bg-blue-100 border-blue-500 text-blue-700";
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50`}>
      <div
        className={`px-4 py-3 rounded border-l-4 shadow-md ${getToastClasses()}`}
      >
        <div className="flex items-center">
          <div className="py-1">
            <p className="font-medium">{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => dispatch(hideMessage())}
              className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 rounded-md"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
