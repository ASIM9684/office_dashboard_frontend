// src/utils/toast.js
import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Toast message component with single gradient underline
const ToastMessage = ({ icon, message }) => (
  <div className="text-sm font-medium text-gray-800">
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  </div>
);

// Show success toast
export const showSuccessToast = (message) => {
  toast(<ToastMessage icon="✅" message={message} />, {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Show error toast
export const showErrorToast = (message) => {
  toast(<ToastMessage icon="❌" message={message} />, {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
