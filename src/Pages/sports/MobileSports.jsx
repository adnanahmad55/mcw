import React, { useEffect, useState } from "react";
import MobileHeader from "./MobileHeader";
import MobileFooter from "./MobileFooter";
import { useMatchAllLeaguesMutation, useMatchAllMatchesMutation, useTournamentsListMutation } from "../../redux/service/fetchMatch";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { setGameTab } from "../../redux/slice/sportsState.slice";

export default function MobileSports() {
    const gameTab = useSelector((state) => state.sportsState.gameTab);
    const [apiCallStatus, setApiCallStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tournamentsList] = useTournamentsListMutation();
    const [matchAllLeagues] = useMatchAllLeaguesMutation();
    const [matchAllMatches] = useMatchAllMatchesMutation();
    const [cricketData, setCricketData] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [activeTournament, setActiveTournament] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [allMatches, setAllMatches] = useState([]);


    const handleFetch = async () => {
        setApiCallStatus(false);
        const response = await tournamentsList({ sports_id: '', type: 'today' });
        if (response?.data?.status) {

            const newData = response?.data?.data || [];
            setCricketData(newData);
            setApiCallStatus(true);
            setLoading(false);

        } else {
            setCricketData([]);
            setLoading(false);
        }
    }
    const handleMatchAllLeagues = async () => {
        setApiCallStatus(false);
        const response = await matchAllLeagues({ sports_id: '', });
        if (response?.data?.status) {

            const newData = response?.data?.data || [];
            setCricketData(newData);
            setApiCallStatus(true);
            setLoading(false);


        } else {
            setCricketData([]);
        }
    }

    const handleMatchAllMatches = async () => {
        const response = await matchAllMatches({ sports_id: '', tournament_id: '' });
        if (response?.data?.status) {

            const newData = response?.data?.data || [];
            setAllMatches(newData);
        } else {
            setAllMatches([]);
        }
    }

    useEffect(() => {
        handleMatchAllLeagues();
        // handleFetch();
        handleMatchAllMatches();
    }, [])
    return (
        <>
            <MobileHeader />
            <div className="w-full bg-[#eee] min-h-[100vh]">
                <div
                    className="md:hidden w-full font-bold border-t-0 border-[#ccc] text-white text-center text-[3.7333333333vw] p-1 flex justify-center gap-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(-180deg, rgb(46, 75, 94), rgb(36, 58, 72) 82%)"
                    }}
                >
                    Highlights
                </div>
                <div className="bg-[#1e1e1e] w-full flex">
                    <div className="border-r w-full border-[#4b4b4b] py-[2.9333333333vw] px-[1.3333333333vw] text-white text-[3.2vw] text-center"
                        onClick={() => navigate('/mob-inplay')}>
                        <img src="assets/img/inplay-white.svg" className="mx-auto block w-[6.6666666667vw] mb-1" />
                        In-Play
                    </div>
                    <div className="border-r w-full border-[#4b4b4b] py-[2.9333333333vw] px-[1.3333333333vw] text-white text-[3.2vw] text-center"
                        onClick={() => navigate('/mob-inplay')}>
                        <img src="assets/img/multi-white.svg" className="mx-auto block w-[6.6666666667vw] mb-1" />
                        Multi Markets
                    </div>
                    <div className="border-r w-full border-[#4b4b4b] py-[2.9333333333vw] px-[1.3333333333vw] text-white text-[3.2vw] text-center"
                        onClick={() => { navigate('/mob-sport'); dispatch(setGameTab("4")); }}>
                        <img src="assets/img/Cricket-white.svg" className="mx-auto block w-[6.6666666667vw] mb-1" />
                        Cricket
                    </div>
                    <div className="border-r w-full border-[#4b4b4b] py-[2.9333333333vw] px-[1.3333333333vw] text-white text-[3.2vw] text-center"
                        onClick={() => { navigate('/mob-sport'); dispatch(setGameTab("1")); }}>
                        <img src="assets/img/Soccer-white.svg" className="mx-auto block w-[6.6666666667vw] mb-1" />
                        Soccer
                    </div>
                    <div className="border-r w-full border-[#4b4b4b] py-[2.9333333333vw] px-[1.3333333333vw] text-white text-[3.2vw] text-center"
                        onClick={() => { navigate('/mob-sport'); dispatch(setGameTab("2")); }}>
                        <img src="assets/img/Tennis-white.svg" className="mx-auto block w-[6.6666666667vw] mb-1" />
                        Tennis
                    </div>

                </div>

                {!selectedGame && <div
                    className="md:hidden w-full h-[12.2666666667vw] relative items-center font-bold border-t-0 border-[#ccc] text-white text-center text-[3.7333333333vw] p-1 flex justify-center gap-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(-180deg, rgb(46, 75, 94), rgb(36, 58, 72) 82%)"
                    }}
                >
                    <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-[12.8vw]"
                        style={{ background: 'linear-gradient(-180deg,#ffffff26,#00000026)', borderLeft: '1px solid rgba(255,255,255,.1)' }}>
                        <img src="assets/img/search.svg" />
                    </div>
                    All Sports
                </div>}

                {selectedGame && <div className="w-full bg-[#1e1e1e] font-bold text-white flex gap-2">
                    <div className="w-[10.6666666667vw] h-[10.6666666667vw] border-r border-[#4b4b4b]"
                        onClick={() => setSelectedGame('')}>
                        <img src="assets/img/backarrow.svg" />
                    </div>
                    <div className="flex items-center gap-1">All Sports <span className="opacity-70">{">"}</span>
                        <span className="text-[#2789ce]">{Number(selectedGame) === 4 ? 'Cricket' : Number(selectedGame) === 1 ? 'Soccer' : 'Tennis'}</span>
                        {/* <span className="opacity-70">{">"}</span> */}
                        {/* <span className="text-[#2789ce]">Test Matches</span> */}
                    </div>
                </div>}

                {!selectedGame && <div className="w-full">
                    <div className="w-full bg-white text-[4vw] p-[2.1333333333vw] text-[#2789ce] font-bold border-b bprder-[#e0e6e6] flex items-center justify-between"
                        onClick={() => setSelectedGame('4')}
                    >
                        Cricket
                        <div className="border border-[#e0e6e6] rounded-[1.0666666667vw] w-[6.4vw] h-[6.4vw] ">
                            <img src="assets/img/right.svg" />
                        </div>
                    </div>
                    <div className="w-full bg-white text-[4vw] p-[2.1333333333vw] text-[#2789ce] font-bold border-b bprder-[#e0e6e6] flex items-center justify-between"
                        onClick={() => setSelectedGame('1')}
                    >
                        Soccer
                        <div className="border border-[#e0e6e6] rounded-[1.0666666667vw] w-[6.4vw] h-[6.4vw] ">
                            <img src="assets/img/right.svg" />
                        </div>
                    </div>
                    <div className="w-full bg-white text-[4vw] p-[2.1333333333vw] text-[#2789ce] font-bold border-b bprder-[#e0e6e6] flex items-center justify-between"
                        onClick={() => setSelectedGame('2')}
                    >
                        Tennis
                        <div className="border border-[#e0e6e6] rounded-[1.0666666667vw] w-[6.4vw] h-[6.4vw] ">
                            <img src="assets/img/right.svg" />
                        </div>
                    </div>


                </div>}

                {selectedGame && (
                    <div className="w-full">
                        {cricketData
                            ?.filter((leagues) => leagues?.sports_api_id === String(selectedGame))
                            .map((leagues) => (
                                <div
                                    key={leagues?._id}
                                    className="w-full p-[2.1333333333vw] text-[#2789ce] font-bold border-b bprder-[#e0e6e6] bg-white"
                                >
                                    <div className="w-full bg-white text-[4vw]  flex items-center justify-between"
                                        onClick={() =>
                                            setActiveTournament(prev =>
                                                prev === leagues?.tournament_api_id ? null : leagues?.tournament_api_id
                                            )
                                        }
                                    >
                                        {leagues?.tournament_name}
                                        <div className="border border-[#e0e6e6] rounded-[1.0666666667vw] w-[6.4vw] h-[6.4vw] ">
                                            <img src="assets/img/right.svg" />
                                        </div>
                                    </div>

                                    {activeTournament === leagues?.tournament_api_id &&
                                        allMatches
                                            .filter(match => match?.tournament_api_id === leagues?.tournament_api_id)
                                            .map((match, idx) => (
                                                <div
                                                    key={idx}
                                                    className="w-full pl-[1.4rem] pt-[2.1333333333vw] bg-white text-[4vw] flex items-center justify-between"
                                                    onClick={() => navigate('/mob-match', { state: { matchId: match?.match_api_id, marketID: match?.market?.market_api_id } })}
                                                >
                                                    ➜ {match?.match_title}
                                                    <div className="border border-[#e0e6e6] rounded-[1.0666666667vw] w-[6.4vw] h-[6.4vw]">
                                                        <img src="assets/img/righticon.svg" />
                                                    </div>
                                                </div>
                                            ))
                                    }

                                </div>
                            ))}
                    </div>
                )}



            </div>

            <MobileFooter />
        </>
    )
}