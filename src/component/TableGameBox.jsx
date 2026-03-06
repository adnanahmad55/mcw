import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setCategory } from '../redux/slice/gameSlice';
import { useDispatch } from 'react-redux';
import GameCard from './GameCard';
import useIsMobile from '../hooks/useIsMobile';

// Import JSON files at the top
import kmData from "../assets/data/poker/km.json"

const categories = [
    {
        title: "KINGMIDAS",
        img: "https://images.6492394993.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR/KM-COLOR.png",
        data: kmData,
        platform: "KINGMAKER",
        gameType: "TABLE"
    }
];

export default function TableGameBox({ title, showAllBtn, categoryName }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState(0);
    const [loadedArrays, setLoadedArrays] = useState(1); // Start with 1 array
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false); // Track if we're showing more than first array

    const currentCategory = categories[activeTab];
    const gameArrays = Object.values(currentCategory.data);
    const totalArrays = gameArrays.length;

    const isGameList = location.pathname.includes('/game-list')

    // Reset loaded arrays when tab changes
    useEffect(() => {
        setLoadedArrays(1);
        setHasMore(totalArrays > 1);
        setIsExpanded(false);
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
                setIsExpanded(true);
                setIsLoading(false);
            }, 300);
        }
    };

    const showLessGames = () => {
        setLoadedArrays(1);
        setHasMore(true);
        setIsExpanded(false);
        // Scroll to top of the component
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle scroll for infinite loading (desktop) - only when expanded
    useEffect(() => {
        const handleScroll = () => {
            if (
                isExpanded &&
                window.innerHeight + document.documentElement.scrollTop
                >= document.documentElement.offsetHeight - 1000 &&
                hasMore && !isLoading
            ) {
                loadMoreGames();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, isLoading, loadedArrays, totalArrays, isExpanded]);

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
                                                        gap: '4px',
                                                        padding: '10px'
                                                    }}>
                                                        {categories.map((category, index) => (
                                                            <div key={category.title} onClick={() => {
                                                                navigate('/game-list?category=Table');
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
                            <p className='text-white flex h-[24px] my-2 tracking-wider'> <span className='h-full w-1 mr-2 rounded-md bg-fillColor'></span> Table Games</p>
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

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                    <span className="ml-2 text-gray-400">Loading more games...</span>
                                </div>
                            )}

                            {/* Show More/Show Less Buttons */}
                            {totalArrays > 1 && !isLoading && (
                                <div className="flex justify-center my-2 gap-3">
                                    {/* Show More Button - visible when not all arrays are loaded */}
                                    {hasMore && !isExpanded && isGameList && (
                                        <button
                                            onClick={loadMoreGames}
                                            style={{
                                                background: 'radial-gradient(50% 60.61% at 50% 50%, #174593 0, #0f3157 100%)'
                                            }}
                                            className="flex items-center justify-center h-[35px] text-[14px] font-extrabold text-white whitespace-nowrap rounded-3xl px-6 py-0 hover:shadow-lg transition-shadow duration-200"
                                        >
                                            Show More
                                        </button>
                                    )}

                                    {/* Show Less Button - visible when more than first array is loaded */}
                                    {isExpanded && (
                                        <button
                                            onClick={showLessGames}
                                            style={{
                                                background: 'radial-gradient(50% 60.61% at 50% 50%, #666666 0, #333333 100%)'
                                            }}
                                            className="flex items-center justify-center h-[35px] text-[14px] font-extrabold text-white whitespace-nowrap rounded-3xl px-6 py-0 hover:shadow-lg transition-shadow duration-200"
                                        >
                                            Show Less
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile See All Button */}
                        <div className='md:hidden flex justify-center mb-4'>
                            {showAllBtn && hasMore && (
                                <button
                                    onClick={() => {
                                        if (categoryName) {
                                            navigate('/game-list?category=Table');
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