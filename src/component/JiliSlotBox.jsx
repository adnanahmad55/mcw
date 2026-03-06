import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCategory } from '../redux/slice/gameSlice';
import { useDispatch } from 'react-redux';
import GameCard from './GameCard';
import useIsMobile from '../hooks/useIsMobile';

// Import JSON files at the top
import jiliData from "../assets/data/jiliSlots.json"

const categories = [
    {
        title: "JILI",
        img: "https://images.6492394993.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR/JL-COLOR.png",
        data: jiliData,
        platform: "JILI",
        gameType: "SLOT"
    },
];

export default function FishingGameBox({ title, showAllBtn, categoryName }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useIsMobile();
    
    const [activeTab, setActiveTab] = useState(0);
    const [loadedArrays, setLoadedArrays] = useState(1); // Start with 1 array
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false); // Track if we're showing more than first array

    const currentCategory = categories[activeTab];
    const gameArrays = Object.values(currentCategory.data);
    const totalArrays = gameArrays.length;

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
            
            
            <div className="bg-boxColor rounded-xl mb-3 overflow-hidden">
                {/* Header */}
                <div className="flex title-bg justify-between items-center text-white mb-4 pl-[20px] h-[43.9467px] md:h-[68px] rounded pr-[20px] md:pr-[58px]">
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
                </div>
                
            
                {/* Games Grid */}
                <div className="px-4">
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
                        <div className="flex justify-center my-6 gap-3">
                            {/* Show More Button - visible when not all arrays are loaded */}
                            {hasMore && !isExpanded && (
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
                
                {/* Footer Info */}
                <div className="text-gray-400 text-sm text-center mt-3 pb-4 hidden md:block">
                    {loadedGames.length} / {totalGamesCount} Games
                    {isExpanded && ` (Showing ${loadedArrays} of ${totalArrays} sections)`}
                </div>
                
                {/* Mobile See All Button */}
                <div className='md:hidden flex justify-center my-4'>
                    {showAllBtn && hasMore && (
                        <button
                            onClick={() => {
                                if (categoryName) {
                                    navigate('/game-list');
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
            </div>
        </div>
    );
}