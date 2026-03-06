import React from "react";

export default function SectionCard({ icon, title, data, iconBg = "bg-orange-400" })  {
    return (
        <div className="bg-white border border-gray-200 rounded-none p-4 pb-0 px-0 mb-4 shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-3 px-2">
                <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${iconBg}`}>
                        {icon}
                    </div>
                    <span className="font-semibold">{title}</span>
                </div>
                <div className="text-gray-500 text-sm">Total P&L: <span className="font-semibold text-black">0.00</span></div>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 bg-[#fcfcfc] pt-2 pb-2 px-2">
                {data.map((item, index) => (
                    <div key={index}>
                        <div className="text-gray-500">{item.label}</div>
                        <div className="font-semibold text-black">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};