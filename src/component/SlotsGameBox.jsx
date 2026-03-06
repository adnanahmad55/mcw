import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setCategory } from '../redux/slice/gameSlice';
import { useDispatch } from 'react-redux';
import GameCard from './GameCard';
import useIsMobile from '../hooks/useIsMobile';

// Import JSON files at the top
import jiliData from "../assets/data/slots/filtered_jili.json"
import spribeData from "../assets/data/slots/filtered_spribe.json"
import fcData from "../assets/data/slots/filtered_fc.json"
import jdbData from "../assets/data/slots/filtered_jdb.json"
import pgData from "../assets/data/slots/filtered_pg.json"
import ppData from "../assets/data/slots/filtered_pp.json"
import rtData from "../assets/data/slots/filtered_rt.json"
import btgData from "../assets/data/slots/filtered_btg.json"
import fsData from "../assets/data/slots/filtered_fs.json"
import dsData from "../assets/data/slots/filtered_ds.json"
import fivegData from "../assets/data/slots/filtered_5g.json"
import iluData from "../assets/data/slots/filtered_ilu.json"
import neData from "../assets/data/slots/filtered_ne.json"
import nlcData from "../assets/data/slots/filtered_nlc.json"
import p8Data from "../assets/data/slots/filtered_p8.json"
import ssData from "../assets/data/slots/filtered_ss.json"
import ylData from "../assets/data/slots/filtered_yl.json"
import sgData from "../assets/data/slots/filtered_sg.json"
import llData from "../assets/data/slots/filtered_ll.json"
import hsData from "../assets/data/slots/filtered_hs.json"
import jkData from "../assets/data/slots/filtered_jk.json"
import cgData from "../assets/data/slots/filtered_cg.json"
import ptData from "../assets/data/slots/filtered_pt.json"
import kmData from "../assets/data/slots/filtered_km.json"

const categories = [
    {
        title: "JILI",
        img: "/img/slot-menu-icon/jili.png",
        vendorImg: "/img/slot-menu-icon/jili-vendor.png",
        data: jiliData,
        platform: "JILI",
        gameType: "SLOT"
    },
    {
        title:"PG",
        img: "/img/slot-menu-icon/pg.png",
        vendorImg: "/img/slot-menu-icon/pg-vendor.png",
        data:pgData,
        platform: "PG",
        gameType: "SLOT"
    },
    // {
    //     title:"PP",
    //     img: "/img/slot-menu-icon/pp.png",
    //     vendorImg: "/img/slot-menu-icon/pp-vendor.png",
    //     data:ppData,
    //     platform: "PP",
    //     gameType: "SLOT"
    // },
    {
        title:"SPRIBE",
        img: "/img/slot-menu-icon/spb.png",
        vendorImg: "/img/slot-menu-icon/spb-vendor.png",
        data:spribeData,
        platform: "SPRIBE",
        gameType: "EGAME"
    },
    {
        title:"FC",
        img: "/img/slot-menu-icon/fc.png",
        vendorImg: "/img/slot-menu-icon/fc-vendor.png",
        data:fcData,
        platform: "FC",
        gameType: "SLOT"
    },
    {
        title:"JDB",
        img: "/img/slot-menu-icon/jdb.png",
        vendorImg: "/img/slot-menu-icon/jdb-vendor.png",
        data:jdbData,
        platform: "JDB",
        gameType: "SLOT"
    },
    {
        title:"RT",
        img: "/img/slot-menu-icon/rt.png",
        vendorImg: "/img/slot-menu-icon/rt-vendor.png",
        data:rtData,
        platform: "RT",
        gameType: "SLOT"
    },
    // {
    //     title:"BTG",
    //     img: "/img/slot-menu-icon/btg.png",
    //     vendorImg: "/img/slot-menu-icon/btg-vendor.png",
    //     data:btgData,
    //     platform: "BTG",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"FS",
    //     img: "/img/slot-menu-icon/fs.png",
    //     vendorImg: "/img/slot-menu-icon/fs-vendor.png",
    //     data:fsData,
    //     platform: "FASTSPIN",
    //     gameType: "SLOT"
    // },
    {
        title:"DS",
        img:"/img/slot-menu-icon/dragoon.png",
        vendorImg: "/img/slot-menu-icon/dragon-soft-vendor.jpg",
        data:dsData,
        platform: "DRAGOONSOFT",
        gameType: "SLOT"
    },
    // {
    //     title:"5G",
    //     img:"/img/slot-menu-icon/5G.png",
    //     vendorImg: "/img/slot-menu-icon/5G-vendor.webp",
    //     data:fivegData,
    //     platform: "5G",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"ILU",
    //     img:"/img/slot-menu-icon/iloveu.png",
    //     vendorImg: "/img/slot-menu-icon/iloveu-vendor.jpg",
    //     data:iluData,
    //     platform: "ILOVEU",
    //     gameType: "SLOT"
    // },
    {
        title:"NE",
        img:"/img/slot-menu-icon/netent.png",
        vendorImg: "/img/slot-menu-icon/netent-vendor.jpg",
        data:neData,
        platform: "NETENT",
        gameType: "SLOT"
    },
    // {
    //     title:"NLC",
    //     img:"/img/slot-menu-icon/nlc.png",
    //     vendorImg: "/img/slot-menu-icon/nolimit-city-vendor.jpg",
    //     data:nlcData,
    //     platform: "NLC",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"P8",
    //     img:"/img/slot-menu-icon/play8.png",
    //     vendorImg: "/img/slot-menu-icon/play8-vendor.jpg",
    //     data:p8Data,
    //     platform: "PLAY8",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"PT",
    //     img:"/img/slot-menu-icon/playtech.png",
    //     vendorImg: "/img/slot-menu-icon/playtech-vendor.webp",
    //     data:ptData,
    //     platform: "PT",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"SS",
    //     img:"/img/slot-menu-icon/smartsoft.png",
    //     vendorImg: "/img/slot-menu-icon/smartsoft-vendor.png",
    //     data:ssData,
    //     platform: "SMARTSOFT",
    //     gameType: "EGAME"
    // },
    // {
    //     title:"YL",
    //     img:"/img/slot-menu-icon/yellow.png",
    //     vendorImg: "/img/slot-menu-icon/yl-vendor.png",
    //     data:ylData,
    //     platform: "YL",
    //     gameType: "EGAME"
    // }
    ,
    // {
    //     title:"HS",
    //     img:"/img/slot-menu-icon/hacksaw.png",
    //     vendorImg: "/img/slot-menu-icon/hacksaw-vendor.jpg",
    //     data:hsData,
    //     platform: "HACKSAW",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"JOKER",
    //     img:"/img/slot-menu-icon/joker.png",
    //     vendorImg: "/img/slot-menu-icon/joker-vendor.jpg",
    //     data:jkData,
    //     platform: "JOKER",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"LL",
    //     img:"/img/slot-menu-icon/ladyluck.png",
    //     vendorImg: "/img/slot-menu-icon/ladyluck-vendor.jpg",
    //     data:llData,
    //     platform: "LADYLUCK",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"CG",
    //     img:"/img/slot-menu-icon/cg.png",
    //     vendorImg: "/img/slot-menu-icon/cg-vendor.png",
    //     data:cgData,
    //     platform: "CG",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"KM",
    //     img:"/img/slot-menu-icon/km-logo.png",
    //     vendorImg: "/img/slot-menu-icon/KM-vendor.png",
    //     data:kmData,
    //     platform: "KINGMAKER",
    //     gameType: "SLOT"
    // },
    // {
    //     title:"SPADE",
    //     img:"/img/slot-menu-icon/spade.png",
    //     vendorImg: "/img/slot-menu-icon/sg-vendor.jpg",
    //     data:sgData,
    //     platform: "SPADE",
    //     gameType: "SLOT"
    // }
];

export default function SlotGameBox({ title, showAllBtn, categoryName }) {
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
        const selectedVendorIndex = sessionStorage.getItem('selectedVendorIndex');
        if (selectedVendorIndex && isGameList) {
            setActiveTab(parseInt(selectedVendorIndex));
            sessionStorage.removeItem('selectedVendorIndex');
        }
    }, [isGameList]);

    // Reset loaded arrays when tab changes
    useEffect(() => {
        setLoadedArrays(3); // Always start with 3 arrays
        setHasMore(totalArrays > 3);
    }, [activeTab, totalArrays]);

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

    // Handle scroll for infinite loading (desktop)
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

    const handleVendorClick = (category, index) => {
        navigate('/game-list?category=Slots');
        dispatch(setCategory(category.title));
        // Store the selected tab index for when we reach the game-list page
        sessionStorage.setItem('selectedVendorIndex', index.toString());
    };

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
                                                            navigate('/game-list');
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
                            <p className='text-white flex h-[24px] my-2 tracking-wider'> <span className='h-full w-1 mr-2 rounded-md bg-fillColor'></span> Slots</p>
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
                        </div>
                        
                        {/* Mobile See All Button */}
                        <div className='md:hidden flex justify-center mb-4'>
                            {showAllBtn && (
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
                    </>
                )}
            </div>
        </div>
    );
}