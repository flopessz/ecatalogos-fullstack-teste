import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div onClick={onClose} className="absolute bg-black bg-opacity-50 w-full h-full"></div>
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative border-4 border-gray-500">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
};
