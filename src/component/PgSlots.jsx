import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import GameCard from "./GameCard";

import game1 from "../assets/img/pgslots/PG0170.png";
import game2 from "../assets/img/pgslots/PG0169.webp";
import game3 from "../assets/img/pgslots/PG0168.png";
import game4 from "../assets/img/pgslots/PG0167.webp";
import game5 from "../assets/img/pgslots/PG0166.webp";
import game6 from "../assets/img/pgslots/PG0165.webp";
import game7 from "../assets/img/pgslots/PG0164.webp";
import jl from "../assets/img/hotgame/JL-COLOR.webp";
import km from "../assets/img/hotgame/KM-COLOR.webp";
import pg from "../assets/img/hotgame/PG-COLOR.webp";
import sp from "../assets/img/hotgame/SPB-COLOR.webp";

import GameBox from "./GameBox";
import useIsMobile from "../hooks/useIsMobile";

const games = [
    { img: game1, title: "Super Ace", provider: pg },
    { img: game2, title: "Wild Bounty", provider: pg },
    { img: game3, title: "Super Ace", provider: pg },
    { img: game4, title: "Wild Bounty", provider: pg },
    { img: game5, title: "Super Ace", provider: pg },
    { img: game6, title: "Wild Bounty", provider: pg },
    { img: game7, title: "Super Ace", provider: pg },
];

export default function PgSlots({ slideItem }) {
    const isMobile = useIsMobile();
    return (

        <>
            <GameBox title="🔥 PG Slots">
                {/* Swiper Slider */}
                {isMobile ? (<div className="grid grid-cols-4 gap-3 px-3">
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
