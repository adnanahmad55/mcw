import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import axios from "axios";

export default function ReferralEarningsRecords() {
    const { t } = useTranslation(); // Initialize translation function
    const [data, setData] = useState([]);
    const [type, setType] = useState(""); // filter type
    const [timeRange, setTimeRange] = useState("Recent"); // default
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const authData = JSON.parse(localStorage.getItem("auth"));
    const username = authData?.username;

    const fetchEarnings = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_PROMOTION_API}/promotion/referral-earnings-data`,
                {
                    params: {
                        username,
                        type,
                        time_range: timeRange,
                        from_date: fromDate,
                        to_date: toDate,
                    },
                }
            );
            if (res.data.subCode === 200) {
                setData(res.data.data);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, [username, type, timeRange, fromDate, toDate]);

    return (
        <div className="mt-4 space-y-4">
            {/* 🔹 Filters Section */}
            <div className="flex flex-wrap gap-3 items-center">
                {/* Type Filter */}
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm"
                >
                    <option value="">{t('inviteFriends.allTypes')}</option>
                    <option value="deposit-rebate">{t('inviteFriends.depositRebateOption')}</option>
                    <option value="betting-rebate">{t('inviteFriends.bettingRebateOption')}</option>
                    <option value="achievements">{t('inviteFriends.achievements')}</option>
                    <option value="invite-friend">{t('inviteFriends.inviteFriend')}</option>
                </select>

                {/* Time Range Filter */}
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="border px-3 py-2 rounded-md text-sm"
                >
                    <option value="Recent">{t('inviteFriends.recent')}</option>
                    <option value="Today">{t('inviteFriends.today')}</option>
                    <option value="Yesterday">{t('inviteFriends.yesterday')}</option>
                    <option value="Weekly">{t('inviteFriends.weekly')}</option>
                    <option value="date-range">{t('inviteFriends.custom')}</option>
                </select>

                {/* Date Range (only visible if Custom selected) */}
                {timeRange === "Custom" && (
                    <>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="border px-2 py-1 rounded-md text-sm"
                        />
                        <span>-</span>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="border px-2 py-1 rounded-md text-sm"
                        />
                    </>
                )}

                {/* Apply Button */}
                {/* <button
          onClick={fetchEarnings}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {t('inviteFriends.apply')}
        </button> */}
            </div>

            {/* 🔹 Table Section */}
            <div>
                <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-[#f5f6f7] text-black">
                        <tr>
                            <th className="px-4 py-2 text-left">{t('inviteFriends.registrationDate')}</th>
                            <th className="px-4 py-2 text-left">{t('inviteFriends.username')}</th>
                            <th className="px-4 py-2 text-left">{t('inviteFriends.amount')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.filter(item => item?.reward_status === "claimed").map((item) => (
                                <tr
                                    key={item._id}
                                    className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">
                                        {new Date(item.date_time).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">{item.ref_username}</td>
                                    <td className="px-4 py-2">৳ {item.reward_amt}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center py-4 text-gray-500">
                                    {t('inviteFriends.noDataFound')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
