import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import GameCard from "./GameCard";

import game1 from "../assets/img/live/gcs__live-eg4_1683254015799.webp";
import game2 from "../assets/img/live/gcs__live-pp.webp";
import game3 from "../assets/img/live/gcs__live-sex.webp";
import game4 from "../assets/img/live/gcs__live-ez_1683253698803.webp";
import game5 from "../assets/img/live/gcs__live-mg_1683253736459.webp";
import game6 from "../assets/img/live/gcs__live-via_1708577243296.webp";
import game7 from "../assets/img/live/gcs__live-ail_1726562945358.webp";
import game8 from "../assets/img/live/gcs__live-wj_1724989255275.webp";
import game9 from "../assets/img/live/gcs__live-gpi.webp";
import game10 from "../assets/img/live/gcs__live-pt_1718357645383.webp";
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
    { img: game7, },
    { img: game8, },
    { img: game9, },
    { img: game10, },
];

export default function Live({ slideItem }) {
    const isMobile = useIsMobile();
    return (

        <>
            <GameBox title="Live">
                {/* Swiper Slider */}
                {isMobile ? (<div className="grid grid-cols-4 gap-3 px-3">
                    {games.map((game, idx) => (
                        <>
                            {console.log(game)}
                            <GameCard key={idx} {...game} />
                        </>
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
