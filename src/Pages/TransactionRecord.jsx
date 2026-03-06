import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import allGames from '../data/games.json'
import SkeletonThemeLoader from "../component/SkeletonThemeLoader";

export default function TransactionRecord({ }) {
    const [select, setSelect] = useState('Active');
    const { isLogin, username } = useSelector((state) => state.auth);
    // useCheckLogin('/transactions');

    const [pageNumber, setPageNumber] = useState(1);
    const [type, setType] = useState('all');
    const [data, setData] = useState([]);
    const [oprId, setOprId] = useState(null);
    const [playerId, setPlayerId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [gameList, setGameList] = useState([]);
    // const [filterModal, setFilterModal] = useState(false);
    const [gameFilter, setGameFilter] = useState(false);
    const [dayFilter, setDayFilter] = useState('today');
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const dateFilters = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Last 7 days", value: "date_range" },
    ];
    const [filters, setFilters] = useState({
        from: '',
        to: '',
        game: '',
        dateFilter: 'recent'
    });

    const getDateRange = (filterType) => {
        const today = new Date();
        let from = "";
        let to = today.toISOString().split("T")[0];

        if (filterType === "today") {
            from = to;
        } else if (filterType === "yesterday") {
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            from = yesterday.toISOString().split("T")[0];
            to = yesterday.toISOString().split("T")[0];
        } else if (filterType === "7days") {
            const last7 = new Date();
            last7.setDate(today.getDate() - 6);
            from = last7.toISOString().split("T")[0];
        }

        return { from, to };
    };

    useEffect(() => {
        const storedPlayerId = JSON.parse(localStorage.getItem('playerId'));
        const storedOprId = JSON.parse(localStorage.getItem('oprId'));

        if (storedPlayerId && storedOprId) {
            setPlayerId(storedPlayerId);
            setOprId(storedOprId);
        }
    }, []);


    useEffect(() => {

        axios.get(`${import.meta.env.VITE_APP_BASE_URL}/games`)
            .then(response => {
                setGameList(response.data);
            })
            .catch(error => {
                console.error("Error fetching game list", error);
            });
    }, []);

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

    const fetchData = async () => {
        if (!oprId || !playerId) return;

        setLoading(true);
        setError(null);

        try {

            const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URL}${import.meta.env.VITE_APP_BASE_URL_PORT}/transaction/history`, {
                operator_id: oprId,
                player_id: playerId,
                to: fromDate,
                from: toDate,
                game: filters.game,
                filter: dayFilter
            });

            // setData(response.data);

            // console.log(filteredData, 'filteredData');
            if (response?.data?.status) {
                const filteredData = response?.data?.data?.filter(
                    (item) =>
                        item.operation_type !== "deposit" &&
                        item.operation_type !== "withdraw" &&
                        item.game_code !== "MGP030119"
                );

                setData(filteredData);
                setLoading(false);
            }
        } catch (error) {
            setError("Error fetching transaction history.");
            console.error("Error fetching transaction history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (oprId && playerId) {
            fetchData();
        }
    }, [oprId, playerId, type, filters]);

    const changePage = (str) => {
        const totalPages = Math.ceil(data?.data?.length / 10);

        if (str === 'next' && pageNumber < totalPages) {
            setPageNumber(pageNumber + 1);
        } else if (str === 'prev' && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    useEffect(() => {
        // fetchBets();
        if (fromDate && toDate) {
            fetchData();
        }
    }, [fromDate, toDate]);

    const formatValue = (value) => {
        if (value == null || isNaN(value)) {
            return <>{"Invalid value"}</>;
        }

        if (value === 0) return <>{"0"}</>;

        const absValue = Math.abs(value);

        if (absValue >= 10000000) {
            return <>{(value / 10000000).toFixed(1) + "Cr"}</>;
        } else if (absValue >= 100000) {
            return <>{(value / 100000).toFixed(1) + "Lac"}</>;
        } else {
            return <>{value.toFixed(2)}</>;
        }
    };

    return (
        <>
            <div className="md:hidden block">
                {/* <h2 className="text-white relative text-[4.2666666667vw] md:text-yellow-400 flex justify-center items-center md:block text-center md:text-xl md:font-bold border-b border-[#706e6e] md:border-yellow-400 pb-2 mb-3 md:mb-6 bg-yellow-400  md:bg-transparent h-12 md:h-auto">
                    <Link
                        to="/"
                        className="opacity-70 absolute left-3 top-0 bottom-0 flex md:hidden items-center"><img src="assets/img/back.svg" className="w-2" /></Link>
                    Transactions Record
                </h2> */}
                <h2 className="text-white relative md:hidden text-[4.2666666667vw] md:text-yellow-400 flex justify-center items-center text-center md:text-xl md:font-bold border-0 border-[#706e6e] md:border-yellow-400 pb-2 mb-0 md:mb-6 bg-[#C9A33D]  md:bg-transparent h-12 md:h-auto">
                    <Link
                        to="/"
                        onClick={() => setGameFilter(false)}
                        className="opacity-70 absolute left-3 top-0 bottom-0 flex md:hidden items-center"><img src="assets/img/back.svg" className="w-2" /></Link>
                    Casino Betting Records              </h2>


            </div>
            



                <div className="w-full bg-black md:bg-[#313131] rounded p-4 my-4">

                    <div className="flex justify-between items-center border-b border-dashed border-white pb-3 mb-3">
                        <p className="mb-0 relative flex items-center text-white">
                            <span className="w-1 h-[15px] inline-block bg-[#aa0019] mr-2"></span>
                            <strong className="font-m"> Casino Betting Records</strong>
                        </p>

                        {/* <div className="flex">
                                    <button className={`${select == "Active" ? 'bg-yellow-400 text-black' : 'bg-[#464646] text-white'} min-w-[160px] py-[.4375rem] px-[.3125rem] text-sm rounded shadow font-semibold text-center `}
                                        onClick={() => setSelect("Active")} >Active</button>
                                    <button className={`${select == "Completed" ? 'bg-yellow-400 text-black' : 'bg-[#464646] text-white'} min-w-[160px] py-[.4375rem] px-[.3125rem] text-sm rounded shadow font-semibold text-center `}
                                        onClick={() => setSelect("Completed")}>Completed</button>
                                </div> */}
                    </div>

                    <div className="flex justify-between items-center md:hidden mb-2">
                        <div className="bg-white capitalize text-black text-[3.2vw] px-[2.6666666667vw] rounded-[.8vw]"> {dayFilter === 'date_range' ? 'Last 7 days' : dayFilter} </div>
                        <div className="bg-[#4e4e4e] rounded w-[13.3333333333vw] h-[12.8vw] flex items-center justify-center"
                            onClick={() => setGameFilter(true)}>
                            <img src="assets/img/games-filter-icon.svg" />
                        </div>
                    </div>

                    {/* <div className="flex w-full justify-center">
                        <img src="assets/img/img_deposit.svg" />
                    </div>
                    <p className="w-full text-center text-white text-base">No Data</p> */}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {/* <div className="">
                            <div className="form-group">
                                <select
                                    name="dateFilter"
                                    value={filters.dateFilter} onChange={handleFilterChange}
                                    className="w-full bg-[#4e4e4e] text-white rounded p-2"
                                >
                                    <option value="recent" defaultValue>Recent</option>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="current_week">Current Week</option>
                                    <option value="last_week">Last Week</option>
                                    <option value="current_month">Current Month</option>
                                    <option value="last_month">Last Month</option>
                                    <option value="last_six_month">Last 6 Months</option>
                                    
                                </select>
                            </div>
                        </div> */}

                        {/* <div className="">
                            <div className="form-group">
                                <select
                                    className="w-full bg-[#4e4e4e] text-white rounded p-2" name="game"
                                    value={filters.game}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">All Games</option>
                                    {allGames.length > 0 && allGames?.map((doc, index) => (
                                        <option key={index} value={doc?.gameCode}>
                                            {doc?.gameName} ({doc?.gameCode})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div> */}

                        {/* <div className="">
                            <label>From</label>
                            <input
                                type="date"
                                name="from"
                                value={filters.from}
                                onChange={handleFilterChange}
                                className="w-full bg-[#4e4e4e] text-white rounded p-2"
                            />
                        </div> */}
                        {/* <div className="">
                            <label>To</label>
                            <input
                                type="date"
                                name="to"
                                value={filters.to}
                                onChange={handleFilterChange}
                                className="w-full bg-[#4e4e4e] text-white rounded p-2"
                            />
                        </div> */}

                    </div>


                    <div className="w-full overflow-auto">
                        {loading && (
                            <div className="mt-4">
                                <SkeletonThemeLoader />
                            </div>
                        )}
                        {/* // ) : error ? (
                        //     <div className="text-center text-white">{error}</div>
                        // ) : (
                        //     <table className="w-full text-white text-sm mt-5 border border-[#686565] border-collapse">
                        //         <thead>
                        //             <tr className="bg-[#4e4e4e]">
                        //                 <th className="px-4 py-2 text-left border border-[#686565]">Date</th>
                        //                 <th className="px-4 py-2 text-left border border-[#686565]">Time</th>
                        //                 <th className="px-4 py-2 text-left border border-[#686565]">Remark (Description)</th>
                        //                 <th className="px-4 py-2 text-left border border-[#686565]">Transaction Amount</th>
                        //             </tr>
                        //         </thead>
                        //         <tbody>
                        //             {data?.data?.length > 0 && data.data.map((transaction, i) => (
                        //                 i >= (pageNumber - 1) * 10 && i < pageNumber * 10 && (
                        //                     <tr key={i}>
                        //                         <td className="px-4 py-2 border border-[#686565]">{transaction.created_on.split(',')[0]}</td>
                        //                         <td className="px-4 py-2 border border-[#686565]">{transaction.created_on.split(',')[1]}</td>
                        //                         <td className="px-4 py-2 border border-[#686565]">{transaction.transaction_details.remarks}</td>
                        //                         <td className={`px-4 py-2 border border-[#686565] ${transaction.transaction_type === "1" || transaction.transaction_type === "4" ? 'text-danger' : transaction.transaction_type === "2" ? 'text-success' : 'text-warning'}`}>
                        //                             {transaction.transaction_type === "1" ? '-' : "+"}{transaction.amount}
                        //                         </td>
                        //                     </tr>
                        //                 )
                        //             ))}
                        //             {data?.data?.length === 0 && (
                        //                 <tr>
                        //                     <td colSpan={4} className="text-center px-4 py-2 border border-[#686565]">
                        //                         No transactions available
                        //                     </td>
                        //                 </tr>
                        //             )}
                        //         </tbody>
                        //     </table>
                        // )} */}
                    </div>


                    {data?.length > 0 ? (
                        data?.map((doc, idx) =>
                            <div className="bg-[#222424] rounded mb-3" key={idx}>
                                <div className="w-w-full p-2 border-bottom">
                                    <p className="mb-0 text-white relative flex items-center f-14">
                                        <span className="me-2 bg-white h-4 w-1"></span>
                                        <strong className='capitalize'>{doc?.game_name || doc?.game_code}</strong>
                                    </p>
                                </div>
                                <div className="w-100 p-3">
                                    <ul className="game_data_list p-0">
                                        <li className="flex items-center justify-between text-white my-0">
                                            Date <span>{doc?.created_on?.split(',')[0]}</span>
                                        </li>
                                        <li className="flex items-center justify-between text-white my-2">
                                            Time <span>{doc?.created_on?.split(',')[1]}</span>
                                        </li>
                                        <li className="flex items-center justify-between text-white my-2">
                                            Transaction Amount <span>{doc?.amount}</span>
                                        </li>
                                        <li className="flex items-center justify-between flex-wrap text-white my-2">
                                            Remark (Description) <span>{doc?.transaction_details?.remarks}</span>
                                        </li>
                                        {/* <li className="flex items-center justify-between flex-wrap text-white my-2">
                                                Status <span>{Number(transaction?.transaction_type) === 1
                                                    ? <><img src="assets/img/check.png" width="16" /></>
                                                    : <><img src="assets/img/cross.png" width="16" /> </>}
                                                </span>
                                            </li> */}
                                    </ul>
                                </div>
                            </div>
                        )
                    ) : (
                        <p className="text-gray-400">No transactions found.</p>
                    )}


                </div>

                {/* {gameFilter && (<div className="py-4 text-white fixed top-0 bottom-0 left-0 right-0 z-50 bg-[#141515]">
                    <h3 className="mb-3 border-b px-4 border-[#2b2c2c] font-bold flex items-center justify-between text-[#e2e6e9] pb-3 text-lg">Filter
                        <img src="./assets/img/icon-close.svg" />
                    </h3>
                    <div className="flex flex-col px-4">
                        <label className="text-[#e2e6e9] mb-3 w-full">
                            <input
                                type="radio"
                                name="dateFilter"
                                value="today"
                                checked={filters.dateFilter === "today"}
                                onChange={(e) =>
                                    setFilters({ ...filters, dateFilter: e.target.value })
                                }
                            />{" "}
                            Today
                        </label>
                        <label className="text-[#e2e6e9] mb-3 w-full">
                            <input
                                type="radio"
                                name="dateFilter"
                                value="yesterday"
                                checked={filters.dateFilter === "yesterday"}
                                onChange={(e) =>
                                    setFilters({ ...filters, dateFilter: e.target.value })
                                }
                            />{" "}
                            Yesterday
                        </label>
                        <label className="text-[#e2e6e9] mb-3 w-full">
                            <input
                                type="radio"
                                name="dateFilter"
                                value="7days"
                                checked={filters.dateFilter === "7days"}
                                onChange={(e) =>
                                    setFilters({ ...filters, dateFilter: e.target.value })
                                }
                            />{" "}
                            Last 7 days
                        </label>
                    </div>

                    

                    
                </div>)} */}


                {gameFilter && (<div className="w-full z-50 h-full fixed left-0 right-0 bottom-0 top-[0px] p-[2.6666666667vw] bg-[#191E32]">


                    <div className="text-white pb-[.1875rem] text-sm mt-4">
                        Date
                    </div>

                    <div className="grid grid-cols-3 gap-[6px]">
                        {dateFilters.map((filter, index) => {
                            const isActive = dayFilter === filter.value;
                            return (
                                <div
                                    key={index}
                                    onClick={() => { handleDayFilter(filter.value); }}
                                    className={`relative flex justify-center items-center ${isActive ? 'text-white bg-[#C9A33D] border-[#ffe43c]' : 'bg-[#445187] text-white border-[#ffffff80]'
                                        } text-[.8125rem] px-[.75rem] border-0 h-[32px] rounded cursor-pointer`}
                                >
                                    {filter.label}
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-white pb-[.1875rem] text-sm mt-4">
                        Game
                    </div>

                    <select
                        className="bg-[#445187] text-white border-[#ffffff80] w-full rounded p-2" name="game"
                        value={filters.game}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Games</option>
                        {allGames?.length > 0 && allGames?.map((doc, index) => (
                            <option key={index} value={doc?.gameCode}>
                                {doc?.gameName} ({doc?.gameCode})
                            </option>
                        ))}
                    </select>

                    <div className="grid grid-cols-2 gap-2 px-2 absolute bottom-0 left-0 w-full pb-3">
                        <button className="border border-[#454745] text-[#8d9aa5] h-[48px]"
                            onClick={() => setGameFilter(false)}> Clear all </button>
                        <button className="border border-[#aa0019] bg-[#aa0019] text-[#fff] h-[48px]"
                            onClick={() => setGameFilter(false)}>  Apply filters  </button>
                    </div>



                </div>)}

            
        </>
    )
}