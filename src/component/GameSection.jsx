import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import useIsMobile from "../hooks/useIsMobile";
import GameBox from "./GameBox";
import LiveGameBox from "./LiveGameBox";
import SlotsGameBox from "./SlotsGameBox";
import FishingGameBox from "./FishingGameBox";
import JiliSlotBox from "./JiliSlotBox";
import TableGameBox from "./TableGameBox";
import GameCard from "./GameCard";
import NineWickets from "./NineWickets";
import ArcadeGameBox from "./ArcadeGameBox";
import { useLocation } from "react-router-dom";

/** Helper: randomize last digits */
const randomizeTail = (base, digits = 3) => {
  const max = Math.pow(10, digits);
  const randomTail = Math.floor(Math.random() * max);
  return (base + randomTail).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// Define category order for directional animation - only include categories from Category.jsx
const categoryOrder = [
  "Hot Games",
  "Sports",
  "Slots",
  "Live",
  "Table",
  "Crash",
  "Fish",
  "Arcade",
  "Lottery"
];

export default function GameSection({
  title,
  games,
  slideItem,
  mobileViewGame,
  sliceGame,
  showAllBtn,
  categoryName,
  previousCategory,
  currentCategory
}) {
  const isMobile = useIsMobile();
  const location = useLocation();

  const isGameList = location.pathname.includes("/game-list");

  const isSports = title === "Sports";
  const isCasino = title === "Live Casino";
  const isSlots = title === "Slots";
  const isFishing = title === "Fish";
  const isJiliSlots = title === "JILI Slots";
  const isTable = title === "Table";
  const isArcade = title === "Arcade";
  const isCrash = title === "Crash"

  // Determine animation direction based on category position in the order array
  const getAnimationDirection = () => {
    // If there's no previous category or it's the same as current, use default animation
    if (!previousCategory || previousCategory === currentCategory) return 'right';

    const prevIndex = categoryOrder.indexOf(previousCategory);
    const currentIndex = categoryOrder.indexOf(currentCategory);

    // If we can't find the categories in our predefined order, default to right
    if (prevIndex === -1 || currentIndex === -1) return 'right';

    // If moving to a later category in the list (to the right), return 'right'
    // If moving to an earlier category in the list (to the left), return 'left'
    return currentIndex > prevIndex ? 'right' : 'left';
  };

  const animationDirection = getAnimationDirection();

  /** Jackpot states */
  const [grand, setGrand] = useState("794,232.76");
  const [major, setMajor] = useState("130,483.75");
  const [mini, setMini] = useState("4,787.55");

  /** Update jackpots */
  useEffect(() => {
    const interval = setInterval(() => {
      setGrand(randomizeTail(794000, 3));
      setMajor(randomizeTail(130000, 3));
      setMini(randomizeTail(4000, 2));
    }, 75);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{
        x: animationDirection === 'right' ? '100%' : '-100%',
        opacity: 0
      }}
      animate={{ x: 0, opacity: 1 }}
      exit={{
        x: animationDirection === 'right' ? '100%' : '-100%',
        opacity: 0
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ position: "static" }}
    >
      {(isSlots && isGameList) && (
        <div className="jackpot-banner-wrapper px-3 mb-3">
          <div className="search-top-info mb-3">
            <input
              type="text"
              className="ng-pristine ng-valid ng-touched"
              placeholder="Search Games"
            />
          </div>

          <div className="relative">
            <img
              className="jackpot-banner-img"
              alt="jackpot"
              src="/upload/h5Announcement/image_272081.jpg"
              loading="lazy"
            />

            <p
              className="center-peak-grand absolute top-[73%] left-[50%] -translate-x-1/2 -translate-y-1/2"
              style={{ color: "#ffe77d", fontSize: "3.2vw" }}
            >
              {grand}
            </p>

            <p
              className="center-peak-major absolute top-[80%] left-[82%] -translate-x-1/2 -translate-y-1/2"
              style={{ color: "#fff", fontSize: "3.2vw" }}
            >
              {major}
            </p>

            <p
              className="center-peak-mini absolute top-[80%] left-[19%] -translate-x-1/2 -translate-y-1/2"
              style={{ color: "#fff", fontSize: "3.2vw" }}
            >
              {mini}
            </p>
          </div>
        </div>
      )}

      {isCasino ? (
        <LiveGameBox title={title} showAllBtn={showAllBtn} categoryName={categoryName} />
      ) : isSlots ? (
        <SlotsGameBox title={title} showAllBtn={showAllBtn} categoryName={categoryName} />
      ) : isFishing ? (
        <FishingGameBox title={title} showAllBtn={showAllBtn} categoryName={categoryName} />
      ) : isJiliSlots ? (
        <JiliSlotBox title={title} showAllBtn={showAllBtn} categoryName={categoryName} />
      ) : isTable ? (
        <TableGameBox title={title} showAllBtn={showAllBtn} categoryName={categoryName} />
      ) : (isArcade || isCrash) ? (
        <ArcadeGameBox title={title} showAllBtn={showAllBtn} categoryName={categoryName} />
      ) : (
        <GameBox
          title={title}
          showAllBtn={showAllBtn}
          categoryName={categoryName}
          length={games?.length}
        >
          {isMobile && isSports ? (
            <div className="grid grid-cols-4 gap-2 px-3">
              {(sliceGame ? games.slice(0, sliceGame) : games).map((game, idx) => (
                <GameCard key={idx} {...game} />
              ))}
            </div>
          ) : isMobile ? (
            <div className={`grid grid-cols-${mobileViewGame} gap-2 px-3`}>
              {(sliceGame ? games.slice(0, sliceGame) : games).map((game, idx) => (
                <GameCard key={idx} {...game} />
              ))}
            </div>
          ) : isSports ? (
            <div className="px-3" style={{ display: "flex" }}>
              <NineWickets title={title} />
            </div>
          ) : (
            <div className="px-3">
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
      )}
    </motion.div>
  );
}
