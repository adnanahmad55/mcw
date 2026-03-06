import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MobBets from "./sports/MobBets";
import SkeletonThemeLoader from "../component/SkeletonThemeLoader";

const BettingRecord = () => {
  const [select, setSelect] = useState('Settled');
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dayFilter, setDayFilter] = useState('today');
  const [betStatus, setBetStatus] = useState('settled');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [tab, setTab] = useState("");
  const [gameFilter, setGameFilter] = useState(false);
  const betTabs = [
    { label: "Settled", value: "settled" },
    // { label: "Cancelled", value: "cancelled" },
    { label: "Unsettled", value: "unsettled" },
    { label: "Voided", value: "voided" },
  ];
  const dateFilters = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 days", value: "date_range" },
  ];

  const tabs = [
    { label: "Exchange", value: "exchange" },
    { label: "Bookmaker", value: "bookmaker" },
    { label: "Fancy", value: "fancy" },
    { label: "Sportsbook", value: "sportsbook" },
  ];


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchBets = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL_SPORT}spb/fetch-bets`, {
        operator_id: JSON.parse(localStorage.getItem('oprId')),
        player_id: JSON.parse(localStorage.getItem('initiatePlayerId')),
      });
      if (res.data?.status) {
        setBets(res.data?.bets || []);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const fetchBetHistory = async () => {
    setLoading(true);
    try {
      const requestData = {
        market: tab,
        dateFilter: dayFilter,
        to: fromDate,
        from: toDate,
        operator_id: JSON.parse(localStorage.getItem('oprId')),
        // bet_id: "890320408",
        bet_status: betStatus,
        player_id: JSON.parse(localStorage.getItem('initiatePlayerId')),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL_SPORT}spb/bet-history`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status) {
        setBets(response.data.bets);
        setLoading(false);

      } else {
        // handle error response
        console.error("Failed to fetch bets:", response.data.message);
        setLoading(false);
        setBets([]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setLoading(false);
      setBets([]);
    }
  };

  const handleDayFilter = (value) => {
    setDayFilter(value);

    if (value === 'date_range') {
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      const formatDate = (date) => date.toISOString().split('T')[0];

      setToDate(formatDate(sevenDaysAgo));
      setFromDate(formatDate(today));
    }

    if (value === 'today') {
      const today = new Date();
      const formatDate = (date) => date.toISOString().split('T')[0];
      setToDate(formatDate(today));
      setFromDate(formatDate(today));
    }

    if (value === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formatDate = (date) => date.toISOString().split('T')[0];
      setToDate(formatDate(yesterday));
      setFromDate(formatDate(yesterday));
    }
  };

  useEffect(() => {
    handleDayFilter(dayFilter);
  }, [dayFilter]);


  // useEffect(() => {
  //     const today = new Date();
  //     const sevenDaysAgo = new Date();
  //     sevenDaysAgo.setDate(today.getDate() - 7);

  //     const formatDate = (date) => date.toISOString().split('T')[0];

  //     setToDate(formatDate(today));
  //     setFromDate(formatDate(sevenDaysAgo));
  // }, []);


  useEffect(() => {
    // fetchBets();
    if (fromDate && toDate) {
      fetchBetHistory();
    }
  }, [fromDate, toDate, betStatus, tab]);

  return (
    <>
      <h2 className="text-white relative md:hidden text-[4.2666666667vw] md:text-yellow-400 flex justify-center items-center text-center md:text-xl md:font-bold border-0 border-[#706e6e] md:border-yellow-400 pb-2 mb-0 md:mb-6 bg-[#C9A33D]  md:bg-transparent h-12 md:h-auto">
        <Link
          to="/"
          onClick={() => setGameFilter(false)}
          className="opacity-70 absolute left-3 top-0 bottom-0 flex md:hidden items-center"><img src="assets/img/back.svg" className="w-2" /></Link>
        Batting Record
      </h2>
      <div className="flex md:hidden bg-[#C9A33D]">
        {betTabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setBetStatus(tab.value)}
            className={` 
        ${betStatus === tab.value ? ' text-white border-b-2 border-[#ffb80c]' : 'text-white'} 
        h-[2.1875rem] w-full px-[.625rem] text-[.875rem] cursor-pointer text-center 
         flex items-center justify-center hover:text-white`}
            style={{ borderRadius: '3px 3px 0 0' }}
          >
            {tab.label}
          </div>
        ))}
      </div>



      <div className="w-full bg-[#313131] rounded md:p-4 p-2 md:my-4">

        {/* Mobile View */}

        {betStatus !== 'unsettled' && (
          <>

            <div className="flex justify-between items-center md:hidden mb-0">
              <div className="bg-white capitalize text-black text-[3.2vw] py-1 px-[2.6666666667vw] rounded-[.8vw]"> {dayFilter === 'date_range' ? 'Last 7 days' : dayFilter} </div>
              <div className="bg-[#4e4e4e] rounded w-[13.3333333333vw] h-[12.8vw] flex items-center justify-center"
                onClick={() => setGameFilter(true)}>
                <img src="assets/img/games-filter-icon.svg" />
              </div>
            </div>

            {gameFilter && <div className="w-full z-20 h-full fixed left-0 right-0 bottom-0 top-[46px] p-[2.6666666667vw] bg-[#191E32]">
              <div className="text-white pb-[.1875rem] text-sm">
                Platform
              </div>

              <div className="grid grid-cols-3 gap-[6px]">
                {tabs.map((filter, index) => {
                  const isActive = tab === filter.value;
                  return (
                    <div
                      key={index}
                      onClick={() => { setTab(filter.value); setGameFilter(false); }}
                      className={`relative flex justify-center items-center ${isActive ? 'text-white bg-[#C9A33D] border-[#ffe43c]' : 'bg-[#445187] text-white border-[#ffffff80]'
                        } text-[.8125rem] px-[.75rem] border-0 h-[32px] rounded cursor-pointer`}
                    >
                      {filter.label}
                    </div>
                  );
                })}
              </div>

              <div className="text-white pb-[.1875rem] text-sm mt-4">
                Date
              </div>

              <div className="grid grid-cols-3 gap-[6px]">
                {dateFilters.map((filter, index) => {
                  const isActive = dayFilter === filter.value;
                  return (
                    <div
                      key={index}
                      onClick={() => { handleDayFilter(filter.value); setGameFilter(false); }}
                      className={`relative flex justify-center items-center ${isActive ? 'text-white bg-[#C9A33D] border-[#ffe43c]' : 'bg-[#445187] text-white border-[#ffffff80]'
                        } text-[.8125rem] px-[.75rem] border-0 h-[32px] rounded cursor-pointer`}
                    >
                      {filter.label}
                    </div>
                  );
                })}
              </div>

            </div>}

            {/* Mobile View End */}

            <div className="hidden md:flex justify-between items-center border-b border-dashed border-white pb-3 mb-3">
              <p className="mb-0 relative flex items-center text-white">
                <span className="w-1 h-[15px] inline-block bg-[#aa0019] mr-2"></span>
                <strong className="font-m"> Betting Records</strong>
              </p>
              {/* <div className="flex">
                            <button className={`${select == "Settled" ? 'bg-yellow-400 text-black' : 'bg-[#464646] text-white'} md:min-w-[160px] py-[.4375rem] px-[.3125rem] text-sm rounded shadow font-semibold text-center `}
                                onClick={() => setSelect("Settled")} >Settled</button>
                            <button className={`${select == "Unsettled" ? 'bg-yellow-400 text-black' : 'bg-[#464646] text-white'} md:min-w-[160px] py-[.4375rem] px-[.3125rem] text-sm rounded shadow font-semibold text-center `}
                                onClick={() => setSelect("Unsettled")}>Unsettled</button>
                        </div> */}
            </div>

            <div className="hidden md:flex border-b border-[#0088da]">
              {betTabs.map((tab, index) => (
                <div
                  key={index}
                  onClick={() => setBetStatus(tab.value)}
                  className={`hover:bg-[#0088da] 
        ${betStatus === tab.value ? 'bg-[#0088da] text-white' : 'bg-[#0088da33] text-[#ffffff80]'} 
        h-[2.1875rem] mr-[1px] px-[.625rem] text-[.875rem] cursor-pointer text-center 
        w-[9.375rem] flex items-center justify-center hover:text-white`}
                  style={{ borderRadius: '3px 3px 0 0' }}
                >
                  {tab.label}
                </div>
              ))}
            </div>

            <div className="hidden md:block mt-2 w-full">
              <div className="text-white pb-[.1875rem] text-sm">
                Platform
              </div>
              <div className="flex gap-[.625rem]">
                {tabs.map((filter, index) => {
                  const isActive = tab === filter.value;
                  return (
                    <div
                      key={index}
                      onClick={() => setTab(filter.value)}
                      className={`relative flex justify-center items-center w-[114.7px] ${isActive ? 'text-[#ffe43c] border-[#ffe43c]' : 'text-[#ffffff80] border-[#ffffff80]'
                        } text-[.8125rem] px-[.75rem] border h-[32px] rounded cursor-pointer`}
                    >
                      {filter.label}


                      {isActive && (
                        <>
                          <img
                            src="assets/img/icon-check.svg"
                            className="absolute bottom-1 right-[2px] w-[8px] z-10"
                            style={{ filter: 'invert(1)' }}
                          />
                          <div
                            className="absolute right-0 bottom-0 w-0 h-0 border-solid"
                            style={{
                              borderColor: 'transparent transparent #ffe43c',
                              borderWidth: '0 0 20px 20px',
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>


            <div className="hidden md:block mt-2 w-full">
              <div className="text-white pb-[.1875rem] text-sm">
                Date
              </div>
              <div className="flex gap-[.625rem]">
                {dateFilters.map((filter, index) => {
                  const isActive = dayFilter === filter.value;
                  return (
                    <div
                      key={index}
                      onClick={() => handleDayFilter(filter.value)}
                      className={`relative flex justify-center items-center w-[114.7px] ${isActive ? 'text-[#ffe43c] border-[#ffe43c]' : 'text-[#ffffff80] border-[#ffffff80]'
                        } text-[.8125rem] px-[.75rem] border h-[32px] rounded cursor-pointer`}
                    >
                      {filter.label}


                      {isActive && (
                        <>
                          <img
                            src="assets/img/icon-check.svg"
                            className="absolute bottom-1 right-[2px] w-[8px] z-10"
                            style={{ filter: 'invert(1)' }}
                          />
                          <div
                            className="absolute right-0 bottom-0 w-0 h-0 border-solid"
                            style={{
                              borderColor: 'transparent transparent #ffe43c',
                              borderWidth: '0 0 20px 20px',
                            }}
                          ></div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>


            {loading && <SkeletonThemeLoader />}

            <div className="w-full overflow-auto">


              {/* <table className="w-full text-white text-sm md:mt-5 border border-[#686565] border-collapse">
                                    <thead>
                                        <tr className="bg-[#4e4e4e]">
                                            <th className="px-4 py-2 text-left border border-[#686565]">Odds req.</th>
                                            <th className="px-4 py-2 text-left border border-[#686565]">Avg. Odds</th>
                                            <th className="px-4 py-2 text-left border border-[#686565]">Stake (PBU)</th>
                                            <th className="px-4 py-2 text-left border border-[#686565]">Bet ID</th>
                                            <th className="px-4 py-2 text-left border border-[#686565]">Bet Placed</th>
                                            <th className="px-4 py-2 text-left border border-[#686565]">Profit/Loss (PBU)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bets?.map((bet, index) => (
                                            <tr key={index} className="bg-[#4e4e4e]">
                                                <td className="px-4 py-2 text-left border border-[#686565]">{bet?.bet?.rate}</td>
                                                <td className="px-4 py-2 text-left border border-[#686565]">{bet?.bet?.fancy_rate}</td>
                                                <td className="px-4 py-2 text-left border border-[#686565]">{bet?.bet?.stack_amount}</td>
                                                <td className="px-4 py-2 text-left border border-[#686565]">{bet?.bet_id}</td>
                                                <td className="px-4 py-2 text-left border border-[#686565]">
                                                    {new Date(bet?.bet?.bet_time).toLocaleString()}
                                                </td>
                                                <td className={`px-4 py-2 text-left border border-[#686565] ${bet?.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {bet?.profitLoss}
                                                </td>
                                            </tr>
                                        ))}

                                        {bets?.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-gray-400">
                                                    <div className="flex w-full justify-center">
                                                        <img src="assets/img/img_deposit.svg" />
                                                    </div>
                                                    <p className="w-full text-center text-white text-base">No Data</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>

                                </table> */}

              <div className="space-y-4">
                {bets?.map((bet, index) => (
                  <div
                    key={index}
                    className="bg-[#222424] mt-3 text-white rounded-[3px] shadow-md p-4 mb-3 border-0 border-gray-700"
                  >
                    {/* Status & Time */}
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className={`text-xs font-medium px-3 py-1 rounded ${bet?.result === "Won"
                          ? "bg-green-200 text-green-700"
                          : bet?.result === "Lost"
                            ? "bg-red-200 text-red-700"
                            : "bg-yellow-200 text-yellow-700"
                          }`}
                      >
                        {bet?.result}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(bet?.bet?.bet_time).toLocaleString()}
                      </span>
                    </div>

                    {/* Match + Market */}
                    <div className="mb-2">
                      <p className="text-sm font-semibold">{bet?.bet?.match_name}</p>
                      <p className="text-xs text-gray-400">
                        {bet?.bet?.selection_name} - {bet?.bet?.section_team} ({bet?.bet?.side})
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400">Odds</p>
                        <p>{bet?.bet?.rate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Stake</p>
                        <p>{bet?.bet?.stack_amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Bet ID</p>
                        <p>{bet?.bet_id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Profit/Loss</p>
                        <p
                          className={`${bet?.profitLoss >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                        >
                          {bet?.profitLoss}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* No Data */}
                {bets?.length === 0 && !loading && (
                  <div className="text-center py-6 text-gray-400">
                    <div className="flex justify-center mb-2">
                      <img src="assets/img/img_deposit.svg" alt="No Data" />
                    </div>
                    <p className="text-white text-base">No Data</p>
                  </div>
                )}
              </div>


            </div>

            {/* <div className="w-full overflow-auto">

                        {!loading && bets?.length > 0 ? (
                            <table className="w-full text-white text-sm mt-5 border border-[#686565] border-collapse">
                                <thead>
                                    <tr className="bg-[#4e4e4e]">
                                        <th className="px-4 py-2 text-left border border-[#686565]">Bet ID</th>
                                        <th className="px-4 py-2 text-left border border-[#686565]">Match Name</th>
                                        <th className="px-4 py-2 text-left border border-[#686565]">Market</th>
                                        <th className="px-4 py-2 text-left border border-[#686565]">Selection</th>
                                        <th className="px-4 py-2 text-left border border-[#686565]">Bet Time</th>
                                        <th className="px-4 py-2 text-left border border-[#686565]">Stack Amount</th>
                                        <th className="px-4 py-2 text-left border border-[#686565]">Return Amount</th>
                                        <th className="px-4 py-2 text-left border border-[#686565]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bets?.map((bet) =>
                                        bet?.bets?.map((item) => (
                                            <tr key={item._id}>
                                                <td className="px-4 py-2 border border-[#686565]">{bet?.bet_id}</td>
                                                <td className="px-4 py-2 border border-[#686565]">{item?.match_name || item?.match_title}</td>
                                                <td className="px-4 py-2 border border-[#686565]">{item?.market_title}</td>
                                                <td className="px-4 py-2 border border-[#686565]">{item?.outcome}</td>
                                                <td className="px-4 py-2 border border-[#686565]">
                                                    {new Date(item?.bet_time).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-2 border border-[#686565]">{item?.stack_amount}</td>
                                                <td className="px-4 py-2 border border-[#686565]">{Number(item?.return_amount).toFixed(2)}</td>
                                                <td className="px-4 py-2 border border-[#686565]">{item?.status}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        ) :

                            <div>

                                <div className="flex w-full justify-center">
                                    <img src="assets/img/img_deposit.svg" />
                                </div>
                                <p className="w-full text-center text-white text-base">No Data</p>
                            </div>
                        }
                    </div> */}
          </>
        )}
        {betStatus === 'unsettled' && <MobBets />}





      </div>

    </>
  );
};

export default BettingRecord;