import { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DownloadPopup from "./DownloadPopup"

const DownloadBanner = () => {
  const [visible, setVisible] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <>
      <div className="w-full bg-gradient-to-r from-[#111111] to-[#111111] h-[64px] flex items-center justify-center relative">
        {/* Close button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
        >
          <X size={20} />
        </button>

        {/* Gift Icon */}
        <img
          src="/download/gift.png"
          alt="gift"
          className="h-[36px] w-auto mr-2"
        />

        {/* Coins + Text */}
        <div className="flex items-center space-x-2">
          <img src="/download/coin1.png" alt="coin1" className="h-[22px] w-auto" />
          <img src="/download/text.png" alt="banner text" className="h-[30px] w-auto" />
          <img src="/download/coin2.png" alt="coin2" className="h-[22px] w-auto" />
        </div>

        {/* Download Button */}
        <button 
          onClick={() => setPopupOpen(true)}
          className="absolute right-4"
        >
          <img src="/download/button.png" alt="Download" className="h-[30px] w-auto" />
        </button>
      </div>

      {/* Popup component */}
      <DownloadPopup 
        isOpen={popupOpen} 
        onClose={() => setPopupOpen(false)} 
      />
    </>
  );
};

export default DownloadBanner;