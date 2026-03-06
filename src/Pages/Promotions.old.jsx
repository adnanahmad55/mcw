import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Promotions() {
    const [bonusList, setBonusList] = useState([]);
    const [offerClaim, setOfferClaim] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const authData = JSON.parse(localStorage.getItem("auth"));

    const user_id = authData?.userId;
    const username = authData?.username;
    const token = authData?.token;

    const checkPromotion = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-all-active-promotion`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res?.data?.status) {
                setBonusList(res?.data?.data?.promotions || []);
            }
        } catch (err) {
            console.error("Promotion check error:", err);
        }
    };

    const getDailyBonus = async () => {
        try {
            if (!user_id || !username) {
                console.error("User not logged in properly");
                return;
            }

            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-daily-bonus?username=${username}&user_id=${user_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res?.data?.status) {
                // console.log("Daily Bonus Data:", res?.data?.data);
                setOfferClaim(res?.data?.data?.claim_bonus?.is_claimable);
            } else {
                console.warn("No bonus available or API error:", res?.data?.message);
            }
        } catch (err) {
            console.error("Get daily bonus error:", err);
        }
    };

    const claimPlayerBonus = async (body) => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/claim-player-bonus`,
                body,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res?.data?.status) {
                alert(res?.data?.message);
                getDailyBonus();
            } else {
                alert(res?.data?.message);
            }
        } catch (err) {
            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Something went wrong"
            );
        }
    };

    const toggleExpanded = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const getImageUrl = (imageName) => {
        return `${import.meta.env.VITE_APP_API_BASE_URL}banner-uploads/promotion-banner/${imageName}`;
    };

    useEffect(() => {
        checkPromotion();
        getDailyBonus();
    }, []);

    return (
        <>
            <div className="w-full">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid md:grid-cols-2 gap-4 p-4">
                        {bonusList.length > 0 ? (
                            bonusList.map((bonus, index) => (
                                <div key={bonus?._id} className="w-full">
                                    <div className="w-full rounded overflow-hidden bg-[#0f3157]">
                                        {/* Offer Image */}
                                        <img 
                                            src={bonus?.offer_image 
                                                ? getImageUrl(bonus.offer_image)
                                                : "https://images.6492394993.com/mcs-images/announcement/bet15bdtf6/3016170_1747923902751.png  "
                                            }
                                            className="w-full" 
                                            alt={bonus?.title}
                                        />
                                        
                                        {/* Dropdown Bar */}
                                        <div 
                                            className="min-h-[50px] px-3 cursor-pointer flex items-center justify-between transition-colors duration-200"
                                            style={{background:'linear-gradient(180deg, #174593, #0f3157)'}}
                                            onClick={() => toggleExpanded(index)}
                                        >
                                            <strong className="text-white text-sm md:text-base">{bonus?.title}</strong>
                                            <div style={{}}><img src="/down2.svg" height={14} width={24} alt="" className={`transition-transform duration-300 ${expanded === index ? "rotate-180" : ""}`} /></div>
                                        </div>

                                        {/* Expandable Content */}
                                        <div 
                                            className={`overflow-hidden transition-all duration-500 ease-in-out ${
                                                expanded === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                        >
                                            {bonus?.description_image ? (
                                                /* Description Image */
                                                <div className="w-full">
                                                    <img 
                                                        src={getImageUrl(bonus.description_image)}
                                                        className="w-full p-2 rounded-xl" 
                                                        alt={`${bonus?.title} description`}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full bg-[#0f3157] p-4">
                                                    <p className="flex items-center justify-between my-3">
                                                        <span className="text-xs md:text-base text-white">Category:</span>
                                                        <strong className="text-xs text-white md:text-base">{bonus?.category}</strong>
                                                    </p>
                                                    <p className="flex items-center justify-between my-3">
                                                        <span className="text-xs md:text-base text-white">Bonus Code:</span>
                                                        <strong className="text-xs text-white md:text-base">{bonus?.bonus_code}</strong>
                                                    </p>
                                                    <p className="flex items-center justify-between my-3">
                                                        <span className="text-xs md:text-base text-white">Offer Type:</span>
                                                        <strong className="text-xs text-white md:text-base">{bonus?.offer_type}</strong>
                                                    </p>
                                                    <p className="flex items-center justify-between my-3">
                                                        <span className="text-xs md:text-base text-white">Bonus:</span>
                                                        <strong className="text-xs text-white md:text-base">
                                                            {bonus?.offer_on !== "daily-bonus" && (
                                                                bonus?.offer_type === "Percentage"
                                                                    ? `${bonus?.percentage_value}%`
                                                                    : `${bonus?.fixed_value}`
                                                            )}
                                                            {bonus?.offer_on === "daily-bonus" && bonus?.daily_bonus_array[0]?.bonus_amount}
                                                        </strong>
                                                    </p>
                                                    <p className="flex items-center justify-between my-3">
                                                        <span className="text-xs md:text-base text-white">Valid From:</span>
                                                        <strong className="text-xs text-white md:text-base">
                                                            {new Date(bonus?.start_time).toLocaleDateString()} -{" "}
                                                            {new Date(bonus?.end_time).toLocaleDateString()}
                                                        </strong>
                                                    </p>
                                                    <p className="flex items-center justify-between my-3">
                                                        <span className="text-xs md:text-base text-white">Bonus Apply On:</span>
                                                        <strong className="text-xs text-white md:text-base">
                                                            {bonus?.bonus_apply_on?.map((b) => b.name).join(", ")}
                                                        </strong>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: "white" }}>No Promotions Available</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}