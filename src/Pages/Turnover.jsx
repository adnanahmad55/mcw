import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaRegCircleCheck, FaXmark } from "react-icons/fa6";
import { MdOutlineWatchLater } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import Marquee from "react-fast-marquee";
import { logout } from "../redux/slice/authSlice";
import { toast } from "react-toastify";
import DownloadPopup from "../component/DownloadPopup";
// import { div } from "framer-motion/client"; // This import seems unused
import { useTranslation } from "react-i18next";

export default function Turnover() {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const user_id = authData?.userId;
    const username = authData?.username;
    const token = authData?.token;
    const [turnoverData, setTurnoverData] = useState([]);
    const [isDepositRequired, setIsDepositRequired] = useState(false);
    const [loading, setLoading] = useState({});
    const [channelModal, setChannelModal] = useState(false);
    const [currentChannel, setCurrentChannel] = useState("");
    const [activeTab, setActiveTab] = useState("active");
    const [showAppDownloadPopup, setShowAppDownloadPopup] = useState(false);
    const [currentTurnoverId, setCurrentTurnoverId] = useState(null);
    const dispatch = useDispatch();
    const activeCount = turnoverData?.filter(item => !item?.is_completed && !item?.is_claimable).length || 0; // Exclude claimable
    const completedCount = turnoverData?.filter(item => item?.is_completed).length || 0;
    const { t } = useTranslation();

    const channelNames = {
        "join-telegram": "Telegram",
        "join-whatsapp": "Whatsapp",
        "join-facebook": "Facebook",
    };

    const calculateDaysUntilExpiry = (completionDate) => {
        if (!completionDate) return null;
        
        const today = new Date();
        const completion = new Date(completionDate);
        
        today.setHours(0, 0, 0, 0);
        completion.setHours(0, 0, 0, 0);
        
        const timeDiff = completion.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return daysDiff;
    };

    const getPlayerTurnover = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-player-turnover?username=${username}&user_id=${user_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res?.data?.status) {
                // Filter out items where is_claimable is true
                const filteredData = res?.data?.data?.turnover?.promotions?.filter(item => !item?.is_claimable) || [];
                setTurnoverData(filteredData);
                setIsDepositRequired(res?.data?.data?.turnover?.isDepositRequired || false);
            } else {
                console.warn("No turnover data found");
                setTurnoverData([]); // Ensure state is updated even if no data
            }
        } catch (err) {
            console.error("Turnover API error:", err);
            setTurnoverData([]); // Ensure state is updated on error
        }
    };

    useEffect(() => {
        getPlayerTurnover();
    }, []);

    const handleClaim = async (turnoverId, promotionType) => {
        try {
            setLoading((prev) => ({ ...prev, [turnoverId]: true }));

            const body = {
                username: username,
                turnover_id: turnoverId,
            };

            const res = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/claim-turnover`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Handle both success and failure responses in the same place
            if (res?.data?.status) {
                toast.success(res?.data?.message);

                const redirectUrl = res?.data?.data?.redirect_url;
                if (redirectUrl) {
                    window.open(redirectUrl, "_blank");
                }
                getPlayerTurnover(); // Refresh data after claim
            } else {
                // Check for the specific app-download error condition
                if (promotionType === "app-download" && 
                    res?.data?.subCode === 400 && 
                    res?.data?.message === "Web user not allowed to claim turnover for app download.") {
                    
                    setCurrentTurnoverId(turnoverId);
                    setShowAppDownloadPopup(true);
                } else {
                    toast.error(res?.data?.message || "Claim failed");
                }
            }
        } catch (err) {
            // Handle network errors or other unexpected errors
            const msg = err?.response?.data?.message || 
                       err?.data?.message || 
                       err?.message || 
                       "Something went wrong ❌";
            
            toast.error(msg);
            
            if (promotionType === "app-download" && err?.status === 400) {
                    console.log(err)
                    setCurrentTurnoverId(turnoverId);
                    setShowAppDownloadPopup(true)
                    console.log(showAppDownloadPopup)
                } else {
                    // toast.error(err?.data?.message || "Claim failed");
                }
        } finally {
            setLoading((prev) => {
                const updated = { ...prev };
                delete updated[turnoverId];
                return updated;
            });
        }
    };

    // Filter data based on activeTab, excluding claimable items
    const filteredData = turnoverData?.filter(item => {
        if (activeTab === "active") {
            return !item?.is_completed && !item?.is_claimable; // Exclude claimable from active
        } else {
            return item?.is_completed;
        }
    });

    return (
        <>
            <div className="w-full px-2 pb-4 pt-4 min-h-[50vh]">
                <div className="flex border-b border-gray-700 mb-4">
                    <button
                        className={`py-2 px-4 font-medium text-sm w-2/4 text-center ${activeTab === "active"
                                ? "text-green-500 border-b-2 border-green-500"
                                : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("active")}
                    >
                        {t("turnover.active")} ({activeCount})
                    </button>
                    <button
                        className={`py-2 px-4 font-medium text-sm w-2/4 text-center ${activeTab === "completed"
                                ? "text-green-500 border-b-2 border-green-500"
                                : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("completed")}
                    >
                        {t("turnover.completed")} ({completedCount})
                    </button>
                </div>

                {isDepositRequired && (
                        <Marquee pauseOnHover={true} gradient={false} speed={60}>
                            <p className="text-white">
                                {t("turnover.depositRequired")}
                            </p>
                        </Marquee>
                )}

                {filteredData?.length > 0 ? (
                    [...filteredData]
                        .sort((a, b) => {
                            if (a?.title === "Primary Turnover" && b?.title !== "Primary Turnover") {
                                return -1;
                            }
                            if (b?.title === "Primary Turnover" && a?.title !== "Primary Turnover") {
                                return 1;
                            }
                            return 0;
                        })
                        .map((item, idx) => {
                            const progress = item?.required_turnover
                                ? (item?.current_turnover / item?.required_turnover) * 100
                                : 0;

                            const daysUntilExpiry = item?.completion_date ? calculateDaysUntilExpiry(item?.completion_date) : null;

                            return (
                                <div key={idx} className="bg-[#000] text-white rounded-lg p-4 shadow-md w-full mb-3">
                                    <div className="flex items-center mb-2 justify-between">
                                        <span className="bg-green-700 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                            {
                                                item?.is_completed ? (
                                                    <>
                                                        <FaRegCircleCheck />
                                                        {t("turnover.completed")}
                                                    </>
                                                ) : (
                                                    <>
                                                        <MdOutlineWatchLater />
                                                        {t("turnover.inProgress")}
                                                    </>
                                                )
                                            }
                                            {item.wallet_type === "cash" ? ` (${t("turnover.cash")})` : ` (${t("turnover.bonus")})`}
                                            {item.required_amount ? `  ${item.current_amount}/${item.required_amount} ${t("turnover.amount")}` : " "}
                                        </span>
                                        {item?.is_claimable && !item?.is_claimed 
                                        && !isDepositRequired 
                                        && activeTab === "active" && (
                                            <button
                                                className="bg-green-700 text-white text-xs px-2 py-1 rounded"
                                                style={{ border: "0", cursor: "pointer" }}
                                                disabled={!!loading[item?._id]}
                                                onClick={() => handleClaim(item?._id, item?.promotion_type)}
                                            >
                                                {loading[item?._id] ? `${t("turnover.claiming")}...` : t("turnover.claim")}
                                            </button>
                                        )}
                                        {!item?.is_claimable && activeTab === "active" && (
                                          <span
                                            className={`text-xs px-2 py-1 rounded text-white ${
                                              item?.is_claimed ? "bg-green-900" : "bg-red-700"
                                            }`}
                                          >
                                            {item?.is_claimed ? t("turnover.claimed") : t("turnover.unclaimable")}
                                          </span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-300 mb-1">
                                        {item?.title} {item?.title === "Primary Turnover" ? '' : `(${item?.promotion_type})`}
                                    </p>

                                    {item?.title === "Primary Turnover" ? '' : (
                                        <div className="text-sm">
                                            {t("turnover.applicableOn")} -{" "}
                                            {item?.eligible_games_category
                                                ?.map((game) => game.name)
                                                .join(", ")}
                                        </div>
                                    )}
                                    {/* {console.log(item)} */}
                                    {item?.promotion_type === "bet-on-games" && (
                                        <div className="text-xs">
                                            {t("turnover.toClaimOffer")} -{" "} {item?.games?.map((game) => game).join(", ")}
                                        </div>
                                    )}

                                    {item?.completion_date && (
                                        <div className="text-sm mb-1">
                                            <span className={`${
                                                daysUntilExpiry !== null ? (daysUntilExpiry > 7 ? 'text-green-400' : daysUntilExpiry > 3 ? 'text-yellow-400' : 'text-red-400') : 'text-gray-400'
                                            }`}>
                                                {t("turnover.expiresIn")}: {daysUntilExpiry !== null ? (
                                                    daysUntilExpiry > 0 ? `${daysUntilExpiry} days` : 
                                                    daysUntilExpiry === 0 ? 'Today' : `${Math.abs(daysUntilExpiry)} days ago`
                                                ) : 'N/A'}
                                            </span>
                                        </div>
                                    )}

                                    <h2 className="text-2xl font-bold mb-2">৳ {item?.amount}</h2>

                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                        <div
                                            className="bg-green-500 h-1.5 rounded-full w-0"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-xs text-gray-400 mb-1">
                                        <span>{item?.current_turnover} / {item?.required_turnover}</span>
                                        <span>{progress?.toFixed(2)}%</span>
                                    </div>
                                </div>
                            );
                        })
                ) : (
                    <p className="text-white text-center mt-4 min-h-[60vh]" style={{ color: '#fff', textAlign: 'center' }}>
                        {t("turnover.noTurnoverDataFound")}
                    </p>
                )}
                
                    <DownloadPopup 
                        onClose={() => setShowAppDownloadPopup(false)}
                        onConfirm={() => {
                            setShowAppDownloadPopup(false);
                        }}
                        isOpen={showAppDownloadPopup}
                    />
            </div>
        </>
    )
}