import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMatchBetHistoryMutation } from "../../redux/service/fetchMatch";
import SkeletonThemeLoader from "../../component/SkeletonThemeLoader";


export default function MobBets() {
    const [matchBetHistory] = useMatchBetHistoryMutation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState('false');
    const navigate = useNavigate();
    const [betInfo, setBetInfo] = useState(false);

    const goBack = () => {
        navigate(-1);
    };


    const fetchBetHistory = async () => {
        setLoading(true);
        const response = await matchBetHistory({});
        if (response?.data?.status) {
            setData(response.data.bets);
            setLoading(false);
        } else {
            console.log(response?.data?.message || "Error fetching data");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBetHistory();
    }, []);

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        const formattedDate = date.toLocaleDateString("en-GB");
        const formattedTime = date.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        return `${formattedDate} ${formattedTime}`;

    };

    const location = useLocation();

    return (
        <div className="w-full min-h-[100vh] bg-white">
            {/* Header */}
            {location.pathname.includes("/mob-bets") && (<div className="w-full flex items-center justify-between"
                style={{ background: 'linear-gradient(180deg,#474747,#070707)' }}>
                <div className="text-[#ffb200] text-[4vw] font-bold flex gap-1 items-center pl-[1.8666666667vw]">
                    Open Bets
                </div>
                <Link className="border-l border-[#be7809] py-[3.4666666667vw] px-[3.4666666667vw]" to="/">
                    <img src="assets/img/close1.svg" />
                </Link>
            </div>)}



            {/* Stake Header */}


            {/* Table Header */}
            <div className="w-full">
                {data?.length > 0 ? (
                    data.map((item, idx) =>
                        item.bets.map((b, i) => (
                            <div className="w-full mb-3" key={b._id}>
                                <div className="w-full bg-[#1e1e1e] font-bold text-white flex gap-2">
                                    <div className="w-[10.6666666667vw] h-[10.6666666667vw] border-r border-[#4b4b4b]"
                                        onClick={goBack}>
                                        <img src="assets/img/backarrow.svg" />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {b.match_name}
                                    </div>
                                </div>
                                <div className="px-[1.8666666667vw] md:hidden w-full font-bold border-t-0 border-[#ccc] text-white text-left text-[3.7333333333vw] p-1 flex justify-start gap-0"
                                    style={{
                                        backgroundImage: "linear-gradient(-180deg, rgb(46, 75, 94), rgb(36, 58, 72) 82%)"
                                    }}>
                                    Matched
                                </div>
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="text-center font-bold">
                                            <td className="text-left p-1">No</td>
                                            <td className="p-1">Run/Odds</td>
                                            <td className="p-1">Stake</td>
                                            <td className="p-1 text-end pr-2">Profit</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {betInfo === b._id && <tr>
                                            <td colSpan={4} className="text-left text-xs bg-[#e4f2fc] text-gray-500 p-1">
                                                Ref: {item?.market_id}{" "}
                                                {formatDateTime(b?.bet_time)}
                                            </td>
                                        </tr>}

                                        <tr className="w-full">
                                            <td className="bg-[#bedcf4] p-1 text-xs">
                                                <span className="font-bold">{b.side?.toUpperCase()}</span> <br />
                                                {b.selection_name}
                                            </td>
                                            <td className="bg-[#bedcf4] p-1 text-xs text-center">
                                                {b.rate} <br />
                                                {b.price}
                                            </td>
                                            <td className="bg-[#bedcf4] p-1 text-xs text-center">
                                                {b.stack_amount}
                                            </td>
                                            <td className="bg-[#bedcf4] p-1 pr-2 text-xs text-right">
                                                {b.return_amount}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4}>
                                                <div className="flex items-center">
                                                    <div className="flex items-center gap-2 text-xs p-1 text-gray-700"
                                                        onClick={() => setBetInfo(b._id)}>
                                                        <span className={`w-3 h-3 rounded-full block border border-[#2a8acf] ${betInfo === b._id ? 'bg-[#2a8acf]' : ''}`}></span>
                                                        Bet Info
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs p-1 text-gray-700"
                                                        onClick={() => setBetInfo(b._id + 1)}>
                                                        <span className={`w-3 h-3 rounded-full block border border-[#2a8acf] ${betInfo === b._id + 1 ? 'bg-[#2a8acf]' : ''}`}></span>
                                                        Time Order
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>


                                    </tbody>
                                </table>
                            </div>))
                    )) : (
                    <div className="text-center">
                        <span className="text-center text-gray-500 p-4">
                            {!loading && 'No bet history found.'}
                        </span>
                    </div>
                )}
            </div>
            {loading && <SkeletonThemeLoader />}
        </div>
    );
}
