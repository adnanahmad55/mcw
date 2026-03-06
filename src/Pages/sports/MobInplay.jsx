import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useMatchOddMutation, useTournamentsListMutation } from "../../redux/service/fetchMatch";
import { useNavigate } from "react-router-dom";




import MobileHeader from "./MobileHeader";
import MobileFooter from "./MobileFooter";
import InPlayIcon from "./InPlayIcon";
import WithOutInPlayIcon from "./WithOutInPlayIcon";
import MatchTime from "./MatchTime";
import SkeletonThemeLoader from "../../component/SkeletonThemeLoader";

export default function MobInplay() {
    const gameTab = useSelector((state) => state.sportsState.gameTab);
    const dispatch = useDispatch();
    const [seriesList, setSeriesList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [tournamentsList] = useTournamentsListMutation();
    const [keyType, setKeyType] = useState('inPlay');
    const [matchOdd] = useMatchOddMutation();
    const [cricketData, setCricketData] = useState([]);
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState("by Time");
    const [loading, setLoading] = useState(false);




    const handleFetch = async () => {
        setLoading(true);
        const response = await tournamentsList({ sports_id: '', type: keyType });
        if (response?.data?.status) {
            const newData = response?.data?.data || [];
            setCricketData(newData);
            setLoading(false);

        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleFetch();
    }, [gameTab, keyType]);

    const groupedData = {
        Cricket: cricketData.filter((t) => t.sports_api_id === "4"),
        Soccer: cricketData.filter((t) => t.sports_api_id === "1"),
        Tennis: cricketData.filter((t) => t.sports_api_id === "2"),
    };

    return (
        <>
            <MobileHeader />

            <div className="w-full min-h-[100vh] bg-white">


                <div className="md:hidden bg-[#172832] py-1 w-full text-white text-center text-[3.7333333333vw] p-1 flex justify-center gap-0"
                    style={{ backgroundImage: ' #172832' }}>
                    {/* {keyType === 'inPlay' ? ( */}
                    <div className="flex items-center gap-0 justify-center w-full border border-white rounded-[1.6vw] overflow-hidden">
                        <span onClick={() => setKeyType('inPlay')}
                            className={`${keyType === 'inPlay' ? 'bg-[#fff] text-[#172832]' : ''} w-full py-1 font-bold text-center`}>In-Play</span>
                        <span onClick={() => setKeyType('today')}
                            className={`${keyType === 'today' ? 'bg-[#fff] text-[#172832]' : ''} w-full py-1 font-bold text-center border-r border-l border-white`}>Today</span>
                        <span onClick={() => setKeyType('tomorrow')}
                            className={`${keyType === 'tomorrow' ? 'bg-[#fff] text-[#172832]' : ''} w-full py-1 font-bold text-center`}>Tomorrow</span>
                    </div>
                    {/* ) : 'Highlights'} */}
                </div>


                <div className="bg-white">
                    {Object.entries(groupedData).map(([sportName, tournaments]) => (
                        <div className="mb-7" key={sportName}>
                            {tournaments?.length > 0 && (

                                <div
                                    className="md:hidden w-full font-bold border-t border-[#ccc] text-white text-center text-[3.7333333333vw] p-1 flex justify-center gap-0"
                                    style={{
                                        backgroundImage:
                                            "linear-gradient(-180deg, rgb(46, 75, 94), rgb(36, 58, 72) 82%)"
                                    }}
                                >
                                    {sportName}
                                </div>
                            )}
                            {tournaments.map((tournament) =>
                                tournament.matchList.map((match, index) => (
                                    <div className="w-full" key={index}>
                                        {selectedFilter === 'by Competition' &&
                                            <div className="text-[#1e1e1e] font-bold text-[13px] border-y px-2 border-[#bfcad1] bg-[#eff3f5] py-1">
                                                {tournament.tournament_name}
                                            </div>
                                        }
                                        <div className="border-b border-[#e0e6e6] flex items-center justify-between p-1 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full block ${match?.in_play ? 'bg-[#6bbd11]' : 'bg-[#c5d0d7]'}`}></span>
                                                <div
                                                    onClick={() =>
                                                        navigate('/mob-match', {
                                                            state: {
                                                                matchId: match?.match_api_id,
                                                                marketID: match?.market?.market_api_id,
                                                            },
                                                        })
                                                    }>
                                                    <p className="m-0 flex gap-[1.3333333333vw] mb-2">
                                                        {match.in_play ? <InPlayIcon /> : <WithOutInPlayIcon />}
                                                        {match?.in_play ? (
                                                            <span className="text-[#508D0E] text-[3.2vw]">In-Play</span>
                                                        ) : (
                                                            <span className="text-[#777] text-[3.2vw]">
                                                                <MatchTime startTime={match?.start_time} />
                                                            </span>
                                                        )}
                                                    </p>
                                                    <strong className="text-[#2789ce] font-semibold">{match?.match_title}</strong>
                                                </div>
                                            </div>
                                            <a title="Add to Multi Markets" className="add-pin" style={{ cursor: 'pointer', width: 16 }}>
                                                <img src="assets/img/pin.svg" alt="Pin" />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ))}
                </div>
                {loading && <SkeletonThemeLoader />}
            </div>





            <MobileFooter />
        </>
    )
}