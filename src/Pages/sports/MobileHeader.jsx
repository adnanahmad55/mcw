import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import socket from "../../Utils/socketClient"
import { setInitiateApiCall } from "../../redux/slice/sportsState.slice";

export default function MobileHeader() {
    const userName = useSelector(state => state.userName?.value);
    const walletBalance = useSelector(state => state.wallet?.value);
    const { isLogin, username } = useSelector((state) => state.auth);
    const [overlayState, setOverlayState] = useState(false);
    const [playerId, setPlayerId] = useState('');
    const operator_id = JSON.parse(localStorage.getItem('oprId'));
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {

        if (isLogin && !localStorage.getItem('initiatePlayerId')) {
            dispatch(setInitiateApiCall(true));
        }
    }, [isLogin, dispatch, navigate]);

    useEffect(() => {
        if (isLogin) {

            const id = JSON.parse(localStorage.getItem("initiatePlayerId"));
            setPlayerId(id);
        }
    }, [isLogin]);

    useEffect(() => {
        if (!isLogin || !playerId) return;

        console.log("✅ Using existing socket:", socket.id);
        socket.emit("log_in", { player_id: playerId, opr_id: operator_id });
        console.log("📤 Event -> log_in:", { player_id: playerId });

        const handleLoggedIn = (data) => {
            console.log("✅ Event -> logged_in:", data);
        };

        const handleUserUpdatedExposure = (data) => {
            console.log("✅ user_updated_exposure:", data);
            localStorage.setItem("totalExposure", data?.totalExposure || "0");
        };


        socket.on("logged_in", handleUserUpdatedExposure);
        socket.on("user_updated_exposure", handleUserUpdatedExposure);

        return () => {
            socket.off("logged_in", handleUserUpdatedExposure);
            socket.off("user_updated_exposure", handleUserUpdatedExposure);
        };
    }, [isLogin, playerId]);

    const handleRefresh = () => {
        setIsRefreshing(true);

        // Simulate loading delay (replace with actual API call)
        setTimeout(() => {

            setIsRefreshing(false);
        }, 1000);
    };

    return (
        <>
            <header className="top-0 border-b border-black h-[14.6666666667vw] left-0 w-full z-50 fixed flex items-center justify-between py-[2.6666666667vw] px-[1.8666666667vw]"
                style={{ background: 'linear-gradient(180deg,#013d72 0% 100%)', backgroundColor: '#d2d2d2' }}>
                <div className="flex min-w-[29.333vw] max-w-[31.2vw] -ml-px mr-[2.133vw]">
                    <Link className='flex items-center justify-center border border-black rounded-[1.066vw] bg-[#40493880] px-[1.866vw] py-[1.6vw] h-[9.866667vw]'
                        to="/"
                        style={{ border: '.2666666667vw solid' }}
                    >
                        <img src="assets/img/home.svg" className='w-[6.666vw] h-[5.066vw]' />
                    </Link>
                    {isLogin && <Link className="text-white gap-1 font-bold text-sm flex items-center justify-center border border-black rounded-[1.066vw] bg-[#40493880] px-[1.866vw] py-[1.6vw] h-[9.866667vw]"
                        to="/mob-bets"
                        style={{ margin: '0', boxShadow: 'inset 0 .2666666667vw #ffffff4d', borderRadius: '0 1.0666666667vw 1.0666666667vw 0', border: '.2666666667vw solid rgba(0,0,0,.25)' }}>
                        <img src="assets/img/bet.svg" />Bets
                    </Link>}
                </div>

                <div>
                    {isLogin && <div className="flex justify-between items-center">
                        <div

                            className="w-full max-w-xs h-full py-0.5 flex items-center justify-between"
                        >
                            {/* flex-col */}
                            {/* <p className="mb-1 text-header-text text-white">
                    @{userName}
                  </p> */}
                            <div className="text-xs">
                                <div className='text-right'>
                                    <span className="mr-1 text-header-dollar text-white opacity-70">
                                        Main
                                    </span>
                                    <span className="text-header-text text-wrap text-white font-bold">
                                        BDT {isRefreshing ? '...' : Number(localStorage.getItem('wallet_balance')).toFixed(2)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="mr-1 text-header-dollar text-white opacity-70">
                                        Exposure
                                    </span>
                                    <span className="text-header-exp bg-header-exp text-white font-bold">
                                        {isRefreshing ? '...' : localStorage.getItem('totalExposure')}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={`rounded-[1.066vw] bg-[#40493880] px-[1.866vw] py-[1.6vw] h-[9.866667vw] border p-1 ml-2 border-[#00000080] flex items-center justify-center
                    `}
                                style={{ boxShadow: 'inset 0 .2666666667vw #ffffff4d' }}
                                onClick={handleRefresh}
                            >
                                <img src="assets/img/refresh.svg" className={`${isRefreshing ? 'animate-spin' : ''} w-4`} />
                            </div>
                            <div className="ml-2">
                                <Link className='flex items-center justify-center border border-black rounded-[1.066vw] bg-[#40493880] px-[1.866vw] py-[1.6vw] h-[9.866667vw]'
                                    to="/mob-setting"
                                    style={{ border: '.2666666667vw solid' }}
                                >
                                    <img src="assets/img/setting.svg" />
                                </Link>
                            </div>
                        </div>
                        {/* <i

                  className="icon-refresh mr-1 ml-2.5 text-20 text-header-icon"
                /> */}
                    </div>}
                </div>

            </header>
            <div className="w-full flex mt-[14.6666666667vw]" style={{ backgroundImage: 'linear-gradient(180deg,#2a3a43 27%,#1c282d 83%)' }}>
                <div className="righticon_bg text-xs font-semibold flex gap-1 text-white">
                    <svg width="17" height="17" xmlns="http://www.w3.org/2000/svg"><g fill="rgb(255,255,255)" fillRule="nonzero"><path d="M8.5 10.083c1.519 0 2.75-1.195 2.75-2.669V2.67C11.25 1.195 10.019 0 8.5 0S5.75 1.195 5.75 2.67v4.744c0 1.474 1.231 2.67 2.75 2.67zM7.278 2.67c0-.654.548-1.186 1.222-1.186.674 0 1.222.532 1.222 1.186v4.745c0 .654-.548 1.186-1.222 1.186-.674 0-1.222-.532-1.222-1.186V2.67z" /><path d="M14 7.333h-1.447c0 2.36-1.818 4.278-4.053 4.278S4.447 9.692 4.447 7.333H3c0 2.942 2.085 5.374 4.776 5.75v.973h-2.46v1.527h6.368v-1.527h-2.46v-.973c2.69-.376 4.776-2.808 4.776-5.75z" /></g></svg> News
                </div>
            </div>
        </>
    )
}