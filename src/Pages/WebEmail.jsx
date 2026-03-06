import React, { useState } from "react";
import { FaSyncAlt, FaTrash } from "react-icons/fa";
import BackHeader from "../component/BackHeader";
import { useTranslation } from "react-i18next";

const mockMessages = [
    {
        id: 1,
        sender: "Sender:Platform",
        title: "ব্যবহারকারী সুরক্ষা বার্তা",
        time: "2025-09-05 14:23:05",
    },
    {
        id: 2,
        sender: "Sender:Platform",
        title: "ব্যবহারকারী সুরক্ষা বার্তা",
        time: "2025-09-04 12:59:01",
    },
    {
        id: 3,
        sender: "Sender:Platform",
        title: "ব্যবহারকারী সুরক্ষা বার্তা",
        time: "2025-09-02 12:24:04",
    },
];

export default function WebEmail() {
    const [messages, setMessages] = useState(mockMessages);
    const [selected, setSelected] = useState([]);
    const { t } = useTranslation();

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const isAllSelected = selected.length === messages.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelected([]);
        } else {
            setSelected(messages.map((msg) => msg.id));
        }
    };

    return (
        <>
            <div className="bg-[#333]">
                <BackHeader text="Internal Message" />
            </div>
            <div className="min-h-screen bg-gray-50 flex justify-center py-4">
                <div className="bg-white w-full max-w-md rounded ">
                    {/* Header */}
                    <div className="border-b p-3 text-center text-blue-500 font-medium text-sm">
                        {t('webEmail.inbox')}
                    </div>

                    {/* Select All + Actions */}
                    <div className="flex items-center justify-between p-3 border-b text-sm">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={toggleSelectAll}
                                className="w-4 h-4"
                            />
                            <label>{t('webEmail.selectAll')}</label>
                        </div>
                        <div className="flex items-center space-x-3 text-gray-500 text-lg">
                            <FaSyncAlt className="cursor-pointer hover:text-blue-500" />
                            <FaTrash className="cursor-pointer hover:text-red-500" />
                        </div>
                    </div>

                    {/* Messages */}
                    <div>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-start justify-between px-3 py-3 border-b ${selected.includes(msg.id) ? "bg-gray-100" : ""
                                    }`}
                            >
                                <div className="flex items-start space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(msg.id)}
                                        onChange={() => toggleSelect(msg.id)}
                                        className="mt-1 w-4 h-4"
                                    />
                                    <div className="text-sm">
                                        <div className="flex items-center space-x-1 mb-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                            <span className="text-gray-700 font-medium">
                                                {msg.sender}
                                            </span>
                                            <span className="text-xs text-gray-400">{msg.time}</span>
                                        </div>
                                        <div className="text-gray-800 font-medium">
                                            Title: {msg.title}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-gray-400 text-xl">›</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
