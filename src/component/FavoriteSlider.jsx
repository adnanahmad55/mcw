import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Import required modules
import { Pagination, Autoplay } from 'swiper/modules';

const FavoritesSlider = () => {
  // Images array - replace with your actual image URLs
  const images = [
    "/upload/announcement/image_328556.jpg",
    "/upload/announcement/image_328562.jpg",
    "/upload/announcement/image_328564.jpg",
    "/upload/announcement/image_330706.jpg",
    "/upload/announcement/image_330714.jpg",
    "/upload/announcement/image_272083.jpg",
    "/upload/announcement/image_327854.jpg",
    "/upload/announcement/image_327852.jpg",
    "/upload/announcement/image_328561.jpg"
  ];

  return (
    <div className="full-width-slider-container" style={{ width: '100%', position: 'relative' }}>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: '.custom-swiper-pagination',
          type: 'bullets',
          renderBullet: function (index, className) {
            return `<span class="${className}" style="background-color: white;"></span>`;
          }
        }}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        style={{
          width: '100%',
          height: 'auto',
        }}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index}`}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: '80vh',
                objectFit: 'cover'
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom pagination positioned relative to the swiper container */}
      <div 
        className="custom-swiper-pagination" 
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '10',
          display: 'flex',
          gap: '2px',
          alignItems: 'center',
          justifyContent:'center'
        }}
      />
      
      <style jsx>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          background-color: white !important;
          transition: all 0.3s ease;
        }
        
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          background-color: #c9a33d !important;
          transform: scale(1.2);
        }
        
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
        }
      `}</style>
    </div>
  );
};

export default FavoritesSlider;