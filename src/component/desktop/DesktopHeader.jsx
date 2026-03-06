import React, { useMemo, useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setCategory } from '../../redux/slice/gameSlice';
import { useTranslation } from 'react-i18next';
import logo from '/mcw/h5/assets/images/logo-horizontal.png';
import Login from '../Login';
import { CircleUserRound, CreditCard, Menu, RefreshCcw } from 'lucide-react';

const gameCategories = [
  { name: 'Hot Games', label: 'HOT', hasDropdown: true },
  { name: 'Sports', label: 'Sports', hasDropdown: true },
  { name: 'Live', label: 'Casino', hasDropdown: true },
  { name: 'Slots', label: 'Slot', hasDropdown: true },
  { name: 'Crash', label: 'Crash', hasDropdown: true },
  { name: 'Table', label: 'Table', hasDropdown: true },
  { name: 'Fish', label: 'Fishing', hasDropdown: true },
  { name: 'Arcade', label: 'Arcade', hasDropdown: true },
  { name: 'Lottery', label: 'Lottery', hasDropdown: true },
];

const navLinks = [
  { label: 'Promotions', path: '/promotions' },
  { label: 'VIP', path: '/vip' },
];

export default function DesktopHeader({ onToggleSidebar }) {
  const { isLogin, token, username } = useSelector((state) => state.auth);
  const { selectedCategory } = useSelector((state) => state.game);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState({ open: false, tab: 'login' });
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'bn';
  });
  const [walletBalance, setWalletBalance] = useState(() => {
    const v = Number(localStorage.getItem('wallet_balance') || 0);
    return Number.isFinite(v) ? v : 0;
  });
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    setSelectedLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    setShowLangDropdown(false);
  };

  const formattedBalance = useMemo(() => {
    const v = Number(walletBalance);
    return Number.isFinite(v) ? v.toFixed(2) : '0.00';
  }, [walletBalance]);

  const handleRefreshBalance = async () => {
    if (!token || !username) return;

    setIsRefreshingBalance(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_BASE_URL}v1/user/get-user-balance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        }
      );

      const data = await response.json();
      if (response.ok && data?.success) {
        const totalCoins = Number(data?.data?.totalCoins ?? 0);
        setWalletBalance(Number.isFinite(totalCoins) ? totalCoins : 0);
        localStorage.setItem('wallet_balance', (Number.isFinite(totalCoins) ? totalCoins : 0).toFixed(2));
      }
    } catch {
      // ignore: header should stay stable even if refresh fails
    } finally {
      setIsRefreshingBalance(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    dispatch(setCategory(categoryName));
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <>
      {/* ===== MAIN HEADER BAR ===== */}
      <header className="sticky top-0 z-[100] w-full h-[76px] bg-gradient-to-r from-currentColor via-currentColor to-secondaryColor border-b border-white/5">
        <div className="h-full w-full flex items-center justify-between px-[160px]">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              aria-label="Open menu"
              className="text-fillColor hover:opacity-80 transition-opacity"
              onClick={onToggleSidebar}
            >
              <Menu size={28} />
            </button>
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => {
                navigate('/');
                dispatch(setCategory('Hot Games'));
              }}
            >
              <img src={logo} alt="MCW" className="h-10 w-auto object-contain" />
            </button>
          </div>

          {/* Right: Auth buttons OR Wallet group */}
          <div className="flex items-center gap-4">
            {!isLogin ? (
              <>
                <button
                  className="px-8 py-3 rounded-lg font-semibold text-white bg-secondaryColor/40 border border-white/10 hover:opacity-90 transition-opacity"
                  onClick={() => setIsOpen({ open: true, tab: 'register' })}
                >
                  Sign up
                </button>
                <button
                  className="px-8 py-3 rounded-lg font-semibold text-white bg-fillColor hover:opacity-90 transition-opacity"
                  onClick={() => setIsOpen({ open: true, tab: 'login' })}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-fillColor hover:opacity-90 transition-opacity"
                  onClick={() => navigate('/deposit', { state: { backgroundLocation: location } })}
                >
                  <CreditCard size={18} />
                  Deposit
                </button>

                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-secondaryColor text-white">
                  <button
                    type="button"
                    aria-label="Refresh wallet"
                    className="opacity-90 hover:opacity-100 transition-opacity"
                    onClick={handleRefreshBalance}
                    disabled={isRefreshingBalance}
                  >
                    <RefreshCcw size={18} className={isRefreshingBalance ? 'animate-spin' : ''} />
                  </button>
                  <span className="font-semibold whitespace-nowrap">Main Wallet</span>
                  <span className="font-bold whitespace-nowrap">৳{formattedBalance}</span>
                </div>

                <button
                  type="button"
                  aria-label="Account"
                  className="w-11 h-11 rounded-full border border-white/10 bg-white/5 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                  onClick={() => navigate('/account')}
                >
                  <CircleUserRound size={22} />
                </button>
              </>
            )}

            {/* Flag / Language */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                aria-label="Language"
                className="w-11 h-11 rounded-full overflow-hidden border border-white/10 hover:opacity-90 transition-opacity"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
              >
                <img src="/BD.webp" alt="BD" className="w-full h-full object-cover" />
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-44 rounded-lg overflow-hidden bg-currentColor border border-white/10 shadow-lg">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-white/5 ${selectedLanguage === 'en' ? 'text-fillColor' : 'text-white'}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    <span>English</span>
                    {selectedLanguage === 'en' && <span>✓</span>}
                  </button>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between hover:bg-white/5 ${selectedLanguage === 'bn' ? 'text-fillColor' : 'text-white'}`}
                    onClick={() => handleLanguageChange('bn')}
                  >
                    <span>বাংলা</span>
                    {selectedLanguage === 'bn' && <span>✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ===== GAMES NAV BAR (below header) ===== */}
      <nav className="dt-gamenav">
        <div className="dt-gamenav__inner">
          {gameCategories.map((cat, idx) => {
            const isActive = selectedCategory === cat.name;
            return (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                className={`dt-gamenav__item ${isActive ? 'dt-gamenav__item--active' : ''}`}
              >
                <span className="dt-gamenav__label">{cat.label}</span>
                {cat.hasDropdown && (
                  <svg className="dt-gamenav__chevron" width="12" height="8" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
          {navLinks.map((link, idx) => (
            <button
              key={`nav-${idx}`}
              onClick={() => navigate(link.path)}
              className="dt-gamenav__item"
            >
              <span className="dt-gamenav__label">{link.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Login/Register Modal */}
      {isOpen.open && (
        <Login
          isOpen={isOpen.open}
          onClose={() => setIsOpen({ open: false, tab: 'login' })}
          initialTab={isOpen.tab}
        />
      )}
    </>
  );
}
