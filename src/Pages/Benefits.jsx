import React, { useEffect, useState } from 'react'
import BackHeader from '../component/BackHeader'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import vipImg from '../assets/img/lv.png'
import vipImg1 from '../assets/img/lv18.f4144ae0.png'
import { useLocation, useNavigate } from 'react-router-dom';

import "swiper/css";
import "swiper/css/pagination";
import { IoIosCloseCircle } from 'react-icons/io';
import axios from 'axios';

export default function Benefits() {
    const navigate = useNavigate();
    const location = useLocation()
    const [upgrade, setUpgrade] = useState(false);
    const [vipData, setVipData] = useState(null);
    const authData = JSON.parse(localStorage.getItem("auth"));
    const username = authData?.username;
    const token = authData?.token;

    useEffect(() => {
        const fetchVipData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-vip-bonus?username=${username}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setVipData(res?.data?.data?.vip);
            } catch (error) {
                console.error("Error fetching VIP data:", error);
            }
        };
        fetchVipData();
    }, []);

    // Get current level data
    const currentLevelData = vipData?.levels?.find(level => level.level === vipData?.level) || null;
    
    // Check if requirements are completed
    const isDepositCompleted = currentLevelData && 
        currentLevelData.current_deposit >= currentLevelData.required_deposit;
    
    const isBetCompleted = currentLevelData && 
        currentLevelData.current_bet >= currentLevelData.required_bet;
    
    // Calculate progress for display
    const depositPercent = currentLevelData && currentLevelData.required_deposit > 0
        ? Math.min(((currentLevelData.current_deposit / currentLevelData.required_deposit) * 100).toFixed(0), 100)
        : 0;
    
    const betPercent = currentLevelData && currentLevelData.required_bet > 0
        ? Math.min(((currentLevelData.current_bet / currentLevelData.required_bet) * 100).toFixed(0), 100)
        : 0;

    // Calculate completed requirements count
    const completedCount = (isDepositCompleted ? 1 : 0) + (isBetCompleted ? 1 : 0);

    const handleCollectAndUpgrade = () => {
        navigate('/bonus');
        setUpgrade(false);
    };

    const handleGoToDeposit = () => {
        navigate('/deposit', {
                state: { backgroundLocation: location },
            });
        setUpgrade(false);
    };

    const handleGoToHome = () => {
        navigate('/');
        setUpgrade(false);
    };

    return (
        <>
            <div className="bg-black w-full">
                <BackHeader />
            </div>
            <div className='w-full p-[14px] bg-[#f5f5f9] min-h-screen'>
                
                <div className='rounded px-2 mt-3'
                    style={{
                        background: 'linear-gradient(0deg,#f1f9ff,#b3bcc8)'
                    }}>
                    <div className='member-level-info min-h-[57px] flex items-center justify-between'>
                        <div className='flex items-center relative z-[1] flex-1'>
                            <img src="./assets/img/lv9.be016011.png" className='h-[65px]' />
                            <div className='font-bold text-[#333] text-[21px]'>VIP{vipData?.level || 0}</div>
                        </div>
                        <button
                            onClick={() => setUpgrade(true)}
                            className='shadow-[-0.03rem_04px_010px_0_rgba(0,0,0,0.1)] backdrop-blur-[1px] w-[115px] min-h-[33px] flex items-center justify-center gap-[0.1rem] text-[#434851] text-[10px] font-semibold leading-none pl-[0.24rem] pr-[0.15rem] py-[0.1rem] rounded-[33px_0_0_33px]'>
                            Upgrade
                        </button>
                    </div>
                    <div className='border-l-4 mt-5 mb-3 border-[#fd2f2f] text-sm pl-[19px] text-[#666]'>Level Up Requirements</div>
                    <p className='text-[#666] text-[10px] pb-3'>To level up, all conditions must be fulfilled</p>
                </div>

                {vipData && <div className="w-full relative pl-[150px] rounded-[9px] bg-white mt-3"
                    style={{ boxShadow: '0 0 .4rem 0 rgba(255,236,170,.3)' }}>
                    <div className='flex flex-col absolute w-[33%] text-[#666] text-[11px] font-semibold z-10 left-0 top-[38px]'
                        style={{
                            background: 'linear-gradient(180deg,rgba(241,249,255,.15),rgba(179,188,200,.15))'
                        }}>

                        <div className='h-[93px] flex flex-col px-[3px] py-[10px] border-b-[0.02rem] border-b-[hsla(240,7%,94%,0.5)] border-solid'>
                            <div className='text-[11px] font-bold'>Total deposit</div>
                        </div>

                        <div className='h-[93px] flex flex-col px-[3px] py-[10px] border-b-[0.02rem] border-b-[hsla(240,7%,94%,0.5)] border-solid'>
                            <div className='text-[11px] font-bold'>Total bet</div>
                        </div>

                    </div>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={2}
                        className="mySwiper"
                    >
                        {vipData?.levels?.map((level, idx) => {
                            const depositPercent =
                                level.required_deposit > 0
                                    ? Math.min(
                                        ((level.current_deposit / level.required_deposit) * 100).toFixed(0),
                                        100
                                    )
                                    : 0;

                            const betPercent =
                                level.required_bet > 0
                                    ? Math.min(
                                        ((level.current_bet / level.required_bet) * 100).toFixed(0),
                                        100
                                    )
                                    : 0;

                            return (
                                <SwiperSlide key={level._id} className={`flex px-2 flex-col ${vipData?.level === level?.level ? 'acive_vip' : ''}`}>
                                    <div className='text-[10px] font-bold text-black h-[38px] flex justify-center items-center gap-[9px] px-0 py-[5px]'>
                                        {vipData?.level === level?.level ? <img src={vipImg1} className="h-[26px] object-contain" alt="VIP" /> : <img src={vipImg} className="h-[26px] object-contain" alt="VIP" />}

                                        VIP{level.level}
                                    </div>
                                    <div>
                                        <div className='h-[93px] flex flex-col px-[3px] py-[10px] border-b-[0.02rem] border-b-[hsla(240,7%,94%,0.5)] border-solid'>
                                            <div className='text-[#a6a39d] text-[11px] font-bold'>{level.current_deposit}</div>
                                            <div className='text-[#979797] text-[9px] font-semibold text-right mt-[1px]'>/{level.required_deposit}</div>
                                            <div className='text-[#979797] text-[9px] font-semibold text-right mt-[1px]'>{depositPercent}%</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className='h-[93px] flex flex-col px-[3px] py-[10px] border-b-[0.02rem] border-b-[hsla(240,7%,94%,0.5)] border-solid'>
                                            <div className='text-[#a6a39d] text-[11px] font-bold'>{level.current_bet}</div>
                                            <div className='text-[#979797] text-[9px] font-semibold text-right mt-[1px]'>/{level.required_bet}</div>
                                            <div className='text-[#979797] text-[9px] font-semibold text-right mt-[1px]'>{betPercent}%</div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>}
            </div>

            {upgrade && currentLevelData && (
                <div className='fixed p-6 top-0 bottom-0 left-0 right-0 z-40 bg-[#00000066] flex items-end'>
                    <div className='w-full'>
                        <div className='w-full rounded-md flex flex-col bg-white'>
                            <div className='relative min-h-[57px] flex items-center gap-[0.35rem] pl-[19px] pr-[11px] py-0'>
                                <div className='flex-1 flex flex-col gap-[5px] font-bold text-[15px] relative z-[1] text-[#333]'>
                                    <div>Upgrade</div>
                                    <div className='text-[11px] font-medium'>To level up, all conditions must be fulfilled</div>
                                </div>

                                <div className='-mt-[3px] h-[65px]'>
                                    <img src={vipImg} className='h-full object-contain' />
                                </div>
                            </div>

                            <div className='flex-1 overflow-y-auto flex flex-col gap-[6px] px-[9px] py-[14px]'>
                                <div className='flex flex-col gap-[9px] p-[9px] bg-white'
                                    style={{ boxShadow: '0 0 .2rem 0 rgba(188,230,252,.3)' }}>
                                    <p className='text-[#a6a6a6] text-[11px] font-semibold'>Total deposit</p>
                                    <div className='flex items-end gap-[4px]'>
                                        <div className='flex-1 flex flex-col gap-[2px]'>
                                            <div className='text-[#656565] text-[13px] font-bold'>
                                                ৳ {currentLevelData.current_deposit.toFixed(2)}
                                                <span className='text-[10px]'>/{currentLevelData.required_deposit.toFixed(2)}</span>
                                            </div>
                                            <div className='flex-1 flex gap-[17px]' style={{alignItems:'center'}}>
                                                <div className='flex-1 h-[0.3rem] border backdrop-blur-[0.04rem] flex items-center px-[0.04rem] py-[0.02rem] rounded-[0.8rem] border-solid border-[hsla(0,0%,95%,0.2)]'
                                                    style={{
                                                        background: 'hsla(0,0%,97%,.7)'
                                                    }}>
                                                    <div 
                                                        className='h-full bg-[#23e63a] rounded-[0.8rem]'
                                                        style={{ width: `${depositPercent}%` }}
                                                    ></div>
                                                </div>
                                                <div className='text-[#a6a39d] text-[10px] font-semibold'>{depositPercent}%</div>
                                                {isDepositCompleted ? (
                                                    <div className='bg-[#23e63a] rounded-3xl text-white text-[9px] px-2 py-1'>Completed</div>
                                                ) : (
                                                    <button 
                                                        onClick={handleGoToDeposit}
                                                        className='bg-[#333] min-w-[30px] text-center rounded-3xl text-white text-[9px] px-2 py-1'
                                                    >
                                                        GO
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='flex flex-col gap-[9px] p-[9px] bg-white'
                                    style={{ boxShadow: '0 0 .2rem 0 rgba(188,230,252,.3)' }}>
                                    <p className='text-[#a6a6a6] text-[11px] font-semibold'>Total bet</p>
                                    <div className='flex items-end gap-[4px]'>
                                        <div className='flex-1 flex flex-col gap-[2px]'>
                                            <div className='text-[#656565] text-[13px] font-bold'>
                                                ৳ {currentLevelData.current_bet.toFixed(2)}
                                                <span className='text-[10px]'>/{currentLevelData.required_bet.toFixed(2)}</span>
                                            </div>
                                            <div className='flex-1 flex gap-[17px]' style={{alignItems:'center'}}>
                                                <div className='flex-1 h-[0.3rem] border backdrop-blur-[0.04rem] flex items-center px-[0.04rem] py-[0.02rem] rounded-[0.8rem] border-solid border-[hsla(0,0%,95%,0.2)]'
                                                    style={{
                                                        background: 'hsla(0,0%,97%,.7)'
                                                    }}>
                                                    <div 
                                                        className='h-full bg-[#23e63a] rounded-[0.8rem]'
                                                        style={{ width: `${betPercent}%` }}
                                                    ></div>
                                                </div>
                                                <div className='text-[#a6a39d] text-[10px] font-semibold'>{betPercent}%</div>
                                                {isBetCompleted ? (
                                                    <div className='bg-[#23e63a] rounded-3xl text-white text-[9px] px-2 py-1'>Completed</div>
                                                ) : (
                                                    <button 
                                                        onClick={handleGoToHome}
                                                        className='bg-[#333] min-w-[30px] text-center rounded-3xl text-white text-[9px] px-2 py-1'
                                                    >
                                                        GO
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {completedCount === 2 && (
                                    <button
                                        onClick={handleCollectAndUpgrade}
                                        className='w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg mt-4'
                                    >
                                        Collect Reward & Upgrade
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className='flex justify-center mt-5'>
                            <IoIosCloseCircle
                                onClick={() => setUpgrade(false)}
                                className='text-[#f2f2f2] text-3xl' />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}