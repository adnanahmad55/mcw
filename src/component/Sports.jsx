import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import GameCard from "./GameCard";

import game1 from "../assets/img/slots/gcs__rng-jl_1720148908774.webp";
import game2 from "../assets/img/slots/gcs__rng-pg_1692249585882.webp";
import game3 from "../assets/img/slots/gcs__rng-spb_1692248602713.webp";
import game4 from "../assets/img/slots/gcs__rng-fc_1719220287111.webp";
import game5 from "../assets/img/slots/gcs__rng-jdb.webp";
import game6 from "../assets/img/slots/gcs__rng-pp_1719222797039.webp";
// import game7 from "../assets/img/slots/PG0164.webp";
import jl from "../assets/img/hotgame/JL-COLOR.webp";
import km from "../assets/img/hotgame/KM-COLOR.webp";
import pg from "../assets/img/hotgame/PG-COLOR.webp";
import sp from "../assets/img/hotgame/SPB-COLOR.webp";

import GameBox from "./GameBox";
import useIsMobile from "../hooks/useIsMobile";

const games = [
    { img: game1, },
    { img: game2, },
    { img: game3, },
    { img: game4, },
    { img: game5, },
    { img: game6, },
];

export default function Sports({ slideItem }) {
    const isMobile = useIsMobile();
    return (

        <>
            <GameBox title="Sports">
                {/* Swiper Slider */}
                {isMobile ? (<div className="grid grid-cols-4 gap-2 px-3">
                    {games.slice(0, 12).map((game, idx) => (
                        <GameCard key={idx} {...game} />
                    ))}
                </div>
                ) : (
                    <div className="px-4">
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            spaceBetween={15}
                            slidesPerView={slideItem}
                            loop={false}
                            className="game-swiper game-swiper-slide"
                        >
                            {games.map((game, idx) => (
                                <SwiperSlide key={idx}>
                                    <GameCard {...game} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>)}


            </GameBox>
        </>
    );
}