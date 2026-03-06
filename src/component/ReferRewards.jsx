import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReferRewards() {
    const { t } = useTranslation(); // Initialize translation function
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const authData = JSON.parse(localStorage.getItem("auth"));
    const username = authData?.username;
    const [claimLoading, setClaimLoading] = useState({}); // Track loading state for each item

    const fetchData = async () => {
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_APP_PROMOTION_API}/promotion/referral-count-offer?username=${username}`
            );
            if (res.data.subCode === 200) {
                setData(res?.data?.data);
            }
        } catch (err) {
            console.error("Error fetching offers:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClaim = async (id) => {
        setClaimLoading(prev => ({ ...prev, [id]: true }));
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_APP_PROMOTION_API}/promotion/claim-referral-bonus`,
                {
                    username: username,
                    claim_id_array: [id],
                }
            );

            if (res.data.subCode === 200) {
                toast.success(res.data.message || t('inviteFriends.claim'), {
                    position: "top-center",
                    autoClose: 2000,
                });
                fetchData();
            } else {
                toast.error(res.data.message || t('inviteFriends.failedToLoad'), {
                    position: "top-center", autoClose: 1500
                });
            }
        } catch (error) {
            console.error("API Error:", error);
            if (error.response && error.response.data) {
                toast.error(
                    error.response.data.message || t('inviteFriends.failedToLoad'),
                    { position: "top-center", autoClose: 1500 }
                );
            } else if (error.request) {
                toast.error(t('inviteFriends.failedToLoad'), {
                    position: "top-center", autoClose: 1500
                });
            } else {
                toast.error(error.message || t('inviteFriends.failedToLoad'), {
                    position: "top-center", autoClose: 1500
                });
            }
        } finally {
            setClaimLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    const handleClaimAll = async () => {
        if (!data?.referral_earning) return;

        // Get all claimable items
        const claimableItems = data.referral_earning.filter(item => item.reward_claimable);
        
        if (claimableItems.length === 0) {
            toast.info(t('inviteFriends.noItemsToClaim'), {
                position: "top-center", autoClose: 1500
            });
            return;
        }

        // Set loading state for all claimable items
        const loadingStates = {};
        claimableItems.forEach(item => {
            loadingStates[item._id] = true;
        });
        setClaimLoading(loadingStates);

        try {
            const claimIds = claimableItems.map(item => item._id);
            const res = await axios.post(
                `${import.meta.env.VITE_APP_PROMOTION_API}/promotion/claim-referral-bonus`,
                {
                    username: username,
                    claim_id_array: claimIds,
                }
            );

            if (res.data.subCode === 200) {
                toast.success(res.data.message || t('inviteFriends.claimAll'), {
                    position: "top-center",
                    autoClose: 2000,
                });
                fetchData();
            } else {
                toast.error(res.data.message || t('inviteFriends.failedToLoad'), {
                    position: "top-center", autoClose: 1500
                });
            }
        } catch (error) {
            console.error("API Error:", error);
            if (error.response && error.response.data) {
                toast.error(
                    error.response.data.message || t('inviteFriends.failedToLoad'),
                    { position: "top-center", autoClose: 1500 }
                );
            } else if (error.request) {
                toast.error(t('inviteFriends.failedToLoad'), {
                    position: "top-center", autoClose: 1500
                });
            } else {
                toast.error(error.message || t('inviteFriends.failedToLoad'), {
                    position: "top-center", autoClose: 1500
                });
            }
        } finally {
            // Reset all loading states
            setClaimLoading({});
        }
    };

    if (loading) {
        return <div className="text-center py-6">{t('inviteFriends.loading')}</div>;
    }

    return (
        <div className="w-full">
            {/* <img src="/refer-earn-03.webp" className="w-full" /> */}
            
            {/* Add Claim All button */}
            {/* <div className="max-w-md mx-auto mt-3 px-4">
                <button
                    className="w-full text-sm px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg"
                    style={{ background: 'linear-gradient(113deg,#43cbff,#9708cc)' }}
                    onClick={handleClaimAll}
                    disabled={Object.keys(claimLoading).length > 0} // Disable if any item is loading
                >
                    {Object.keys(claimLoading).length > 0 ? t('inviteFriends.claimingAll') : t('inviteFriends.claimAll')}
                </button>
            </div> */}
            <div className="space-y-3 max-w-md mx-auto mt-3 px-4">
                {data?.referral_earning?.filter(item => item.activity_type === "achievements").map((offer, idx) => (
                    <div
                        key={idx}
                        className={`${offer?.reward_claimable ? '' : 'opacity-70'} flex items-center justify-between bg-gradient-to-r from-gray-100 to-gray-200 rounded-[3px] shadow p-4`}
                        style={{ background: 'linear-gradient(180deg,#f3f7fb 0,#e0e9f1)' }}
                    >
                        {/* Left side: Icon + Text */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center">
                                <img src="/assets/img/level-01.png" width={62} />
                            </div>
                            <div>
                                {(() => {
                                    if (offer.activity_type === "achievements") {
                                        return (
                                            <>
                                                <p className="text-gray-800 font-medium">{offer.remark}</p>
                                                <p className="text-gray-600 text-sm">৳ {offer.reward_amt}</p>
                                                <p className="text-gray-500 text-xs">{offer.reward_rate}</p>
                                            </>
                                        );
                                    } else if (offer.activity_type === "invite-friend") {
                                        return (
                                            <>
                                                <p className="text-gray-800 font-medium">{offer.remark}</p>
                                                <p className="text-gray-600 text-xs">
                                                    Invited: {offer.ref_username}
                                                </p>
                                                <p className="text-gray-600 text-xs">৳ {offer.reward_amt}</p>
                                                <p className="text-gray-500 text-xs">{offer.reward_rate}</p>
                                            </>
                                        );
                                    } else if (offer.activity_type === "deposit-rebate") {
                                        return (
                                            <>
                                                <p className="text-gray-800 font-medium">{offer.remark}</p>
                                                <p className="text-gray-600 text-xs">
                                                    Deposit by: {offer.ref_username}
                                                </p>
                                                <p className="text-gray-600 text-xs">
                                                    Deposit Amount: ৳ {offer.deposit_amount} by {offer.ref_username}
                                                </p>
                                                <p className="text-gray-600 text-sm">Reward: ৳ {offer.reward_amt}</p>
                                            </>
                                        );
                                    } else if (offer.activity_type === "betting-rebate") {
                                        return (
                                            <>
                                                <p className="text-gray-800 font-medium">{offer.remark}</p>
                                                <p className="text-gray-600 text-xs">
                                                    Bet by: {offer.ref_username}
                                                </p>
                                                <p className="text-gray-600 text-xs">
                                                    Bet Amount: ৳ {offer.bet_amount} by {offer.ref_username}
                                                </p>
                                                <p className="text-gray-600 text-sm">Reward: ৳ {offer.reward_amt}</p>
                                            </>
                                        );
                                    } else {
                                        // Default case when none of the above conditions are true
                                        return (
                                            <>
                                                <p className="text-gray-800 font-medium">{offer.remark}</p>
                                                <p className="text-gray-600 text-xs">
                                                    Deposit by: {offer.ref_username}
                                                </p>
                                                <p className="text-gray-600 text-xs">
                                                    Deposit Amount: ৳ {offer.deposit_amount} by {offer.ref_username}
                                                </p>
                                                <p className="text-gray-600 text-sm">Reward: ৳ {offer.reward_amt}</p>
                                            </>
                                        );
                                    }
                                })()}
                            </div>
                        </div>

                        {/* Right side: Progress + Button */}
                        <div className="flex flex-col items-end justify-center">
                            {offer.activity_type === "achievements" && (
                                <span className="text-gray-700 font-semibold">
                                    {offer.count} / {offer.required_count}
                                </span>
                            )}
                            {offer.reward_claimable ? (
                                <button
                                    className="text-xs mt-1 px-2 py-1 bg-purple-400 hover:bg-purple-500 text-white rounded-full"
                                    style={{ background: 'linear-gradient(113deg,#43cbff,#9708cc)' }}
                                    onClick={() => handleClaim(offer?._id)}
                                    disabled={claimLoading[offer?._id]} 
                                >
                                    {claimLoading[offer?._id] ? t('inviteFriends.claiming') : t('inviteFriends.claim')}
                                </button>
                            ) : (
                                <button
                                    className="text-xs mt-1 px-2 py-1 bg-purple-400 hover:bg-purple-500 text-white rounded-full"
                                    style={{ background: 'linear-gradient(113deg,#43cbff,#9708cc)' }}
                                >
                                    {offer.reward_status === "claimed" ? "claimed" : "available"}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}