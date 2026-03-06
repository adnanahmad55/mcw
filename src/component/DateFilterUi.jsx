import React from "react";

export default function DateFilterUi () {
    return (
        <div className="flex gap-2 items-center mb-4 px-2">
            <button className="px-3 py-1 bg-white whitespace-nowrap border border-[#108ee9] text-[#108ee9] rounded text-sm hover:bg-gray-100">Today</button>
            <button className="px-3 py-1 bg-white whitespace-nowrap border border-[#108ee9] text-[#108ee9] rounded text-sm hover:bg-gray-100">Yesterday</button>
            <button className="px-3 py-1 bg-blue-500 whitespace-nowrap text-white rounded text-sm">7-days</button>
            <input
                type="text"
                value="08/31 - 09/06"
                readOnly
                className="px-3 py-1 border border-[#108ee9] text-[#108ee9] rounded text-sm bg-white"
            />
        </div>
    );
};