import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import axios from "axios";
import { useSelector } from "react-redux";

export default function Incomes({ data, loading }) {
    const { t } = useTranslation(); // Initialize translation function
    

    // if (loading) {
    //     return (
    //         <div className="max-w-md mx-auto bg-[#f6f6f6] rounded-[3px] shadow-md overflow-hidden p-4 text-center">
    //             Loading...
    //         </div>
    //     );
    // }

    // if (!data) {
    //     return (
    //         <div className="max-w-md mx-auto bg-[#f6f6f6] rounded-[3px] shadow-md overflow-hidden p-4 text-center text-red-500">
    //             Failed to load data
    //         </div>
    //     );
    // }

    // API response se stats bana rahe hain
    const stats = [
        { label: t('inviteFriends.invitationRewards'), value: `৳ ${data?.totalSummary?.invitationRewards || 0}` },
        { label: t('inviteFriends.achievementRewards'), value: `৳ ${data?.totalSummary?.achievementRewards || 0}` },
        { label: t('inviteFriends.depositRebate'), value: `৳ ${data?.totalSummary?.depositRebate || 0}` },
        { label: t('inviteFriends.bettingRebate'), value: `৳ ${data?.totalSummary?.bettingRebate || 0}` },
        { label: t('inviteFriends.registers'), value: data?.registers || 0 },
        { label: t('inviteFriends.validReferral'), value: data?.validReferral || 0 },
        { label: 'Depositors', value: data?.depositors || 0 }, // Using depositors from sidebar if available
    ];

    return (
        <div className="max-w-md mx-auto bg-[#f6f6f6] rounded-[3px] shadow-md overflow-hidden">
            {/* Today's Income */}
            <div className="px-4 py-3 border-b border-gray-200 text-center">
                <h2 className="text-gray-700 font-medium">
                    {t('inviteFriends.todaysIncome')}: <span className="text-blue-600">৳ {data?.totalIncome || 0}</span>
                </h2>
            </div>

            {/* Stats List */}
            <div
                className="px-4 py-3"
                style={{ background: "linear-gradient(180deg,#f3f7fb 0,#e0e9f1)" }}
            >
                {stats.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex justify-between items-center py-2 text-sm"
                    >
                        <span className="text-gray-600">{item?.label}</span>
                        <span className="text-blue-600 font-semibold">{item?.value}</span>
                    </div>
                ))}
            </div>

            {/* Banner */}
            {/* <img src="./assets/img/rewardsBg3.webp" className="w-full" alt="Rewards Banner" /> */}
        </div>
    );
}
