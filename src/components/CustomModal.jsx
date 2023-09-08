import React, { useEffect, useState } from 'react';
const Modal = ({ isOpen, onClose,children }) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // Make sure to reset the 'overflow' property when the modal is closed
      document.body.style.overflow = 'auto';
    }

    // Clean up the effect when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-3xl w-full">
            <div className="flex justify-end items-center">
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800 transition duration-150"
              >
                <svg
                  className="h-6 w-6 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.348 12l5.823-5.822a1.25 1.25 0 0 0-1.768-1.768L12.58 10.23 6.758 4.408a1.25 1.25 0 1 0-1.768 1.768L10.812 12l-5.822 5.822a1.25 1.25 0 0 0 1.768 1.768l5.822-5.822 5.822 5.822a1.25 1.25 0 0 0 1.768-1.768L14.348 12z" />
                </svg>
              </button>
            </div>
            <div>
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default Modal