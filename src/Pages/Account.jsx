import React, { useEffect, useState } from 'react';
// Note: Images like acbg, lv, user are not used in the new JSX, so imports might be unnecessary depending on final needs.
// Keeping them commented for reference if the background image logic needs to be reinstated later.
// import acbg from '../assets/img/home_bg.png';
// import lv from '../assets/img/lv.png';
// import user from '../assets/img/user.png';
import { FaGift, FaCoins, FaChartLine, FaDownload, FaTrophy, FaHistory } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
// import { Link } from 'react-router-dom'; // Not needed for the new JSX structure
import { useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

export default function Account() {
    const { isLogin, username, totalCoins } = useSelector((state) => state.auth);
    const authData = JSON.parse(localStorage.getItem("auth")); // Assuming auth data structure is similar
    const [vipData, setVipData] = useState(null); // Initialize with null
    const usernameName = authData?.username;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation()
    const { t } = useTranslation(); // Initialize translation function

    // --- Logic Implementation ---

    // Fetch VIP data on component mount
    const fetchVipData = async () => {
        if (!usernameName) return; // Prevent call if no username
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-vip-bonus?username=${usernameName}`);
            setVipData(res?.data?.data?.vip || null); // Ensure state is set correctly even if API returns unexpected format
        } catch (error) {
            console.error("Error fetching VIP data:", error);
            setVipData(null); // Reset state on error
        }
    };

    useEffect(() => {
        fetchVipData();
    }, [usernameName]); // Re-fetch if username changes


    // Calculate claimable count for rewards
    const claimableCount = vipData?.earnings?.filter(item => item?.reward_claimable)?.length || 0;

    // Handle Logout
    const handleLogout = () => {
        // Dispatch logout action to clear Redux store
        dispatch(logout());
        // Navigate to home page after logout
        navigate("/");
    };

    // Handle App Download
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = import.meta.env.VITE_APP_DOWNLOAD_URL;
        link.setAttribute("download", import.meta.env.VITE_APP_DOWNLOAD_NAME);
        document.body.appendChild(link);
        link.click();
        link.remove();
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
            const { token, username, userId } = authData;

            const response = await fetch(
                `${import.meta.env.VITE_APP_API_BASE_URL}api/user-get-balance`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('authToken'))}`,
                    },
                    body: JSON.stringify({
                        player_id: userId,
                        operator_id: import.meta.env.VITE_APP_OPERATOR_ID,
                    }),
                }
            );
            const data = await response.json();

            if (response.ok && data?.data) {
                const wallet = data?.data?.wallet;
                setUserCoins(wallet);
                localStorage.setItem("wallet_balance", JSON.stringify(wallet));
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

    // --- End of Logic Implementation ---

    // --- NEW JSX STARTS HERE ---
    // The JSX below is taken directly from the uploaded file's content,
    // with minor adjustments to incorporate fetched data where applicable
    // and to ensure event handlers like logout/download work.

    return (
        <div
            className="menu-first "
            style={{ width: 400, top: 0, left: 0 }}
        >
            <div
                className="menu-top "
                style={{ opacity: 1, transform: "translate(0px, 0px)", width: 400 }}
            >
                <div
                    className="menu-header relative"
                    style={{ height: 90, borderRadius: 0 }}
                >
                    <video
                        id="coinVideo"
                        autoPlay=""
                        muted=""
                        loop=""
                        playsInline=""
                        className=" ng-star-inserted"
                        poster="/mcw/h5/assets/images/animation/head-coin.png"
                    >
                        <source
                            type="video/quicktime"
                            mcdsrc="/assets/images/animation/head-coin.mov"
                            src="/mcw/h5/assets/images/animation/head-coin.mov"
                        />
                        <source
                            type="video/webm"
                            mcdsrc="/assets/images/animation/head-coin.webm"
                            src="/mcw/h5/assets/images/animation/head-coin.webm"
                        />
                    </video>
                    <div
                        className="member-name  ng-star-inserted"
                        style={{ height: 90 }}
                    >
                        <div
                            id="account"
                            className="account  ng-star-inserted"
                            style={{ maxWidth: 256 }}
                        >
                            {/* Display username from Redux state */}
                            <span>{username || "Guest"}</span>
                        </div>
                        <p
                            id="profile_text"
                            className=""
                            style={{ display: "none" }}
                        >
                            {" "}
                            Profile{" "}
                        </p>
                        <div
                            className="vip-points  ng-star-inserted"
                            style={{ display: "flex" }}
                        >
                            <div className="vip-points-text ">
                                VIP Points (VP)
                            </div>
                            {/* Display VIP points if available in fetched data */}
                            <span className="">{vipData?.points || 0}</span> {/* Placeholder, adjust based on actual API response */}
                        </div>
                    </div>
                    <div
                        className="icon-arrow  ng-star-inserted"
                        style={{
                            maskImage:
                                'url("/mcw/h5/assets/images/icon-set/icon-arrow-type01.svg")',
                            display: "none"
                        }}
                    />
                    <X
                        size={30}
                        className='absolute right-1 top-1 text-white cursor-pointer'
                        onClick={() => navigate('/')}
                    />
                </div>
                <div
                    className="afterlogin marquee  ng-star-inserted"
                    style={{ height: 80, borderRadius: 0 }}
                >
                    <div className="main-wallet ">
                        <div className="wallet ">
                            {" "}
                            Main Wallet{" "}
                            <div
                                onClick={handleRefreshCoins}
                                className={`icon-refresh ${isLoading ? 'animate-spin' : ''}`}
                                style={{
                                    maskImage:
                                        'url("/mcw/h5/assets/images/icon-set/icon-refresh-type01.svg")'
                                }}
                            />
                        </div>
                        <div className="amount ">
                            <span data-currency="$" className="amount ">
                                {/* Display wallet balance from localStorage */}
                                <i className="">৳ {userCoins || '0.00'}</i>
                            </span>
                        </div>
                    </div>
                    <div
                        className="btn-wallet "
                        style={{ display: "none" }}
                    >
                        <span
                            className="icon-wallet "
                            style={{
                                maskImage:
                                    'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-bonuses.svg")'
                            }}
                        />
                        <span className="icon-wallet-bg " />
                    </div>
                </div>
            </div>
            <div
                className="member-menu  ng-star-inserted"
                style={{ display: "block", opacity: 1 }}
            >
                <div className="member-menu-content ">
                    <div
                        className="member-list member-menu-box  ng-star-inserted"
                        style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                    >
                        <div
                            className="title "
                            style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                        >
                            <h2 className="">
                                <span className="">{t('account.funds')}</span> {/* Translate using i18n */}
                            </h2>
                        </div>
                        <ul className="member-menu-item  align-center">
                            <li
                                className=" deposit ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                                onClick={() => navigate('/deposit', {
                                    state: { backgroundLocation: location },
                                })}
                            >
                                {/* Link to deposit page */}
                                <Link onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/deposit', {
                                        state: { backgroundLocation: location },
                                    });
                                }}>
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-deposit.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.deposit')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" withdrawal ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to withdrawal page */}
                                <Link onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/withdrawal', {
                                        state: { backgroundLocation: location },
                                    });
                                }}>
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-withdrawal.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.withdrawal')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" free-spin ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to free spin page - assuming route based on old component */}
                                <Link to="/free-spin"> {/* Placeholder route */}
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-free-spin.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.freeSpin')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="member-list member-menu-box  ng-star-inserted"
                        style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                    >
                        <div
                            className="title "
                            style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                        >
                            <h2 className="">
                                <span className="">{t('account.myPromotion')}</span> {/* Translate using i18n */}
                            </h2>
                        </div>
                        <ul className="member-menu-item  align-center">
                            <li
                                className=" real-time-bonus ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to real-time bonus page - assuming route based on old component */}
                                <Link to="/bonus"> {/* Placeholder route */}
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-real-time-bonus.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.realTimeBonus')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" referral ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to invite friends page - assuming route based on old component */}
                                <Link to="/invite-friends">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-referral.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.inviteFriends')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="member-list member-menu-box  ng-star-inserted"
                        style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                    >
                        <div
                            className="title "
                            style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                        >
                            <h2 className="">
                                <span className="">{t('account.history')}</span> {/* Translate using i18n */}
                            </h2>
                        </div>
                        <ul className="member-menu-item  align-center">
                            <li
                                className=" bet-records ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to betting record page - assuming route based on old component */}
                                <Link to="/betting-record">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-bet-records.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.bettingRecord')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" turnover ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to profit/loss page - assuming route based on old component */}
                                <Link to="/transaction-record">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-turnover.svg")'
                                        }}
                                    />
                                    <p className="">Casino Betting Records</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" records ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to account record page - assuming route based on old component */}
                                <Link to="/account-record">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-records.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.accountRecord')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" records ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to account record page - assuming route based on old component */}
                                <Link to="/deposit-history">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-records.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.depositRecord')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" records ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to account record page - assuming route based on old component */}
                                <Link to="/withdraw-history">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-records.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.withdrawalRecord')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="member-list member-menu-box  ng-star-inserted"
                        style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                    >
                        <div
                            className="title "
                            style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                        >
                            <h2 className="">
                                <span className="">{t('account.my')}</span> {/* Translate using i18n */}
                            </h2>
                        </div>
                        <ul className="member-menu-item  align-center">
                            <li
                                className=" info ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to my account page - assuming route based on old component */}
                                <Link to="/my-account">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-info.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.myAccountTitle')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" changepassword ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to security center page - assuming route based on old component */}
                                <Link to="/securityCenter">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-changepassword.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.securityCenter')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li
                                className=" inbox ng-star-inserted"
                                style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                            >
                                {/* Link to internal message page - assuming route based on old component */}
                                <Link to="/webEmail">
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-inbox.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.internalMessage')}</p> {/* Translate using i18n */}
                                    {/* Add badge if needed, e.g., for unread messages */}
                                    {/* Example: <span className="badge ng-star-inserted">14</span> */}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="member-list member-menu-box  ng-star-inserted"
                        style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                    >
                        <div
                            className="title "
                            style={{ opacity: 1, transform: "translate(0px, 0px)" }}
                        >
                            <h2 className="">
                                <span className="">{t('account.social')}</span> {/* Translate using i18n */}
                            </h2>
                        </div>
                        <ul className="member-menu-item ">
                            <li
                                className=" facebook ng-star-inserted"
                                style={{}}
                            >
                                <Link
                                    target="_blank"
                                    className=""
                                    to=""
                                >
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-facebook.svg")'
                                        }}
                                    />
                                    <p className="">FaceBook</p>
                                </Link>
                            </li>
                            <li
                                className=" telegram ng-star-inserted"
                                style={{}}
                            >
                                <Link
                                    target="_blank"
                                    className=""
                                    to=""
                                >
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-telegram.svg")'
                                        }}
                                    />
                                    <p className="">Telegram</p>
                                </Link>
                            </li>
                            <li
                                className=" instagram ng-star-inserted"
                                style={{}}
                            >
                                <Link
                                    target="_blank"
                                    className=""
                                    to=""
                                >
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-instagram.svg")'
                                        }}
                                    />
                                    <p className="">Instagram</p>
                                </Link>
                            </li>
                            <li
                                className=" youtube ng-star-inserted"
                                style={{}}
                            >
                                <Link
                                    target="_blank"
                                    className=""
                                    to=""
                                >
                                    <span
                                        className=" ng-star-inserted"
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-youtube.svg")'
                                        }}
                                    />
                                    <p className="">Youtube</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div
                        className="member-list member-menu-box  ng-star-inserted"
                        style={{}}
                    >
                        <div className="title ">
                            <h2 className="">
                                <span className="">{t('account.contactUs')}</span> {/* Translate using i18n */}
                            </h2>
                        </div>
                        <ul className="member-menu-item ">
                            <li className="about  ng-star-inserted">
                                <Link className="">
                                    <span
                                        className=""
                                        style={{
                                            maskImage:
                                                'url("/mcw/h5/assets/images/icon-set/theme-icon/icon-about.svg")'
                                        }}
                                    />
                                    <p className="">{t('account.aboutUs')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li className=" talk ng-star-inserted">
                                {/* Example customer service link, replace with actual URL */}
                                <Link target="_blank" className="" to="YOUR_CS_URL_HERE">
                                    <span className="use-icon-path  ng-star-inserted">
                                        <i
                                            className=""
                                            style={{
                                                backgroundImage:
                                                    'url("/upload/customerservice/image_396.png")'
                                            }}
                                        />
                                    </span>
                                    <p className="">{t('account.customerService')}</p> {/* Translate using i18n */}
                                </Link>
                            </li>
                            <li className=" telegram ng-star-inserted">
                                <Link
                                    target="_blank"
                                    className=""
                                    to=""
                                >
                                    <span className="use-icon-path  ng-star-inserted">
                                        <i
                                            className=""
                                            style={{
                                                backgroundImage:
                                                    'url("/upload/customerservice/image_502.png")'
                                            }}
                                        />
                                    </span>
                                    <p className="">Telegram</p>
                                </Link>
                            </li>
                            <li className=" facebook-messenger ng-star-inserted">
                                <Link
                                    target="_blank"
                                    className=""
                                    to=""
                                >
                                    <span className="use-icon-path  ng-star-inserted">
                                        <i
                                            className=""
                                            style={{
                                                backgroundImage:
                                                    'url("/upload/customerservice/image_391.png")'
                                            }}
                                        />
                                    </span>
                                    <p className="">Facebook</p>
                                </Link>
                            </li>
                            <li className=" email ng-star-inserted">
                                <Link
                                    target="_blank"
                                    className=""
                                    to=""
                                >
                                    <span className="use-icon-path  ng-star-inserted">
                                        <i
                                            className=""
                                            style={{
                                                backgroundImage:
                                                    'url("/upload/customerservice/image_426.png")'
                                            }}
                                        />
                                    </span>
                                    <p className="">Email</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* Logout Button */}
                    <div className="button btn-primary ">
                        {/* Call handleLogout function on click */}
                        <Link to="/" onClick={handleLogout} className="cursor-pointer">{t('account.logout')}</Link>
                    </div>
                    {/* Download App Button - Example, add if needed in this specific section */}
                    {/* <div className="button btn-secondary">
                        <Link onClick={handleDownload} className="cursor-pointer">{t('account.downloadApp')}</Link>
                    </div> */}
                </div>
            </div>
        </div>
    );
}