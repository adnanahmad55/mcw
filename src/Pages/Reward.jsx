import React, { useEffect, useState } from "react";
import fundBg from "../assets/img/money_bg.png";
import giftBg from "../assets/img/gift_bg.png";
import inviteBg from "../assets/img/invite_bg.png";
import vipImg from "../assets/img/vipImg.png";
import right from "../assets/img/right.530b2394.png";
import temuBg from "../assets/img/temu_bg.png";

import fundIcon from "../assets/img/money_icon.png";
import giftIcon from "../assets/img/gift_icon.png";
import inviteIcon from "../assets/img/invite_icon.png";
import temuIcon from "../assets/img/temu_icon.png";
import mallBg from "../assets/img/mall-bg.png";
import { useSelector } from "react-redux";
import BackHeader from "../component/BackHeader";
import { Link } from "react-router-dom";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Reward() {
    const { isLogin, username, totalCoins } = useSelector((state) => state.auth);
    const authData = JSON.parse(localStorage.getItem("auth"));
    const usernameName = authData?.username;
    const userId = authData?.userId; // Added userId
    const token = authData?.token; // Added token
    const [userCoins, setUserCoins] = useState(totalCoins)
    const [vipData, setVipData] = useState(null); // Changed to null initially
    const [dailyBonusClaimable, setDailyBonusClaimable] = useState(false);
    const [instantWinData, setInstantWinData] = useState([]);
    const [turnoverData, setTurnoverData] = useState([]);
    const [referralRewardsData, setReferralRewardsData] = useState([]);
    const [totalClaimableCount, setTotalClaimableCount] = useState(0); // Added state for total claimable count

    

    const { t } = useTranslation();
    const cards = [
        { title: t('reward.bonus'), bg: giftBg, icon: giftIcon, url: '/bonus' },
        { title: t('reward.rescueFund'), bg: fundBg, icon: fundIcon, url:'/rescue-fund' },
        { title: t('reward.inviteFriends'), bg: inviteBg, icon: inviteIcon, url:'/invite-friends' },
        { title: t('reward.temuTic'), bg: temuBg, icon: temuIcon },
    ];


    // Fetch VIP Data
    const fetchVipData = async () => {
        if (!usernameName) return; // Guard clause
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-vip-bonus?username=${usernameName}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Added token header
                    },
                }
            );
            setVipData(res?.data?.data?.vip);
        } catch (error) {
            console.error("Error fetching VIP data:", error);
        }
    };

    // Fetch Daily Bonus Claimable Status
    const checkDailyBonus = async () => {
        if (!userId || !usernameName || !token) return; // Guard clause
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-daily-bonus?username=${usernameName}&user_id=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res?.data?.status) {
                setDailyBonusClaimable(res?.data?.data?.claim_bonus?.is_claimable);
            } else {
                setDailyBonusClaimable(false); // Explicitly set to false if not claimable or error
            }
        } catch (err) {
            console.error("Get daily bonus error:", err);
            setDailyBonusClaimable(false); // Explicitly set to false on error
        }
    };

    // Fetch Instant Win Data
    const fetchInstantWinBonus = async () => {
        if (!token) return; // Guard clause
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-instant-win-bonus`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response?.data?.status) {
                setInstantWinData(response?.data?.data?.earnings || []);
            } else {
                setInstantWinData([]); // Explicitly set to empty array
            }
        } catch (err) {
            console.error("Get instant win bonus error:", err);
            setInstantWinData([]); // Explicitly set to empty array
        }
    };

    // Fetch Turnover Data
    const getPlayerTurnover = async () => {
        if (!usernameName || !userId || !token) return; // Guard clause
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-player-turnover?username=${usernameName}&user_id=${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (res?.data?.status) {
                // Filter only claimable turnover data
                const claimableData = res?.data?.data?.turnover?.promotions?.filter(item => item?.is_claimable) || [];
                setTurnoverData(claimableData);
            } else {
                setTurnoverData([]); // Explicitly set to empty array
            }
        } catch (err) {
            console.error("Get turnover bonus error:", err);
            setTurnoverData([]); // Explicitly set to empty array
        }
    };

    // Fetch Referral Rewards Data
    const fetchReferralRewards = async () => {
        if (!usernameName) return; // Guard clause
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/referral-count-offer?username=${usernameName}`
            );
            if (res?.data?.subCode === 200) {
                // Filter out achievements and only include reward_claimable items
                const filteredData = res?.data?.data?.referral_earning?.filter(item =>
                    item?.activity_type !== "achievements" && item?.reward_claimable
                ) || [];
                setReferralRewardsData(filteredData);
            } else {
                setReferralRewardsData([]); // Explicitly set to empty array
            }
        } catch (err) {
            console.error("Get referral rewards error:", err);
            setReferralRewardsData([]); // Explicitly set to empty array
        }
    };

    // Calculate total claimable count
    const recalculateTotalClaimable = () => {
        let count = 0;
        if (dailyBonusClaimable) count++;
        if (vipData?.earnings) {
            count += vipData.earnings.filter(item => item.reward_claimable).length;
        }
        if (instantWinData) {
            count += instantWinData.filter(item => item.reward_claimable).length;
        }
        if (turnoverData) {
            count += turnoverData.length; // Already filtered for claimable
        }
        if (referralRewardsData) {
            count += referralRewardsData.length; // Already filtered for claimable
        }
        setTotalClaimableCount(count);
    };

    // Fetch all data on component mount
    useEffect(() => {
        fetchVipData();
        checkDailyBonus();
        fetchInstantWinBonus();
        getPlayerTurnover();
        fetchReferralRewards();
    }, [usernameName, userId, token]); // Added dependencies

    // Recalculate total claimable count whenever relevant data changes
    useEffect(() => {
        recalculateTotalClaimable();
    }, [dailyBonusClaimable, vipData, instantWinData, turnoverData, referralRewardsData]); // Added dependencies

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
                localStorage.setItem('wallet_balance', data?.data?.totalCoins);
            } else {
                console.error("Failed to refresh coins:", data.message);
            }
        } catch (error) {
            console.error("Error refreshing coins:", error);
        }
    };

    useEffect(() => {
        handleRefreshCoins();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100"

            style={{
                backgroundImage: `url(${mallBg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "100% auto",
                backgroundPosition: "center -0.34rem",
            }}>
            {/* Header Section */}
            {/* <div className="bg-black w-full"> */}
                <BackHeader text="Reward Center" />
            {/* </div> */}
            <div
                className="text-white p-6 rounded-b-3xl relative mt-[100px]"
                style={{backgroundImage:'url(https://www.nbajee10.club/mobile/mc/border.b5fa93b3.png), url(https://www.nbajee10.club/mobile/mc/badge.bf45a271.png), linear-gradient(30deg, rgb(230, 177, 75), rgb(255, 236, 170)'}}
            >
                {/* <h2 className="text-lg font-semibold">Reward Center</h2> */}

                {/* Profile Info */}
                <div className="mt-6 flex items-center">
                    <img
                        src="./assets/img/user.png"
                        alt="profile"
                        className="w-12 h-12 rounded-full border-2 border-white"
                    />
                    <div className="ml-3">
                        <h3 className="font-bold text-black">{username} 📱</h3>
                        <p className="text-sm text-[#25252599]">{t('reward.nickname')}: {username}</p>
                        <div className="flex items-center px-3 py-1 rounded-full space-x-2">
                            <span className="font-medium flex items-center text-black">৳ {Number(userCoins).toFixed(2)}</span>
                            <RefreshCcw size={16} className="cursor-pointer text-black" onClick={handleRefreshCoins} />
                        </div>
                    </div>
                </div>
                <div className="w-full mt-2 text-[#25252599] flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <img src={vipImg} width={20} />  VIP{vipData?.level || 0}
                    </div>
                    <Link to="/vip" className="flex items-center gap-2 text-[#00000099] text-[15px]">
                        {t('reward.benefits')}
                        <img src={right} width={18} height={18} />
                    </Link>
                </div>
                {/* Progress Bar */}
                {/* Progress Bar */}
                <div className="w-full flex items-center mt-2">
                    <div className="w-full bg-[#6666664d] flex justify-start overflow-hidden rounded-3xl h-1">
                        <div
                            className="bg-[#fff] rounded-3xl h-1"
                            style={{
                                width: `${
                                    vipData?.levels?.[vipData?.level]
                                        ? (vipData.levels[vipData.level].current_deposit >=
                                            vipData.levels[vipData.level].required_deposit
                                            ? 50
                                            : 0) +
                                        (vipData.levels[vipData.level].current_bet >=
                                            vipData.levels[vipData.level].required_bet
                                            ? 50
                                            : 0)
                                        : 0
                                }%`,
                            }}
                        ></div>
                    </div>
                    <p className="text-[#25252599] text-sm whitespace-nowrap ml-2">
                        {
                            vipData?.levels?.[vipData?.level]
                                ? ((vipData.levels[vipData.level].current_deposit >=
                                    vipData.levels[vipData.level].required_deposit
                                    ? 1
                                    : 0) +
                                (vipData.levels[vipData.level].current_bet >=
                                    vipData.levels[vipData.level].required_bet
                                    ? 1
                                    : 0))
                                : 0
                        }/2
                    </p>
                </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-2 gap-4 p-4 pt-[12px]">
                {cards.map((item, idx) => (
                    <Link
                        key={idx}
                        to={item?.url}
                        className="relative rounded-xl overflow-hidden shadow-md flex flex-col items-center justify-center text-white h-[120px]"
                        style={{
                            backgroundImage: `url(${item.bg})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        <span className="w-[44px] h-[44px] bg-white rounded-full mb-2 flex justify-center items-center mx-auto">
                            <img src={item.icon} alt={item.title} className="w-6 h-6" />
                        </span>
                        <span className="font-semibold">{item.title}</span>
                        {item.title === 'Bonus' && totalClaimableCount > 0 && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#ff0000] flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{totalClaimableCount}</span>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
}
