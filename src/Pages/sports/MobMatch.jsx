import React, { useEffect, useRef, useState } from "react";
import { useMatchAdvScorecardMutation, useMatchBetHistoryMutation, useMatchMarketMutation, useMatchOddMutation, useMatchScoreBoardMutation, useMatchScorecardMutation, useMatchScoreLiveStreamMutation } from "../../redux/service/fetchMatch";
import { useLocation, useNavigate } from "react-router-dom";
import socket from "../../Utils/socketClient"
import MobileHeader from "./MobileHeader";
import MobileBetPlace from "./MobileBetPlace";
import MobileFooter from "./MobileFooter";
import axios from "axios";
import logo from '../../assets/logo.webp';
import { useSelector } from "react-redux";
import { FaLongArrowAltRight } from "react-icons/fa";


export default function MobMatch() {
    const { isLogin, username } = useSelector((state) => state.auth);
    const [matchScorecard] = useMatchScorecardMutation();
    const [matchScoreBoard] = useMatchScoreBoardMutation();
    const [matchAdvScorecard] = useMatchAdvScorecardMutation();
    const [matchScoreLiveStream] = useMatchScoreLiveStreamMutation();
    const [matchBetHistory] = useMatchBetHistoryMutation();
    const [htmlContent, setHtmlContent] = useState("");
    const [htmlContent1, setHtmlContent1] = useState(null);
    const location = useLocation();
    const matchId = location.state?.matchId || '';
    // const marketId = location.state?.marketID || '';
    const [matchData, setMatchData] = useState(null);
    const [matchMarket] = useMatchMarketMutation();
    const [matchOdd] = useMatchOddMutation();
    const [otherMarkets, setOtherMarkets] = useState([]);
    const [bbFancy, setBbFancy] = useState([]);
    const [tabMarkets, setTabMarkets] = useState([]);
    const [betDetails, setBetDetails] = useState('');
    const [marketId, setMarketID] = useState('');
    // const [matchId, setMatchId] = useState('');
    const [matchName, setMatchName] = useState('');
    const [betPlaceModal, setBetPlaceModal] = useState(false);
    const [betType, setBetType] = useState('');
    const [betPrice, setBetPrice] = useState('');
    const [runnerID, setRunnerID] = useState('');
    const navigate = useNavigate()
    const [iframeHtml, setIframeHtml] = useState("");
    const [matchLoaded, setMatchLoaded] = useState(false);
    const [apiCallStatus, setApiCallStatus] = useState(false);
    const [highlighted, setHighlighted] = useState({});
    const [betPlaceNumber, setBetPlaceNumber] = useState('');
    const [fancyBet, setFancyBet] = useState('premium cricket');
    const [highlightedBack, setHighlightedBack] = useState({});
    const previousBackPrices = useRef({});
    const [highlightedLay, setHighlightedLay] = useState({});
    const previousLayPrices = useRef({});
    const [iframeHtmlLive, setIframeHtmlLive] = useState("");
    const [profits, setBetProfits] = useState({});
    const betPlacePrice = useSelector((state) => state.betProfits.betPlacePrice);
    const [selectedRunnerId, setSelectedRunnerId] = useState('');
    const [selectedMarketId, setSelectedMarketId] = useState('');
    const fetchBetApi = useSelector((state) => state.betProfits.fetchBetApi);

    // console.log(matchId, 'matchId');


    const handleFetchScorecard = async () => {
        const response = await matchScorecard({ match_id: matchId, sportsName: 'cricket' });
        if (response.data?.status) {
            setHtmlContent(response.data.data);
        } else {
            console.log(response.data.message || "No scorecard found.");
        }
        // console.log('API Response:', response);
    }

    const fetchMatchScoreBoard = async () => {
        const response = await matchScoreBoard({ groupById: matchId, sportsName: 'cricket' });
        if (response.data?.status) {
            setHtmlContent1(response?.data?.data?.url);
        } else {
            console.log(response?.data?.message || "No scorecard found.");
        }
        // console.log('API Response:', response);
    }

    const fetchMatchScoreLiveStream = async () => {
        const response = await matchScoreLiveStream({ match_id: matchId, sportsName: 'cricket' });
        if (response.data?.status && response.data?.data) {
            setMatchLoaded(true);
            setIframeHtml(response.data.data);
        } else {
            console.log(response?.data?.message || "No scorecard found.");
        }
        // console.log('API Response:', response);
    }

    const fetchMatchBetHistory = async () => {
        const response = await matchBetHistory({});
        if (response.data?.status) {
            const profits = response.data?.profits || {};
            const matchIds = Array.isArray(matchId) ? matchId : [matchId];

            const filteredProfits = {};
            matchIds.forEach((id) => {
                if (profits[id]) {
                    filteredProfits[id] = profits[id];
                }
            });

            console.log("Filtered Profits:", filteredProfits);

            setBetProfits(filteredProfits);
        } else {
            setBetProfits({})
        }

    }

    useEffect(() => {
        fetchMatchBetHistory();
        handleFetchScorecard();
    }, [matchId, fetchBetApi])

    const handleFetchMarket = async () => {
        const response = await matchMarket({ match_id: matchId });
        if (response.data?.status) {
            setMatchData(response.data.data);
            setApiCallStatus(true);
        } else if (response?.error?.data?.status === false) {

            alert("❌ " + response.error.data.message);
            navigate('/sports')
        }
        else {

            alert("❌ Unknown Error Occurred");
            navigate('/sports')
        }
        // console.log('API Response:', response);
    }

    const matchAdvScorecardFetch = async () => {
        const response = await matchAdvScorecard({ match_id: matchId, sportsName: 'cricket' });
        if (response.data?.status) {
            const url = response.data.data.url;

            // ID extract karo
            const parsedUrl = new URL(url);
            const id = parsedUrl.searchParams.get('Id');

            if (id) {
                fetchStream(id);
            } else {
                console.log("❌ ID not found in URL.");
            }

        } else {
            console.log("❌ Failed to fetch advance scorecard");
        }
    }

    const fetchStream = async (id) => {
        if (!id) return;

        const finalApiUrl = `https://shubdxinternational.com/streaming/client-getstreaming?event_id=${id}-e`;

        try {
            const streamResponse = await axios.get(finalApiUrl);
            const streamData = streamResponse;
            // console.log(streamResponse.data, 'streamResponse');
            setIframeHtmlLive(streamResponse?.data?.url);


            // if (streamData && typeof streamData === "string" && streamData.includes("https://www.glivestreaming.com")) {
            //     const iframeHtml = `<iframe src="${streamData}" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>`;
            //     setIframeHtmlLive(iframeHtml);
            //     console.log(iframeHtml, 'iframeHtmliframeHtml');

            // } else {
            //     console.warn("❌ No valid stream URL found in response.");
            // }



            console.log("🎥 Stream Response:", streamData);
        } catch (error) {
            console.error("❌ Error fetching stream data:", error);
        }
    };

    useEffect(() => {
        matchAdvScorecardFetch();
        // handleFetchScorecard();
        // handleFetchMarket();
        fetchMatchScoreBoard();
        // fetchMatchScoreLiveStream();
    }, []);


    useEffect(() => {
        if (!matchId) return;

        // console.log("➡️ Joining match room:", matchId);
        socket.emit("join_room", { room_code: matchId });

        // Event listener
        const handleOddsUpdate = (data) => {
            if (data?.status && data?.match_id && data?.odds?.markets?.length) {
                // ✅ Pure match data direct socket se
                const matchDataFromSocket = {
                    match_id: data.match_id,
                    markets: data.odds.markets,
                };
                setMatchData(matchDataFromSocket);
            }
        };
        socket.on("match_odds_update", handleOddsUpdate);

        return () => {
            // console.log("⬅️ Leaving room:", matchId);
            socket.emit("leave_room", { room_code: matchId });
            socket.off("match_odds_update", handleOddsUpdate);
        };
    }, [matchId]);


    useEffect(() => {


        if (matchData?.markets?.length) {
            const tabs = matchData.markets.filter(
                (m) => m.market_title === "Match Odds" || m.market_title === "Tied Match" || m.market_title === "BOOKMAKER"
            );
            const bbData = matchData.markets.filter(
                (m) => m.op === "BB_FANCY"
            );
            const others = matchData.markets.filter(
                (m) => m.market_title !== "Match Odds" && m.market_title !== "Tied Match" && m.market_title !== "BOOKMAKER" && m.op !== "BB_FANCY"
            );

            checkAndHighlightBackPrices(tabs);
            checkAndHighlightBackPrices(bbData);
            checkAndHighlightBackPrices(others);
            checkAndHighlightLayPrices(tabs);
            checkAndHighlightLayPrices(bbData);
            checkAndHighlightLayPrices(others);

            setTabMarkets(tabs);
            setBbFancy(bbData);
            setOtherMarkets(others);
            // console.log(others, 'otherMarkets');

        }
    }, [matchData]);

    const checkAndHighlightLayPrices = (markets) => {
        const newHighlights = {};

        markets.forEach((market) => {
            market.runners?.forEach((runner) => {
                const currentPrice = runner?.lay?.[0]?.price;
                const prevPrice = previousLayPrices.current[runner.id];

                if (
                    currentPrice !== undefined &&
                    prevPrice !== undefined &&
                    currentPrice !== prevPrice
                ) {
                    newHighlights[runner.id] = true;

                    setTimeout(() => {
                        setHighlightedLay((prev) => {
                            const updated = { ...prev };
                            delete updated[runner.id];
                            return updated;
                        });
                    }, 100);
                }
                previousLayPrices.current[runner.id] = currentPrice;
            });
        });

        setHighlightedLay((prev) => ({ ...prev, ...newHighlights }));
    };

    const checkAndHighlightBackPrices = (markets) => {
        const newHighlights = {};

        markets.forEach((market) => {
            market.runners?.forEach((runner) => {
                const currentPrice = runner?.back?.[0]?.price;
                const prevPrice = previousBackPrices.current[runner.id];

                if (
                    currentPrice !== undefined &&
                    prevPrice !== undefined &&
                    currentPrice !== prevPrice
                ) {
                    newHighlights[runner.id] = true;

                    setTimeout(() => {
                        setHighlightedBack((prev) => {
                            const updated = { ...prev };
                            delete updated[runner.id];
                            return updated;
                        });
                    }, 100);
                }
                previousBackPrices.current[runner.id] = currentPrice;
            });
        });

        // Merge spark class info
        setHighlightedBack((prev) => ({ ...prev, ...newHighlights }));
    };

    const getProfit = (marketId, runnerName) => {
        if (!profits || typeof profits !== 'object') return 0;

        // Flatten all markets across all matchIds
        const allMarkets = Object.values(profits).flat(); // array of market objects

        const market = allMarkets.find((m) => m.market_id === marketId);

        if (!market || !Array.isArray(market.runners)) return null;

        const runner = market.runners.find((r) => r.runner === runnerName);


        return runner?.winPnl;
    };

    const getProfitForRunner = (marketId, runnerId) => {
        if (
            !betPlacePrice ||
            !betPrice ||
            !betType ||
            !selectedRunnerId ||
            selectedMarketId !== marketId
        )
            return null;

        if (betType === 'back') {
            return runnerId === selectedRunnerId ? (betPrice - 1) * betPlacePrice : -betPlacePrice;
        } else if (betType === 'lay') {
            return runnerId === selectedRunnerId ? -((betPrice - 1) * betPlacePrice) : betPlacePrice;
        }

        return null;
    };

    const safeToFixed = (val, digits = 2) => {
        const num = Number(val);
        return isNaN(num) ? '---' : Math.abs(num).toFixed(digits);
    };

    const getFancyProfitForRunner = (runnerId) => {
        if (!betPrice || !betPlacePrice || !selectedRunnerId) return null;
        if (runnerId !== selectedRunnerId) return null;

        return (betPrice * betPlacePrice) / 100;
    };

    return (
        <>
            <MobileHeader />
            <div className="w-full bg-[#eee] min-h-[100vh] pb-10">
                {/* {htmlContent1 && <div className="w-full" style={{ height: '200px' }}>
                    <iframe
                        src={htmlContent1}
                        title="Live Scorecard"
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                    ></iframe>
                </div>} */}
                {htmlContent && <div className="w-full" style={{ height: '200px' }}>
                    <div
                        className="scorecard-html-wrapper"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                </div>}


                {/* {matchLoaded && <div style={{ width: "100%", height: "250px" }}>
                    <div className='h-full' dangerouslySetInnerHTML={{ __html: iframeHtml }} />
                </div>} */}

                {iframeHtmlLive && <div className="relative" style={{ width: "100%", height: "250px" }}>
                    <iframe src={iframeHtmlLive} style={{ width: '100%', height: '100%' }} />
                    <div className="bg-black rounded p-1 absolute top-[31px] right-[5px] w-[72px]">
                        <img src={logo} className="w-100" />
                    </div>
                </div>}

                <div className="w-full my-4 px-2">
                    <span className="text-[#ffb200] font-bold rounded-[4.8vw] border-[#243a48] border text-[3.46667vw] py-[2.9333333333vw] px-[4vw]"
                        style={{ background: 'linear-gradient(180deg,#474747,#070707)', }}>Match Odds</span>
                </div>

                {tabMarkets?.map((market, index) => (<div className="w-full" key={index}>

                    <div className="w-full border-b border-[#7e97a7] flex bg-white">
                        <div className="w-[12.2666666667vw] bg-[#e0e6e6] items-center relative text-center flex justify-center">
                            <div className="absolute top-0 left-[10.4vw]" style={{
                                width: ' 0', height: ' 0', borderTop: ' 0px solid rgba(0, 0, 0, 0)', borderBottom: ' 9.3333333333vw solid rgba(0, 0, 0, 0)', borderLeft: ' 1.8666666667vw solid #e0e6e6'
                            }}></div>
                            <img src="assets/img/updown.svg" className="w-[6.6666666667vw] h-[6.6666666667vw]" />
                        </div>
                        <div className="text-[2.9333333333vw] items-end font-bold flex"
                            style={{ padding: '1.8666666667vw 1.8666666667vw .8vw', flex: '1' }}>
                            <img src="assets/img/market1.svg" />
                            <p className="m-0 text-[#1e1e1e] ml-1">
                                <span className="text-[2.9333333333vw] font-normal">{market.market_title}</span>
                                <span className="block text-left">{market?.runners?.length}</span>
                            </p>
                        </div>
                        <div className="w-[18.6666666667vw] font-bold text-[3.46667vw] flex justify-center items-end"
                            style={{ padding: '1.8666666667vw 1.8666666667vw .8vw' }}>Back</div>
                        <div className="w-[18.6666666667vw] font-bold text-[3.46667vw] flex justify-center items-end"
                            style={{ padding: '1.8666666667vw 1.8666666667vw .8vw' }}>Lay</div>
                    </div>
                    {market.runners.map((runner, runnerIndex) => {
                        const profit = getProfitForRunner(market.market_api_id, runner.id);
                        return (
                            <div className="w-full" key={runnerIndex}>
                                <div className="w-full flex justify-between bg-white border-b border-[#7e97a7]">
                                    <div className="text-[4vw] font-bold text-[#1e1e1e] flex items-center "
                                        style={{ padding: '1.3333333333vw 1.8666666667vw' }}>
                                        <div>
                                            {runner.name}
                                            {
                                                (() => {
                                                    const existingProfit = getProfit(market.market_api_id, runner.name);
                                                    const newProfit = betPlaceModal && isLogin && profit !== null ? profit : null;

                                                    if (existingProfit !== null && newProfit !== null) {
                                                        const existing = Number(existingProfit);
                                                        const current = Number(newProfit);
                                                        const combined = existing + current;

                                                        return (
                                                            <span className="flex items-center gap-1 text-xs" style={{ color: existing >= 0 ? 'green' : 'red' }}>
                                                                <FaLongArrowAltRight />
                                                                {Math.abs(existing.toFixed(2))} &gt; {Math.abs(combined.toFixed(2))}
                                                            </span>
                                                        );

                                                    } else if (existingProfit !== null) {
                                                        return (
                                                            <span className="flex items-center gap-1 text-xs" style={{ color: existingProfit >= 0 ? 'green' : 'red' }}>
                                                                <FaLongArrowAltRight />
                                                                {Math.abs(Number(existingProfit.toFixed(2)))}
                                                            </span>
                                                        );
                                                    } else if (newProfit !== null) {
                                                        return (
                                                            <span className="flex items-center gap-1 text-xs" style={{ color: newProfit >= 0 ? 'green' : 'red' }}>
                                                                {/* {Math.abs(Number(newProfit.toFixed(2)))} */}
                                                                <FaLongArrowAltRight />
                                                                {safeToFixed(newProfit)}
                                                            </span>
                                                        );
                                                    }
                                                    // else {
                                                    //     return '---';
                                                    // }
                                                })()
                                            }
                                        </div>
                                    </div>
                                    <div className={`flex relative ${runner?.status !== 'ACTIVE' && runner?.status !== '' ? 'pointer-events-none' : ''}`}
                                        onClick={() => { setMatchName(runner.name); setBetDetails(runner); setBetPlaceModal(true); setMarketID(market?.market_api_id); setRunnerID(runner?.id); setBetPlaceNumber(`${index}-${runnerIndex}`); }}>
                                        {runner?.status !== 'ACTIVE' && runner?.status !== '' &&
                                            <div className="bg-[#0006] absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center text-white text-xs uppercase"
                                                style={{ textShadow: '0 .2666666667vw 1.0666666667vw rgba(0,0,0,.5)' }}>{runner?.status}</div>}

                                        <div className={`${highlightedBack[runner.id] ? "spark-back" : ""} w-[18.6666666667vw] border-r border-white text-[#1e1e1e] p-[1.6vw] text-center bg-[#72bbef] min-h-[46px] font-bold`}
                                            onClick={() => { setBetPrice(runner?.back?.[0]?.price); setSelectedRunnerId(runner?.id); setSelectedMarketId(market?.market_api_id); setBetType('back') }}
                                        >
                                            {runner?.back[0]?.price}
                                            <span className="block text-center text-[2.9333333333vw] font-normal">{runner?.back[0]?.size || "--"}</span>
                                        </div>
                                        <div className={`${highlightedLay[runner.id] ? "spark-lay" : ""} w-[18.6666666667vw] border-r border-white text-[#1e1e1e] p-[1.6vw] text-center bg-[#faa9ba] min-h-[46px] font-bold`}
                                            onClick={() => { setBetPrice(runner?.lay?.[0]?.price); setSelectedRunnerId(runner?.id); setSelectedMarketId(market?.market_api_id); setBetType('lay') }}>
                                            {runner?.lay[0]?.price || "--"}
                                            <span className="block text-center text-[2.9333333333vw] font-normal">{runner?.lay[0]?.size || "--"}</span>
                                        </div>
                                    </div>

                                </div>

                                {betPlaceNumber === `${index}-${runnerIndex}` && betPlaceModal && <MobileBetPlace runnerID={runnerID} betType={betType} betPrice={betPrice} marketId={marketId} betDetails={betDetails} matchId={matchId} matchName={matchName} betPlaceModal={betPlaceModal} setBetPlaceModal={setBetPlaceModal} />}


                            </div>
                        )
                    })}
                    {/* {Number(betPlaceNumber) === Number(index) &&
                        <MobileBetPlace />} */}
                </div>))}

                <div className="w-full mt-4">
                    <div className="w-full flex">
                        <div className="flex"
                            onClick={() => setFancyBet('fancy bet')}>
                            <span className="bg-[#0a92a5] text-nowrap flex items-center gap-1 shadow-[inset 0 1px #0003] text-xs text-white pl-[8px] pr-[14px] inline-block">
                                <img src="assets/img/icon-irun.png" className="w-4" />Fancy Bet</span>
                            <img src="assets/img/btn-fancybet_rules.png" />
                        </div>
                        <div className="relative flex"
                            onClick={() => setFancyBet('premium cricket')}>
                            <p className={`${fancyBet === 'premium cricket' ? 'bg-[#e4550f]' : 'bg-[#243a48]'}  text-white relative m-0 shadow-[inset 0 1px #0003] font-bold text-xs px-8 flex items-center`}
                                style={{ borderRadius: '15px 15px 0 0' }}>Premium Cricket
                                <span className="tag-new absolute -top-3 -right-3">
                                    <svg className="fill-red-700" width="32" height="16" viewBox="0 0 32 16" xmlns="http://www.w3.org/2000/svg"><path d="M20 12l-7 4 1-4h-11c-1.657 0-3-1.343-3-3v-6c0-1.657 1.343-3 3-3h26c1.657 0 3 1.343 3 3v6c0 1.657-1.343 3-3 3h-9z" fill="%23D0021B" /></svg>
                                    <span className="absolute text-[9px] top-0 bottom-0 left-0 right-0 flex items-center justify-center pb-1">New</span>
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className={`w-full ${fancyBet === 'premium cricket' ? 'bg-[#e4550f]' : 'bg-[#098b9d]'} p-1 border-t border-[#0a92a5] flex justify-center`}
                        style={{
                            backgroundImage: fancyBet === 'premium cricket' ? '' : 'linear-gradient(180deg,#0a92a5 15%,#076875)',
                            boxShadow: 'inset 0 1px #0003',
                        }}>
                        <ul className={`m-0 ${fancyBet === 'premium cricket' ? 'bg-[#e4550f]' : 'bg-[#ffffff80]'}  rounded-md p-[2px] flex overflow-auto`}>
                            <li className="cursor-pointer text-[#076875] text-xs font-bold min-w-[74px] text-center px-1 py-[1px] bg-white rounded">All</li>
                            <li className={`cursor-pointer ${fancyBet === 'premium cricket' ? 'text-white' : 'text-[#076875]'} text-xs font-bold min-w-[74px] text-center px-1 py-[1px] rounded`}>Normal</li>
                            <li className={`cursor-pointer ${fancyBet === 'premium cricket' ? 'text-white' : 'text-[#076875]'} text-xs font-bold min-w-[74px] text-center px-1 py-[1px] rounded`}>Fancy1</li>
                            <li className={`cursor-pointer ${fancyBet === 'premium cricket' ? 'text-white' : 'text-[#076875]'} text-xs font-bold min-w-[74px] text-center px-1 py-[1px] rounded`}>Over</li>
                            <li className={`cursor-pointer ${fancyBet === 'premium cricket' ? 'text-white' : 'text-[#076875]'} text-xs font-bold min-w-[74px] text-center px-1 py-[1px] rounded`}>Ball by Ball</li>
                            <li className={`cursor-pointer ${fancyBet === 'premium cricket' ? 'text-white' : 'text-[#076875]'} text-xs font-bold min-w-[74px] text-center px-1 py-[1px] rounded`}>Khadda</li>
                            <li className={`cursor-pointer ${fancyBet === 'premium cricket' ? 'text-white' : 'text-[#076875]'} text-xs font-bold min-w-[74px] text-center px-1 py-[1px] rounded`}>Lottery</li>
                            <li className={`cursor-pointer ${fancyBet === 'premium cricket' ? 'text-white' : 'text-[#076875]'} text-xs font-bold min-w-[74px] text-center px-1 py-[1px] rounded`}>Odd/Even</li>
                        </ul>
                    </div>

                    <div className="w-full">
                        <div className="flex justify-between items-center border-t border-[#7e97a7] bg-white">
                            <div className="py-[3px] px-[10px] text-left font-bold border-r-0 text-black text-xs">
                                <p className="m-0 flex gap-1 items-center" />
                                {/* <div>England</div> */}
                                <p />
                            </div>
                            <div className="flex relative ">
                                <div className=" py-1 border-r border-r-white px-2 min-h-[39px] min-w-[60px] flex justify-center items-center">
                                    <div className="text-center text-[#1e1e1e] text-sm font-bold">No</div>
                                </div>
                                <div className=" py-1 border-r border-r-white px-2 min-h-[39px] min-w-[60px] flex justify-center items-center">
                                    <div className="text-center text-[#1e1e1e] text-sm font-bold">Yes</div>
                                </div>


                            </div>
                        </div>
                    </div>


                    {fancyBet === 'fancy bet' && bbFancy.map((market, i) => {
                        const validRunners = market.runners?.filter(runner => runner?.back?.[0] || runner?.lay?.[0]);
                        if (!validRunners || validRunners.length === 0) return null
                        return (
                            <div className="w-full" key={i}>
                                {/* <div className="bg-[#243a48] text-xs text-left p-1 border-b border-[#7e97a7]">{market?.market_title}</div> */}
                                {market.runners.map((runner, runnerIndexb) => (
                                    <>
                                        <div key={runnerIndexb} className="flex justify-between items-center border-t border-[#7e97a7] bg-white">
                                            <div className="py-[3px] px-[10px] text-left font-bold border-r-0 text-black text-xs">
                                                <p className="m-0 flex gap-1 items-center">
                                                    <div>
                                                        {runner.name}
                                                        {(() => {
                                                            const bfprofit = betPlaceModal && isLogin ? getFancyProfitForRunner(i + 1) : null;
                                                            const existingProfit = getProfit(market.market_api_id, runner.name);

                                                            if (existingProfit !== null && bfprofit !== null) {
                                                                const existing = Number(existingProfit);
                                                                const current = Number(bfprofit);
                                                                const combined = existing + current;

                                                                return (
                                                                    <span className="flex items-center gap-1 text-xs" style={{ color: combined >= 0 ? 'green' : 'red' }}>
                                                                        <FaLongArrowAltRight /> {safeToFixed(existing)} &gt; {safeToFixed(combined)}
                                                                    </span>
                                                                );
                                                            }

                                                            if (existingProfit !== null) {
                                                                return (
                                                                    <span className="flex items-center gap-1 text-xs" style={{ color: existingProfit >= 0 ? 'green' : 'red' }}>
                                                                        <FaLongArrowAltRight /> {safeToFixed(existingProfit)}
                                                                    </span>
                                                                );
                                                            }

                                                            if (bfprofit !== null) {
                                                                return (
                                                                    <span className="flex items-center gap-1 text-xs" style={{ color: bfprofit >= 0 ? 'green' : 'red' }}>
                                                                        <FaLongArrowAltRight /> {safeToFixed(bfprofit)}
                                                                    </span>
                                                                );
                                                            }

                                                            return null;
                                                        })()}
                                                    </div>
                                                </p>
                                            </div>

                                            <div className={`flex relative ${runner?.status !== 'ACTIVE' && runner?.status !== '' ? 'pointer-events-none' : ''}`}
                                                onClick={() => { setMatchName(runner.name); setBetDetails(runner); setSelectedRunnerId(i + 1); setSelectedMarketId(market?.market_api_id); setBetPlaceModal(true); setMarketID(market?.market_api_id); setRunnerID(runner?.id); setBetPlaceNumber(`${i + 1}-${runnerIndexb + 1}`); }}>
                                                {runner?.status !== 'ACTIVE' && runner?.status !== '' &&
                                                    <div className="bg-[#0006] absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center text-white text-xs uppercase"
                                                        style={{ textShadow: '0 .2666666667vw 1.0666666667vw rgba(0,0,0,.5)' }}>{runner?.status}</div>}
                                                <div className={`${highlightedLay[runner.id] ? "spark-lay" : ""} py-1 bg-[#faa9ba] border-r border-r-white px-2 min-h-[39px] min-w-[60px]`}
                                                    onClick={() => { setBetPrice(runner?.lay?.[0]?.price); setBetType('lay') }}>
                                                    <div className="text-center text-[#1e1e1e] text-base font-bold">{runner.lay[0]?.line}</div>
                                                    <div className="text-[12px] text-[#1e1e1e] text-center">{runner.lay[0]?.price}</div>
                                                </div>
                                                <div className={`${highlightedBack[runner.id] ? "spark-back" : ""} py-1 bg-[#72bbef] border-r border-r-white px-2 min-h-[39px] min-w-[60px]`}
                                                    onClick={() => { setBetPrice(runner?.back?.[0]?.price); setBetType('back') }}>
                                                    <div className="text-center text-[#1e1e1e] text-base font-bold">{runner?.back[0]?.line}</div>
                                                    <div className="text-[12px] text-[#1e1e1e] text-center">{runner?.back[0]?.price}</div>
                                                </div>


                                                <div className="w-24 text-center justify-center text-[11px] font-bold text-[#7e97a7] min-h-[39px] min-w-[60px] hidden md:flex items-center">Min/Max</div>
                                            </div>

                                        </div>
                                        {betPlaceNumber === `${i + 1}-${runnerIndexb + 1}` && betPlaceModal && <MobileBetPlace runnerID={runnerID} betType={betType} betPrice={betPrice} marketId={marketId} betDetails={betDetails} matchId={matchId} matchName={matchName} betPlaceModal={betPlaceModal} setBetPlaceModal={setBetPlaceModal} />}
                                    </>
                                ))}

                            </div>)
                    })}

                    {fancyBet === 'premium cricket' && otherMarkets.map((market, i) => {
                        const validRunners = market.runners?.filter(runner => runner?.back?.[0] || runner?.lay?.[0]);
                        if (!validRunners || validRunners.length === 0) return null
                        return (

                            <div className="w-full" key={i}>
                                <div className="bg-[#243a48] text-xs text-left p-1 border-b border-[#7e97a7] text-white">{market?.market_title}</div>
                                {market.runners.map((runner, runnerIndex) => {
                                    const profit = getProfitForRunner(market?.market_api_id, runner?.id);
                                    return (
                                        <div className="w-full" key={runnerIndex}>
                                            <div key={runner?.id} className="flex justify-between items-center border-t border-[#7e97a7] bg-white">
                                                <div className="py-[3px] px-[10px] text-left font-bold border-r-0 text-black text-xs">
                                                    <p className="m-0 flex gap-1 items-center">
                                                        <div>
                                                            {runner.name}
                                                            {
                                                                (() => {
                                                                    const existingProfit = getProfit(market.market_api_id, runner.name);
                                                                    const newProfit = betPlaceModal && isLogin && profit !== null ? profit : null;

                                                                    if (existingProfit !== null && newProfit !== null) {
                                                                        const existing = Number(existingProfit);
                                                                        const current = Number(newProfit);
                                                                        const combined = existing + current;

                                                                        return (
                                                                            <span className="flex items-center gap-1 text-xs" style={{ color: combined >= 0 ? 'green' : 'red' }}>
                                                                                <FaLongArrowAltRight /> {Math.abs(existing.toFixed(2))} &gt; {Math.abs(combined.toFixed(2))}
                                                                            </span>
                                                                        );

                                                                    } else if (existingProfit !== null) {
                                                                        return (
                                                                            <span className="flex items-center gap-1 text-xs" style={{ color: existingProfit >= 0 ? 'green' : 'red' }}>
                                                                                <FaLongArrowAltRight /> {Math.abs(Number(existingProfit.toFixed(2)))}
                                                                            </span>
                                                                        );
                                                                    } else if (newProfit !== null) {
                                                                        return (
                                                                            <span className="flex items-center gap-1 text-xs" style={{ color: newProfit >= 0 ? 'green' : 'red' }}>
                                                                                <FaLongArrowAltRight /> {safeToFixed(newProfit)}
                                                                            </span>
                                                                        );
                                                                    }
                                                                    // else {
                                                                    //     return '---';
                                                                    // }
                                                                })()
                                                            }
                                                        </div>
                                                    </p>
                                                </div>

                                                <div className={`flex relative ${runner?.status !== 'ACTIVE' && runner?.status !== '' ? 'pointer-events-none' : ''}`}
                                                    onClick={() => { setMatchName(runner.name); setBetDetails(runner); setBetPlaceModal(true); setMarketID(market?.market_api_id); setRunnerID(runner?.id); setBetPlaceNumber(`${i + 2}-${runner?.id}`); }}>
                                                    {runner?.status !== 'ACTIVE' && runner?.status !== '' &&
                                                        <div className="bg-[#0006] absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center text-white text-xs uppercase"
                                                            style={{ textShadow: '0 .2666666667vw 1.0666666667vw rgba(0,0,0,.5)' }}>{runner?.status}</div>}

                                                    <div className={`${highlightedLay[runner.id] ? "spark-lay" : ""} py-1 bg-[#faa9ba] border-r border-r-white px-2 min-h-[39px] min-w-[60px] cursor-pointer`}
                                                        onClick={() => { setBetPrice(runner?.lay?.[0]?.price); setSelectedRunnerId(runner?.id); setSelectedMarketId(market?.market_api_id); setBetType('lay') }}>
                                                        <div className="text-center text-[#1e1e1e] text-base font-bold">{runner.lay[0]?.price}</div>
                                                        <div className="text-[12px] text-[#1e1e1e] text-center">{runner.lay[0]?.size}</div>
                                                    </div>

                                                    <div className={`${highlightedBack[runner.id] ? "spark-back" : ""} py-1 bg-[#72bbef] border-r border-r-white px-2 min-h-[39px] min-w-[60px] cursor-pointer`}
                                                        onClick={() => { setBetPrice(runner?.back?.[0]?.price); setSelectedRunnerId(runner?.id); setSelectedMarketId(market?.market_api_id); setBetType('lay') }}>
                                                        <div className="text-center text-[#1e1e1e] text-base font-bold">{runner?.back[0]?.price}</div>
                                                        <div className="text-[12px] text-[#1e1e1e] text-center">{runner?.back[0]?.size}</div>
                                                    </div>

                                                    
                                                    <div className="w-24 text-center justify-center text-[11px] font-bold text-[#7e97a7] min-h-[39px] min-w-[60px] hidden md:flex items-center">Min/Max</div>
                                                </div>

                                            </div>
                                            {betPlaceNumber === `${i + 2}-${runner?.id}` && betPlaceModal && <MobileBetPlace runnerID={runnerID} betType={betType} betPrice={betPrice} marketId={marketId} betDetails={betDetails} matchId={matchId} matchName={matchName} betPlaceModal={betPlaceModal} setBetPlaceModal={setBetPlaceModal} />}
                                        </div>
                                    )
                                })}

                            </div>)
                    })}
                </div>

            </div>

            <MobileFooter />
        </>
    )
}