import { X } from "lucide-react";
import { FaAndroid } from "react-icons/fa";

const DownloadPopup = ({ isOpen, onClose }) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = import.meta.env.VITE_APP_DOWNLOAD_URL;
    link.setAttribute("download", import.meta.env.VITE_APP_DOWNLOAD_NAME);
    document.body.appendChild(link);
    link.click();
    link.remove();
    onClose(); // Close the popup after download
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="relative">
        {/* Background Image */}
        <img src="/down-popup.png" alt="Download Popup" className="max-w-[90vw] max-h-[90vh]" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-80"
        >
          <X size={20} />
        </button>

        {/* Green Button */}
        <div className="absolute top-[70%] inset-0 flex items-center justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700"
          >
            <FaAndroid size={20} />
            <span className="font-semibold text-lg">অ্যান্ড্রয়েড অ্যাপ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadPopup;