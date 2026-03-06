import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import the translation hook
import { FaFacebook, FaLine, FaTelegram, FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa'
import { LuLink } from 'react-icons/lu'
import { data } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReferAndEarnOverview({ data, setActiveTab }) {
    const { t } = useTranslation(); // Initialize translation function
    const rewards = [
        { user: "01********5", status: "Received", amount: "৳ 508.00" },
        { user: "md*****1", status: "Received", amount: "৳ 508.00" },
        { user: "ta***2", status: "Received", amount: "৳ 508.00" },
        { user: "so*****0", status: "Received", amount: "৳ 508.00" },

    ];
    const [isPaused, setIsPaused] = useState(false);
    const [visibleRewards, setVisibleRewards] = useState([]);
    const authData = JSON.parse(localStorage.getItem("auth"));
    const referral_code = authData?.referral_code;


    const referralLink = `${import.meta.env.VITE_APP_SITE_URL}/register?r=${referral_code}`;

    const handleCopy = () => {
        const textToCopy = `${import.meta.env.VITE_APP_SITE_URL}/register?r=${referral_code}`;

        if (navigator.clipboard && window.isSecureContext) {

            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    toast.success(t('inviteFriends.copiedSuccessfully'), { position: "top-center", autoClose: 1500 });
                })
                .catch(() => {
                    toast.error(t('inviteFriends.failedToCopy'), { position: "top-center", autoClose: 1500 });
                });
        } else {

            const textarea = document.createElement("textarea");
            textarea.value = textToCopy;
            textarea.style.position = "fixed";
            textarea.style.left = "-999999px";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();

            try {
                document.execCommand("copy");
                toast.success("Copied Successfully!", { position: "top-center", autoClose: 1500 });
            } catch (err) {
                toast.error("Failed to copy!", { position: "top-center", autoClose: 1500 });
            } finally {
                document.body.removeChild(textarea);
            }
        }
    };

    const duplicatedRewards = [...rewards, ...rewards, ...rewards, ...rewards, ...rewards, ...rewards];

    useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
        setVisibleRewards(prev => {
        if (prev.length === 0) return duplicatedRewards.slice(0, 5);
        const newIndex = (duplicatedRewards.indexOf(prev[0]) + 1) % rewards.length;
        return duplicatedRewards.slice(newIndex, newIndex + 5);
        });
    }, 2000);

    return () => clearInterval(interval);
    }, [isPaused, rewards.length]);

    // Initialize visible rewards
    useEffect(() => {
    setVisibleRewards(duplicatedRewards.slice(0, 5));
    }, []);


    return (
        <div className="space-y-4">
            {/* Share Section */}
            <div className="p-4 rounded-xl"
                style={{
                    background: 'linear-gradient(180deg,#f3f7fb,#e0e9f1)'
                }}>
                <p className="font-semibold mb-2 text-[#3b2987] text-center">{t('inviteFriends.shareWithFriends')}</p>
                <div className="flex space-x-3 mb-3 items-center">
                    <div className="text-[#566073]">{t('inviteFriends.shareWithFriends')}</div>

                    <FaFacebookMessenger
                        className="text-blue-600 text-3xl cursor-pointer"
                        onClick={() =>
                            window.open(
                                `https://m.me/?link=${referralLink}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    />

                    <FaWhatsapp
                        className="text-green-500 text-3xl cursor-pointer"
                        onClick={() =>
                            window.open(
                                `https://wa.me/?text=${referralLink}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    />

                    <FaTelegram
                        className="text-sky-500 text-3xl cursor-pointer"
                        onClick={() =>
                            window.open(
                                `https://t.me/share/url?url=${referralLink}&text=Check this out!`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    />

                    <FaLine
                        className="text-green-400 text-3xl cursor-pointer"
                        onClick={() =>
                            window.open(
                                `https://social-plugins.line.me/lineit/share?url=${referralLink}`,
                                "_blank",
                                "noopener,noreferrer"
                            )
                        }
                    />
                </div>

                <div className="flex items-center bg-white rounded-lg px-2 py-1">
                    <LuLink className="me-1" />
                    <input
                        type="text"
                        value={referralLink}
                        readOnly
                        className="flex-1 bg-transparent outline-none text-[9px]"
                    />
                    <button
                        className="text-white bg-blue-500 px-3 py-1 rounded-md"
                        onClick={handleCopy}
                    >
                        {t('inviteFriends.copy')}
                    </button>
                </div>
            </div>


            {/* Income Boxes */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-100 text-center p-2 rounded-[4px]"
                    style={{
                        background: 'linear-gradient(108deg,#abdcff,#0396ff)'
                    }}>
                    <p className="text-white text-[10px]">{t('inviteFriends.todaysIncome')}</p>
                    <h2 className="text-lg font-bold text-white">৳ {data?.todayIncome || 0.00}</h2>
                </div>
                <div className="bg-purple-100 text-center p-2 rounded-[4px]"
                    style={{ background: 'linear-gradient(108deg,#ce9ffc,#7367f0)' }}>
                    <p className="text-white text-[10px]">{t('inviteFriends.yesterdaysIncome')}</p>
                    <h2 className="text-lg font-bold text-white">৳ {data?.yesterdayIncome || 0.00}</h2>
                </div>
                <div className="bg-pink-100 text-center p-2 rounded-[4px]"
                    style={{ background: 'linear-gradient(108deg,#ce9ffc,#7367f0)' }}>
                    <p className="text-white text-[10px]">{t('inviteFriends.registers')}</p>
                    <h2 className="text-lg font-bold text-white">{data?.registers || 0}</h2>
                </div>
                <div className="bg-green-100 text-center p-2 rounded-[4px] cursor-pointer"
                     onClick={() => setActiveTab && setActiveTab('validReferrals')}
                     style={{
                    background: 'linear-gradient(108deg,#abdcff,#0396ff)'
                }}>
                    <p className="text-white text-[10px]">{t('inviteFriends.validReferral')}</p>
                    <h2 className="text-lg font-bold text-white">{data?.validReferral || 0}</h2>
                </div>
            </div>

            <div className=" text-white rounded-xl shadow">
                {/* <img src="/ref.jpeg" alt="" className='rounded-xl'/> */}
            </div>

            {/* Banner */}
            {/* <div className="invite-friends-block text-white p-4 rounded-xl shadow">
                <div className="flex items-center">
                    <img src="/favicon.png" className="w-[85px]" />
                    <h3 className="font-bold ml-2 text-2xl text-center">{t('inviteFriends.agentSuperCommission')}</h3>
                </div>
                <p className="text-2xl mt-2 text-[#ffc576] text-center font-bold">৳ {data?.totalIncome}</p>
                <p className="text-[10px] text-center mt-2 mb-0">এজেন্ট 8 সুপার কমিশন</p>
            </div> */}

            {/* Rewards */}
            <p className="font-bold text-xl mb-2 text-[#3b2987] text-center">{t('inviteFriends.rewardsReleasedToDate')}</p>

            <div className="flex px-[14px] py-[8px] rounded-[4px]"
                style={{
                    background: 'linear-gradient(180deg,#f3f7fb 0,#e0e9f1)'
                }}>
                <div className="mr-6">
                    <img src="/assets/img/bonus-1.png" className="w-[69px]" />
                </div>
                <div className="text-left">
                    <p className="text-[#566073] text-sm">{t('inviteFriends.invitationRewards')}</p>
                    <p className="text-[#3b2987] text-[19px] font-bold mt-1">৳ {data?.totalSummary?.invitationRewards || 0}</p>
                    <p className="text-[#566073] text-[11px]">323232</p>
                </div>
            </div>

            <div className="flex px-[14px] py-[8px] rounded-[4px]"
                style={{
                    background: 'linear-gradient(180deg,#f3f7fb 0,#e0e9f1)'
                }}>
                <div className="mr-6">
                    <img src="/assets/img/bonus-2.png" className="w-[69px]" />
                </div>
                <div className="text-left">
                    <p className="text-[#566073] text-sm">{t('inviteFriends.achievementRewards')}</p>
                    <p className="text-[#3b2987] text-[19px] font-bold mt-1">৳ {data?.totalSummary?.achievementRewards || 0}</p>
                    <p className="text-[#566073] text-[11px]">165708 claimed</p>
                </div>
            </div>

            <div className="flex px-[14px] py-[8px] rounded-[4px]"
                style={{
                    background: 'linear-gradient(180deg,#f3f7fb 0,#e0e9f1)'
                }}>
                <div className="mr-6">
                    <img src="/assets/img/bonus-3.png" className="w-[69px]" />
                </div>
                <div className="text-left">
                    <p className="text-[#566073] text-sm">{t('inviteFriends.depositRebate')}</p>
                    <p className="text-[#3b2987] text-[19px] font-bold mt-1">৳ {data?.totalSummary?.depositRebate || 0}</p>
                    <p className="text-[#566073] text-[11px]">323232</p>
                </div>
            </div>

            <div className="flex px-[14px] py-[8px] rounded-[4px]"
                style={{
                    background: 'linear-gradient(180deg,#f3f7fb 0,#e0e9f1)'
                }}>
                <div className="mr-6">
                    <img src="/assets/img/bonus-4.png" className="w-[69px]" />
                </div>
                <div className="text-left">
                    <p className="text-[#566073] text-sm">{t('inviteFriends.bettingRebate')}</p>
                    <p className="text-[#3b2987] text-[19px] font-bold mt-1">৳ {data?.totalSummary?.bettingRebate || 0}</p>
                    <p className="text-[#566073] text-[11px]">323232</p>
                </div>
            </div>

            <p className="font-bold text-xl mb-2 text-[#3b2987] text-center">এজেন্ট 8 সুপার কমিশন</p>

            {/* <img src="/refer-earn-01.webp" className="w-full" /> */}

            <p className="font-bold text-xl my-2 text-[#3b2987] text-center">এজেন্ট 8 সুপার কমিশন</p>

            <div className="bg-gradient-to-r from-sky-400 to-purple-500 text-white p-4 rounded-xl shadow-md max-w-md mx-auto">
                <h2 className="text-lg font-semibold text-center mb-3">
                    {t('inviteFriends.whoReceivedTheRewards')}
                </h2>
                <div className="overflow-hidden h-[192px] relative">
                    <div
                    className="animate-scroll-stop-go"
                    style={{
                        animation: 'scrollStopGo 8s infinite',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                    onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                    >
                    {[...rewards, ...rewards, ...rewards].map((item, idx) => (
                        <div
                        key={`${item.user}-${idx}`}
                        className="flex justify-between items-center bg-white text-gray-800 px-4 py-2 shadow-sm mb-2"
                        style={{ borderRadius: "2rem" }}
                        >
                        <span className="font-medium">{item.user}</span>
                        <div className='flex gap-3'>
                            <span className="text-sm text-green-600">{item.status}</span>
                            <span className="font-semibold text-blue-600">{item.amount}</span>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                <style jsx>{`
                    @keyframes scrollStopGo {
                    0%, 20% { transform: translateY(0); }
                    25%, 45% { transform: translateY(-20%); }
                    50%, 70% { transform: translateY(-40%); }
                    75%, 95% { transform: translateY(-60%); }
                    100% { transform: translateY(-80%); }
                    }
                `}</style>
            </div>

            <div className="w-full rounded p-4"
                style={{
                    background: 'linear-gradient(122deg,#fd6585,#0d25b9)'
                }}>
                <div className="flex items-center">
                    <img src="/assets/img/wallet.png" className="w-[85px]" />
                    <h3 className="font-bold ml-2 text-2xl text-left text-white">{t('inviteFriends.incomeCalculator')}</h3>
                </div>
                <div className="text-center text-[#ffc576] mb-2">৳ {data?.totalIncome}</div>
            </div>

            <h2 className="font-bold text-xl my-2 text-[#3b2987] text-center">
                এজেন্ট 8 সুপার কমিশন
            </h2>

            {/* <img src="/refer-earn-02.webp" className="w-full" /> */}

        </div>
    )
}
