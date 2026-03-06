import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import SecurityItem from "../component/SecurityItem";
import { FaKey, FaLock, FaPowerOff, FaUserEdit, FaWallet } from "react-icons/fa";
import BackHeader from "../component/BackHeader";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slice/authSlice";

export default function SecurityCenter() {
    const { t } = useTranslation(); // Initialize translation function
    const [progress, setProgress] = useState(0);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
    const [showTransactionPasswordModal, setShowTransactionPasswordModal] = useState(false);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [nickName, setNickName] = useState("");
    const [email, setEmail] = useState("");
    const [transactionPassword, setTransactionPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const targetPercentage = 100;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Animate progress from 0 to target percentage
        const timer = setTimeout(() => {
            setProgress(targetPercentage);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Calculate stroke dasharray values for animation
    const radius = 15.9155;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const fetchWithdrawalWallets = async () => {
        try {
            setLoading(true);
            const authData = JSON.parse(localStorage.getItem("auth"));
            const user_id = authData?.userId;
            const username = authData?.username;

            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}withdraw/get-withdrawal-wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData?.token}`
                },
                body: JSON.stringify({
                    user_id,
                    username
                })
            });

            const data = await response.json();
            
            if (response.ok && data.status) {
                // Format the data to match the expected structure
                const formattedCards = data.data.withdraw_wallets.slice(0, 3).map((wallet, index) => ({
                    id: `${wallet.bdt_id}-${index}`, // Create unique ID
                    bank: wallet.bank_name,
                    cardNumber: wallet.bdt_id,
                    maskedCardNumber: wallet.bdt_id.length > 3 
                        ? '*'.repeat(wallet.bdt_id.length - 3) + wallet.bdt_id.slice(-3) 
                        : wallet.bdt_id,
                    name: "User", // Placeholder since name isn't returned
                    dateAdded: "2025-09-24" // Placeholder date
                }));
                setCards(formattedCards);
            } else {
                toast.error(data.message || t('securityCenter.errors.network'));
            }
        } catch (error) {
            toast.error(t('securityCenter.errors.network'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (showWalletModal) {
            fetchWithdrawalWallets();
        }
    }, [showWalletModal]);

    const handleSubmitPersonalInfo = async () => {
        try {
            setSubmitting(true);
            const authData = JSON.parse(localStorage.getItem("auth"));
            const username = authData?.username;

            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}withdraw/set-withdrawal-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData?.token}`
                },
                body: JSON.stringify({
                    username,
                    password: "", // Ignoring password as per requirement
                    nick_name: nickName,
                    email
                })
            });

            const data = await response.json();
            
            if (response.ok && data.status) {
                toast.success(t('securityCenter.success.updatePersonalInfo'));
                setShowPersonalInfoModal(false);
                setNickName("");
                setEmail("");
            } else {
                toast.error(data.message || t('securityCenter.errors.updatePersonalInfo'));
            }
        } catch (error) {
            toast.error(t('securityCenter.errors.network'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmitTransactionPassword = async () => {
        if (transactionPassword !== confirmPassword) {
            toast.error(t('securityCenter.passwordNotMatch'));
            return;
        }

        try {
            setSubmitting(true);
            const authData = JSON.parse(localStorage.getItem("auth"));
            const username = authData?.username;

            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}withdraw/set-withdrawal-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData?.token}`
                },
                body: JSON.stringify({
                    username,
                    password: transactionPassword,
                    nick_name: "", // Not sending nick name for transaction password
                    email: "" // Not sending email for transaction password
                })
            });

            const data = await response.json();
            
            if (response.ok && data.status) {
                toast.success(t('securityCenter.success.setTransactionPassword'));
                setShowTransactionPasswordModal(false);
                setTransactionPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.message || t('securityCenter.errors.setTransactionPassword'));
            }
        } catch (error) {
            toast.error(t('securityCenter.errors.network'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <>
            <div className="bg-[#333]">
                <BackHeader text={t('securityCenter.securityCenter')} />
            </div>

            <div className="min-h-screen bg-gray-50 flex justify-center p-4">
                <div className="bg-white rounded-xl shadow-md w-full max-w-md p-5">
                    {/* Safety Header */}
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-700 mb-2">
                            {t('securityCenter.safetyPercentage')}: <span className="text-green-500">{t('securityCenter.safetyLevel.high')}</span>
                        </h3>
                        <div className="flex items-center space-x-4">
                            {/* Animated Circular Progress */}
                            <div className="relative w-16 h-16">
                                <svg className="absolute top-0 left-0 w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                    {/* Background circle */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r={radius}
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth="3"
                                    />
                                    {/* Progress circle */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r={radius}
                                        fill="none"
                                        stroke="#22c55e"
                                        strokeWidth="3"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="transition-all duration-[1s] ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-green-500 font-semibold text-sm" style={{marginLeft: '14px'}}>
                                    {progress}%
                                </div>
                            </div>
                            {/* Login Info */}
                            <div className="text-xs text-gray-600">
                                <div className="flex items-center gap-1 mb-1">
                                    ⚡⚡⚡⚡⚡ <span className="text-green-500 font-semibold">High</span>
                                </div>
                                <p>{t('securityCenter.lastLoginIP')}:</p>
                                <p className="text-gray-500 break-words">2409:40d4:29:87ae:4826:9a6b:66d:b27f</p>
                                <p className="mt-1">{t('securityCenter.lastLoginTime')}:</p>
                                <p className="text-gray-500">2025-09-06 09:22:20</p>
                            </div>
                        </div>
                    </div>

                    {/* Alert */}
                    <div className="text-center text-green-500 text-sm mb-4 font-medium">
                        {/* {t('securityCenter.securityLevelLow')} <b>{t('securityCenter.safetyLevel.low')}</b>, {t('securityCenter.improveSafety')} */}
                        {t('securityCenter.securityLevelLow')} <b>{t('securityCenter.safetyLevel.high')}</b>
                    </div>

                    {/* Items */}
                    <div className="divide-y">
                        <div onClick={() => setShowPersonalInfoModal(true)}>
                            <SecurityItem
                                icon={<FaUserEdit />}
                                title={t('securityCenter.personalInfo')}
                                desc={t('securityCenter.completePersonalInfo')}
                                status=""
                            />
                        </div>
                        <div onClick={() => setShowWalletModal(true)}>
                            <SecurityItem
                                icon={<FaWallet />}
                                title={t('securityCenter.bindWallet')}
                                desc={t('securityCenter.bindWalletDesc')}
                                status=""
                            />
                        </div>
                        <SecurityItem
                            icon={<FaLock />}
                            title={t('securityCenter.changePassword')}
                            desc={t('securityCenter.recommendedPassword')}
                            status=""
                        />
                        {/* <div onClick={() => setShowTransactionPasswordModal(true)}>
                            <SecurityItem
                                icon={<FaKey />}
                                title="লেনদেন পাসওয়ার্ড"
                                desc="আপনাপ টাকা উত্তলন করতে উত্তলন পিন সেট করুন।"
                                status=""
                            />
                        </div> */}
                        <div onClick={() => setShowTransactionPasswordModal(true)}>
                            <SecurityItem
                                icon={<FaKey />}
                                title={t('securityCenter.transactionPassword')}
                                desc={t('securityCenter.setTransactionPassword')}
                                status=""
                            />
                        </div>
                        <div onClick={() => handleLogout()}>
                            <SecurityItem
                                icon={<FaPowerOff />}
                                title={t('securityCenter.logout')}
                                desc={t('securityCenter.safelyLogout')}
                                status=""
                                showArrow={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Wallet Cards Modal */}
            {showWalletModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center h-full w-full">
                    <div className="bg-white shadow-lg w-full h-full overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">{t('securityCenter.yourWallets')}</h3>
                            <button 
                                onClick={() => setShowWalletModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {loading ? (
                                <div className="flex justify-center py-8">{t('securityCenter.loadingWallets')}</div>
                            ) : cards.length > 0 ? (
                                <div className="space-y-4">
                                    {cards.map((card) => (
                                        <div 
                                            key={card.id} 
                                            className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="font-medium text-gray-900">{card.bank}</div>
                                                    <div className="text-lg font-bold mt-1">{card.maskedCardNumber}</div>
                                                    <div className="text-xs text-gray-500 mt-2">{t('securityCenter.wallet.added')} {card.dateAdded}</div>
                                                </div>
                                                <div className="bg-gray-100 rounded-lg p-2">
                                                    <div className="w-10 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {t('securityCenter.noWallets')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Personal Information Modal */}
            {showPersonalInfoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white shadow-lg w-full h-full overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">{t('securityCenter.updatePersonalInfo')}</h3>
                            <button 
                                onClick={() => setShowPersonalInfoModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('myAccount.nickname')}
                                    </label>
                                    <input
                                        type="text"
                                        value={nickName}
                                        onChange={(e) => setNickName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={t('myAccount.enterNickname')}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('myAccount.email')}
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={t('myAccount.enterEmail')}
                                    />
                                </div>
                                
                                <button
                                    onClick={handleSubmitPersonalInfo}
                                    disabled={submitting}
                                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                                        submitting 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                >
                                    {submitting ? t('securityCenter.updating') : t('myAccount.submit')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Password Modal */}
            {showTransactionPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white shadow-lg w-full h-full overflow-y-auto">
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">{t('securityCenter.setTransactionPasswordTitle')}</h3>
                            <button 
                                onClick={() => setShowTransactionPasswordModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Form */}
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('securityCenter.password')}
                                    </label>
                                    <input
                                        type="password"
                                        value={transactionPassword}
                                        onChange={(e) => setTransactionPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={t('securityCenter.enterPassword')}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('securityCenter.confirmPassword')}
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder={t('securityCenter.confirmPasswordPlaceholder')}
                                    />
                                </div>
                                
                                <button
                                    onClick={handleSubmitTransactionPassword}
                                    disabled={submitting}
                                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                                        submitting 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                                >
                                    {submitting ? t('securityCenter.setting') : t('securityCenter.setTransactionPasswordTitle')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}