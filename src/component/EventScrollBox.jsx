import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { X } from 'lucide-react';
import 'swiper/css';
import Rewards1 from './rewards/Rewards1';
import Treasure1 from './treasure/Treasure1';
import { motion } from 'framer-motion';

const AutoSlideBox = ({ showTreasureAfterLogin = false }) => {
  const swiperRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showRewards, setShowRewards] = useState(false);
  const [showTreasure, setShowTreasure] = useState(false);

  const images = [
    "/eventImages/TEMU.772745bd.gif",
    "/eventImages/RAFFLE.ef7e5d39.gif",
  ];

  useEffect(() => {
    const shouldShowTreasure = localStorage.getItem('showTreasureAfterLogin');
    if (showTreasureAfterLogin && shouldShowTreasure === 'true') {
      setShowTreasure(true);
      localStorage.removeItem('showTreasureAfterLogin');
    }
  }, [showTreasureAfterLogin]);

  if (!isVisible) return null;

  const handleRaffleClick = (index) => {
    setIsExpanded(false);

    if (index === 0) {
      setShowTreasure(true);
      setShowRewards(false);
    }
    if (index === 1) {
      setShowRewards(true);
      setShowTreasure(false);
    }
  };

  return (
    <>
      {showRewards && <Rewards1 onClose={() => setShowRewards(false)} />}
      {showTreasure && <Treasure1 onClose={() => setShowTreasure(false)} />}

      {/* ⭐ DRAG WRAPPER */}
      <motion.div
        drag
        dragElastic={0.15}
        dragMomentum={false}
        className="fixed bottom-16 left-6 z-40 w-28"
      >
        {/* <div className="relative w-full h-full">

          <div className={`absolute duration-300 ${isExpanded ? '-top-24 -left-4' : '-top-6 -left-4'} 
              right-0 flex justify-between items-center z-10 mb-1`}>
            <button
              className="p-1 bg-white rounded-full shadow-md"
              onClick={() => setIsVisible(false)}
            >
              <X size={16} />
            </button>

            <button
              className="bg-white rounded-full shadow-md"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <img
                src="/expand-arrow.png"
                alt="Expand"
                className={`w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <Swiper
            ref={swiperRef}
            modules={[Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            loop={true}
            className={`w-full rounded-md overflow-hidden transition-opacity duration-300 ${
              isExpanded ? 'opacity-0 absolute' : 'opacity-100 relative'
            }`}
            style={{
              height: '4rem',
              background: 'transparent',
              pointerEvents: 'none'
            }}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full">
                  <img
                    src={img.trim()}
                    alt={`Slide ${index}`}
                    className="w-full h-full object-cover"
                    onClick={() => handleRaffleClick(index)}
                    style={{ cursor: 'pointer', pointerEvents: "auto" }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div
            className={`absolute w-20 bottom-0 right-0 transition-all duration-300 ease-in-out rounded-full scrollbar-hide ${
              isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
            }`}
            style={{
              height: isExpanded ? `${images.length * 4.5}rem` : '0',
              maxHeight: '23rem',
              background: 'rgba(0,0,0,0.6)',
              padding: isExpanded ? '0.5rem' : '0',
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className="w-full h-16 mb-2 last:mb-0 rounded-md overflow-hidden"
              >
                <img
                  src={img.trim()}
                  alt={`Item ${index}`}
                  className="w-full h-full object-cover"
                  onClick={() => handleRaffleClick(index)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            ))}
          </div>
        </div> */}
        <div className="relative w-full h-full">

          <div className={`absolute duration-300 -top-6 -left-4'} 
              right-0 flex justify-between items-center z-10 mb-1`}>
            <button
              className="p-1 text-gray-600 font-semibold rounded-full shadow-md"
              onClick={() => setIsVisible(false)}
            >
              <X size={24} />
            </button>
          </div>

                <div className="w-full h-full">
                  <img
                    src='/lotee.gif'
                    className="w-full h-full object-cover"
                    style={{ cursor: 'pointer', pointerEvents: "auto" }}
                  />
                </div>
        </div>
      </motion.div>
    </>
  );
};

export default AutoSlideBox;
