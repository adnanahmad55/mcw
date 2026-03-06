import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import GameCard from "./GameCard";

import game1 from "../assets/img/hotgame/JL0033.webp";
import game2 from "../assets/img/hotgame/PG0113.png";
import game3 from "../assets/img/hotgame/KM0060.webp";
import game4 from "../assets/img/hotgame/JL0214.webp";
import game5 from "../assets/img/hotgame/JL0045.webp";
import game6 from "../assets/img/hotgame/SPB002.png";
import game7 from "../assets/img/hotgame/JL0038.png";
import game8 from "../assets/img/hotgame/JL0215.webp";
import game9 from "../assets/img/hotgame/JL0162.webp";
import game10 from "../assets/img/hotgame/PG0041.png";
import game11 from "../assets/img/hotgame/JL0156.png";
import game12 from "../assets/img/hotgame/EG4147.webp";
import game13 from "../assets/img/hotgame/JL0036.png";
import game14 from "../assets/img/hotgame/PG0130.png";
import jl from "../assets/img/hotgame/JL-COLOR.webp";
import km from "../assets/img/hotgame/KM-COLOR.webp";
import pg from "../assets/img/hotgame/PG-COLOR.webp";
import sp from "../assets/img/hotgame/SPB-COLOR.webp";

import GameBox from "./GameBox";
import useIsMobile from "../hooks/useIsMobile";

const games = [
    { img: game1, title: "Super Ace", provider: jl },
    { img: game2, title: "Wild Bounty", provider: pg },
    { img: game3, title: "Super Ace", provider: jl },
    { img: game4, title: "Wild Bounty", provider: jl },
    { img: game5, title: "Super Ace", provider: sp },
    { img: game6, title: "Wild Bounty", provider: jl },
    { img: game7, title: "Super Ace", provider: jl },
    { img: game8, title: "Wild Bounty", provider: jl },
    { img: game9, title: "Super Ace", provider: pg },
    { img: game10, title: "Wild Bounty", provider: jl },
    { img: game11, title: "Super Ace", provider: jl },
    { img: game12, title: "Wild Bounty", provider: jl },
    { img: game13, title: "Super Ace", provider: jl },
    { img: game14, title: "Wild Bounty", provider: jl },
];

export default function GameSlider({ slideItem }) {
    const isMobile = useIsMobile();
    return (

        <>
            <GameBox title="🔥 Hot Games">
                {/* Swiper Slider */}
                {isMobile ? (<div className="grid grid-cols-4 gap-3 px-3">
                    {games.slice(0, 12).map((game, idx) => (
                        <GameCard key={idx} {...game} />
                    ))}
                </div>
                ) : (
                    <div className="px-4 hidden md:block">
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
                    </div>
                )}


            </GameBox>
        </>
    );
}
