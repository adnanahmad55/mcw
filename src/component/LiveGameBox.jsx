import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setCategory } from '../redux/slice/gameSlice';
import { useDispatch } from 'react-redux';
import GameCard from './GameCard';
import useIsMobile from '../hooks/useIsMobile';

// Import JSON files at the top
import evoData from "../assets/data/live_casino/filtered_evo.json";
import ppData from "../assets/data/live_casino/filtered_pp.json";
import sexyData from "../assets/data/live_casino/filtered_sexy.json";
import viaData from "../assets/data/live_casino/filtered_via.json";
import ptData from "../assets/data/live_casino/filtered_pt.json";
import bgData from "../assets/data/live_casino/filtered_bg.json";

const categories = [
    {
        title: "EVO",
        img: "/img/LiveCasino/evo.png",
        vendorImg: "/img/LiveCasino/evo-vendor.png",
        data: evoData,
        platform: "EVOLUTION",
        gameType: "LIVE"
    },
    // {
    //     title: "PP",
    //     img: "/img/LiveCasino/pp.png",
    //     vendorImg: "/img/LiveCasino/pp-vendor.png",
    //     data: ppData,
    //     platform: "PP",
    //     gameType: "LIVE"
    // },
    {
        title: "SEXY",
        img: "/img/LiveCasino/sexy.png",
        vendorImg: "/img/LiveCasino/sexy-vendor.png",
        data: sexyData,
        platform: "SEXYBCRT",
        gameType: "LIVE"
    },
    // {
    //     title: "VIA",
    //     img: "/img/LiveCasino/via.png",
    //     vendorImg: "/img/LiveCasino/via-vendor.png",
    //     data: viaData,
    //     platform: "VIACASINO",
    //     gameType: "LIVE"
    // },
    // {
    //     title: "PT",
    //     img: "/img/LiveCasino/pt.png",
    //     vendorImg: "/img/LiveCasino/pt-vendor.png",
    //     data: ptData,
    //     platform: "PT",
    //     gameType: "LIVE"
    // },
    // {
    //     title: "BG",
    //     img: "/img/LiveCasino/big-gaming-logo.png",
    //     vendorImg: "/img/LiveCasino/bg-vendor.webp",
    //     data: bgData,
    //     platform: "BG",
    //     gameType: "LIVE"
    // }
];

export default function LiveGameBox({ title, showAllBtn, categoryName }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation()
    const isMobile = useIsMobile();

    const [activeTab, setActiveTab] = useState(0);
    const [loadedArrays, setLoadedArrays] = useState(3); // Start with 3 arrays
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const currentCategory = categories[activeTab];
    const gameArrays = Object.values(currentCategory.data);
    const totalArrays = gameArrays.length;

    const isGameList = location.pathname.includes('/game-list')

    // Check if we should set a specific tab on mount (for vendor clicks)
    useEffect(() => {
        const selectedVendorIndex = sessionStorage.getItem('selectedLiveVendorIndex');
        if (selectedVendorIndex && isGameList) {
            setActiveTab(parseInt(selectedVendorIndex));
            sessionStorage.removeItem('selectedLiveVendorIndex');
        }
    }, [isGameList]);

    // Reset loaded arrays when tab changes
    useEffect(() => {
        setLoadedArrays(3); // Start with 3 arrays
        setHasMore(totalArrays > 3);
    }, [activeTab, totalArrays]);

    // Get currently loaded games (only from loaded arrays)
    const getLoadedGames = () => {
        const loadedGames = [];
        for (let i = 0; i < Math.min(loadedArrays, totalArrays); i++) {
            if (gameArrays[i] && Array.isArray(gameArrays[i])) {
                gameArrays[i].forEach(game => {
                    loadedGames.push({
                        ...game,
                        img: game.showIcon,
                        title: game.nodeName,
                        platform: currentCategory.platform,
                        gameType: currentCategory.gameType,
                        gameCode: game.gameCode || game.code
                    });
                });
            }
        }
        return loadedGames;
    };

    const loadMoreGames = () => {
        if (loadedArrays < totalArrays && !isLoading) {
            setIsLoading(true);
            // Simulate API call delay
            setTimeout(() => {
                setLoadedArrays(prev => prev + 1);
                setHasMore(loadedArrays + 1 < totalArrays);
                setIsLoading(false);
            }, 300);
        }
    };

    const handleVendorClick = (category, index) => {
        navigate('/game-list?category=Live');
        dispatch(setCategory(category.title));
        // Store the selected tab index for when we reach the game-list page
        sessionStorage.setItem('selectedLiveVendorIndex', index.toString());
    };

    // Handle scroll for infinite loading
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000 &&
                hasMore && !isLoading
            ) {
                loadMoreGames();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isLoading, loadedArrays, totalArrays]);

    const loadedGames = getLoadedGames();
    const totalGamesCount = gameArrays.flat().length;

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
                                                        gap: '4px'
                                                    }}>
                                                        {categories.map((category, index) => (
                                                            <div key={category.title} onClick={() => handleVendorClick(category, index)} className='nineWickets-list rounded-lg overflow-hidden shadow-md cursor-pointer transition-transform duration-300 relative'>
                                                                <div className="nineWickets-inner-main">
                                                                    {/* <img
                                                                        className="vendor-bg"
                                                                        src={category.vendorImg}
                                                                        alt={category.title}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: 'auto',
                                                                            display: 'block'
                                                                        }}
                                                                    /> */}
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

                                        {/* See All Button */}
                                        {/* {showAllBtn && (
                                            <div className="load-more-button" style={{textAlign: 'center', padding: '10px 0'}}>
                                                <button
                                                    onClick={() => {
                                                        if (categoryName) {
                                                            navigate('/game-list?category=Live');
                                                            dispatch(setCategory(categoryName));
                                                        }
                                                    }}
                                                    style={{
                                                        background: 'radial-gradient(50% 60.61% at 50% 50%, #174593 0, #0f3157 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '20px',
                                                        padding: '5px 10px',
                                                        fontWeight: 'bold',
                                                        cursor: 'pointer',
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    See All
                                                </button>
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Original Game List Layout (for /game-list route)
                    <>
                        <div className='mb-4'>
                            <p className='text-white flex h-[24px] my-2 tracking-wider'> <span className='h-full w-1 mr-2 rounded-md bg-fillColor'></span> Live Casino</p>
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
                                        game={game}
                                    />
                                ))}
                            </div>

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <span className="ml-2 text-gray-400">Loading more games...</span>
                                </div>
                            )}
                        </div>

                        {/* Mobile See All Button */}
                        <div className='md:hidden flex justify-center mb-4'>
                            {showAllBtn && (
                                <button
                                    onClick={() => {
                                        if (categoryName) {
                                            navigate('/game-list?category=Live');
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