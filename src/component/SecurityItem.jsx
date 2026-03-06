import {
    FaUserEdit,
    FaWallet,
    FaLock,
    FaKey,
    FaPowerOff,
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationCircle,
} from "react-icons/fa";

export default function SecurityItem({ icon, title, desc, status, color, showArrow = true }) {
    const statusIcon =
        status === "ok" ? (
            <FaCheckCircle className="text-green-500" />
        ) : status === "warn" ? (
            <FaExclamationCircle className="text-yellow-500" />
        ) : status === "error" ? (
            <FaTimesCircle className="text-red-500" />
        ) : null;

    return (
        <div className="flex items-center justify-between border-b py-3">
            <div className="flex items-center space-x-3">
                <div className="text-xl text-blue-500">{icon}</div>
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                {statusIcon}
                {showArrow && <span className="text-gray-400 text-xl">›</span>}
            </div>
        </div>
    );
};