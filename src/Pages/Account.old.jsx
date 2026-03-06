import React, { useEffect, useState } from 'react'
import acbg from '../assets/img/home_bg.png';
import BackHeader from '../component/BackHeader';
import lv from '../assets/img/lv.png'
import user from '../assets/img/user.png'
import { FaGift, FaCoins, FaChartLine, FaDownload, FaTrophy, FaHistory } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // Import the translation hook


export default function Account() {
    const { isLogin, username, totalCoins } = useSelector((state) => state.auth);
    const authData = JSON.parse(localStorage.getItem("auth"));
    const [vipData, setVipData] = useState('');
    const usernameName = authData?.username;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation(); // Initialize translation function


    const handleLogout = () => {
        navigate("/");
        dispatch(logout());
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = import.meta.env.VITE_APP_DOWNLOAD_URL;
        link.setAttribute("download", import.meta.env.VITE_APP_DOWNLOAD_NAME);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const fetchVipData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-vip-bonus?username=${usernameName}`);
            setVipData(res?.data?.data?.vip);
        } catch (error) {
            console.error("Error fetching VIP data:", error);
        }
    };
    useEffect(() => {
        fetchVipData();
    }, []);
    const claimableCount = vipData?.earnings?.filter(item => item?.reward_claimable)?.length || 0;
    const menuItems = [
        { title: t('account.rewardCenter'), icon: <FaTrophy />, badge: 1, url: '/reward' },
        { title: t('account.bettingRecord'), icon: <FaHistory />, url: '/betting-record' },
        { title: t('account.profitAndLoss'), icon: <FaChartLine />, url: '/profit-loss' },
        { title: t('account.depositRecord'), icon: <FaCoins />, url: '/deposit-history' },
        { title: t('account.withdrawalRecord'), icon: <FaCoins />, url: '/withdraw-history' },
        { title: t('account.accountRecord'), icon: <FaCoins />, url: '/account-record' },
        { title: t('account.myAccountTitle'), icon: <FaCoins />, url: '/my-account' },
        { title: t('account.securityCenter'), icon: <FaCoins />, url: '/securityCenter' },
        { title: t('account.inviteFriends'), icon: <FaCoins />, url: '/invite-friends' },
        { title: t('account.manualRebate'), icon: <FaCoins />, url: '/cashback' },
        { title: t('account.internalMessage'), icon: <FaCoins />, badge: 14, url: '/webEmail' },
        { title: t('account.suggestion'), icon: <FaCoins />, url: '/suggestion' },
        { title: t('account.downloadApp'), icon: <FaDownload />, onClick: handleDownload },
        { title: t('account.customerService'), icon: <FaCoins /> },
        { title: t('account.helpCenter'), icon: <FaCoins /> },
        { title: t('account.logout'), icon: <IoMdLogOut /> }, // No url for logout
    ];


    return (
        <div className='w-full acc-bg h-full'
        >
            {/* <div className="bg-black w-full"> */}
                <BackHeader text={t('account.myAccount')} />
            {/* </div> */}
            <div className="w-full relative">
                <div className="w-full pl-6">
                    <div
                        className="w-full min-h-[214px] p-[20px] gap-[10px] flex flex-col relative overflow-hidden"
                        style={{
                            background:
                                "linear-gradient(248deg, rgb(241, 249, 255) 0%, rgb(179, 188, 200) 100%)",
                            borderRadius: "13px 0 0 13px",
                        }}
                    >
                        {/* Right Medal Background */}
                        <div className="absolute right-0 top-0">
                            <img
                                src={lv}
                                className="w-[140px] object-contain opacity-60"
                                style={{ filter: "blur(0.6px)" }}
                                alt="medal"
                            />
                        </div>

                        {/* Profile + Info */}
                        <div className="w-full flex items-center gap-4 relative">
                            {/* Profile Image */}
                            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow">
                                <img src={user} alt="user" className="w-full h-full object-cover" />
                            </div>

                            {/* User Info */}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-[17px] font-bold text-[#222]">{username}</span>
                                    <div className='account-vip-btn rounded-full h-full bg-gray-700 flex flex-row px-2 py-1 items-center'>
                                        <img src="/vip0.png" alt="" style={{height:'20px', width:'20px'}}/>
                                        <Link
                                            to="/vip"
                                            className="font-semibold text-sm px-1 text-white rounded-full h-full">
                                            VIP{vipData?.level || 0}
                                        </Link>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-600">{t('account.nickname')}: {username}</span>

                            </div>
                        </div>

                        <div className='mb-2'>
                            <span className="text-[18px] font-bold text-[#444] mt-1">
                                ৳ {localStorage.getItem('wallet_balance')}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-around mt-4">
                            <Link
                                to="/deposit"
                                className="px-4 py-1 rounded-full bg-white shadow text-sm font-semibold text-[#454545] hover:bg-gray-100"
                                style={{
                                    background: 'linear-gradient(0deg,hsla(0,0%,100%,.7),hsla(0,0%,100%,.3) 33.33%,hsla(0,0%,100%,0) 67%,#fff)'
                                }}>
                                {t('account.deposit')}
                            </Link>
                            <Link to="/withdrawal" className="px-4 py-1 rounded-full bg-white shadow text-sm font-semibold text-[#454545] hover:bg-gray-100"
                                style={{
                                    background: 'linear-gradient(0deg,hsla(0,0%,100%,.7),hsla(0,0%,100%,.3) 33.33%,hsla(0,0%,100%,0) 67%,#fff)'
                                }}>
                                {t('account.withdrawal')}
                            </Link>
                            <Link
                                to="/my-cards"
                                className="px-4 py-1 rounded-full bg-white shadow text-sm font-semibold text-[#454545] hover:bg-gray-100"
                                style={{
                                    background: 'linear-gradient(0deg,hsla(0,0%,100%,.7),hsla(0,0%,100%,.3) 33.33%,hsla(0,0%,100%,0) 67%,#fff)'
                                }}>
                                {t('account.myCards')}
                            </Link>
                        </div>
                    </div>


                </div>
                <div className="w-full p-4">
                    <h2 className="text-gray-700 font-semibold mb-4">{t('account.memberCenter')}</h2>
                    <div className="grid grid-cols-4 gap-4">
                        {menuItems.map((item, idx) =>
                            item.title === t('account.logout') ? (
                                <div
                                    key={idx}
                                    className="relative flex flex-col items-center justify-center p-3 rounded-lg transition cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    {item?.badge && (
                                        <span className="absolute top-1 right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                            {item?.title === t('account.rewardCenter') ? claimableCount : item?.badge}
                                        </span>
                                    )}
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#fff2db] text-[#d1a24f] text-xl">
                                        {item.icon}
                                    </div>
                                    <p className="text-sm text-gray-700 mt-2 text-center leading-tight">
                                        {item.title}
                                    </p>
                                </div>
                            ) : item.title === t('account.downloadApp') ? (
                                <div
                                    key={idx}
                                    className="relative flex flex-col items-center justify-center p-3 rounded-lg transition cursor-pointer"
                                    onClick={handleDownload}
                                >
                                    {item?.badge && (
                                        <span className="absolute top-1 right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                            {item?.title === t('account.rewardCenter') ? claimableCount : item?.badge}
                                        </span>
                                    )}
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#fff2db] text-[#d1a24f] text-xl">
                                        {item.icon}
                                    </div>
                                    <p className="text-sm text-gray-700 mt-2 text-center leading-tight">
                                        {item.title}
                                    </p>
                                </div>
                            ) : (
                                <Link
                                    key={idx}
                                    className="relative flex flex-col items-center justify-center p-3 rounded-lg transition cursor-pointer"
                                    to={item?.url}
                                >
                                    {item?.badge && (
                                        <span className="absolute top-1 right-3 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                            {item?.title === t('account.rewardCenter') ? claimableCount : item?.badge}
                                        </span>
                                    )}
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#fff2db] text-[#d1a24f] text-xl">
                                        {item.icon}
                                    </div>
                                    <p className="text-sm text-gray-700 mt-2 text-center leading-tight">
                                        {item.title}
                                    </p>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}