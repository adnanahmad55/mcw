import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function HomeBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const authData = JSON.parse(localStorage.getItem("auth"));

    useEffect(() => {
        const staticBanners = [
            "/upload/h5Announcement/image_310498.jpg",
            "/upload/h5Announcement/image_272055.jpg",
            "/upload/h5Announcement/image_272063.jpg",
            "/upload/h5Announcement/image_272067.jpg",
            "/upload/h5Announcement/image_272073.jpg",
            "/upload/h5Announcement/image_278659.jpg"
        ];

        const formattedBanners = staticBanners.map((url, index) => ({
            _id: `static-${index}`,
            banner_path: url.trim()
        }));

        setBanners(formattedBanners);
        setLoading(false);
    }, []);

    if (loading) {
        return <div className="home-banner w-full p-2">Loading...</div>;
    }

    return (
        <div className="home-banner w-full pb-2 relative">
            <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                pagination={{
                    clickable: true,
                    type: 'bullets',
                }}
                className="mySwiper"
            >
                {banners.map((banner, index) => (
                    <SwiperSlide key={banner._id}>
                        <img
                            src={banner.banner_path}
                            alt={`Banner ${index + 1}`}
                            className="w-full aspect-[5/2] object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            
            <style jsx global>{`
              .swiper-pagination-bullet {
                background: white !important;
                transition: all 0.3s ease !important;
                width: 8px !important;
                height: 8px !important;
                margin: 0 4px !important;
                opacity: 1 !important;
              }
              
              .swiper-pagination-bullet-active {
                background: #c9a33d !important;
                opacity: 1 !important;
                transform: scale(1.2) !important;
              }
              
              .mySwiper {
                overflow: visible !important; /* Ensure pagination isn't clipped */
              }
              
              .swiper-pagination {
                bottom: 10px !important;
              }
            `}</style>
        </div>
    );
}