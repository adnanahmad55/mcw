import React from 'react';
import { useNavigate } from 'react-router-dom';

const DownloadRequiredModal = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDeposit = () => {
    navigate('/deposit', {
                state: { backgroundLocation: location },
            });
    onClose();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = import.meta.env.VITE_APP_DOWNLOAD_URL;
    link.setAttribute("download", import.meta.env.VITE_APP_DOWNLOAD_NAME);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#131b30] rounded-xl w-full max-w-sm text-white">
        {/* Header */}
        <div className="pt-2 px-4">
          <div className="flex justify-end items-center">
            {/* <h2 className="text-lg font-semibold text-center flex-1">
              Deposit Required
            </h2> */}
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-300 text-center mb-6">
              ১০০ টাকা ব্যবহার করতে এ্যাপ ডাউনলোড এবং ডিপোজিট করুব।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-row gap-3">
            <button
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
            >
              অ্যান্ড্রয়েড অ্যাপ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadRequiredModal;
