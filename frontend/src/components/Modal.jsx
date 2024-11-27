import React from 'react';

function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 md:w-1/3">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        {children}
        <button
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Modal;
