import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaHome, FaGift, FaTrophy, FaUser } from "react-icons/fa";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../redux/slice/gameSlice";
import Login from "./Login"; // Adjust the path as needed
import { useTranslation } from 'react-i18next'; // Import the translation hook
import { motion } from "framer-motion";

export default function FooterNav() {
    const location = useLocation();
    const { isLogin, username } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [showDownloadPopup, setShowDownloadPopup] = useState(true);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(() => {
        return localStorage.getItem('preferredLanguage') || 'bn';
    });
    const languageModalRef = useRef(null);
    const ulRef = useRef(null);

    // Check session storage on component mount to determine if popup should be shown
    useEffect(() => {
        const hasClosedDownload = sessionStorage.getItem('hasClosedDownloadPopup');
        if (hasClosedDownload === 'true') {
            setShowDownloadPopup(false);
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

    const toolbarItems = [
      {
        label: "Home",
        iconUrl:"/footer/icon-home.svg",
        path:"/"
      },
      {
        label: "Promotions",
        iconUrl:"/footer/icon-promotion.svg",
        path:"/promotions"
      },
      {
        label: "Deposit",
        iconUrl:"/footer/icon-deposit.svg",
        path:"/deposit"
      },
      {
        label: "My Account",
        iconUrl:"/footer/icon-account.svg",
        path:"/account"
      },
    ];

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const handleAccountClick = () => {
        if (isLogin) {
            navigate('/account');
        } else {
            openLoginModal();
        }
    };

    // Function to check if route is active
    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    // Find the index of the active item
    const activeIndex = toolbarItems.findIndex(item => isActive(item.path));

    const handleNavClick = (path) => {
      if(path === "/deposit") {
        navigate(path, {
          state: { backgroundLocation: location },
        })
      } else {
        navigate(path)
      }
    };

      const handleDownload = () => {
        const link = document.createElement("a");
        link.href = import.meta.env.VITE_APP_DOWNLOAD_URL;
        link.setAttribute("download", import.meta.env.VITE_APP_DOWNLOAD_NAME);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // Function to close the download popup and save the preference in session storage
    const closeDownloadPopup = () => {
        setShowDownloadPopup(false);
        sessionStorage.setItem('hasClosedDownloadPopup', 'true');
    };

    return (
        <>
            {isLogin ? (
              <>
                <div className="toolbar">
                  <ul ref={ulRef} style={{ "--slider-x": "12px" }}>
                    {toolbarItems.map(({ label, iconUrl, path }, index) => (
                      <li key={label} className={isActive(path) ? "active" : ""}>
                        <a type="button"
                        onClick={() => {
                          if (path === "/account") {
                            handleAccountClick();
                          } else {
                            handleNavClick(path);
                          }
                        }}>
                          <span className="icon-wrap">
                            <span
                              className="item-icon"
                              style={{
                                maskImage: `url("${iconUrl}")`,
                              }}
                            />
                          </span>
                          <p>{label}</p>
                        </a>
                      </li>
                    ))}

                    {activeIndex !== -1 && (
                      <motion.span
                        aria-hidden="true"
                        className="toolbar-border"
                        initial={false}
                        animate={{
                          x: ulRef.current ? (ulRef.current.children[activeIndex]?.offsetLeft || 0) + 12 : 12,
                          width: ulRef.current ? (ulRef.current.children[activeIndex]?.offsetWidth || 60) - 24 : 60,
                        }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                      />
                    )}
                  </ul>
                </div>
              </>
            ) : (
                <div
                    className=" bg-secondaryColor fixed bottom-0 left-0 p-2 w-full rounded-lg flex justify-around items-center gap-1 h-[13.3vw] text-white z-40 font-semibold"
                    style={{boxShadow: `0 -1.0666666667vw 1.0666666667vw var(--toolbar-shadow)`}}
                >
                    <button
                        className=" flex items-center justify-center gap-1 py-1 rounded-lg h-full"
                        style={{background:'linear-gradient( 270deg, #b8b8b8 0%, #b3b3b3 51%, #d6d6d6 74%, #b3b3b3 100% )', fontSize:'14px', width: '30%'}}
                        onClick={() => setShowLanguageModal(true)} // Open language modal when clicked
                    >
                        <img
                            src="/BD.webp"
                            alt="Flag"
                            className="h-7 w-7 rounded-full"
                        />
                        <div className="flex flex-col text-sm text-left text-black">
                            <span>BDT</span>
                            <span>{selectedLanguage === 'en' ? 'English' : 'বাংলা'}</span>
                        </div>
                    </button>
                    <button
                        className="text-white px-4 py-1 rounded-lg h-full"
                        style={{background: 'linear-gradient( to right, #2a3254 0, #445187 20%, #445187 35%, #2a3254 60%, #2a3254 100% )', boxShadow: '0 1.0666666667vw 2.1333333333vw 0 #191e32, inset 0 0 1.0666666667vw 0 #747687', fontSize:'14px', width: '35%'}}
                        onClick={() => setIsLoginModalOpen({open: true, tab: "register"})}>
                        {t('header.register')}
                    </button>
                    <button
                        className="text-white px-4 py-1 rounded-lg h-full"
                        style={{background: 'linear-gradient( to right, #a56c0b 0, #d4b665 20%, #d4b665 35%, #a56c0b 60%, #a56c0b 100% )', boxShadow: '0 1.0666666667vw 2.1333333333vw 0 #191e32, inset 0 0 1.0666666667vw 0 #747687', fontSize:'14px', width: '35%'}}
                        onClick={() => setIsLoginModalOpen({open: true, tab: "login"})}>
                        {t('header.login')}
                    </button>
                </div>
            )}

            {/* Login Modal */}
            {/* <Login isOpen={isLoginModalOpen} onClose={closeLoginModal} /> */}
            <Login
                isOpen={isLoginModalOpen.open}
                onClose={() => setIsLoginModalOpen({open: false, tab: "login"})}
                initialTab={isLoginModalOpen.tab}
            />

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

            {showDownloadPopup && (
                <div>
                  <div
                    _ngcontent-serverapp-c2215114555=""
                    className="pwa-download ng-tns-c2215114555-3 ng-trigger ng-trigger-popWrapTriggerAni ng-star-inserted"
                    style={{ display: "block" }}
                  >
                    <div
                      _ngcontent-serverapp-c2215114555=""
                      className="pwa-download-bg ng-tns-c2215114555-3"
                    >
                      <div
                        _ngcontent-serverapp-c2215114555=""
                        className="pwa-texture ng-tns-c2215114555-3"
                        style={{
                          backgroundImage:
                            'url("/mcw/h5/assets/shared/pwa-download/pwa-texture.webp")'
                        }}
                      />
                      <div
                        _ngcontent-serverapp-c2215114555=""
                        className="pwa-download-container ng-tns-c2215114555-3"
                      >
                        <span
                          _ngcontent-serverapp-c2215114555=""
                          className="pwa-close-btn ng-tns-c2215114555-3"
                          style={{
                            maskImage:
                              'url("/mcw/h5/assets/shared/pwa-download/icon-cross-type04.svg")'
                          }}
                          onClick={closeDownloadPopup} // Add click handler here
                        />
                        <div
                          _ngcontent-serverapp-c2215114555=""
                          className="pwa-hot ng-tns-c2215114555-3"
                          style={{
                            backgroundImage:
                              'url("/mcw/h5/assets/shared/pwa-download/pwa-hot-icon.webp")'
                          }}
                        />
                        <div
                          _ngcontent-serverapp-c2215114555=""
                          className="pwa-icon-frame ng-tns-c2215114555-3"
                        >
                          <div
                            _ngcontent-serverapp-c2215114555=""
                            className="pwa-icon ng-tns-c2215114555-3"
                          >
                            <img
                              _ngcontent-serverapp-c2215114555=""
                              alt="pwa-icon"
                              className="ng-tns-c2215114555-3"
                              src="/awp/8b9e6c48a2/PWAicon-192px.png?v=1768998311082"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div
                          _ngcontent-serverapp-c2215114555=""
                          className="pwa-content ng-tns-c2215114555-3"
                        >
                          <p
                            _ngcontent-serverapp-c2215114555=""
                            className="pwa-name ng-tns-c2215114555-3"
                          >
                            MCW Web App
                          </p>
                          <div className="flex">
                            <img
                              _ngcontent-serverapp-c2215114555=""
                              alt="start"
                              className="start ng-tns-c2215114555-3 ng-star-inserted"
                              src="/mcw/h5/assets/shared/pwa-download/start.svg"
                              loading="lazy"
                              style={{}}
                            />
                            <img
                              _ngcontent-serverapp-c2215114555=""
                              alt="start"
                              className="start ng-tns-c2215114555-3 ng-star-inserted"
                              src="/mcw/h5/assets/shared/pwa-download/start.svg"
                              loading="lazy"
                              style={{}}
                            />
                            <img
                              _ngcontent-serverapp-c2215114555=""
                              alt="start"
                              className="start ng-tns-c2215114555-3 ng-star-inserted"
                              src="/mcw/h5/assets/shared/pwa-download/start.svg"
                              loading="lazy"
                              style={{}}
                            />
                            <img
                              _ngcontent-serverapp-c2215114555=""
                              alt="start"
                              className="start ng-tns-c2215114555-3 ng-star-inserted"
                              src="/mcw/h5/assets/shared/pwa-download/start.svg"
                              loading="lazy"
                              style={{}}
                            />
                            <img
                              _ngcontent-serverapp-c2215114555=""
                              alt="start"
                              className="start ng-tns-c2215114555-3 ng-star-inserted"
                              src="/mcw/h5/assets/shared/pwa-download/start.svg"
                              loading="lazy"
                              style={{}}
                            />
                          </div>
                        </div>
                        <div
                          _ngcontent-serverapp-c2215114555=""
                          className="button btn-primary download-btn ng-tns-c2215114555-3"
                          onClick={handleDownload}
                        >
                          <p _ngcontent-serverapp-c2215114555="" className="ng-tns-c2215114555-3">
                            Download
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )}
        </>
    );
}