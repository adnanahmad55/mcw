import React, { useEffect, useState, useRef } from 'react'
import { CgMenuLeft } from 'react-icons/cg'
// import logo from '/logo.webp'
import logo from '/logo.webp'
import Login from './Login'
import Register from './Register';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slice/authSlice';
import WalletBar from './WalletBar';
import LeftSidebarModal from './Sidebar';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setCategory } from '../redux/slice/gameSlice';



export default function Header() {
    const [isOpen, setIsOpen] = useState({open: false, tab: "login"});
    const [registerModal, setRegisterModal] = useState(false);
    const { isLogin, username } = useSelector((state) => state.auth);
    const [leftSidebar, setLeftSidebar] = useState(false);
    const dispatch = useDispatch();
    const [refCode, setRefCode] = useState("");
    const { t, i18n } = useTranslation();
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        return localStorage.getItem('preferredLanguage') || 'bn';
    });
    const languageModalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const r = urlParams.get("r");
        // console.log(r, 'rrrrr');

        if (r) {
            setRefCode(r);
            setRegisterModal(true);
        }

        // Update selected language when i18n language changes
        setSelectedLanguage(i18n.language);
    }, [i18n.language]);

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

    return (
        <>
            <nav className="w-full bg-currentColor px-3 py-[6px] sticky top-0 z-20">
                {/* Left Section */}
                <div className='max-w-[1000px] mx-auto flex items-center justify-between'>
                    <div className="flex items-center gap-3">
                        {/* Hamburger */}
                        <button className="text-fillColor"
                            onClick={() => setLeftSidebar(true)}>
                            {/* <CgMenuLeft size={28} /> */}
                            <Menu size={28} />
                        </button>

                        {/* Logo */}
                        <img
                            src={logo}
                            alt="Logo"
                            className="h-8"
                            onClick={() => {
                            navigate("/");
                            dispatch(setCategory("Hot Games"));
                            }}


                        />
                    </div>

                    {/* Right Section */}
                    {/* <div className="flex items-center space-x-3">
                        {!isLogin ? (
                            <>
                                <button
                                    className="text-white px-4 py-1 rounded-lg"
                                    style={{background: 'linear-gradient(180deg, #14c968, #1c9756)', fontSize:'14px', width: '5rem'}}
                                    onClick={() => setIsOpen({open: true, tab: "login"})}>
                                    {t('header.login')}
                                </button>

                                <button
                                    className="text-white px-4 py-1 rounded-lg"
                                    style={{background: 'linear-gradient(180deg, #38a6fb, #096fd1)', fontSize:'14px'}}
                                    onClick={() => setIsOpen({open: true, tab: "register"})}>
                                    {t('header.register')}
                                </button>

                                <div className="hidden md:flex items-center space-x-1 text-white cursor-pointer">
                                    <img
                                        src="https://flagcdn.com/us.svg"
                                        alt="Flag"
                                        className="h-5 w-5 rounded-full"
                                    />
                                    <span>English</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <WalletBar />
                            </>
                        )}

                    </div> */}
                    <div className="flex items-center space-x-4">
                        <>
                            {isLogin &&
                            <img src="/BD.webp" className='h-6 w-6' alt="" onClick={() => setShowLanguageModal(true)}/>
                            }
                            <div className='flex flex-col text-[#c9a33d] items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 30 30">
                                    <g clip-path="url(#a)" filter="url(#b)">
                                        <path fill="#c9a33d" d="M15 5.913c4.928 0 8.923 4.105 8.923 9.167 0 1.67-.437 3.235-1.196 4.583a25 25 0 0 1-3.112.757 26 26 0 0 1-2.834.351.84.84 0 0 0-.743-.47h-2.076a.854.854 0 0 0-.84.863c0 .474.378.863.84.863h2.076a.845.845 0 0 0 .799-.61q.25-.016.5-.04a27 27 0 0 0 4.737-.836l.114-.032c-1.406 1.962-3.556 3.326-6.022 3.657-1.68 3.26-6.082 2.814-6.082 2.814-.001 0-.3-.045-.3-.308 0-.213.19-.267.342-.337 1.028-.512 1.615-1.599 1.95-2.596-3.492-1.244-5.999-4.65-5.999-8.659 0-5.062 3.995-9.167 8.923-9.167M14.999 3c5.735 0 10.52 4.182 11.621 9.736l.864.109c.455.057.862.295 1.147.669a1.8 1.8 0 0 1 .356 1.306l-.569 4.758c-.106.888-.843 1.557-1.712 1.557q-.106 0-.21-.013l-1.068-.136-.639-.079a1.7 1.7 0 0 1-.72-.268 10.96 10.96 0 0 0 1.44-5.457c0-.87-.098-1.717-.29-2.528-1.106-4.744-5.261-8.267-10.22-8.267-4.957 0-9.112 3.523-10.218 8.267a11 11 0 0 0-.29 2.528c0 1.99.524 3.855 1.44 5.457-.212.14-.457.235-.722.268l-.637.08-1.067.135a2 2 0 0 1-.211.013c-.869 0-1.606-.669-1.712-1.557l-.57-4.758a1.8 1.8 0 0 1 .357-1.306 1.7 1.7 0 0 1 1.147-.67l.864-.108C4.482 7.182 9.266 3 14.999 3m-3.23 11.282a.79.79 0 0 0-.776.798c0 .44.348.797.777.797a.787.787 0 0 0 .775-.797.787.787 0 0 0-.775-.798m3.231 0a.79.79 0 0 0-.776.798c0 .44.348.797.776.797a.787.787 0 0 0 .776-.797.79.79 0 0 0-.776-.798m3.23 0a.787.787 0 0 0-.775.798c0 .44.347.797.776.797a.787.787 0 0 0 .776-.797.79.79 0 0 0-.777-.798"/>
                                    </g>
                                    <defs>
                                        <clipPath id="a">
                                        <path fill="#fff" d="M0 0h30v30H0z"/>
                                        </clipPath>
                                        <filter id="b" width="32" height="28" x="-1" y="3" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse">
                                        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                                        <feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                                        <feOffset dy="2"/>
                                        <feGaussianBlur stdDeviation="1"/>
                                        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"/>
                                        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_27_1942"/>
                                        <feBlend in="SourceGraphic" in2="effect1_dropShadow_27_1942" result="shape"/>
                                        </filter>
                                    </defs>
                                </svg>
                                <span className='font-bold text-sm'>24-7 CS</span>
                            </div>

                            {/* Language Selector */}
                            {/* <div className="flex items-center">
                                <button
                                    className="flex items-center justify-center gap-1"
                                    onClick={() => setShowLanguageModal(true)}
                                >
                                    <img
                                        src="/BD.webp"
                                        alt="Flag"
                                        className="h-6 w-6 rounded-full"
                                    />
                                    <div className="flex flex-col text-sm text-left text-white">
                                        <span>{selectedLanguage === 'en' ? 'English' : 'বাংলা'}</span>
                                    </div>
                                </button>
                            </div> */}
                        </>
                    </div>
                </div>
            </nav>

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

            <Login
                isOpen={isOpen.open}
                onClose={() => setIsOpen({open: false, tab: "login"})}
                initialTab={isOpen.tab}
            />


            {leftSidebar && (<LeftSidebarModal setLeftSidebar={setLeftSidebar} />)}


        </>
    )
}
