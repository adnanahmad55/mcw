import React, { useEffect, useState } from "react";
import { useMatchBetPlaceMutation } from "../../redux/service/fetchMatch";
import { useDispatch, useSelector } from "react-redux";
// import { currentWalletBalance } from "../../redux/slices/walletBalance.slice";
import { setBetPlacePrice, setFetchBetApi } from "../../redux/slice/betProfits.slice";

export default function MobileBetPlace({ runnerID, betType, betPrice, marketId, betDetails, matchId, matchName, betPlaceModal, setBetPlaceModal }) {
    const [stakeValue, setStakeValue] = useState('');
    const [matchBetPlace] = useMatchBetPlaceMutation();
    const [loading, setLoading] = useState(false);
    const { isLogin, username } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setBetPlacePrice(stakeValue));
    }, [stakeValue]);

    const handlePlaceBet = async () => {
        const authData = JSON.parse(localStorage.getItem("auth"));

        const { token, username, userId } = authData;

        dispatch(setFetchBetApi(false))
        let playerId = userId || '000000';
        const oprId = import.meta.env.VITE_APP_OPERATOR_ID;
        if (!stakeValue) {
            alert("Please enter stake.");
            // alert(stakeValue)
            return;
        }
        // let playerId = localStorage.getItem('playerId') || '000000';
        playerId = playerId.replace(/^"|"$/g, '');
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        // const uniqueId = `${playerId}${timestamp}${randomStr}`;
        // const uniqueId = Date.now().toString().slice(-9);
        const uniqueId = (Date.now() % 1e9).toString().padStart(9, "1");

        // try {
        setLoading(true);
        const response = await matchBetPlace({ playerId, oprId, uniqueId, matchId, marketId, runnerID, stakeValue, betPrice, betType });
        if (response?.data?.status) {
            alert("✅ " + response.data.message);
            setLoading(false);
            // dispatch(currentWalletBalance(response?.data?.balance));
            localStorage.setItem('wallet_balance', JSON.stringify(response?.data?.balance))
            setStakeValue('');
            setBetPlaceModal(false);
            dispatch(setFetchBetApi(true));
        } else if (response?.error?.data?.status === false) {

            alert("❌ " + response.error.data.message);
            setBetPlaceModal(false);
        }
        else {

            alert("❌ " + response?.error?.data?.message);
            setBetPlaceModal(false);
        }

        setLoading(false);
    }
    return (
        <>
            {isLogin && betPlaceModal && (
                <div className="bg-[#f9e7eb] py-3 rounded-md mx-auto shadow-md text-sm font-medium">

                    <div className="flex items-center mt-1 py-1">
                        <div className="flex-1 mr-1 ">

                        </div>
                        <button className="w-9"></button>
                        <div className="w-14 text-right text-xs text-gray-600 pr-1">Min Bet:</div>
                        <button className="w-9"></button>
                    </div>



                    <div className="flex items-center mt-1 py-1 px-2">
                        <div className="flex-1 mr-1 bg-[#dcdcdc] border border-[#c6c3c4] rounded text-[#999999] text-center py-1 rounded-l-md text-lg">
                            {betPrice}
                        </div>
                        <button className="w-9 h-9 bg-[#dcdcdc] border border-[#c6c3c4] text-[22px] text-[#1f72ac] flex items-center justify-center "
                            disabled={Number(stakeValue) === 0}
                            onClick={() => setStakeValue(Number(stakeValue) - 1)}
                            style={{ borderRadius: '0.375rem 0 0 0.375rem' }}>
                            <img src="assets/img/mines.svg" />
                        </button>
                        <input
                            type="tel"
                            value={stakeValue}
                            onChange={(e) => setStakeValue(e.target.value)}
                            className="w-14 h-9 text-center border-t border-b border-[#c6c3c4] outline-none bg-yellow-100 text-lg"
                            style={{ boxShadow: 'inset 0 .2666666667vw 1.3333333333vw #a1802d99' }}
                        />
                        <button className="w-9 h-9 bg-[#dcdcdc] border border-[#c6c3c4] text-[22px] text-[#1f72ac] flex items-center justify-center"
                            onClick={() => setStakeValue(Number(stakeValue) + 1)}
                            // disabled={Number(stakeValue) === 0}
                            style={{ borderRadius: '0 0.375rem 0.375rem 0' }}>
                            <img src="assets/img/plus.svg" />
                        </button>
                    </div>

                    {/* Chips Row */}
                    <div className="flex mt-1">
                        {[1000, 5000, 10000, 20000, 25000, 50000].map((val) => (
                            <button
                                key={val}
                                onClick={() => setStakeValue(val)}
                                className="bg-[#145b7d] text-white py-1 text-center w-full border-r border-[#476a7f]"
                                style={{ background: 'linear-gradient(-180deg,#32617f 20%,#1f4258 91%)' }}
                            >
                                {val}
                            </button>
                        ))}
                    </div>


                    <div className="flex mt-1">


                        <div className="grid grid-cols-6 gap-0 w-full border-b border-gray-300">
                            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "00", "."].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setStakeValue((prev) => prev + val)}
                                    className="bg-white border-t border-l border-gray-300 py-2 text-center "
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                        <button
                            className="col-span-3 w-[76px] bg-white border border-gray-300 py-2 text-center  flex items-center justify-center"
                            onClick={() => setStakeValue((prev) => prev.slice(0, -1))}
                        >
                            <img src="assets/img/close.svg" />
                        </button>
                    </div>


                    <div className="flex gap-2 mt-2 px-2">
                        <button className="w-1/2 py-2 bg-white border border-gray-300 rounded-md"
                            onClick={() => { setBetPlaceModal(false); setStakeValue('') }}
                            style={{ background: 'linear-gradient(-180deg,#fff,#eee 89%)' }}>
                            Cancel
                        </button>
                        <button
                            className={`w-1/2 py-2 bg-gray-400 text-[#ffb200] rounded-md cursor-not-allowed ${loading || !stakeValue || Number(stakeValue) <= 0 ? 'opacity-70' : ''}`}
                            style={{ background: 'linear-gradient(180deg,#474747,#070707)' }}
                            onClick={handlePlaceBet}
                            disabled={loading || !stakeValue || Number(stakeValue) <= 0}
                        >
                            {loading ? "Placing..." : "Place Bet"}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}