import React, { useEffect, useState } from "react";
import MobileHeader from "./MobileHeader";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import MobileFooter from "./MobileFooter";
import { useMatchOddMutation, useTournamentsListMutation } from "../../redux/service/fetchMatch";

import InPlayIcon from "./InPlayIcon";
import WithOutInPlayIcon from "./WithOutInPlayIcon";

// import { setInitiateApiCall } from "../../redux/slices/uiState.slice";
import MatchTime from "./MatchTime";
import { setGameTab } from "../../redux/slice/sportsState.slice";
import SkeletonThemeLoader from "../../component/SkeletonThemeLoader";

export default function SportsMobile() {
    const gameTab = useSelector((state) => state.sportsState.gameTab);
    const dispatch = useDispatch();
    const [seriesList, setSeriesList] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [tournamentsList] = useTournamentsListMutation();
    const [keyType, setKeyType] = useState('today');
    const [matchOdd] = useMatchOddMutation();
    const [cricketData, setCricketData] = useState([]);
    const navigate = useNavigate();
    const [oddsData, setOddsData] = useState({});
    const [betDetails, setBetDetails] = useState('');
    const [marketId, setMarketID] = useState('');
    const [matchId, setMatchId] = useState('');
    const [matchName, setMatchName] = useState('');
    const [betPlaceModal, setBetPlaceModal] = useState(false);
    const [betType, setBetType] = useState('');
    const [betPrice, setBetPrice] = useState('');
    const [runnerID, setRunnerID] = useState('');
    const [selectedFilter, setSelectedFilter] = useState("by Time");
    const [apiCallStatus, setApiCallStatus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(true);
    // const initiateApiCall = useSelector((state) => state.selectedCategoryUi.initiateApiCall);
    const [cachedData, setCachedData] = useState({
        cricket: null,
        soccer: null,
        tennis: null,
        all: null,
    });
    const [oddsCache, setOddsCache] = useState({
        cricket: null,
        soccer: null,
        tennis: null,
        all: null,
    });
    const [matchCounts, setMatchCounts] = useState({ cricket: 0, soccer: 0, tennis: 0 });

    const handleSelect = (value) => {
        setSelectedFilter(value);
    };

    const getGameKey = (gameTab) => {
        if (Number(gameTab) === 4) return "cricket";
        if (Number(gameTab) === 1) return "soccer";
        if (Number(gameTab) === 2) return "tennis";
        return "all";
    };

    



    const handleFetch = async () => {
        setLoading(true);
        const response = await tournamentsList({ sports_id: '', type: keyType });
        if (response?.data?.status) {
            const newData = response?.data?.data || [];
            setCricketData(newData);
            setApiCallStatus(true);
            setLoading(false);

            const matchCounts = {
                cricket: 0,
                soccer: 0,
                tennis: 0
            };

            newData.forEach(tournament => {
                tournament?.matchList?.forEach(match => {
                    switch (match.sports_api_id) {
                        case "4":
                        case 4:
                            matchCounts.cricket += 1;
                            break;
                        case "1":
                        case 1:
                            matchCounts.soccer += 1;
                            break;
                        case "2":
                        case 2:
                            matchCounts.tennis += 1;
                            break;
                        default:
                            break;
                    }
                });
            });

            setMatchCounts(matchCounts);


        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        // const key = getGameKey(gameTab);
        // if (cachedData[key]) {
        //     setCricketData(cachedData[key]);
        // }
        handleFetch();
    }, [keyType]);

    // useEffect(() => {
    //     if (!initiateApiCall) {
    //         dispatch(setInitiateApiCall(true));
    //     }
    // }, [initiateApiCall]);




    return (
        <>
            <MobileHeader />

            {loading && <div className="w-full min-h-[100vh] bg-white"><SkeletonThemeLoader /></div>}

            {!loading && cricketData ? <div className="w-full min-h-[100vh] bg-white">


                <div className="md:hidden w-full relative h-[12.2666666667vw] flex items-end"
                    style={{ backgroundImage: 'linear-gradient(180deg,#ffcc2e,#ffbd14)', borderBottom: '.7vw solid #070707', backgroundColor: '#1e1e1e' }}>
                    <div className="absolute search-icon-before top-0 bottom-0 right-0 z-10 text-white  flex items-center justify-center w-[12.8vw]"
                        // onClick={() => setKeyType('inPlay')}
                        style={{ background: 'linear-gradient(180deg,#525252,#2d2d2d)' }}><img src="assets/img/search.svg" /></div>
                    <ul className="flex overflow-auto gap-3 justify-between pr-[21.3333333333vw]">
                        <li className={`${Number(gameTab) === 4 ? 'text-[#ffb200]' : 'text-[#070707]'} font-bold flex items-center gap-1 relative`}
                            style={{ lineHeight: '9.6vw', padding: '0 1.8666666667vw', borderRadius: '1.6vw 1.6vw 0 0', background: `${Number(gameTab) === 4 ? 'linear-gradient(180deg,#474747,#070707)' : ''}` }}
                            onClick={() => dispatch(setGameTab('4'))}>
                            {Number(gameTab) === 4 ? <img src="assets/img/cricket.svg" className="w-5" /> : <img src="assets/img/cricket1.svg" className="w-5" />}Cricket
                            <span
                                id="tagLive"
                                className="flex absolute top-[0] right-[1.333vw] min-w-[9.333vw] h-[3.2vw] text-white text-center text-[2.666vw] leading-[3.2vw] rounded-[0.8vw] pr-[1.333vw] shadow-[0_0.266vw_0.8vw_rgba(0,0,0,0.5)]"
                                style={{
                                    backgroundImage: 'linear-gradient(180deg,#fb3434,#e80505)',
                                }}
                            >
                                <strong
                                    className="flex justify-center items-center h-full mr-[1.333vw] px-[0.533vw] rounded-l-[0.8vw]"
                                    style={{
                                        backgroundImage: 'linear-gradient(180deg,#fff,#eee 89%)',
                                    }}
                                >

                                    <span
                                        className="block w-[3.733vw] h-[2.133vw] bg-no-repeat bg-contain"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,<svg width='14' height='8' xmlns='http://www.w3.org/2000/svg'><g fill='rgb(255,0,0)' fill-rule='evenodd'><path d='M12.012 0l-.698.727c1.734 1.808 1.734 4.738 0 6.546l.698.727c2.117-2.207 2.117-5.79 0-8zM10.3 1.714l-.7.735c.967 1.014.967 2.66 0 3.673l.7.735c1.352-1.418 1.352-3.721 0-5.143zM1.588 0l.698.727c-1.734 1.808-1.734 4.738 0 6.546L1.588 8c-2.117-2.207-2.117-5.79 0-8zM3.3 1.714l.7.735c-.967 1.014-.967 2.66 0 3.673l-.7.735c-1.352-1.418-1.352-3.721 0-5.143z'/><circle cx='6.8' cy='4.4' r='1.6'/></g></svg>")`,
                                        }}
                                    ></span>
                                </strong>
                                {matchCounts?.cricket}
                            </span>
                        </li>

                        <li className={`${Number(gameTab) === 1 ? 'text-[#ffb200]' : 'text-[#070707]'} font-bold flex items-center gap-1 relative`}
                            style={{ lineHeight: '9.6vw', padding: '0 1.8666666667vw', borderRadius: '1.6vw 1.6vw 0 0', background: `${Number(gameTab) === 1 ? 'linear-gradient(180deg,#474747,#070707)' : ''}` }}
                            onClick={() => dispatch(setGameTab('1'))}>
                            {Number(gameTab) === 1 ? <img src="assets/img/soccer1.svg" className="w-5" /> : <img src="assets/img/soccer.svg" className="w-5" />}Soccer
                            <span
                                id="tagLive"
                                className="flex absolute top-[0] right-[1.333vw] min-w-[9.333vw] h-[3.2vw] text-white text-center text-[2.666vw] leading-[3.2vw] rounded-[0.8vw] pr-[1.333vw] shadow-[0_0.266vw_0.8vw_rgba(0,0,0,0.5)]"
                                style={{
                                    backgroundImage: 'linear-gradient(180deg,#fb3434,#e80505)',
                                }}
                            >
                                <strong
                                    className="flex justify-center items-center h-full mr-[1.333vw] px-[0.533vw] rounded-l-[0.8vw]"
                                    style={{
                                        backgroundImage: 'linear-gradient(180deg,#fff,#eee 89%)',
                                    }}
                                >

                                    <span
                                        className="block w-[3.733vw] h-[2.133vw] bg-no-repeat bg-contain"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,<svg width='14' height='8' xmlns='http://www.w3.org/2000/svg'><g fill='rgb(255,0,0)' fill-rule='evenodd'><path d='M12.012 0l-.698.727c1.734 1.808 1.734 4.738 0 6.546l.698.727c2.117-2.207 2.117-5.79 0-8zM10.3 1.714l-.7.735c.967 1.014.967 2.66 0 3.673l.7.735c1.352-1.418 1.352-3.721 0-5.143zM1.588 0l.698.727c-1.734 1.808-1.734 4.738 0 6.546L1.588 8c-2.117-2.207-2.117-5.79 0-8zM3.3 1.714l.7.735c-.967 1.014-.967 2.66 0 3.673l-.7.735c-1.352-1.418-1.352-3.721 0-5.143z'/><circle cx='6.8' cy='4.4' r='1.6'/></g></svg>")`,
                                        }}
                                    ></span>
                                </strong>
                                {matchCounts?.soccer}
                            </span></li>
                        <li className={`${Number(gameTab) === 2 ? 'text-[#ffb200]' : 'text-[#070707]'} font-bold flex items-center gap-1 relative`}
                            style={{ lineHeight: '9.6vw', padding: '0 1.8666666667vw', borderRadius: '1.6vw 1.6vw 0 0', background: `${Number(gameTab) === 2 ? 'linear-gradient(180deg,#474747,#070707)' : ''}` }}
                            onClick={() => dispatch(setGameTab('2'))}>
                            {Number(gameTab) === 2 ? <img src="assets/img/tennis1.svg" className="w-5" /> : <img src="assets/img/tennis.svg" className="w-5" />}Tennis
                            <span
                                id="tagLive"
                                className="flex absolute top-[0] right-[1.333vw] min-w-[9.333vw] h-[3.2vw] text-white text-center text-[2.666vw] leading-[3.2vw] rounded-[0.8vw] pr-[1.333vw] shadow-[0_0.266vw_0.8vw_rgba(0,0,0,0.5)]"
                                style={{
                                    backgroundImage: 'linear-gradient(180deg,#fb3434,#e80505)',
                                }}
                            >
                                <strong
                                    className="flex justify-center items-center h-full mr-[1.333vw] px-[0.533vw] rounded-l-[0.8vw]"
                                    style={{
                                        backgroundImage: 'linear-gradient(180deg,#fff,#eee 89%)',
                                    }}
                                >

                                    <span
                                        className="block w-[3.733vw] h-[2.133vw] bg-no-repeat bg-contain"
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,<svg width='14' height='8' xmlns='http://www.w3.org/2000/svg'><g fill='rgb(255,0,0)' fill-rule='evenodd'><path d='M12.012 0l-.698.727c1.734 1.808 1.734 4.738 0 6.546l.698.727c2.117-2.207 2.117-5.79 0-8zM10.3 1.714l-.7.735c.967 1.014.967 2.66 0 3.673l.7.735c1.352-1.418 1.352-3.721 0-5.143zM1.588 0l.698.727c-1.734 1.808-1.734 4.738 0 6.546L1.588 8c-2.117-2.207-2.117-5.79 0-8zM3.3 1.714l.7.735c-.967 1.014-.967 2.66 0 3.673l-.7.735c-1.352-1.418-1.352-3.721 0-5.143z'/><circle cx='6.8' cy='4.4' r='1.6'/></g></svg>")`,
                                        }}
                                    ></span>
                                </strong>
                                {matchCounts?.tennis}
                            </span>
                        </li>
                    </ul>
                </div>

                <div
                    className="md:hidden w-full font-bold border-t border-[#ccc] text-white text-center text-[3.7333333333vw] p-1 flex justify-center gap-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(-180deg, rgb(46, 75, 94), rgb(36, 58, 72) 82%)"
                    }}
                >
                    Highlights
                </div>

                <div className="md:hidden w-full flex justify-center items-center bg-[#eeeeee] py-2">
                    <div className="w-[80%] bg-[#e3e3e3] rounded-[1.6vw] flex justify-center"
                        style={{ boxShadow: 'inset 0 1px 3px #00000026' }}>
                        <div className={`${selectedFilter === 'by Time' ? 'bg-white text-[#0074c4]' : 'text-[#000]'}  h-[8vw] text-[3.2vw] rounded-[1.3333333333vw] font-bold flex items-center justify-center w-[50%]`}
                            style={{ boxShadow: '0 0 3px #00000026' }}
                            onClick={() => setSelectedFilter('by Time')}>by Time</div>
                        <div className={`${selectedFilter === 'by Competition' ? 'bg-white text-[#0074c4]' : 'text-[#000]'}  h-[8vw] text-[3.2vw] rounded-[1.3333333333vw] font-bold flex items-center justify-center w-[50%]`}
                            style={{ boxShadow: '0 0 3px #00000026' }}
                            onClick={() => setSelectedFilter('by Competition')}>by Competition</div>
                    </div>
                </div>

                <ul className="bg-white">
                    {cricketData?.filter((tournament) => tournament.sports_api_id === String(gameTab)).map((tournament) => {


                        return (

                            tournament.matchList.map((match, idx) => (
                                <li className="w-full" key={idx}>
                                    {selectedFilter === 'by Competition' &&
                                        <div className="text-[#1e1e1e] font-bold text-[13px] border-y px-2 border-[#bfcad1] bg-[#eff3f5] py-1">{tournament.tournament_name}</div>
                                    }
                                    <div className="border-b border-[#e0e6e6] flex items-center justify-between p-1 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full block ${match?.in_play ? 'bg-[#6bbd11]' : 'bg-[#c5d0d7]'} `}></span>
                                            <div
                                                onClick={() => navigate('/mob-match', { state: { matchId: match?.match_api_id, marketID: match?.market?.market_api_id } })}>
                                                <p className="m-0 flex gap-[1.3333333333vw] mb-2">
                                                    {match.in_play ? <InPlayIcon /> :
                                                        <WithOutInPlayIcon />}
                                                    {match?.in_play ? <span className="text-[#508D0E] text-[3.2vw] ">In-Play</span> :
                                                        <span className="text-[#777] text-[3.2vw] "><MatchTime startTime={match?.start_time} /></span>}
                                                </p>
                                                <strong className="text-[#2789ce] font-semibold">{match?.match_title}</strong>
                                            </div>

                                        </div>
                                        <a title="Add to Multi Markets" className="add-pin" style={{ cursor: 'pointer', width: 16 }}>
                                            <img src="assets/img/pin.svg" />
                                        </a>
                                    </div>
                                </li>
                            )))
                    }
                    )}

                </ul>

                {/* by Competition */}







            </div> : ''}



            <MobileFooter />

        </>
    )
}