import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import { FaFacebook, FaWhatsapp, FaTelegram, FaLine } from "react-icons/fa";
import { LuLink } from "react-icons/lu";
import BackHeader from "../component/BackHeader";
import Incomes from "../component/Incomes";
import { useSelector } from "react-redux";
import axios from "axios";
import ReferAndEarnOverview from "../component/ReferAndEarnOverview";
import ReferRewards from "../component/ReferRewards";
import ReferralEarningsRecords from "../component/ReferralEarningsRecords";
import ValidReferrals from "../component/ValidReferrals";
import InvalidReferrals from "../component/InvalidReferrals";

function InviteFriends() {  
    const { t } = useTranslation(); // Initialize translation function
    const [activeTab, setActiveTab] = useState("overview");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    // const { isLogin, username, totalCoins } = useSelector((state) => state.auth);
    const [todayTotalIncome, setTodayTotalIncome] = useState("");
    const authData = JSON.parse(localStorage.getItem("auth"));
    const username = authData?.username;
    const userID = authData?.userId;
    const referral_code = authData?.referral_code;
    const token = authData?.token;

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_APP_PROMOTION_API}/promotion/referral-earnings-summary?username=${username}&player_id=${userID}&operator_code=${import.meta.env.VITE_APP_OPERATOR_ID}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.data.subCode === 200) {
                    setData(res?.data?.data);
                    setTodayTotalIncome(res?.data?.data?.totalIncome);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);


   if (loading) {
        return (
            <div className="max-w-md mx-auto bg-[#f6f6f6] rounded-[3px] shadow-md overflow-hidden p-4 text-center">
                {t('inviteFriends.loading')}
            </div>
        );
    }

    // if (!data) {
    //     return (
    //         <div className="max-w-md mx-auto bg-[#f6f6f6] rounded-[3px] shadow-md overflow-hidden p-4 text-center text-red-500">
    //             Failed to load data
    //         </div>
    //     );
    // }

    const rewards1 = [
        {
            id: 1,
            title: "Over 5 valid referral in total.",
            amount: "৳ 500.00",
            progress: "0/5",
            status: "Available",
            iconColor: "from-red-400 to-orange-500",
        },
        {
            id: 2,
            title: "Over 20 valid referral in total.",
            amount: "৳ 2,000.00",
            progress: "0/20",
            status: "Available",
            iconColor: "from-green-400 to-teal-500",
        },
    ];



    return (
        <>
            <div className="bg-black w-full">
                <BackHeader text={t('inviteFriends.referAndEarn')} />
            </div>
            <div className="min-h-screen bg-white p-2">

                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-gray-300 mb-4 scrollbar-hide">
                    {["overview", "rewards", "incomes", "records", "validReferrals", "invalidReferrals"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 capitalize flex-shrink-0 ${activeTab === tab
                                ? "border-b-2 border-blue-500 text-blue-600 font-semibold"
                                : "text-gray-600"
                                }`}
                        >
                            {t(`inviteFriends.${tab}Tab`)}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <ReferAndEarnOverview data={data} setActiveTab={setActiveTab} />
                )}

                {activeTab === "rewards" && (
                    <ReferRewards />
                )}

                {activeTab === "incomes" && (
                    <Incomes data={data} loading={loading} />
                )}

                {activeTab === "records" && (
                    <ReferralEarningsRecords />
                )}

                {activeTab === "validReferrals" && (
                    <ValidReferrals data={data} />
                )}

                {activeTab === "invalidReferrals" && (
                    <InvalidReferrals data={data} />
                )}

            </div>
        </>
    );
}

export default InviteFriends;
