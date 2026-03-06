import React, { useEffect, useState } from 'react'
import bgImg from '../assets/img/mall-bg.jpg'
import bgImg1 from '../assets/img/tiket_bg_red.jpg'
import headImg from '../assets/img/head.png'
import activityAmount_bg from '../assets/img/activityAmount_bg.png'
import rain from '../assets/img/rain.png'
import HeaderTitle from '../assets/img/header-title-top.png'
import redenvelope from '../assets/img/ticket-type-redenvelope.webp'
import BackHeader from '../component/BackHeader'
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IoCloseCircleOutline } from 'react-icons/io5'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Bonus() {
    const { isLogin, username, totalCoins } = useSelector((state) => state.auth);
    const [claimModal, setClaimModal] = useState(false);
    const [claimData, setClaimData] = useState("");
    const [count, setCount] = useState(5);
    const [step, setStep] = useState(1);
    const [countdown, setCountdown] = useState(5);
    const [timer, setTimer] = useState(10);
    const [counterModal, setCounterModal] = useState(false);
    const [claimAmount, setClaimAmount] = useState("");
    const [claimAmountModal, setClaimAmountModal] = useState(false);
    const [dailyBonusClaimable, setDailyBonusClaimable] = useState(false);
    
    // New state for instant win bonus
    const [instantWinData, setInstantWinData] = useState([]);

    const navigate = useNavigate()

    const data = [
        { name: "to****0", amount: "৳ 3.67" },
        { name: "mo****2", amount: "৳ 7.25" },
        { name: "pa****5", amount: "৳ 15.40" },
        { name: "lo****3", amount: "৳ 25.10" },
        { name: "to****0", amount: "৳ 3.67" },
        { name: "mo****2", amount: "৳ 7.25" },
        { name: "pa****5", amount: "৳ 15.40" },
        { name: "lo****3", amount: "৳ 25.10" },
    ];

    const [vipData, setVipData] = useState(null);
    const authData = JSON.parse(localStorage.getItem("auth"));
    const usernameName = authData?.username;
    const userId = authData?.userId;
    const token = authData?.token;

    useEffect(() => {
        if (step === 2 && countdown > 0) {
            const interval = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
        if (step === 2 && countdown === 0) {
            setStep(3);
        }
    }, [step, countdown]);

    const onClose = () => {
        setCounterModal(false);
        setClaimData('');
        setClaimModal(false);
        setStep(1);
        setCountdown(5);
        setTimer(10);
        setClaimAmountModal(false);
    }

    useEffect(() => {
        if (step === 3 && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
        if (step === 3 && timer === 0) {
            onClose();
        }
    }, [step, timer]);

    // New function to fetch instant win bonus
    const fetchInstantWinBonus = async () => {
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
                console.warn("No instant win bonus available or API error:", response?.data?.message);
            }
        } catch (err) {
            console.error("Get instant win bonus error:", err);
        }
    };

    // New function to claim instant win bonus
    const claimInstantWinBonus = async (claimId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/claim-instant-win-bonus`,
                {
                    username: usernameName,
                    claim_id_array: [claimId],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response?.data?.status) {
                setClaimAmountModal(true);
                setClaimAmount(response?.data?.data?.totalWinning || response?.data?.data?.amount || 0);
                
                // Refresh data after claiming
                fetchInstantWinBonus();
                fetchVipData();
                checkDailyBonus();
            } else {
                alert(response?.data?.message || "Failed to claim bonus");
            }
        } catch (err) {
            console.error("Claim instant win bonus error:", err);
            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong while claiming bonus"
            );
        }
    };

    const checkDailyBonus = async () => {
        try {
            if (!userId || !usernameName) {
                console.error("User not logged in properly");
                return;
            }

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
                console.warn("No bonus available or API error:", res?.data?.message);
            }
        } catch (err) {
            console.error("Get daily bonus error:", err);
        }
    };

    const claimDailyBonus = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/claim-daily-bonus`,
                {
                    username: usernameName,
                    user_id: userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res?.data?.status) {
                setDailyBonusClaimable(false);
                setClaimAmountModal(true);
                setClaimAmount(res?.data?.data?.amount || 0);
            } else {
                alert(res?.data?.message || "Failed to claim daily bonus");
            }
        } catch (err) {
            console.error("Claim daily bonus error:", err);
            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong while claiming daily bonus"
            );
        }
    };

    const claimVipBonus = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}promotion/claim-vip-bonus`, {
                username: usernameName,
                claim_id_array: [claimData],
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            if (res?.data?.status) {
                onClose();
                fetchVipData();
                setClaimAmountModal(true);
                setClaimAmount(res?.data?.data?.totalWinning);
            } else {
                alert(res?.data?.message || "Failed to claim VIP bonus");
                onClose();
            }
        } catch (err) {
            console.error("Claim VIP bonus error:", err);
            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong while claiming VIP bonus"
            );
            onClose();
        }
    };

    const fetchVipData = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-vip-bonus?username=${usernameName}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setVipData(res?.data?.data?.vip);
        } catch (error) {
            console.error("Error fetching VIP data:", error);
        }
    };

    useEffect(() => {
        fetchVipData();
        checkDailyBonus();
        fetchInstantWinBonus(); // Fetch instant win bonus data
    }, []);

    // Determine the type of bonus being claimed
    const getBonusType = () => {
        if (claimData === 'daily-bonus') return 'daily-bonus';
        if (instantWinData.some(item => item._id === claimData)) return 'instant-win';
        return 'vip-bonus';
    };

    const bonusType = getBonusType();

    return (
        <>
            <div className='w-full bg-[#f5f5f9] min-h-screen'>
                <div className="bg-black w-full">
                    <BackHeader text="Bonus" />
                </div>
                
                <div className='w-full h-[158px]'
                    style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <div className="pt-7 pl-6 flex items-center w-full">
                        <img
                            src="./assets/img/user.png"
                            alt="profile"
                            className="w-14 h-14 rounded-full border-2 border-white"
                        />
                        <div className="ml-3">
                            <h3 className="font-medium text-white">{username}</h3>
                            <p className="text-base font-bold text-white">৳ {localStorage.getItem('wallet_balance')} </p>
                        </div>
                    </div>
                </div>

                {/* Daily Bonus Card */}
                {dailyBonusClaimable && (
                    <div className='w-full h-[120px] mb-4 flex items-center px-2'
                        style={{ 
                            backgroundImage: `url(${bgImg1})`, 
                            backgroundSize: 'cover', 
                            backgroundRepeat: 'no-repeat', 
                            boxShadow: '0 38px 38px rgba(0,0,0,.1)',
                            borderRadius: '8px'
                        }}>
                        <div className='px-4 gap-3 relative flex' style={{ flex: '1 1 0%' }}>
                            <div className='rounded-lg py-2 px-1 w-[104px] flex items-center'
                                style={{ background: 'linear-gradient(0deg,#ff73c3,#f425d4)', boxShadow: '0 2px 9px rgba(254,52,216,.35)' }}>
                                <div className='w-full text-center text-[10px] text-white'>
                                    <span className='block text-center'>DAILY BONUS</span>
                                    <span className='block text-center'>Red Package</span>
                                    <span className='block text-center'>{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <div className='w-full text-center text-[10px] text-black'>
                                    <span className='block text-left'>Daily Reward</span>
                                    <span className='block text-left'>100% Claimable</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white h-full text-[#bababa] text-[11px] py-[8px] px-[3px] w-[84px]'>
                            <div className='w-full text-center'>
                                Today
                            </div>
                            <div className='text-[9px] font-normal text-center text-[#666]'>
                                <strong className='font-bold text-[32px]'>{new Date().getDate()}</strong>
                                day
                                <p className='text-[11px] font-normal'>{new Date().toLocaleTimeString()}</p>
                                <button className='w-full text-white bg-[#30d005] rounded-3xl font-normal text-center py-[6px] px-1'
                                    onClick={() => {
                                        setClaimModal(true); 
                                        setClaimData('daily-bonus');
                                    }}>Claim</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* VIP Bonus Cards */}
                {vipData?.earnings?.filter(item => item?.reward_claimable)?.map((item, idx) => (
                    <div key={idx} className='w-full h-[120px] mb-4 flex items-center px-2'
                        style={{ backgroundImage: `url(${bgImg1})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', boxShadow: '0 38px 38px rgba(0,0,0,.1)' }}>
                        <div className='px-4 gap-3 relative flex'
                            style={{
                                flex: '1 1 0%'
                            }}>
                            <div className='rounded-lg py-2 px-1 w-[104px] flex items-center'
                                style={{ background: 'linear-gradient(0deg,#ff73c3,#f425d4)', boxShadow: '0 2px 9px rgba(254,52,216,.35)' }}>
                                <div className='w-full text-center text-[10px] text-white'>
                                    <span className='block text-center'>REWARD TICKET</span>
                                    <span className='block text-center'>Red Package</span>
                                    <span className='block text-center'>{new Date(item?.date_time).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className='flex items-center'
                            >
                                <div className='w-full text-center text-[10px] text-black'>
                                    <span className='block text-left'>Reward</span>
                                    <span className='block text-left'>{item?.reward_rate}</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white h-full text-[#bababa] text-[11px] py-[8px] px-[3px] w-[84px]'>
                            <div className='w-full text-center'>
                                Due Date
                            </div>
                            <div className='text-[9px] font-normal text-center text-[#666]'>
                                <strong className='font-bold text-[32px]'>{new Date(item?.date_time).getDate()}</strong>
                                day
                                <p className='text-[11px] font-normal'>23:31:08</p>
                                {item?.reward_claimable && (
                                    <button className='w-full text-white bg-[#30d005] rounded-3xl font-normal text-center py-[6px] px-1'
                                        onClick={() => {
                                            setClaimModal(true); setClaimData(item?._id)
                                        }}>Claim</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Instant Win Bonus Cards */}
                {instantWinData?.filter(item => item?.reward_claimable)?.map((item, idx) => (
                    <div key={item._id} className='w-full h-[120px] mb-4 flex items-center px-2'
                        style={{ backgroundImage: `url(${bgImg1})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', boxShadow: '0 38px 38px rgba(0,0,0,.1)' }}>
                        <div className='px-4 gap-3 relative flex'
                            style={{
                                flex: '1 1 0%'
                            }}>
                            <div className='rounded-lg py-2 px-1 w-[104px] flex items-center'
                                style={{ background: 'linear-gradient(0deg,#ff73c3,#f425d4)', boxShadow: '0 2px 9px rgba(254,52,216,.35)' }}>
                                <div className='w-full text-center text-[10px] text-white'>
                                    <span className='block text-center'>
                                        {item.activity_type === 'instant-win' ? 'INSTANT WIN' : item.activity_type === 'instant-loss' ? 'INSTANT LOSS' : 'INSTANT BET'}
                                    </span>
                                    <span className='block text-center'>Red Package</span>
                                    <span className='block text-center'>{new Date(item?.date_time).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className='flex items-center'
                            >
                                <div className='w-full text-center text-[10px] text-black'>
                                    <span className='block text-left'>Reward</span>
                                    <span className='block text-left'>Amount: {item?.amount}</span>
                                    <span className='block text-left'>Bonus: {item?.reward_rate}</span>
                                    <span className='block text-left'>{item?.game || 'Game'}</span>
                                </div>
                            </div>
                        </div>

                        <div className='bg-white h-full text-[#bababa] text-[11px] py-[8px] px-[3px] w-[84px]'>
                            <div className='w-full text-center'>
                                Due Date
                            </div>
                            <div className='text-[9px] font-normal text-center text-[#666]'>
                                <strong className='font-bold text-[32px]'>{new Date(item?.date_time).getDate()}</strong>
                                day
                                <p className='text-[11px] font-normal'>23:31:08</p>
                                {item?.reward_claimable && (
                                    <button className='w-full text-white bg-[#30d005] rounded-3xl font-normal text-center py-[6px] px-1'
                                        onClick={() => {
                                            setClaimModal(true); 
                                            setClaimData(item._id);
                                        }}>Claim</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Claim Modals - Only one at a time based on bonus type */}
            {claimModal && bonusType === 'daily-bonus' && (
                <div className='bg-[#000000cc] fixed top-0 bottom-0 left-0 right-0 z-30'>
                    <div className='w-full p-2 relative'>
                        <IoCloseCircleOutline className='text-white absolute right-4 text-2xl top-4' onClick={onClose} />
                        <div className='claimHeaderTitle relative pt-[53px] flex justify-center'>
                            <div className='headerTitleInner'>Rewards</div>
                        </div>
                        <div className='flex justify-center'>
                            <div className='w-[66px] bg-[#787878] rounded-md text-white mt-2 p-2 text-center py-3 text-[9px]'>
                                দৈনিক পুরস্কার
                            </div>
                        </div>
                        <div className='w-full text-center text-[#ffb30b] text-[13px] font-bold mt-1'>
                            দৈনিক পুরস্কার
                        </div>
                        <div className='w-full flex justify-center px-4'>
                            <img src={redenvelope} className='w-full' />
                        </div>
                        <div className='flex justify-center'>
                            <button className='w-[168px] text-center text-[#d63000] h-[26px] text-[13px] rounded-3xl'
                                style={{
                                    background: 'transparent linear-gradient(180deg,#fff,#f7c163) 0 0 no-repeat padding-box'
                                }}
                                onClick={() => {
                                    setStep(2);
                                    setCountdown(5);
                                    setCounterModal(true);
                                }}
                            >Claim</button>
                        </div>
                        <div className='h-[17px] flex items-center mt-2 px-[5px] py-0 rounded-3xl border-[1.44px] border-solid border-[#707070]'
                            style={{ background: '#262626 0 0 no-repeat padding-box' }}>
                            <div className='h-[9px] w-full text-white text-right text-[11px] rounded-3xl border-0'
                                style={{
                                    background: 'transparent linear-gradient(180deg,#ffcf00,#ee7c0e) 0 0 no-repeat padding-box'
                                }}>100%</div>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='ticket-rank-wrap'>
                                <div className='w-[230px] overflow-hidden h-[68px]'>
                                    <Swiper
                                        direction="vertical"
                                        slidesPerView={4}
                                        loop={true}
                                        autoplay={{
                                            delay: 2000,
                                            disableOnInteraction: false,
                                        }}
                                        modules={[Autoplay]}
                                        className="h-[120px]"
                                    >
                                        {data.map((item, idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="w-full px-4 border-b py-[0px] flex justify-between text-[11px] border-[#444122]">
                                                    <span className="text-white">{item.name}</span>
                                                    <span className="text-[#fab00c]">{item.amount}</span>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VIP and Instant Win Bonus Modal - Unified (without counter) */}
            {claimModal && bonusType !== 'daily-bonus' && (
                <div className='bg-[#000000cc] fixed top-0 bottom-0 left-0 right-0 z-30'>
                    <div className='w-full p-2 relative'>
                        <IoCloseCircleOutline className='text-white absolute right-4 text-2xl top-4' onClick={onClose} />
                        <div className='claimHeaderTitle relative pt-[53px] flex justify-center'>
                            <div className='headerTitleInner'>Rewards</div>
                        </div>
                        <div className='flex justify-center'>
                            <div className='w-[66px] bg-[#787878] rounded-md text-white mt-2 p-2 text-center py-3 text-[9px]'>
                                {bonusType === 'instant-win' ? 'INSTANT WIN' : 'VIP BONUS'}
                            </div>
                        </div>
                        <div className='w-full text-center text-[#ffb30b] text-[13px] font-bold mt-1'>
                            {bonusType === 'instant-win' ? 'INSTANT WIN BONUS' : 'VIP BONUS'}
                        </div>
                        <div className='w-full flex justify-center px-4'>
                            <img src={redenvelope} className='w-full' />
                        </div>
                        <div className='flex justify-center'>
                            <button className='w-[168px] text-center text-[#d63000] h-[26px] text-[13px] rounded-3xl'
                                style={{
                                    background: 'transparent linear-gradient(180deg,#fff,#f7c163) 0 0 no-repeat padding-box'
                                }}
                                onClick={() => {
                                    // Claim directly without counter for instant bonuses
                                    if (bonusType === 'instant-win') {
                                        claimInstantWinBonus(claimData);
                                        onClose();
                                    } else {
                                        // For VIP bonuses, still use the counter
                                        setStep(2);
                                        setCountdown(5);
                                        setCounterModal(true);
                                    }
                                }}
                            >Claim</button>
                        </div>
                        <div className='h-[17px] flex items-center mt-2 px-[5px] py-0 rounded-3xl border-[1.44px] border-solid border-[#707070]'
                            style={{ background: '#262626 0 0 no-repeat padding-box' }}>
                            <div className='h-[9px] w-full text-white text-right text-[11px] rounded-3xl border-0'
                                style={{
                                    background: 'transparent linear-gradient(180deg,#ffcf00,#ee7c0e) 0 0 no-repeat padding-box'
                                }}>100%</div>
                        </div>
                        <div className='w-full flex justify-center'>
                            <div className='ticket-rank-wrap'>
                                <div className='w-[230px] overflow-hidden h-[68px]'>
                                    <Swiper
                                        direction="vertical"
                                        slidesPerView={4}
                                        loop={true}
                                        autoplay={{
                                            delay: 2000,
                                            disableOnInteraction: false,
                                        }}
                                        modules={[Autoplay]}
                                        className="h-[120px]"
                                    >
                                        {data.map((item, idx) => (
                                            <SwiperSlide key={idx}>
                                                <div className="w-full px-4 border-b py-[0px] flex justify-between text-[11px] border-[#444122]">
                                                    <span className="text-white">{item.name}</span>
                                                    <span className="text-[#fab00c]">{item.amount}</span>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {counterModal && (
                <div className='bg-[#000000cc] fixed top-0 bottom-0 left-0 right-0 z-40'>
                    {step === 2 && (
                        <div className='w-full p-2 relative'>
                            <div className='w-full'>
                                <img src={headImg} className='w-full' />
                            </div>
                            <div className='mt-[43px]'>
                                <div className='text-center font-bold text-[23px] text-white'>Count down</div>
                                <p className='text-center text-[#ffea00] font-bold text-[143px] -mt-8'>{countdown}</p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className='w-full p-2 relative h-full'>
                            <div className='text-center text-white mt-[43px] text-sm'>
                                End in <span className='text-[#ffea00] text-[23px] font-bold px-1'>{timer}</span> <span>sec</span>
                            </div>
                            <p className='text-white text-sm text-center mt-6'>Please click on any red package</p>
                            <div className='w-full h-full absolute top-0 bottom-0 right-0 left-0 z-20'
                                onClick={() => {
                                    if (claimData === 'daily-bonus') {
                                        claimDailyBonus();
                                    } else {
                                        claimVipBonus();
                                    }
                                }}>
                                <div className='w-full rain foreground z-10'>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {claimAmountModal && (
                <div className='bg-[#000000cc] fixed top-0 bottom-0 left-0 right-0 z-40'>
                    <div className='w-full p-2 relative h-full flex justify-center items-center'>
                        <div className='w-full relative'>
                            <img src={activityAmount_bg} className='w-full' />
                            <div className='absolute top-24 left-0 right-0'>
                                <p className='text-center text-[#b27008] text-xs'>Congratulations!</p>
                                <p className='text-[#b27008] font-bold text-center text-[32px]'>৳ {claimAmount}</p>
                            </div>
                            <div className='w-full text-center flex justify-center mt-6'>
                                <IoCloseCircleOutline className='text-white text-4xl top-4'
                                    onClick={onClose} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}