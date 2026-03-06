import React from "react";
import BackHeader from "../component/BackHeader";

const data = [
    { label: "Slot", value: "0.0000", color: "bg-blue-500" },
    { label: "Live", value: "0.0000", color: "bg-purple-400" },
    { label: "Fish", value: "0.0000", color: "bg-teal-500" },
    { label: "Table", value: "0.0000", color: "bg-pink-400" },
    { label: "Sports", value: "0.0000", color: "bg-red-400" },
    { label: "Lottery", value: "0.0000", color: "bg-blue-400" },
];

export default function Cashback() {
    const total = "0.0000";
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-gray-50 justify-center">
            <div className="bg-black" >
                <BackHeader text="Cashback" />
            </div>
            <div className="w-full bg-[#f5f5f5] relative">
                <div className="w-full max-w-sm rounded-xl p-5">
                    <div className="flex justify-between mb-4 bg-white border border-red-300 rounded pr-2">
                        <span className="bg-red-300 text-white text-sm px-3 py-1 rounded">Date</span>
                        <span className="text-orange-400 font-medium">{today}</span>
                    </div>

                    {data.map((item, index) => (
                        <div className="flex justify-between items-center bg-white pr-2 mb-3" key={index}>
                            <span className={`${item.color} text-white text-sm px-3 py-1 rounded`}>
                                {item.label}
                            </span>
                            <span className="text-orange-400">{item.value}</span>
                        </div>
                    ))}

                    {/* Total */}
                    <div className="flex justify-between items-center bg-white pr-2 mt-5 mb-3">
                        <span className="bg-purple-300 text-white text-sm px-3 py-1 rounded">
                            Total
                        </span>
                        <span className="text-orange-400">{total}</span>
                    </div>

                    {/* Claim Button */}
                    <button
                        className="w-full bg-gray-300 text-white font-medium py-2 rounded cursor-not-allowed"
                        disabled
                    >
                        Claim
                    </button>

                    {/* Timezone Note */}
                    <p className="text-xs text-red-400 mt-3 text-center">
                        ⚠️ Reminder: The data above is based on GMT +8
                    </p>
                </div>
            </div>
        </div>
    );
}
