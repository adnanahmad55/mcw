import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from 'react';
import { TiUserAdd } from "react-icons/ti";
import sportsProviders from "../data/sportsProviders";
import LeftMenuProvider from "./LeftMenuProvider";
import LiveCasinoProvider from "../data/LiveCasinoProvider";
import SlotProvider from "../data/SlotProvider";
import TableProvider from "../data/TableProvider";
import LotteryProvider from "../data/LotteryProvider";
import FishingProvider from "../data/FishingProvider";
import ArcadeProvider from "../data/ArcadeProvider";
import CrashProvider from "../data/CrashProvider";
// import { path } from "framer-motion/client"; // Removed unused import
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from 'react-i18next';

const menuItems = [
  { icon: 'icon-sport.svg', label: 'Sports', translationKey: 'sports' },
  { icon: 'icon-casino.svg', label: 'Casino', translationKey: 'casino' },
  { icon: 'icon-slot.svg', label: 'Slots', translationKey: 'slots' },
  { icon: 'icon-table.svg', label: 'Table', translationKey: 'table' },
  { icon: 'icon-lottery.svg', label: 'Lottery', translationKey: 'lottery' },
  { icon: 'icon-fish.svg', label: 'Fishing', translationKey: 'fishing' },
  { icon: 'icon-arcade.svg', label: 'Arcade', translationKey: 'arcade' },
  { icon: 'icon-crash.svg', label: 'Crash', translationKey: 'crash' },
];

const bottomMenu = [
  { icon: 'icon-home.svg', label: 'Home', translationKey: 'home', path: '/' },
  { icon: 'icon-login.svg', label: 'Login', translationKey: 'login', path: '/login' },
];

const bottomMenuPro = [
  { icon: 'icon-promotion.svg', label: 'Promotions', translationKey: 'promotions', path: '/promotion' },
  { icon: 'icon-download.svg', label: 'Download', translationKey: 'download', path: '/app-download' },
];

const bottomMenuFB = [
  { icon: 'icon-customer.svg', label: 'Customer Service', translationKey: 'customerService', path: '/support-widget' },
  { icon: 'icon-customer (1).svg', label: 'FB Group', translationKey: 'fbGroup', path: '/message-widget' },
];

const walletOption = [
  { icon: 'icon-deposit.svg', label: 'Deposit', translationKey: 'deposit', path: '/deposit' },
  { icon: 'icon-withdrawal.svg', label: 'Withdrawal', translationKey: 'withdrawal', path: '/withdrawal' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 }
  })
};

const LeftSidebarModal = ({ setLeftSidebar }) => { // Accept setLeftSidebar as prop
  const { t } = useTranslation();
  const [spinning, setSpinning] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProviderCategory, setSelectedProviderCategory] = useState('');
  const { isLogin, username, totalCoins } = useSelector((state) => state.auth);
  const authData = localStorage.getItem("auth");
  const parsedData = JSON.parse(authData);
  const playerName = parsedData?.username;

  const [iExposure, setIexposure] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userCoins, setUserCoins] = useState(totalCoins);

  const handleLogout = () => {
    dispatch(logout());
    setLeftSidebar(false); // Close sidebar using the prop function
    navigate("/");
  };

  const handleClick = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  };

  const handleRefreshCoins = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      if (!authData || !authData.token || !authData.username) {
        console.error("Auth data missing");
        return;
      }
      const { token, username } = authData;

      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}v1/user/get-user-balance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        }
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setUserCoins(data.data?.totalCoins);
        setIexposure(data.data?.ninew_exposure);
        localStorage.setItem('wallet_balance', data?.data?.totalCoins);
      } else {
        console.error("Failed to refresh coins:", data.message);
      }
    } catch (error) {
      console.error("Error refreshing coins:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    handleRefreshCoins();
  }, []);

  // Internal state to manage the visibility of the sidebar itself
  const [isVisible, setIsVisible] = useState(false);

  // Effect to sync internal visibility state with the setLeftSidebar prop
  useEffect(() => {
    // Assuming the parent controls the visibility via a boolean state passed as setLeftSidebar
    // We can't directly call setLeftSidebar() if it's a setter function.
    // Let's assume the parent passes the visibility state down differently.
    // The new component expects a function to close itself.
    // So we will directly use setLeftSidebar(false) in the component logic below.
    // We don't need an internal state mirroring the parent's state here.
    // The AnimatePresence already handles showing/hiding based on the condition.
    // The parent controls the rendering of this component, so we just need to call setLeftSidebar(false).
  }, []); // No dependency array needed if parent manages rendering

  // We remove the internal 'open' state and the effect that managed it,
  // because the parent component should be controlling whether this component renders at all.
  // Instead, we directly call setLeftSidebar(false) when needed.

  return (
    <AnimatePresence>
      {/* The component itself is controlled by the parent, so it renders when it needs to. */}
      {/* We use AnimatePresence to handle the enter/exit animations. */}
      <motion.div className="fixed inset-0 z-50 flex overflow-hidden"
                  initial="hidden"
                  animate="visible"
                  exit="hidden">
        {/* Close Button */}
        <button
          className="absolute -top-6 right-0 text-white text-[50px] z-10"
          onClick={() => {
            setSelectedProviderCategory('');
            setLeftSidebar(false); // Close sidebar using the prop function
          }}
        >
          &times;
        </button>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-[#00000080]"
          style={{
            backdropFilter: 'blur(2.1333333333vw)'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setLeftSidebar(false)} // Close sidebar on backdrop click
        ></motion.div>

        {/* Sidebar Content */}
        <div className="w-full flex pb-[10px]">
          {/* Main Sidebar Panel */}
          <motion.div
            className="relative pt-[10.6666666667vw] px-[2.1333333333vw] w-[63.8666666667vw] z-20 overflow-auto"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.4 }}
          >
            {/* Header */}
            <div className='w-full bg-[#222222] h-[16vw] relative'
                 style={{
                   borderRadius: '6px 6px 0px 0px',
                   boxShadow: 'inset 0 .2666666667vw .2666666667vw color-mix(in srgb,#fff,transparent 80%)'
                 }}>
              <video autoPlay muted loop playsInline
                     className='absolute z-10 bottom-[-.2666666667vw] left-[-2.6666666667vw] w-[28vw] h-[19.7333333333vw]'>
                <source src="/assets/img/head-coin.webm" type="video/webm" />
              </video>
              <div className='flex relative capitalize flex-col justify-center h-[16vw] text-[3.2vw] font-semibold pl-[26.6666666667vw] text-[#ffb80c]'>
                {isLogin ? playerName : t('hiWelcome')}
                {isLogin && <p className="text-[#ffb80c] flex items-center justify-between mt-1 pr-3"
                               onClick={() => {
                                 navigate('/profile');
                                 setLeftSidebar(false); // Close sidebar after navigation
                               }}>{t('profile')} <MdKeyboardArrowRight size={20} /></p>}
              </div>
            </div>

            <div className='w-full h-[16vw] bg-[#ffb80c] flex relative'
                 style={{
                   borderRadius: '0 0 1.3333333333vw 1.3333333333vw'
                 }}>
              {!isLogin ? <>
                <div className='inline-flex items-center px-3 relative w-6/12 shadow-none text-[3.2vw] font-medium justify-between text-[#222222]'
                     onClick={() => {
                       setLeftSidebar(false); // Close sidebar on login click
                     }}>
                  <img src='/assets/img/icons/icon-login.svg'
                       className='w-[4vw]'
                       style={{ filter: 'brightness(0) saturate(100%)' }} />
                  {t('login')}
                </div>
                <div className='inline-flex items-center px-3 relative w-6/12 shadow-none text-[3.2vw] font-medium justify-between text-[#222222]'
                     onClick={() => {
                       navigate('/register');
                       setLeftSidebar(false); // Close sidebar after navigation
                     }}>
                  <TiUserAdd className="text-black text-[4vw]" />
                  {t('signUp')}
                </div>
              </> :
                <div className="flex items-center justify-between w-full px-3">
                  <div className="w-auto">
                    <div className="flex items-center gap-1">
                      <span className="text-[#222222] text-[3.2vw]"> {t('mainWallet')} </span>
                      <img src="/assets/img/icon-refresh-type01.svg"
                           onClick={handleRefreshCoins}
                           className={`w-[3.2vw] h-[3.2vw] cursor-pointer transition-transform ${spinning ? 'spin-fast' : ''}`}
                           style={{ filter: 'invert(1)' }} />
                    </div>
                    <strong className="text-[4.8vw] text-[#222222]">৳ {totalCoins?.toFixed(2) || '0.00'}</strong>
                  </div>
                  <Link to="/inbox" onClick={() => setLeftSidebar(false)} className="w-[10.6666666667vw] h-[10.6666666667vw] p-2 rounded-full flex items-start justify-center bg-[#222]">
                    <img src="/assets/img/icon-email.svg" className="" />
                  </Link>
                </div>
              }
            </div>

            {isLogin && (
              <div className="flex my-2 items-center h-[19.2vw] bg-[#2a2a2a] text-[2.9333333333vw] p-[1.0666666667vw] rounded-[1.3333333333vw] cursor-pointer"
                   style={{
                     background: 'linear-gradient(45deg, #2f2e2c 0%, #24221c 100%)',
                     boxShadow: '0 2.1333333333vw 2.6666666667vw color-mix(in srgb,rgba(0, 0, 0, .2),transparent 70%),inset .2666666667vw .2666666667vw color-mix(in srgb,#fff,transparent 80%)'
                   }}>
                {walletOption.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap justify-center items-center px-4 text-white"
                    onClick={() => {
                      navigate(item.path);
                      setLeftSidebar(false); // Close sidebar after navigation
                    }}
                  >
                    <img src={`/assets/img/${item.icon}`} alt={t(item.translationKey)} className="w-[8vw] h-[8vw] mb-1" />
                    <p className="whitespace-nowrap overflow-hidden w-full text-center">{t(item.translationKey)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Menu grid */}
            <div
              className="grid grid-cols-3 gap-[2.1333333333vw] mb-0 mt-[2.1333333333vw]">
              {menuItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={itemVariants}
                  onClick={() => {
                    setSelectedProviderCategory(item.label);
                    // Keep sidebar open when selecting category
                  }}
                  className="flex flex-col items-center h-[19.2vw] justify-center bg-[#2a2a2a] text-[2.9333333333vw] p-[1.0666666667vw] rounded-[1.3333333333vw] cursor-pointer text-white"
                  style={{
                    background: `${selectedProviderCategory === item.label ? 'rgba(255, 255, 255, .3)' : 'linear-gradient(45deg, #2f2e2c 0%, #24221c 100%)'}`,
                    boxShadow: '0 2.1333333333vw 2.6666666667vw color-mix(in srgb,rgba(0, 0, 0, .2),transparent 70%),inset .2666666667vw .2666666667vw color-mix(in srgb,#fff,transparent 80%)',
                    filter: `${selectedProviderCategory === item.label ? 'brightness(100)' : ''}`
                  }}
                >
                  <img src={`/assets/img/icons/${item.icon}`} alt={t(item.translationKey)} className="w-[8vw] h-[8vw] mb-1" />
                  {item.label === 'Casino' ? t('casino') : t(item.translationKey)}
                </motion.div>
              ))}
            </div>

            {/* Bottom buttons */}
            <motion.div
              className="space-y-2 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: menuItems.length * 0.1 }}>
              <div className="flex mb-2 items-center h-[19.2vw] bg-[#2a2a2a] text-[2.9333333333vw] p-[1.0666666667vw] rounded-[1.3333333333vw] cursor-pointer"
                   style={{
                     background: 'linear-gradient(45deg, #2f2e2c 0%, #24221c 100%)',
                     boxShadow: '0 2.1333333333vw 2.6666666667vw color-mix(in srgb,rgba(0, 0, 0, .2),transparent 70%),inset .2666666667vw .2666666667vw color-mix(in srgb,#fff,transparent 80%)'
                   }}>
                {bottomMenuPro.map((item, idx) => (
                  <Link
                    to={item.path}
                    key={idx}
                    onClick={() => setLeftSidebar(false)} // Close sidebar after navigation
                    className="flex flex-wrap justify-center items-center px-4 text-white"
                  >
                    <img src={`/assets/img/icons/${item.icon}`} alt={t(item.translationKey)} className="w-[8vw] h-[8vw] mb-1" />
                    <p className="whitespace-nowrap overflow-hidden text-white">{t(item.translationKey)}</p>
                  </Link>
                ))}
              </div>
              <div className="flex mb-2 items-center h-[19.2vw] bg-[#2a2a2a] text-[2.9333333333vw] p-[1.0666666667vw] rounded-[1.3333333333vw] cursor-pointer"
                   style={{
                     background: 'linear-gradient(45deg, #2f2e2c 0%, #24221c 100%)',
                     boxShadow: '0 2.1333333333vw 2.6666666667vw color-mix(in srgb,rgba(0, 0, 0, .2),transparent 70%),inset .2666666667vw .2666666667vw color-mix(in srgb,#fff,transparent 80%)'
                   }}>
                {bottomMenuFB.map((item, idx) => (
                  <Link
                    key={idx}
                    to={item.path}
                    onClick={() => setLeftSidebar(false)} // Close sidebar after navigation
                    className="flex flex-wrap justify-center items-center px-4 text-white"
                  >
                    <img src={`/assets/img/icons/${item.icon}`} alt={t(item.translationKey)} className="w-[8vw] h-[8vw] mb-1" />
                    <p className="whitespace-nowrap overflow-hidden">{t(item.translationKey)}</p>
                  </Link>
                ))}
              </div>
              <div className="flex justify-between items-center h-[19.2vw] bg-[#2a2a2a] text-[2.9333333333vw] p-[1.0666666667vw] rounded-[1.3333333333vw] cursor-pointer"
                   style={{
                     background: 'linear-gradient(45deg, #2f2e2c 0%, #24221c 100%)',
                     boxShadow: '0 2.1333333333vw 2.6666666667vw color-mix(in srgb,rgba(0, 0, 0, .2),transparent 70%),inset .2666666667vw .2666666667vw color-mix(in srgb,#fff,transparent 80%)'
                   }}>
                {bottomMenu.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 w-full text-white"
                    onClick={() => {
                      if (isLogin && item.label === 'Login') {
                        handleLogout(); // This calls setLeftSidebar(false)
                      } else if (!isLogin && item.label === 'Login') {
                        navigate(item.path); // Navigate to login
                        setLeftSidebar(false); // Close sidebar after navigation
                      } else if (!isLogin && item.label === 'Home') {
                        navigate(item.path); // Navigate to home
                        setLeftSidebar(false); // Close sidebar after navigation
                      } else if (isLogin && item.label === 'Home') {
                         navigate(item.path); // Navigate to home
                        setLeftSidebar(false); // Close sidebar after navigation
                      }
                    }}
                  >
                    <img src={`/assets/img/icons/${item.icon}`} alt={t(item.translationKey)} className="w-6 h-6 mb-1" />
                    {isLogin && item.label === 'Login' ? t('logout') : t(item.translationKey)}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Provider Submenus */}
          {selectedProviderCategory === 'Sports' &&
            <motion.div className="relative mt-[10.6666666667vw] z-10 w-[29.3333333333vw] overflow-auto rounded-[1.3333333333vw]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                          background: 'rgba(255, 255, 255, .3)'
                        }}>
              {sportsProviders.map((item, idx) => (
                <LeftMenuProvider
                  key={idx}
                  item={item}
                  idx={idx}
                  setParentSidebar={setLeftSidebar} // Pass the function down
                />
              ))}
            </motion.div>}
          {selectedProviderCategory === 'Casino' &&
            <motion.div className="relative mt-[10.6666666667vw] z-10 w-[29.3333333333vw] overflow-auto rounded-[1.3333333333vw]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                          background: 'rgba(255, 255, 255, .3)'
                        }}>
              {LiveCasinoProvider.map((item, idx) => (
                <LeftMenuProvider
                  setSelectedProviderCategory={setSelectedProviderCategory}
                  setParentSidebar={setLeftSidebar} // Pass the function down
                  key={idx}
                  item={item}
                  idx={idx}
                />
              ))}
            </motion.div>}
          {selectedProviderCategory === 'Slots' &&
            <motion.div className="relative mt-[10.6666666667vw] z-10 w-[29.3333333333vw] overflow-auto rounded-[1.3333333333vw]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                          background: 'rgba(255, 255, 255, .3)'
                        }}>
              {SlotProvider.map((item, idx) => (
                <LeftMenuProvider
                  setSelectedProviderCategory={setSelectedProviderCategory}
                  setParentSidebar={setLeftSidebar} // Pass the function down
                  key={idx}
                  item={item}
                  idx={idx}
                />
              ))}
            </motion.div>}
          {selectedProviderCategory === 'Table' &&
            <motion.div className="relative mt-[10.6666666667vw] z-10 w-[29.3333333333vw] overflow-auto rounded-[1.3333333333vw]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                          background: 'rgba(255, 255, 255, .3)'
                        }}>
              {TableProvider.map((item, idx) => (
                <LeftMenuProvider
                  setSelectedProviderCategory={setSelectedProviderCategory}
                  setParentSidebar={setLeftSidebar} // Pass the function down
                  key={idx}
                  item={item}
                  idx={idx}
                />
              ))}
            </motion.div>}
          {selectedProviderCategory === 'Lottery' &&
            <motion.div className="relative mt-[10.6666666667vw] z-10 w-[29.3333333333vw] overflow-auto rounded-[1.3333333333vw]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                          background: 'rgba(255, 255, 255, .3)'
                        }}>
              {LotteryProvider.map((item, idx) => (
                <LeftMenuProvider
                  setSelectedProviderCategory={setSelectedProviderCategory}
                  setParentSidebar={setLeftSidebar} // Pass the function down
                  key={idx}
                  item={item}
                  idx={idx}
                />
              ))}
            </motion.div>}
          {selectedProviderCategory === 'Fishing' &&
            <motion.div className="relative mt-[10.6666666667vw] z-10 w-[29.3333333333vw] overflow-auto rounded-[1.3333333333vw]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                          background: 'rgba(255, 255, 255, .3)'
                        }}>
              {FishingProvider.map((item, idx) => (
                <LeftMenuProvider
                  setSelectedProviderCategory={setSelectedProviderCategory}
                  setParentSidebar={setLeftSidebar} // Pass the function down
                  key={idx}
                  item={item}
                  idx={idx}
                />
              ))}
            </motion.div>}
          {selectedProviderCategory === 'Arcade' &&
            <motion.div className="relative mt-[10.6666666667vw] z-10 w-[29.3333333333vw] overflow-auto rounded-[1.3333333333vw]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                          background: 'rgba(255, 255, 255, .3)'
                        }}>
              {ArcadeProvider.map((item, idx) => (
                <LeftMenuProvider
                  setSelectedProviderCategory={setSelectedProviderCategory}
                  setParentSidebar={setLeftSidebar} // Pass the function down
                  key={idx}
                  item={item}
                  idx={idx}
                />
              ))}
            </motion.div>}
          {selectedProviderCategory === 'Crash' &&
            <motion.div className="relative mt-[10.6666666667vw] z-10 w-[29.3333333333vw] overflow-auto rounded-[1.3333333333vw]"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ type: 'tween', duration: 0.4 }}
                        style={{
                          background: 'rgba(255, 255, 255, .3)'
                        }}>
              {CrashProvider.map((item, idx) => (
                <LeftMenuProvider
                  setSelectedProviderCategory={setSelectedProviderCategory}
                  setParentSidebar={setLeftSidebar} // Pass the function down
                  key={idx}
                  item={item}
                  idx={idx}
                />
              ))}
            </motion.div>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LeftSidebarModal;