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
  import { FileText, X } from "lucide-react";
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

      const [userCoins, setUserCoins] = useState(0)
      const [isLoading, setIsLoading] = useState(false)
      const handleRefreshCoins = async () => {
        setIsLoading(true)
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
            // setIexposure(data.data?.ninew_exposure);
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
        handleRefreshCoins()
      }, [])

      return (
          <div className="bg-[#00000080] backdrop-blur-xl fixed top-0 left-0 z-[116] w-full h-screen flex scrollbar-hide">
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
                          className="h-screen pt-2 px-4 pb-4 text-white overflow-auto shadow-xl scrollbar-hide sidebar-panel"
                      >
                        {/* Close button inside sidebar on desktop */}
                        <div className="sidebar-close-btn" onClick={() => setLeftSidebar(false)}>
                          <X size={22} />
                        </div>
                        <div className="menu-first" style={{ width: "100%" }}>
                          <div
                            className="menu-top "
                            style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                          >
                            <div className="menu-header ">
                              <video
                                id="coinVideo"
                                mcdvideo=""
                                autoPlay=""
                                muted=""
                                loop=""
                                playsInline=""
                                className=" ng-star-inserted"
                                poster="/mcw/h5/assets/images/animation/head-coin.png"
                              >
                                <source
                                  type="video/quicktime"
                                  className=""
                                  mcdsrc="/assets/images/animation/head-coin.mov"
                                  src="/mcw/h5/assets/images/animation/head-coin.mov"
                                />
                                <source
                                  type="video/webm"
                                  className=""
                                  mcdsrc="/assets/images/animation/head-coin.webm"
                                  src="/mcw/h5/assets/images/animation/head-coin.webm"
                                />
                              </video>

                              {isLogin ? (
                                <>
                                  <div className="member-name  ng-star-inserted">
                                    <div
                                      id="account"
                                      className="account  ng-star-inserted"
                                      style={{}}
                                    ></div>
                                    <p id="profile_text" className="" style={{ display: "flex" }}>
                                      {" "}
                                      Profile{" "}
                                    </p>
                                  </div>
                                  <div
                                    className="icon-arrow  ng-star-inserted"
                                    style={{
                                      maskImage:
                                        'url("/mcw/h5/assets/images/icon-set/icon-arrow-type01.svg")',
                                      display: "flex",
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <div className="member-name  ng-star-inserted">
                                    <div
                                      id="account"
                                      className="account  ng-star-inserted"
                                      style={{}}
                                    ></div>
                                    <p id="profile_text" className="" style={{ display: "flex" }}>
                                      {" "}
                                      Hi Welcome{" "}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>

                            {isLogin ? (
                                <div className="afterlogin marquee  ng-star-inserted">
                                  <div className="main-wallet ">
                                    <div className="wallet ">
                                      {" "}
                                      Main Wallet{" "}
                                      <div
                                        onClick={handleRefreshCoins}
                                        className={`icon-refresh ${isLoading ? 'animate-spin' : ''}`}
                                        style={{
                                          maskImage:
                                            'url("/mcw/h5/assets/images/icon-set/icon-refresh-type01.svg")',
                                        }}
                                      />
                                    </div>
                                    <div className="amount ">
                                      <span data-currency="$" className="amount ">
                                        <i className="">৳ {userCoins || '0.00'}</i>
                                      </span>
                                    </div>
                                  </div>
                                  <div className="btn-wallet " style={{ display: "flex" }}>
                                    <span
                                      className="icon-wallet "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-bonuses.svg")',
                                      }}
                                    />
                                    <span className="icon-wallet-bg " />
                                  </div>
                                </div>
                              ) : (
                                <div className="beforelogin  ng-star-inserted">
                                  <div className="login-button ">
                                    <span
                                      style={{
                                        WebkitMaskImage:
                                          "url(/assets/images/icon-set/theme-icon/icon-login.svg)"
                                      }}
                                      className=""
                                    />
                                    <Link className="" to="/login">
                                      LOGIN
                                    </Link>
                                  </div>
                                  <div className="register-button ">
                                    <span
                                      style={{
                                        WebkitMaskImage:
                                          "url(/assets/images/icon-set/theme-icon/icon-register.svg)"
                                      }}
                                      className=""
                                    />
                                    <Link className="" to="/register">
                                      SIGN UP
                                    </Link>
                                  </div>
                                </div>
                              )
                            }
                          </div>

                          <div className="menu-item ">
                            <div className="" style={{}}>
                              <div className="search-box  ng-star-inserted">
                                <span className="">Search Games</span>
                                <i
                                  className="icon-search "
                                  style={{
                                    maskImage:
                                      'url("/mcw/h5/assets/images/icon-set/icon-search-type01.svg")',
                                  }}
                                />
                              </div>


                              {isLogin && 
                                <ul className="wallet-box  ng-star-inserted">
                                  <li
                                    data-category="deposit"
                                    className=""
                                    tabIndex={0}
                                    ot-tag="menu_Deposit_T"
                                    style={{ opacity: 1, transform: "translate(0px, 0px)", flex:"1" }}
                                  >
                                    <a className="" onClick={() => {navigate('/deposit', {state: { backgroundLocation: location }}); setLeftSidebar(false);}} style={{cursor: 'pointer'}}>
                                      <span
                                        className=""
                                        style={{
                                          maskImage:
                                            'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-deposit.svg")',
                                        }}
                                      />
                                      <p className="">Deposit</p>
                                    </a>
                                  </li>
                                  <li
                                    data-category="withdrawal"
                                    className=""
                                    ot-tag="menu_Withdrawal_T"
                                    style={{ opacity: 1, transform: "translate(0px, 0px)", marginRight:"0" }}
                                  >
                                    <a className="" onClick={() => {navigate('/withdrawal', {state: { backgroundLocation: location }}); setLeftSidebar(false);}} style={{cursor: 'pointer'}}>
                                      <span
                                        className=""
                                        style={{
                                          maskImage:
                                            'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-withdrawal.svg")',
                                        }}
                                      />
                                      <p className="">Withdrawal</p>
                                    </a>
                                  </li>
                                </ul>
                              }
                              <ul className="main-box ">
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_HOTGAME"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-hotgame.svg")',
                                      }}
                                    />
                                    <p className="">HOT</p>
                                  </a>
                                </li>
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_SPORT"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-sport.svg")',
                                      }}
                                    />
                                    <p className="">Sports</p>
                                  </a>
                                </li>
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_CASINO"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-casino.svg")',
                                      }}
                                    />
                                    <p className="">Casino</p>
                                  </a>
                                </li>
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_SLOT"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-slot.svg")',
                                      }}
                                    />
                                    <p className="">Slot</p>
                                  </a>
                                </li>
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_CRASH"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-crash.svg")',
                                      }}
                                    />
                                    <p className="">Crash</p>
                                  </a>
                                </li>
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_TABLE"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-table.svg")',
                                      }}
                                    />
                                    <p className="">Table</p>
                                  </a>
                                </li>
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_FISH"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-fish.svg")',
                                      }}
                                    />
                                    <p className="">Fishing</p>
                                  </a>
                                </li>
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_ARCADE"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-arcade.svg")',
                                      }}
                                    />
                                    <p className="">Arcade</p>
                                  </a>
                                </li>
                                <li
                                  className=" game-nav-item ng-star-inserted"
                                  data-category-type-id={0}
                                  gallery-image-key="ICON_LOTTERY"
                                  style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                >
                                  <a className="">
                                    <span
                                      className="item-icon "
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-lottery.svg")',
                                      }}
                                    />
                                    <p className="">Lottery</p>
                                  </a>
                                </li>
                              </ul>
                              <ul
                                className="item-box "
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                              >
                                <li data-category="promotion" className="">
                                  <a className="" onClick={() => {navigate('/promotions'); setLeftSidebar(false);}} style={{cursor: 'pointer'}}>
                                    <span
                                      className=""
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-promotion.svg")',
                                      }}
                                    />
                                    <p className="">Promotions</p>
                                  </a>
                                </li>
                                <li data-category="vip" className=" ng-star-inserted">
                                  <a className="" onClick={() => {navigate('/vip'); setLeftSidebar(false);}} style={{cursor: 'pointer'}}>
                                    <span
                                      className=""
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-vip.svg")',
                                      }}
                                    />
                                    <p className="">VIP</p>
                                  </a>
                                </li>
                                <li data-category="download" className=" ng-star-inserted">
                                  <a className="" onClick={() => {handleDownload(); setLeftSidebar(false);}} style={{cursor: 'pointer'}}>
                                    <span
                                      className=""
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-download.svg")',
                                      }}
                                    />
                                    <p className="">Download</p>
                                  </a>
                                </li>
                                <li data-category="affiliate" className=" ng-star-inserted">
                                  <a target="_blank" className="" href="https://ag.mcw88.bet/login" style={{cursor: 'pointer'}}>
                                    <span
                                      className=""
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-affiliate.svg")',
                                      }}
                                    />
                                    <p className=""> Affiliates </p>
                                  </a>
                                </li>

                                <li className=" ng-star-inserted">
                                  <a className="" onClick={() => {navigate('/turnover'); setLeftSidebar(false);}} >
                                    <span
                                      className=""
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-partnership.svg")',
                                      }}
                                    />
                                    <p className="">Turnover</p>
                                  </a>
                                </li>

                                <li data-category="refer-bonus" className=" ng-star-inserted">
                                  <a className="" onClick={() => {navigate('/invite-friends'); setLeftSidebar(false);}} style={{cursor: 'pointer'}}>
                                    <span
                                      className=""
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-referral.svg")',
                                      }}
                                    />
                                    <p className="">Refer Bonus</p>
                                  </a>
                                </li>
                              </ul>

                              <ul
                                className="contact-box "
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                              >
                                <li className=" talk ng-star-inserted" data-category="talk" style={{}}>
                                  <a target="_blank" className="" href="">
                                    <span
                                      className="use-icon-path  ng-star-inserted"
                                      style={{
                                        backgroundImage:
                                          'url("/upload/customerservice/image_396.png")',
                                      }}
                                    />

                                    <p className="">24-7 CS</p>
                                  </a>
                                </li>

                                <li
                                  className=" telegram ng-star-inserted"
                                  data-category="telegram"
                                  style={{}}
                                >
                                  <a target="_blank" className="" href="">
                                    <span
                                      className="use-icon-path  ng-star-inserted"
                                      style={{
                                        backgroundImage:
                                          'url("/upload/customerservice/image_502.png")',
                                      }}
                                    />

                                    <p className="">Telegram</p>
                                  </a>
                                </li>

                                <li
                                  className=" facebook-messenger ng-star-inserted"
                                  data-category="facebook-messenger"
                                  style={{}}
                                >
                                  <a
                                    target="_blank"
                                    className=""
                                    href="https://www.messenger.com/t/108230511799596"
                                  >
                                    <span
                                      className="use-icon-path  ng-star-inserted"
                                      style={{
                                        backgroundImage:
                                          'url("/upload/customerservice/image_391.png")',
                                      }}
                                    />
                                    <p className="">Facebook</p>
                                  </a>
                                </li>

                                <li
                                  className=" email ng-star-inserted"
                                  data-category="email"
                                  style={{}}
                                >
                                  <a target="_blank" className="" href="">
                                    <span
                                      className="use-icon-path  ng-star-inserted"
                                      style={{
                                        backgroundImage:
                                          'url("/upload/customerservice/image_426.png")',
                                      }}
                                    />
                                    <p className="">Email</p>
                                  </a>
                                </li>
                              </ul>

                              <ul
                                className="home-box "
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                              >
                                <li data-category="home" className="">
                                  <a className="" onClick={() => {navigate('/'); setLeftSidebar(false);}} style={{cursor: 'pointer'}}>
                                    <span
                                      className=""
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-home.svg")',
                                      }}
                                    />
                                    <p className="">Home</p>
                                  </a>
                                </li>
                                <li data-category="logout" className=" ng-star-inserted">
                                  <a className="" onClick={() => {handleLogout();}} style={{cursor: 'pointer'}}>
                                    <span
                                      className=""
                                      style={{
                                        maskImage:
                                          'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-logout.svg")',
                                      }}
                                    />
                                    <p className="">Log out</p>
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                  </AnimatePresence>
              </OutsideClickHandler>

              <X className='text-white cursor-pointer mt-4 shrink-0 self-start mobile-close-btn' size={28} style={{ marginLeft: '4px' }} onClick={() => { setLeftSidebar(false); }} />

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