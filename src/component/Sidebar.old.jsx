import { useState, useRef, useEffect } from "react";
import {
    FaGift,
    FaUserFriends,
    FaTrophy,
    FaGamepad,
    FaAngleDown,
    FaAngleUp,
    FaDice,
    FaChessKnight,
    FaFish,
    FaPlay,
    FaFootballBall,
    FaUser,
    FaDownload,
    FaHeadset,
    FaSignOutAlt,
    FaGlobe,
    FaHistory,
    FaCreditCard,
} from "react-icons/fa";
import { FileText } from "lucide-react";
import logo from "/logo.webp";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from 'react-i18next';


export default function LeftSidebarModal({ setLeftSidebar }) {
    const { t, i18n } = useTranslation();
    const { isLogin } = useSelector((state) => state.auth);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        return localStorage.getItem('preferredLanguage') || 'bn';
    }); 
    const languageModalRef = useRef(null);

    useEffect(() => {
        setSelectedLanguage(i18n.language);
    }, [i18n.language]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()

    const toggleDropdown = (label) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    const handleLogout = () => {
        dispatch(logout());
        setLeftSidebar(false);
        navigate("/"); // Changed from "/" to "/login"
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = import.meta.env.VITE_APP_DOWNLOAD_URL;
        link.setAttribute("download", import.meta.env.VITE_APP_DOWNLOAD_NAME);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setLeftSidebar(false); // Close the sidebar after download
    };

    const handleLanguageChange = (language) => {
        // Update the local state immediately
        setSelectedLanguage(language);
        
        // Change language using i18n
        i18n.changeLanguage(language);
        
        // Store the language preference in localStorage
        localStorage.setItem('preferredLanguage', language);
        
        // Close the modal after language change
        setShowLanguageModal(false);
    };

    const getMenuItems = () => {
        const baseItems = [
            { label: t('sidebar.promotion'), icon: <FaGift />, path: "/promotions" },
            { label: t('sidebar.withdraw'), icon: <FaCreditCard />, requiresAuth: true, path: "/withdrawal" },
            { label: t('sidebar.inviteFriends'), icon: <FaUserFriends />, requiresAuth: true, path: "/invite-friends" },
            { label: t('sidebar.rewardCenter'), icon: <FaTrophy />, requiresAuth: true, path: "/reward" },
            {
                label: t('sidebar.gameCenter'),
                icon: <FaGamepad />,
                isDropdown: true,
                children: [
                    { label: t('sidebar.slots'), icon: <FaDice />, url: "/game-list?category=Slots" },
                    { label: t('sidebar.liveCasino'), icon: <FaChessKnight />, url: "/game-list?category=Live" },
                    { label: t('sidebar.fish'), icon: <FaFish />, url: "/game-list?category=Fish" },
                    { label: t('sidebar.sports'), icon: <FaPlay />, url: "/game-list?category=Sports" },
                    { label: t('sidebar.cricket'), icon: <FaFootballBall />, url: "/game-list?category=Sports" },
                ],
            },
            {
                label: t('sidebar.account'),
                icon: <FaUser />,
                isDropdown: true,
                children: [
                    { label: t('sidebar.cashback'), requiresAuth: true, url: "/cashback" },
                    { label: t('sidebar.vipCenter'), requiresAuth: true, url: "/vip" },
                    { label: t('sidebar.bettingRecord'), requiresAuth: true, url: "/betting-record" },
                    { label: t('sidebar.accountRecord'), requiresAuth: true, url: "/account-record" },
                    { label: t('sidebar.securityCenter'), requiresAuth: true, url: "/securityCenter" },
                    { label: t('sidebar.depositRecord'), requiresAuth: true, url: "/deposit-history" },
                    { label: t('sidebar.profitLoss'), requiresAuth: true, url: "/profit-loss" },
                    { label: t('sidebar.mail'), requiresAuth: true, url: "/mail" },
                ],
            },
            { label: t('sidebar.downloadApp'), icon: <FaDownload />, isDownload: true },
            { label: t('sidebar.customerService'), icon: <FaHeadset />, 
                // path: "/live-chat" 
            },
            { label: t('sidebar.helpCenter'), icon: <FaGift /> },
            { label: t('sidebar.language'), icon: <FaGlobe />, isLanguage: true },
        ];

        const loggedInOnlyItems = [
            { label: t('sidebar.turnover'), icon: <FileText size={18} />, path: "/turnover" },
            { label: t('sidebar.openBets'), icon: <FaCreditCard />, path: "/openbets" },
            { label: t('sidebar.depositHistory'), icon: <FaHistory />, path: "/deposit-history" },
        ];

        if (isLogin) {
            baseItems.unshift(...loggedInOnlyItems);
            baseItems.push({ label: t('sidebar.logOut'), icon: <FaSignOutAlt />, isLogout: true });
        }

        return baseItems;
    };

    const menuItems = getMenuItems();

    const handleNavigation = (item) => {
        if (item.isLogout) {
            handleLogout();
            return;
        }
        
        if (item.isDownload) {
            handleDownload();
            return;
        }
        
        if (item.isLanguage) {
            setShowLanguageModal(true);
            return;
        }
        
        if (item.requiresAuth && !isLogin) {
            setLeftSidebar(false);
            navigate("/login");
            return;
        }
        
        if (item.path) {
            setLeftSidebar(false);
            navigate(item.path);
        }
    };

    const handleChildNavigation = (child) => {
        if (child.requiresAuth && !isLogin) {
            setLeftSidebar(false);
            navigate("/login");
            return;
        }
        
        if (child.url) {
            setLeftSidebar(false);
            navigate(child.url);
        }
    };

    return (
        <div className="bg-[#00000080] fixed top-0 left-0 z-40 w-full h-screen flex scrollbar-hide">
            <OutsideClickHandler onOutsideClick={(e) => {
                // Only close sidebar if the click is not in the language modal
                if (!languageModalRef.current || !languageModalRef.current.contains(e.target)) {
                    setLeftSidebar(false);
                }
            }}>
                <AnimatePresence>
                    <motion.div
                        initial={{ x: -300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-64 bg-[#131b30] h-screen p-4 text-white overflow-auto shadow-xl scrollbar-hide"
                    >
                        <div className="w-full h-full overflow-auto pb-[130px]  scrollbar-hide">
                            {/* Logo */}
                            <div className="flex justify-center mb-6">
                                <img src={logo} alt="Logo" className="h-8" />
                            </div>

                            {isLogin && (
                                <div className="w-full mb-3">
                                    <div className="w-full mb-3 flex justify-center items-center relative">
                                        <Link className="relative" to="/invite-friends" onClick={() => setLeftSidebar(false)}>
                                            <img src="./assets/img/side-share.png" className="w-[167px]" />
                                            <span className="absolute left-0 top-0 bottom-0 flex items-center pl-2 text-[10px]">
                                                {t('sidebar.shareEarn')}
                                            </span>
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link to="/deposit" state={location.state} className="relative" onClick={() => setLeftSidebar(false)}>
                                            <img src="./assets/img/side-deposit.png" className="w-[167px]" />
                                            <span className="absolute left-0 top-0 bottom-0 flex items-center pl-2 text-[10px]">
                                                {t('sidebar.deposit')}
                                            </span>
                                        </Link>
                                        <Link to="/promotions" className="relative" onClick={() => setLeftSidebar(false)}>
                                            <img src="./assets/img/side-promo.png" className="w-[167px]" />
                                            <span className="absolute left-0 top-0 bottom-0 flex items-center pl-2 text-[10px]">
                                                {t('sidebar.promotion')}
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {/* Render Menu */}
                            <div className="flex flex-col gap-2">
                                <div className="w-full">
                                    <button
                                        onClick={() => window.location.href='https://ag.mcw88.bet/login'}
                                        className="flex items-center justify-between w-full px-4 py-2 bg-[#232c44] rounded hover:bg-[#232c44]"
                                    >
                                        <span className="flex items-center gap-3">
                                            <FaUser /> {t('sidebar.affiliate')}
                                        </span>
                                    </button>
                                </div>
                                {menuItems.map((item, idx) => (
                                    <div className="w-full" key={idx}>
                                        {item.isDropdown ? (
                                            <>
                                                <button
                                                    onClick={() => toggleDropdown(item.label)}
                                                    className="flex items-center justify-between w-full px-4 py-2 bg-[#232c44] rounded hover:bg-[#232d46]"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        {item.icon} {item.label}
                                                    </span>
                                                    {openDropdown === item.label ? <FaAngleUp /> : <FaAngleDown />}
                                                </button>

                                                <AnimatePresence>
                                                    {openDropdown === item.label && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex flex-col mt-1 ml-0 rounded-[10px] px-2 gap-2 bg-[#101421] overflow-hidden"
                                                        >
                                                            {item.children.map((child, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => handleChildNavigation(child)}
                                                                    className="flex items-center gap-3 px-3 py-2 hover:text-[#47a3f3] rounded w-full text-left"
                                                                >
                                                                    {child.icon} {child.label}
                                                                </button>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleNavigation(item)}
                                                className={`flex w-full items-center gap-3 px-4 py-2 rounded hover:bg-[#232d46] ${
                                                    item.isLogout ? "bg-red-600" : "bg-[#232c44]"
                                                }`}
                                            >
                                                {item.icon} {item.label}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </OutsideClickHandler>
            
            {/* Language Selection Modal */}
            {showLanguageModal && (
                <div ref={languageModalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#131b30] rounded-lg p-6 w-80 max-w-[90%] text-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">{t('sidebar.language')}</h3>
                            <button 
                                onClick={() => setShowLanguageModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <button
                                onClick={() => handleLanguageChange('en')}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                                    selectedLanguage === 'en' 
                                        ? 'bg-blue-600' 
                                        : 'bg-[#232c44] hover:bg-[#232d46]'
                                }`}
                            >
                                <span className="ml-2">English</span>
                                {selectedLanguage === 'en' && (
                                    <span className="ml-auto text-green-500">✓</span>
                                )}
                            </button>
                            
                            <button
                                onClick={() => handleLanguageChange('bn')}
                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                                    selectedLanguage === 'bn' 
                                        ? 'bg-blue-600' 
                                        : 'bg-[#232c44] hover:bg-[#232d46]'
                                }`}
                            >
                                <span className="ml-2">বাংলা (Bangla)</span>
                                {selectedLanguage === 'bn' && (
                                    <span className="ml-auto text-green-500">✓</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}