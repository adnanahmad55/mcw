import React, {useState, useEffect, useRef} from 'react'
import { AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { setCategory } from '../redux/slice/gameSlice'
import HomeBanner from '../component/HomeBanner'
import MarqueeSlide from '../component/MarqueeSlide'
import Category from '../component/Category'
import GameSlider from '../component/GameSlider'
import PgSlots from '../component/PgSlots'
import Slots from '../component/Slots'
import Live from '../component/Live'
import GameSection from '../component/GameSection'
import { hotGames, pgGames, slotGames, liveGames,  crashGames, fishGame, liveCasinoGame, sportsGames } from "../data/games";
import { jiliGames } from '../data/jiliGames'
import { pgSoftGames } from '../data/pgSoftGames'
import { FaAndroid, FaApple, FaWhatsapp } from "react-icons/fa";
import bgImage from "../assets/img/home-app-bg.png";
import android from "../assets/img/down-android.png";
import iphone from "../assets/img/down-ios.fbdc1792.png";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import FavoritesSlider from '../component/FavoriteSlider'
import ProviderSlider from '../component/ProviderSlider'
import PopularGames from '../component/PopularGames'
import LaunchBanner from '../component/LaunchBanner'
import useIsMobile from '../hooks/useIsMobile'

export default function Home() {
   const { t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedCategory } = useSelector((state) => state.game);
  const { isLogin, username } = useSelector((state) => state.auth);
  const previousCategoryRef = useRef(null);
  const isMobile = useIsMobile();

  const gameSections = [
    {
      key: "Hot Games",
      title: "Hot Games",
      games: hotGames,
      slideItem: 7,
      mobileViewGame: 4,
      sliceGame: 24,
      // showAllBtn: 'Sell All',
      categoryName: 'Hot Games'
    },
    {
      key: "JILI Slots",
      title: "🔥 JILI Slots",
      games: jiliGames,
      slideItem: 7,
      mobileViewGame: 4,
      sliceGame: 8,
      showAllBtn: 'Sell All',
      categoryName: 'JILI Slots'
    },
    {
      key: "PG Slots",
      title: "🔥 PG Slots",
      games: pgSoftGames,
      slideItem: 7,
      mobileViewGame: 4,
      sliceGame: 8,
      showAllBtn: 'Sell All',
      categoryName: 'PG Slots'
    },
    {
      key: "Slots",
      title: "Slots",
      games: slotGames,
      slideItem: 3,
      mobileViewGame: 3,
      sliceGame: 9,
      showAllBtn: 'Sell All',
      categoryName: 'Slots',
    },
    {
      key:"Table",
      title: "Table",
      games: slotGames,
      slideItem: 3,
      mobileViewGame: 3,
      sliceGame: 9,
      showAllBtn: 'Sell All',
      categoryName: 'Table',
    },
    {
      key: "Crash",
      title: "Crash",
      games: crashGames,
      slideItem: 3,
      mobileViewGame: 4,
      sliceGame: 8,
      // showAllBtn: false,
      showAllBtn: 'See ALl',
      categoryName:'Crash'
    },
    {
      key: "Live",
      title: "Live Casino",
      games: liveCasinoGame,
      slideItem: 7,
      mobileViewGame: 3,
      sliceGame: 9,
      showAllBtn: 'Sell All',
      categoryName: 'Live'
    },
    {
      key: "Fish",
      title: "Fish",
      games: fishGame,
      slideItem: 7,
      mobileViewGame: 4,
      sliceGame: 8,
      showAllBtn: 'Sell All',
    },
    {
      key: "Sports",
      title: "Sports",
      games: sportsGames,
      slideItem: 3,
      mobileViewGame: 4,
      sliceGame: ''
    },
    {
      key: "Arcade",
      title: "Arcade",
      games: sportsGames,
      slideItem: 3,
      mobileViewGame: 4,
      sliceGame: ''
    }
  ];

  const [showLaunchBanner, setShowLaunchBanner] = useState(false);

  const handleLaunchBannerClose = () => {
    setShowLaunchBanner(false);
  };


  useEffect(() => {
    const hasSeenLaunchBanner = sessionStorage.getItem("hasSeenLaunchBanner");

    if (!hasSeenLaunchBanner) {
      setShowLaunchBanner(true);
      sessionStorage.setItem("hasSeenLaunchBanner", "true");
    }
  }, []);

    const [supportData, setSupportData] = useState("");
    const getSupportData = async () => {
        try {
          const supportResponse = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}v1/admin/support-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const support = await supportResponse.json();
        if (supportResponse.ok) {
          setSupportData(support.results[0]);
        } else {
          toast.error(supportResponse.message || "Support error");
        }
      } catch (error) {
        toast.error("Support error");
      }
    };

    // useEffect(() => {
    //   getSupportData();
    // }, []);

  useEffect(() => {
    // Update the previous category ref after render
    previousCategoryRef.current = selectedCategory;
  }, [selectedCategory]);



  return (
    <div className={`w-full ${isMobile ? 'md:pt-12 pt-0' : 'pt-0'} relative`}>
      {showLaunchBanner && <LaunchBanner onClose={handleLaunchBannerClose} />}
      <HomeBanner />
      <MarqueeSlide />
      {/* Category bar - only show on mobile, desktop has sidebar categories */}
      {isMobile && (
        <div className='mt-[10px] mb-[10px]'>
          <Category />
        </div>
      )}
      {/* On desktop, add some top spacing since no category bar */}
      {!isMobile && <div className='mt-3' />}
      {/* {isLogin &&
      <div className="flex gap-2 w-full px-2 mb-[10px]">
        <Link to="/deposit" className='vendor-menu-scroll w-full flex justify-center gap-3 p-1 home-transaction text-lg'>
          <img alt="deposit" className="h-8 w-8" src="/deposit.svg" />
          <p className="text-[#ffab49] font-semibold">{t('account.deposit')}</p>
        </Link>
        <Link to="/withdrawal" className='vendor-menu-scroll w-full flex justify-center gap-3 p-1 home-transaction text-lg'>
          <img alt="withdraw" className="h-8 w-8" src="/withdraw.svg" />
          <p className="text-[#ffab49] font-semibold">{t('account.withdrawal')}</p>
        </Link>
      </div>
      } */}
      <AnimatePresence mode="wait">
        {gameSections.map(({ key, title, games, slideItem, mobileViewGame, sliceGame, showAllBtn, categoryName }) =>
          (selectedCategory === key) && (
            <GameSection
              key={key}
              title={title}
              games={games}
              slideItem={slideItem}
              mobileViewGame={mobileViewGame}
              sliceGame={sliceGame}
              showAllBtn={showAllBtn}
              categoryName={categoryName}
              previousCategory={previousCategoryRef.current}
              currentCategory={selectedCategory}
            />
          )
        )}
      </AnimatePresence>

      <div className='text-white px-3'>
        <p className='py-1 flex h-[32px] mb-2 font-semibold tracking-wider'> <span className='h-full w-1 mr-2 rounded-md bg-fillColor'></span> Favourites</p>
        <FavoritesSlider />
      </div>

      <div className='text-white px-3'>
        <p className='py-1 flex h-[32px] my-2 font-semibold tracking-wider'> <span className='h-full w-1 mr-2 rounded-md bg-fillColor'></span> Popular Games</p>
        <PopularGames/>
      </div>

      <div className='text-white px-3'>
        <p className='py-1 flex h-[32px] my-2 font-semibold tracking-wider'> <span className='h-full w-1 mr-2 rounded-md bg-fillColor'></span> Game Providers</p>
        <ProviderSlider/>
      </div>


      {/* <div
        className="w-full bg-cover bg-center py-10 px-5 rounded-xl text-white flex flex-col items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-2">DOWNLOAD APP</h2>
        <p className="text-sm md:text-base opacity-80 mb-6 text-center">
          Download and install the APP for a smoother gaming experience.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <img src={android} />
          <img src={iphone} />
        </div>
      </div> */}
      {/* <div className='fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-2'>
      <a
        href={`https://wa.me/${import.meta.env.VITE_APP_SUPPORT_NO}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-40 right-5 z-50 bg-green-500 rounded-full p-2 shadow-lg hover:bg-green-600 transition-colors duration-300"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-white text-3xl" />
      </a>
      <a href={`https://t.me/${import.meta.env.VITE_APP_SUPPORT_NO}`} target='_blank'><img src="/tg.png" alt="Telegram" className="w-10 h-10 object-contain" /></a>
      </div> */}
      {/* <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-2" style={{bottom: '6rem'}}>
        <a href={`https://wa.me/${import.meta.env.VITE_APP_SUPPORT_NO}`} target='_blank'><img src="/wa.png" alt="WhatsApp" className="w-10 h-10 object-contain" /></a>
        <a href="https://www.facebook.com/star75bd" target='_blank'><img src="/fb.png" alt="Facebook" className="w-10 h-10 object-contain" /></a>
        <a href={`https://t.me/star75offcial`} target='_blank'><img src="/tg.png" alt="Telegram" className="w-10 h-10 object-contain" /></a>
      </div> */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-2" style={{bottom: '6rem'}}>
        {supportData && supportData.whatsapp &&
          <a href={`https://wa.me/${supportData.whatsapp}`} target='_blank'><img src="/wa.png" alt="WhatsApp" className="w-10 h-10 object-contain" /></a>
        }
        {supportData && supportData.facebook &&
          <a href={supportData.facebook} target='_blank'><img src="/fb.png" alt="Facebook" className="w-10 h-10 object-contain" /></a>
        }
        {supportData && supportData.telegram &&
          <a href={supportData.telegram} target='_blank'><img src="/tg.png" alt="Telegram" className="w-10 h-10 object-contain" /></a>
        }
        {/* <a href=" https://tawk.to/chat/694bce57477298197c6dc9f4/1jd81s1gj" target='_blank'><img src="/service.png" alt="Service" className="w-10 h-10 object-contain" /></a> */}
        <a href="#"><img src="/service.png" alt="Service" className="w-10 h-10 object-contain" /></a>
      </div>
    </div>
  )
}

