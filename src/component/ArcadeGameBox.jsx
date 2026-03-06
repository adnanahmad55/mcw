import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setCategory } from '../redux/slice/gameSlice';
import { useDispatch } from 'react-redux';
import GameCard from './GameCard';
import useIsMobile from '../hooks/useIsMobile';

// Import JSON files at the top
import jiliData from "../assets/data/fishing/filtered_jili.json"
import fcData from "../assets/data/fishing/filtered_fc.json"
import spadeData from "../assets/data/fishing/filtered_spade.json"
import ylData from "../assets/data/fishing/filtered_yl.json"
import fsData from "../assets/data/fishing/filtered_fs.json"
import jdbData from "../assets/data/fishing/filtered_jdb.json"

import { jdbArcadeGames, jiliArcadeGames, spribeArcadeGames, ylArcadeGames } from '../data/games';

const categories = [
    {
        title: "JILI",
        img: "https://images.6492394993.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR/JL-COLOR.png",
        data: jiliArcadeGames,
        platform: "JILI",
        gameType: "ARC"
    },
    {
        title:"YL",
        img:"https://images.6492394993.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR/YL-COLOR.png",
        data:ylArcadeGames,
        platform: "YL",
        gameType: "ARC"
    },
    {
        title:"SPRIBE",
        img: "/img/slot-menu-icon/spb.png",
        vendorImg: "/img/slot-menu-icon/spb-vendor.png",
        data:spribeArcadeGames,
        platform: "SPRIBE",
        gameType: "ARC"
    },
    {
        title:"JDB",
        img:"https://images.6492394993.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR/JDB-COLOR.png",
        data:jdbArcadeGames,
        platform: "JDB",
        gameType: "ARC"
    }
];

export default function ArcadeGameBox({ title, showAllBtn, categoryName }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(0);

    const currentCategory = categories[activeTab];
    const gameArray = currentCategory.data; // Since arcade data is a single array, not nested
    const totalGames = gameArray ? gameArray.length : 0;

    const isGameList = location.pathname.includes('/game-list')

    // Get currently loaded games (for arcade, we just return the whole array)
    const getLoadedGames = () => {
        const loadedGames = [];
        if (gameArray && Array.isArray(gameArray)) {
            gameArray.forEach(game => {
                loadedGames.push({
                    ...game,
                    img: game.img,
                    title: game.title,
                    platform: currentCategory.platform,
                    gameType: currentCategory.gameType,
                    gameCode: game.gameCode || game.code
                });
            });
        }
        return loadedGames;
    };

    const loadedGames = getLoadedGames();
    const totalGamesCount = totalGames;
    return (
        <div>
            <div className=" px-3 mb-3 overflow-hidden">
                {/* Header */}
                {/* <div className="flex title-bg justify-between items-center text-white mb-4 pl-[20px] h-[43.9467px] md:h-[68px] rounded pr-[20px] md:pr-[58px]">
                    <h3 className="flex items-center gap-2 font-bold text-[18px] md:text-[28px]">
                        {title}
                        <div style={{
                            width: '2px',
                            height: '40px',
                            margin: "0 15px",
                            background: "linear-gradient(180deg, #38a6fb, #096fd1)",
                            transform: "rotate(45deg)"
                        }}></div>
                        <div className="text-center text-white text-xs font-semibold">
                            <strong className="text-base font-semibold">{totalGamesCount}</strong>
                            <span className="block opacity-70">Total</span>
                        </div>
                    </h3>
                </div> */}
                {/* Conditional Rendering based on route */}
                {!isGameList ? (
                    // Vendor Grid Layout (for non-game-list routes)
                    <div className="gameList-wrap">
                        <div className="game-outer">
                            <div>
                                <div className="scroll-game-container">
                                    <div className="scroll-game-content">
                                        <div className="scroll-game-swiper swiper-container-initialized swiper-container-horizontal">
                                            <div className="scroll-game-list swiper-wrapper" style={{transform: 'translate3d(0px, 0px, 0px)'}}>
                                                <div className="swiper-slide swiper-slide-active" style={{width: '100%'}}>
                                                    <div className="game-slide-group vendor-grid" style={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(4, 1fr)',
                                                        gap: '4px',
                                                        padding: '10px'
                                                    }}>
                                                        {categories.map((category, index) => (
                                                            <div key={category.title} onClick={() => {
                                                                navigate('/game-list?category=Arcade');
                                                                dispatch(setCategory(category.title));
                                                            }} className='nineWickets-list rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 relative'>
                                                                <div className="nineWickets-inner-main">
                                                                    <div className="nineWickets-inner-2">
                                                                        <span>
                                                                        <img src={category.img} alt={category.title} />
                                                                        </span>
                                                                    </div>
                                                                    <p className="trunicate-text">{category.title}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className='mb-4'>
                            <p className='text-white flex h-[24px] my-2 tracking-wider'> <span className='h-full w-1 mr-2 rounded-md bg-fillColor'></span> Arcade Games</p>
                        </div>
                        {/* Tabs */}
                        <div className="rounded mb-4 bg-secondaryColor" style={{position:'sticky', top:0, zIndex:9, padding:'10px'}}>
                            <div className="flex gap-2 overflow-x-auto" style={{scrollbarWidth: 'none'}}>
                                {categories.map((category, index) => (
                                    <button
                                        key={category.title}
                                        onClick={() => setActiveTab(index)}
                                        className={`flex flex-col items-center gap-2 px-2 py-1 rounded-lg whitespace-nowrap transition-all duration-200 ${
                                            activeTab === index
                                                ? 'bg-[linear-gradient(180deg,#24262d_0%,#4b442f_100%)] border-[0.32vw] border-[#394471] text-white shadow-lg'
                                                : 'bg-[#232a46] border-[0.32vw] border-[#394471] text-gray-300 hover:bg-gray-600'
                                        }`}
                                        // style={{background:'radial-gradient(50% 60.61% at 50% 50%, #174593 0, #0f3157 100%)'}}
                                    >
                                        <img
                                            src={category.img}
                                            alt={category.title}
                                            className="object-contain"
                                            style={{minWidth:'50px', minHeight:'30px'}}
                                        />
                                        {/* <span className="font-semibold" style={{fontSize:'12px', fontWeight:'600'}}>{category.title}</span> */}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Games Grid */}
                        <div className="">
                            <div className="grid grid-cols-4 gap-2">
                                {loadedGames.map((game, index) => (
                                    <GameCard
                                        key={`${game.gameCode || game.code}-${index}`}
                                        img={game.img}
                                        title={game.title}
                                        provider={currentCategory.img}
                                        platform={game.platform}
                                        gameCode={game.gameCode}
                                        gameType={game.gameType}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Mobile See All Button */}
                        <div className='md:hidden flex justify-center mb-4'>
                            {showAllBtn && (
                                <button
                                    onClick={() => {
                                        if (categoryName) {
                                            navigate('/game-list?category=Arcade');
                                            dispatch(setCategory(categoryName));
                                        }
                                    }}
                                    style={{
                                        background: 'radial-gradient(50% 60.61% at 50% 50%, #174593 0, #0f3157 100%)'
                                    }}
                                    className='flex items-center justify-center h-[27.4667px] text-[13px] font-extrabold text-white whitespace-nowrap rounded-3xl mx-auto my-0 px-[10.9867px] py-0'>
                                    See All
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}