import { useState, useEffect } from 'react';
import redenvelope from '../../assets/img/ticket-type-redenvelope.webp'
import headImg from '../../assets/img/head.png'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { IoChevronBackCircleOutline, IoCloseCircleOutline, IoEllipseOutline, IoTimeOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom';

function CountdownTimer({ targetHours = 24 }) {
  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const difference = endOfDay - now;
    
    if (difference > 0) {
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  return (
      <div className="w-full flex flex-row justify-center gap-2 px-4 mb-2 mt-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <IoTimeOutline className="text-[#ffb30b] text-xl" />
          <span className="text-white text-sm font-medium">Remaining time</span>
        </div>
        
        <div className="flex justify-center items-center gap-2">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-md w-[40px] border border-[#4a4a4a] shadow-inner">
              <div className="text-white text-2xl font-bold text-center">
                {formatNumber(timeLeft.hours)}
              </div>
            </div>
            <div className="text-[#999] text-xs mt-1">hr</div>
          </div>

          <span className="text-white text-2xl font-bold mb-5">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-md w-[40px] border border-[#4a4a4a] shadow-inner">
              <div className="text-white text-2xl font-bold text-center">
                {formatNumber(timeLeft.minutes)}
              </div>
            </div>
            <div className="text-[#999] text-xs mt-1">min</div>
          </div>

          <span className="text-white text-2xl font-bold mb-5">:</span>

          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-md w-[40px] border border-[#4a4a4a] shadow-inner">
              <div className="text-white text-2xl font-bold text-center">
                {formatNumber(timeLeft.seconds)}
              </div>
            </div>
            <div className="text-[#999] text-xs mt-1">sec</div>
          </div>
        </div>
      </div>
  );
}

export default function Rewards1({ onClose }) {
    const [mainModal, setMainModal] = useState(true)
    const [linkModal, setLinkModal] = useState(false);

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

  return (
    <div>
      {mainModal && (
        <div className='bg-[#000000cc] fixed top-0 bottom-0 left-0 right-0 z-50'>
          <div className='w-full p-2 relative'>
              <IoCloseCircleOutline
                className='text-white absolute right-4 text-4xl top-4 z-50 cursor-pointer'
                onClick={onClose}
              />
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
              <div className='w-full'>
                <CountdownTimer/>
              </div>
              <div className='w-full flex justify-center px-1'>
                  <img src={redenvelope} className='w-full' />
              </div>
              <div className='flex justify-center'>
                  <button className='w-[190px] text-center text-[#d63000] h-[32px] text-[16px] rounded-3xl'
                      style={{
                          background: 'transparent linear-gradient(180deg,#fff,#ffa80f) 0 0 no-repeat padding-box'
                      }}
                      onClick={() => {
                          setLinkModal(true)
                          setMainModal(false)
                      }}
                  >Claim</button>
              </div>
              <div className='h-[20px] flex items-center mt-4 mx-9 px-[5px] py-0 rounded-3xl border-[1.44px] border-solid border-[#707070]'
                style={{ background: '#262626 0 0 no-repeat padding-box' }}>
                <div className='h-[10px] w-full text-white text-right leading-none text-[12px] rounded-3xl border-0'
                    style={{
                        background: 'transparent  0 0 no-repeat padding-box'
                    }}>0.00%</div>
              </div>
              <div className='w-full flex justify-center'>
                  <div className='ticket-rank-wrap2'>
                      <div className='px-4 overflow-hidden h-[68px]'>
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

      {linkModal && (
        <div className='bg-[#000000cc] fixed top-0 bottom-0 left-0 right-0 z-50'>
          <div className='w-full p-2 relative'>
              <IoChevronBackCircleOutline
                  className='text-white absolute left-4 text-4xl z-50 top-4 cursor-pointer'
                  onClick={() => {
                    setLinkModal(false)
                    setMainModal(true)
                  }}
                />
              <IoCloseCircleOutline
                className='text-white absolute right-4 text-4xl top-4 z-50 cursor-pointer'
                onClick={onClose}
              />
              <div className='claimHeaderTitle relative pt-[53px] flex justify-center'>
                  <div className='headerTitleInner'>Rewards</div>
              </div>
              <p className='text-white text-center text-sm my-4'>Complete the task to claim your ticket</p>
              <div className='h-[20px] flex items-center mt-2 mx-9 px-[5px] py-0 rounded-3xl border-[1.44px] border-solid border-[#707070]'
                style={{ background: '#262626 0 0 no-repeat padding-box' }}>
                <div className='h-[10px] w-full text-white text-right leading-none text-[12px] rounded-3xl border-0'
                    style={{
                        background: 'transparent  0 0 no-repeat padding-box'
                    }}>0.00%</div>
              </div>
              <div className='bg-neutral-600 text-white text-sm flex flex-row justify-around items-center mx-4 mt-7 py-3 rounded'>
                <p>Link a withdrawal card</p>
                <Link
                  to="/withdrawal"
                  onClick={onClose}
                  className='px-7 py-2 pt-[9px] leading-none rounded-full bg-[linear-gradient(179deg,rgb(245,184,25),rgb(242,161,31)_30%,rgb(235,106,45))]'>
                    Bind
                </Link>
              </div>
          </div>
        </div>
      )}

    </div>
  )
}
