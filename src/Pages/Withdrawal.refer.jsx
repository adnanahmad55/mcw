import React, { useState, useEffect } from 'react'
import PageTab from '../component/PageTab';
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from "react-toastify";
import axios from 'axios';
import { Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Withdrawal() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState("bKash");
    const [selectedAmount, setSelectedAmount] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionPassword, setTransactionPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userCoins, setUserCoins] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deviceID, setDeviceID] = useState("");
    const [unclaimedPromotions, setUnclaimedPromotions] = useState([]);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCardNumber, setNewCardNumber] = useState("");
    const [newCardName, setNewCardName] = useState("");
    const [isAddingCard, setIsAddingCard] = useState(false);

    const methods = [
        { id: "bKash", name: "bKash", img: "/assets/img/bkash.png" },
        { id: "Rocket", name: "Rocket", img: "/assets/img/rocket.png" },
        { id: "Nagad", name: "Nagad", img: "/assets/img/nagad.png" },
    ];
    const amounts = ['500', '1,000', '2,000', '5,000', '10,000', '100', '50', '10', '5', '1'];
    const authData = JSON.parse(localStorage.getItem("auth"));
    const token = authData?.token;
    const userId = authData?.userId;
    const username = authData?.username;
    const wallet_balance = localStorage.getItem("wallet_balance");

    // Load data on component mount
    useEffect(() => {
        fetchWithdrawalWallets();
        handleRefreshCoins();
        fetchPlayerTurnover();
    }, []);

    const handleRefreshCoins = async () => {
        setIsLoading(true);
        
        try {
            if (!authData || !authData.token || !authData.username) {
                console.error("Auth data missing");
                return;
            }

            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}v1/user/get-user-balance`,
                { username },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setUserCoins(response.data.data?.totalCoins || 0);
                localStorage.setItem('wallet_balance', response.data?.data?.totalCoins);
            } else {
                toast.error(response.data.message || "Failed to refresh balance");
            }
        } catch (error) {
            console.error("Error refreshing coins:", error);
            toast.error("Network error. Please try again.");
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        }
    };

    const fetchWithdrawalWallets = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}withdraw/get-withdrawal-wallet`,
                {
                    user_id: userId,
                    username
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.data.status) {
                const formattedCards = response.data.data.withdraw_wallet.slice(0, 3).map((wallet, index) => ({
                    id: `${wallet.bdt_id}-${index}`,
                    bank: wallet.bank_name,
                    cardNumber: wallet.bdt_id,
                    maskedCardNumber: wallet.bdt_id.length > 3 
                        ? '*'.repeat(wallet.bdt_id.length - 3) + wallet.bdt_id.slice(-3) 
                        : wallet.bdt_id,
                    name: "User",
                    dateAdded: "2025-09-24"
                }));
                setCards(formattedCards);
            } else {
                toast.error(response.data.message || "Failed to fetch wallets");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        }
    };

    // Fetch player turnover and promotions
    const fetchPlayerTurnover = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-player-turnover?username=${username}&user_id=${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            
            if (response.data.status) {
                const unclaimedPromotions = response.data.data.turnover.grouped_promotions.filter(promo => {
                    return (
                        promo.is_completed === false &&
                        promo.is_claimed === true &&
                        promo.is_claimable === false &&
                        promo.has_expired === false
                    );
                });

                setUnclaimedPromotions(unclaimedPromotions);
            } else {
                console.error("Failed to fetch player turnover:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching player turnover:", error);
        }
    };

    const handleAddCard = async () => {
        if (!newCardName.trim() || !newCardNumber.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsAddingCard(true);
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}withdraw/add-withdrawal-wallet`,
                {
                    user_id: userId,
                    username,
                    bank_name: selected,
                    bdt_id: newCardNumber
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.status) {
                toast.success("Wallet added successfully");
                fetchWithdrawalWallets(); // Refresh the list
                setShowAddCardModal(false);
                setNewCardNumber("");
                setNewCardName("");
            } else {
                toast.error(response.data.message || "Failed to add wallet");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsAddingCard(false);
        }
    };

    const handleSubmitWithdrawal = async () => {
        if (!amount || !transactionPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error("Invalid amount");
            return;
        }

        if (cards.length === 0) {
            toast.error("Please add at least one card");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const eligibilityResponse = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}withdraw/check-withdrawal-eligibility`,
                {
                    user_id: userId,
                    username
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!eligibilityResponse.data.status) {
                toast.error(eligibilityResponse.data.message || "Eligibility check failed");
                setIsSubmitting(false);
                return;
            }

            const selectedCard = cards[currentCardIndex];
            
            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}withdraw/player-withdrawal`,
                {
                    user_id: userId,
                    username,
                    amount: parseFloat(amount),
                    ip: "192.168.0.108",
                    bdt_id: selectedCard.cardNumber,
                    bank_name: selectedCard.bank,
                    password: transactionPassword,
                    device_id: deviceID
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.data.status) {
                toast.success("Withdrawal request submitted successfully");
                setAmount("");
                setTransactionPassword("");
                handleRefreshCoins();
            } else {
                toast.error(response.data.message || "Withdrawal failed");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAmountSelect = (value) => {
        const numValue = Number(value.replace(/,/g, '')); // Remove commas and convert to number
        setSelectedAmount(value);
        setAmount(numValue); // Update the input field with the numeric value
    };

    // Handle input change - update both amount and selectedAmount
    const handleAmountInputChange = (e) => {
        const value = e.target.value;
        setAmount(value);
        // Update selectedAmount if the input matches one of the predefined amounts
        if (amounts.includes(value)) {
            setSelectedAmount(value);
        } else {
            setSelectedAmount(""); // Clear selection if not a predefined amount
        }
    };

    useEffect(() => {
        const loadDeviceId = async () => {
            if (window.deviceId) {
                setDeviceID(window.deviceId);
            } else {
                setDeviceID("Web")
            }
        }

        loadDeviceId()
    }, []);

    const modalVariants = {
        hidden: { opacity: 0, y: "100%" },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
        exit: { opacity: 0, y: "100%", transition: { duration: 0.2 } }
    };

    return (
        <AnimatePresence>
            <motion.div className="fixed inset-0 z-50 bg-[#1f1f1f] overflow-y-auto"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className='w-full'>
                    <div className='flex justify-between items-center h-12 bg-app-color relative'>
                        <div className='w-full text-white text-[19px] text-center'>My Wallet</div>
                        <X className='absolute right-0  text-white cursor-pointer text-[26px] w-16' onClick={() => navigate('/')} />
                    </div>
                    <PageTab />

                    <motion.div
                        className='w-full'
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 20 }}
                    >
                        <div className='p-[2.1333333333vw] w-full'>
                            <div className='w-full bg-[#2b2922] flex flex-wrap items-center justify-between rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                <div className='flex items-center text-[4vw] font-medium text-white'>
                                    <span className='text-white whitespace-nowrap text-[3.2vw] bg-transparent border-0'>Withdrawable Amount</span>
                                </div>
                                <p className='text-[9.3333333333vw] font-medium text-white text-right w-full'>{userCoins.toFixed(2) || '0.00'}</p>
                            </div>
                        </div>

                        {/* <div className='p-[2.1333333333vw] w-full pt-0'>
                            <div className='w-full bg-[#2b2922] flex flex-wrap items-center justify-between rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                <div className='flex items-center text-[4vw] font-medium text-white'>
                                    <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Payment Method</div>
                                <div className="grid grid-cols-3 gap-3 mt-3 mb-4 w-full">
                                    {methods.map((m) => (
                                        <div
                                            key={m.id}
                                            onClick={() => setSelected(m.id)}
                                            className={`relative flex h-[78px] flex-col items-center justify-center rounded-md cursor-pointer transition ${selected === m.id
                                                ? "bg-[#222222] border border-[#ffb80c]"
                                                : "bg-[#222222]"
                                                }`}
                                        >
                                            <img src={m.img} alt={m.name} className="w-6 h-6 mb-1" />
                                            <span className="text-xs text-white">{m.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div> */}

                        {cards.length > 0 ? (
                            <div className='p-[2.1333333333vw] w-full pt-0'>
                                <div className='w-full bg-[#2b2922] rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center text-[4vw] font-medium text-white'>
                                            <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Card</div>
                                    </div>
                                    
                                    <div className="relative mb-6">
                                        <div className="relative h-[120px] overflow-hidden rounded-xl">
                                            {cards.map((card, index) => (
                                                <div 
                                                    key={card.id}
                                                    className={`absolute inset-0 transition-transform duration-300 ease-in-out ${
                                                        index === currentCardIndex 
                                                            ? 'translate-x-0 border-4 border-green-500 border-opacity-80' 
                                                            : 'translate-x-full'
                                                    }`}
                                                    style={{ 
                                                        transform: `translateX(${(index - currentCardIndex) * 100}%)`,
                                                        backgroundImage: `url('${index === 1 ? '/withdrawalCardBg2.png' : '/withdrawalCardBg.png'}')`,
                                                        backgroundSize: '100% 100%',
                                                        backgroundPosition: 'center',
                                                        borderRadius:'1.5rem'
                                                    }}
                                                >
                                                    {index === currentCardIndex && (
                                                        <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 z-10">
                                                            <svg 
                                                                className="w-4 h-4 text-white" 
                                                                fill="none" 
                                                                stroke="currentColor" 
                                                                viewBox="0 0 24 24" 
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path 
                                                                    strokeLinecap="round" 
                                                                    strokeLinejoin="round" 
                                                                    strokeWidth="3" 
                                                                    d="M5 13l4 4L19 7" 
                                                                />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="p-4 h-full flex flex-col justify-between text-white">
                                                        <div className="pl-10 pt-3">
                                                            <p className="text-sm">{card.bank}</p>
                                                            <p className="text-lg font-bold">{card.maskedCardNumber}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs">{card.dateAdded}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-center mt-2 space-x-2">
                                            {cards.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentCardIndex(index)}
                                                    className={`w-2 h-2 rounded-full ${
                                                        index === currentCardIndex ? 'bg-red-600' : 'bg-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='p-[2.1333333333vw] w-full pt-0'>
                                <div className='w-full bg-[#2b2922] rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center text-[4vw] font-medium text-white'>
                                            <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>No Cards Added</div>
                                    </div>
                                    
                                    <div 
                                        className="relative w-full flex flex-col items-center py-8 mb-6"
                                        style={{background:'url(/assets/img/empty-wallet.png)', backgroundSize:'cover', height:'192px'}}
                                    >
                                        <div className="w-48 h-28 rounded-xl flex items-end justify-center text-gray-400 text-sm">
                                            Empty E-Wallet
                                        </div>
                                    </div>
                                    
                                    <div className='w-full flex justify-end'>
                                        <button
                                            className="bg-[#fe0000] rounded-full p-3 shadow-md z-10 my-2"
                                            onClick={() => setShowAddCardModal(true)}
                                        >
                                            {/* <img src="/plus.svg" alt="Add Card" height={24} width={24}/> */}
                                            <Plus className="w-6 h-6 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className='p-[2.1333333333vw] w-full pt-0'>
                            <div className='w-full bg-[#2b2922] rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center text-[4vw] font-medium text-white'>
                                        <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Amount</div>
                                    <span className='text-white whitespace-nowrap text-[3.2vw] bg-transparent border-0'
                                        style={{
                                            textOverflow: ' ellipsis'
                                        }}>
                                        ৳ 500.00 - ৳ 24,000.00
                                    </span>
                                </div>
                                <div className='grid grid-cols-4 gap-3 w-full mt-3'>
                                    {amounts.map((a, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleAmountSelect(a)}
                                            className={`relative flex h-[40px] flex-col items-center justify-center rounded-[2.6666666667vw] text-[3.2vw] cursor-pointer transition ${selectedAmount === a
                                                ? "bg-[#222222] border border-[#ffb80c]"
                                                : "bg-[#222222]"
                                                }`}
                                        >
                                            <span className="text-xs text-white">{a}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className='w-full flex relative mt-3'>
                                    <span className='text-white text-[5.7333333333vw] absolute top-0 bottom-0 left-2 flex items-center justify-center'>
                                        ৳
                                    </span>
                                    <input 
                                        type='tel'
                                        value={amount}
                                        onChange={handleAmountInputChange}
                                        className='bg-[#3b392f] pl-6 text-[#fff] rounded-[1.3333333333vw] h-[11.7333333333vw] text-[4.2666666667vw] w-full' 
                                    />
                                </div>

                            </div>

                            

                            {unclaimedPromotions.length > 0 ? (
                                <div className="bg-[#2b2922] mt-3 rounded-[1.3333333333vw] p-[2.1333333333vw]">
                                    <div className="text-center mb-4">
                                        <h2 className="text-[3.4666666667vw] font-semibold text-white mb-2">Available Promotions</h2>
                                        <p className="text-red-500 font-medium text-[2.8444444444vw]">Complete requirements to claim these promotions.</p>
                                    </div>

                                    <div className="bg-[#3b392f] overflow-hidden">
                                        <div className="flex bg-[#4d4d4d] text-white font-medium">
                                            <div className="flex-1 px-[2.1333333333vw] py-[2.1333333333vw] text-left text-[2.8444444444vw]">Promotion</div>
                                            <div className="flex-1 px-[2.1333333333vw] py-[2.1333333333vw] text-right text-[2.8444444444vw]">Amount</div>
                                        </div>
                                        
                                        {unclaimedPromotions.map((promo) => (
                                            <div key={promo._id} className="flex border-b border-[#4d4d4d]">
                                                <div className="flex-1 px-[2.1333333333vw] py-[2.1333333333vw] text-white text-[2.8444444444vw]">{promo.title}</div>
                                                <div className="flex-1 px-[2.1333333333vw] py-[2.1333333333vw] text-right text-red-500 font-semibold text-[2.8444444444vw]">৳{promo.required_turnover - promo.current_turnover}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="w-full mt-[2.1333333333vw] py-[2.6666666667vw] bg-[#fe002d] text-white rounded-[1.3333333333vw] font-semibold text-[3.7333333333vw]"
                                        style={{boxShadow:'0 .1rem .5rem .1rem rgba(255, 0, 0, .36)'}}
                                    >
                                        OK
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className='w-full bg-[#2b2922] mt-3 min-h-[90px] rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center text-[4vw] font-medium text-white'>
                                                <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Transaction Password</div>
                                        </div>
                                        
                                        <div className='w-full flex relative mt-3'>
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                value={transactionPassword}
                                                onChange={(e) => setTransactionPassword(e.target.value)}
                                                placeholder="Transaction Password"
                                                className='bg-[#3b392f] pl-6 text-[#fff] rounded-[1.3333333333vw] h-[11.7333333333vw] text-[4.2666666667vw] w-full' 
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <img
                                                    src={showPassword ? "/eye_open.svg" : "/eye_close.svg"}
                                                    alt="toggle password visibility"
                                                    height={20}
                                                    width={20}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSubmitWithdrawal}
                                        disabled={isSubmitting || cards.length === 0 || !amount || !transactionPassword}
                                        className={`text-[#222222] mt-4 w-full text-[5.3333333333vw] rounded-[1.3333333333vw] h-[12.8vw] flex justify-center items-center ${
                                            isSubmitting || cards.length === 0 || !amount || !transactionPassword
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : ""
                                        }`}
                                        style={{
                                            background: isSubmitting || cards.length === 0 || !amount || !transactionPassword
                                                ? 'linear-gradient(180deg, #999 0%, #999 100%)'
                                                : 'linear-gradient(180deg, #ffb80c 0%, #ffb80c 100%)'
                                        }}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Submit'}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Add Card Modal */}
                        {showAddCardModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-[2.1333333333vw]">
                                <div className="bg-[#2b2922] rounded-[1.3333333333vw] w-full max-w-md p-[2.1333333333vw]">
                                    <div className="flex justify-between items-center mb-[2.1333333333vw]">
                                        <h3 className="text-white text-[4.2666666667vw] font-bold">Add New Card</h3>
                                        <button 
                                            onClick={() => setShowAddCardModal(false)}
                                            className="text-white text-[4.8vw]"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                    
                                    {/* E-wallet Group Selection */}
                                    <div className="mb-[2.1333333333vw]">
                                        <div className="flex w-[120px] mb-[2.1333333333vw]">
                                            <div className="w-full border-[#ff3039] rounded-lg p-1 flex items-center justify-center" style={{borderWidth:'1px', background:'rgba(255, 48, 57, .06)'}}>
                                                <img src="/ewallet.webp" alt="E-wallet" style={{height:'42px'}}/>
                                            </div>
                                        </div>
                                        
                                        {/* E-wallet type selection */}
                                        <div className="mb-[2.1333333333vw]">
                                            <h3 className="text-white text-[3.2vw] mb-[1.6vw]">E-wallet type</h3>
                                            <div className="flex justify-evenly gap-[1.3333333333vw]">
                                                {["Nagad", "BKash", "Rocket"].map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setSelected(type)}
                                                        className={`px-[2.1333333333vw] py-[1.6vw] flex-1 rounded-lg text-medium transition-colors ${
                                                            selected === type
                                                                ? "bg-[#ff30390f] text-black border border-[#ff3039]"
                                                                : "bg-[#3b392f] text-[#9fa7ab] border border-[#0003] hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-[2.1333333333vw]">
                                        <label className="text-white text-[3.2vw] block mb-[1.0666666667vw]">Card Number</label>
                                        <input
                                            type="text"
                                            value={newCardNumber}
                                            onChange={(e) => setNewCardNumber(e.target.value)}
                                            placeholder={`Please fill in ${selected} account number`}
                                            className="w-full bg-[#3b392f] text-white rounded-[1.3333333333vw] p-[2.1333333333vw] text-[3.7333333333vw]"
                                        />
                                    </div>
                                    
                                    <div className="mb-[2.1333333333vw]">
                                        <label className="text-white text-[3.2vw] block mb-[1.0666666667vw]">Full Name</label>
                                        <input
                                            type="text"
                                            value={newCardName}
                                            onChange={(e) => setNewCardName(e.target.value)}
                                            placeholder="Full name of the payee"
                                            className="w-full bg-[#3b392f] text-white rounded-[1.3333333333vw] p-[2.1333333333vw] text-[3.7333333333vw]"
                                        />
                                    </div>
                                    
                                    <div className="mb-[2.1333333333vw] text-[2.8444444444vw] text-red-500">
                                        Please ensure the name you provide matches exactly with the name registered with your financial provider to avoid failure. Once the name is submitted, it cannot be changed
                                    </div>
                                    
                                    <button
                                        onClick={handleAddCard}
                                        disabled={isAddingCard}
                                        className="w-full py-[2.6666666667vw] bg-[#4CAF50] text-white rounded-[1.3333333333vw] font-bold text-[3.7333333333vw]"
                                    >
                                        {isAddingCard ? 'Adding...' : 'Add Card'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}