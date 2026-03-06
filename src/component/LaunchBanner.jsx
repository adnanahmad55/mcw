import React from 'react'
import { X } from 'lucide-react'

export default function LaunchBanner({ onClose }) {
  const handleClose = () => {
    // Call the parent's onClose handler if provided
    if (onClose) {
      onClose();
    } else {
      // Fallback: hide the banner by removing it from the DOM
      const banner = document.querySelector('.launch-banner');
      if (banner) {
        banner.style.display = 'none';
      }
    }
  };

  return (
    <div className='launch-banner w-screen h-screen backdrop-blur-xl fixed inset-0 z-[120] flex items-center justify-center'>
      <div className="relative max-w-max">
        <img src="/launch-banner.jpg" alt="" className='w-[90vw] max-w-md object-contain' />
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-[101] p-1 rounded-full  transition-colors"
          aria-label="Close banner"
        >
          <X size={22} color="white" />
        </button>
      </div>
    </div>
  )
}
