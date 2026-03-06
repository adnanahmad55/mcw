import React from "react";
import DateFilterUi from "../component/DateFilterUi";
import SectionCard from "../component/SectionCard";
import BackHeader from "../component/BackHeader";

const ProfitAndLoss = () => {
    const allData = [
        { label: "Deposit", value: "0.00" },
        { label: "Bonus", value: "0.00" },
        { label: "Income", value: "0.00" },
        { label: "Withdrawal", value: "0.00" },
        { label: "Rebate", value: "0.00" },
        { label: "Expenses", value: "0.00" },
    ];

    const slotData = [
        { label: "Betting", value: "0.00" },
        { label: "Valid bet", value: "0.00" },
        { label: "Win amount", value: "0.00" },
        { label: "Rebate", value: "0.00" },
        { label: "Bonus", value: "0.00" },
    ];

    const liveData = [
        { label: "Betting", value: "0.00" },
        { label: "Valid bet", value: "0.00" },
        { label: "Win amount", value: "0.00" },
        { label: "Rebate", value: "0.00" },
        { label: "Bonus", value: "0.00" },
    ];

    return (
        <>
            <div className="bg-black">
                <BackHeader text="Profit and Loss" />
            </div>
            <div className="min-h-screen bg-gray-50 p-4 px-0 max-w-xl mx-auto">

                <DateFilterUi />

                <SectionCard icon="💰" title="All" data={allData} iconBg="bg-yellow-400" />
                <SectionCard icon="🎰" title="Slot" data={slotData} iconBg="bg-blue-400" />
                <SectionCard icon="🎥" title="Live" data={liveData} iconBg="bg-red-400" />
            </div>
        </>
    );
};

export default ProfitAndLoss;