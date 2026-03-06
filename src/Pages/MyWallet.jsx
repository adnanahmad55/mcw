import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import { Plus } from 'lucide-react';
import { CgSpinner } from "react-icons/cg";
import { IoIosClose } from "react-icons/io";

// Simple checkmark SVG icon component
const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#ffb80c]"
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default function MyWallet({ isDeposit = true }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentView, setCurrentView] = useState(isDeposit ? 'deposit' : 'withdrawal');
    const [cardNumber, setCardNumber] = useState('');

    // Update current view when the prop changes
    useEffect(() => {
        setCurrentView(isDeposit ? 'deposit' : 'withdrawal');
    }, [isDeposit]);

    // Animation variants for sliding between views
    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    // Direction for swipe animation (1 for right, -1 for left)
    const [direction, setDirection] = useState(0);

    // Handle tab change by navigating to the appropriate route
    const handleTabChange = (view) => {
        const prevView = currentView;
        setCurrentView(view);

        // Set direction for animation: 1 if going from left (deposit) to right (withdrawal), -1 if going from right to left
        setDirection(prevView === 'deposit' && view === 'withdrawal' ? 1 : -1);

        if (view === 'deposit') {
            navigate('/deposit', {
                state: { backgroundLocation: location },
            });
        } else {
            navigate('/withdrawal', {
                state: { backgroundLocation: location },
            });
        }
    };

    // Animation variants for the entire modal
    const modalVariants = {
        initial: {
            opacity: 0,
            y: "50%",
            scale: 0.98,
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1,
        },
        exit: {
            opacity: 0,
            y: "50%",
            scale: 0.98,
        },
    };


    // DEPOSIT LOGIC STARTS HERE
    const [selected, setSelected] = useState("bKash");
    const [selectedAmount, setSelectedAmount] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedPhone, setSelectedPhone] = useState(null);

    const authData = JSON.parse(localStorage.getItem("auth"));

    const user_id = authData?.userId;
    const username = authData?.username;
    const token = authData?.token;

    const [remark, setRemark] = useState('');
    const [promotionMsg, setPromotionMsg] = useState("");
    const [eligible, setEligible] = useState(false);
    const [bonusList, setBonusList] = useState([]);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [deviceID, setDeviceID] = useState("");

    // State for iframe modal
    const [iframeUrl, setIframeUrl] = useState(null);

    // 🔹 Check Promotion eligibility
    useEffect(() => {
        const checkPromotion = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_APP_PROMOTION_API}/promotion/get-all-user-eligible-promotion?player_id=${user_id}&operator_code=${import.meta.env.VITE_APP_OPERATOR_ID}`, {

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                });

                if (data?.data?.status) {
                    setBonusList(data?.data?.data?.available_bonus);
                    if (data?.data?.status) {
                        setEligible(true);
                    } else {
                        setEligible(false);
                    }
                }
            } catch (err) {
                console.error("Promotion check error:", err);
            }
        };

        if (username) {
            checkPromotion();
        }
    }, [username]);

    const getBonusAmount = (depositAmount) => {
        if (!selectedPromo || !bonusList || bonusList.length === 0) return null;

        // Find the selected promotion
        const selectedBonus = bonusList.find(bonus => bonus._id === selectedPromo._id);
        if (!selectedBonus || !selectedBonus.deposit_variation) return null;

        // Find the variation that matches the deposit amount
        for (let variation of selectedBonus.deposit_variation) {
            if (depositAmount >= variation.min_amount && depositAmount <= variation.max_amount) {
                return variation.bonus_amount;
            }
        }
        return null;
    };

    // 🔹 Fetch banks from API
    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem("auth"));
        const { token, username, userId } = authData;

        const fetchBanks = async () => {
            try {
                const data = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}fetch-bdt-upi`, {

                    operator_code: import.meta.env.VITE_APP_OPERATOR_ID,
                    player_id: userId,
                    txn_type: 'deposit'

                });
                if (data?.data?.status) {

                    setBanks(data?.data?.data);
                }
            } catch (err) {
                console.error("Error fetching banks:", err);
            }
        };
        fetchBanks();
    }, []);

    useEffect(() => {
        const loadDeviceId = () => {
            if (window.deviceId && typeof window.deviceId === 'string') {
                console.log('Using mobile device ID:', window.deviceId);
                setDeviceID(window.deviceId);
            } else {
                console.log('Using web identifier: web');
                setDeviceID("web");
            }
        };

        loadDeviceId();
    }, []);

    // Function to generate random transaction ID
    const generateRandomTxnId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedBank || !amount) {
            alert("Please select a payment method and enter an amount ❌");
            return;
        }

        if (amount < 100) {
            alert("Minimum amount to deposit is 100");
            return;
        }

        setLoading(true);

        try {
            const randomTxnId = generateRandomTxnId();

            const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}player-deposit`, {
                operator_code: import.meta.env.VITE_APP_OPERATOR_ID,
                player_id: user_id,
                // username,
                amount: Number(amount),
                // ip: window.location.hostname,
                // remarks: "Deposit via OKPay",
                // device_id: deviceID,
                promotion_id: selectedPromo?._id || "",
                // txnId: randomTxnId,
                // bdt_id: selectedBank.bdt_id,
                method: selectedBank,
                details: {
                    "method": selectedBank?.toUpperCase(),
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });


            if (response.data.status) {
                toast.success(response.data.message);
                setIframeUrl(response?.data?.data?.data?.url);
            } else {
                toast.error(response.data.message || "Deposit failed");
            }
        } catch (err) {
            console.error("Deposit error:", err);
            toast.error(err.response?.data?.message || "Deposit failed. Please try again");
        } finally {
            setLoading(false);
        }
    };

    // Handle amount selection - update both selectedAmount and amount input
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

    // Close iframe modal
    const closeIframeModal = () => {
        setIframeUrl(null);
    };

    const methods = [
        { id: "bKash", name: "bKash", img: "/assets/img/bkash.png" },
        { id: "Rocket", name: "Rocket", img: "/assets/img/rocket.png" },
        { id: "Nagad", name: "Nagad", img: "/assets/img/nagad.png" },
    ];
    const amounts = ['100', '200', '500', '1000', '2000', '5000', '8000', '10000', '20000', '25000'];

    const wallet_balance = localStorage.getItem("wallet_balance");

    // WITHDRAWAL LOGIC STARTS HERE
    const [withdrawalSelected, setWithdrawalSelected] = useState("bKash");
    const [withdrawalSelectedAmount, setWithdrawalSelectedAmount] = useState("");
    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    // const [transactionPassword, setTransactionPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [userCoins, setUserCoins] = useState(0);
    const [withdrawalIsLoading, setWithdrawalIsLoading] = useState(false);
    // const [cards, setCards] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [withdrawalDeviceID, setWithdrawalDeviceID] = useState("");
    const [unclaimedPromotions, setUnclaimedPromotions] = useState([]);
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCardNumber, setNewCardNumber] = useState("");
    const [newCardName, setNewCardName] = useState("");
    const [isAddingCard, setIsAddingCard] = useState(false);

    const cards = [
        {
            "id": "876543456-0",
            "bank": "bkash",
            "cardNumber": "876543456",
            "maskedCardNumber": "******456",
            "name": "User",
            "dateAdded": "2025-09-24"
        },
        {
            "id": "nagad-1",
            "bank": "nagad",
            "cardNumber": "nagad",
            "maskedCardNumber": "**gad",
            "name": "User",
            "dateAdded": "2025-09-24"
        }
    ]

    // Load data on component mount
    useEffect(() => {
        if (currentView === 'withdrawal') {
            // fetchWithdrawalWallets();
            handleRefreshCoins();
            // fetchPlayerTurnover();
        }
    }, [currentView]);

    const handleRefreshCoins = async () => {
        setWithdrawalIsLoading(true);

        try {
            if (!authData || !authData.token || !authData.username) {
                console.error("Auth data missing");
                return;
            }

            const response = await fetch(
                `${import.meta.env.VITE_APP_API_BASE_URL}api/user-get-balance`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        player_id: user_id,
                        operator_id: import.meta.env.VITE_APP_OPERATOR_ID,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok && data?.data) {
                const wallet = data?.data?.wallet;
                setUserCoins(wallet);
                localStorage.setItem("wallet_balance", JSON.stringify(wallet));
            } else {
                console.error("Failed to refresh coins:", data.message);
            }
        } catch (error) {
            console.error("Error refreshing coins:", error);

        } finally {
            setTimeout(() => {
                setWithdrawalIsLoading(false);
            }, 1000);
        }
    };

    // const fetchWithdrawalWallets = async () => {
    //     try {
    //         const response = await axios.post(
    //             `${import.meta.env.VITE_APP_API_BASE_URL}withdraw/get-withdrawal-wallet`,
    //             {
    //                 user_id: user_id,
    //                 username
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`
    //                 }
    //             }
    //         );

    //         if (response.data.status) {
    //             const formattedCards = response.data.data.withdraw_wallet.slice(0, 3).map((wallet, index) => ({
    //                 id: `${wallet.bdt_id}-${index}`,
    //                 bank: wallet.bank_name,
    //                 cardNumber: wallet.bdt_id,
    //                 maskedCardNumber: wallet.bdt_id.length > 3
    //                     ? '*'.repeat(wallet.bdt_id.length - 3) + wallet.bdt_id.slice(-3)
    //                     : wallet.bdt_id,
    //                 name: "User",
    //                 dateAdded: "2025-09-24"
    //             }));
    //             setCards(formattedCards);
    //         } else {
    //             toast.error(response.data.message || "Failed to fetch wallets");
    //         }
    //     } catch (error) {
    //         toast.error("Network error. Please try again.");
    //     }
    // };

    // Fetch player turnover and promotions
    const fetchPlayerTurnover = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-player-turnover?username=${username}&user_id=${user_id}`,
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
                    user_id: user_id,
                    username,
                    bank_name: withdrawalSelected,
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
                // fetchWithdrawalWallets(); // Refresh the list
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


        if (!withdrawalAmount) {
            toast.error("Please fill in all fields");
            return;
        }

        if (isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
            toast.error("Invalid amount");
            return;
        }

        if (cards.length === 0) {
            toast.error("Please add at least one card");
            return;
        }
        if (!cardNumber) {
            toast.error("Please Enter Card Number");
            return;
        }

        setIsSubmitting(true);

        try {
            // const eligibilityResponse = await axios.post(
            //     `${import.meta.env.VITE_APP_API_BASE_URL}withdraw/check-withdrawal-eligibility`,
            //     {
            //         user_id: user_id,
            //         username
            //     },
            //     {
            //         headers: {
            //             'Content-Type': 'application/json',
            //             'Authorization': `Bearer ${token}`
            //         }
            //     }
            // );

            // if (!eligibilityResponse.data.status) {
            //     toast.error(eligibilityResponse.data.message || "Eligibility check failed");
            //     setIsSubmitting(false);
            //     return;
            // }

            const selectedCard = cards[currentCardIndex];

            const response = await axios.post(
                `${import.meta.env.VITE_APP_API_BASE_URL}player-withdraw`,
                {
                    player_id: user_id,
                    operator_id: import.meta.env.VITE_APP_OPERATOR_ID,
                    username,
                    amount: parseFloat(withdrawalAmount),
                    ip: "192.168.0.108",
                    bank_name: selectedCard.bank,
                    device_id: withdrawalDeviceID,
                    acc_details: {
                        channel_id: cardNumber,
                        acc_holder_name: username, // ⚠️ yaha userName undefined tha
                        payment_channel: selectedCard.bank,
                        method: selectedCard.bank,
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status) {
                toast.success("Withdrawal request submitted successfully");
                setWithdrawalAmount("");
                // setTransactionPassword("");
                handleRefreshCoins();
            } else {
                toast.error(error?.response?.data?.message || "Withdrawal failed");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWithdrawalAmountSelect = (value) => {
        const numValue = Number(value.replace(/,/g, '')); // Remove commas and convert to number
        setWithdrawalSelectedAmount(value);
        setWithdrawalAmount(numValue); // Update the input field with the numeric value
    };

    // Handle input change - update both amount and selectedAmount
    const handleWithdrawalAmountInputChange = (e) => {
        const value = e.target.value;
        setWithdrawalAmount(value);
        // Update selectedAmount if the input matches one of the predefined amounts
        if (amounts.includes(value)) {
            setWithdrawalSelectedAmount(value);
        } else {
            setWithdrawalSelectedAmount(""); // Clear selection if not a predefined amount
        }
    };

    useEffect(() => {
        const loadWithdrawalDeviceId = async () => {
            if (window.deviceId) {
                setWithdrawalDeviceID(window.deviceId);
            } else {
                setWithdrawalDeviceID("Web")
            }
        }

        loadWithdrawalDeviceId()
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-currentColor overflow-y-auto"
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <div className='w-full mb-20'>
                <div className='flex justify-between items-center h-12 bg-[#C9A33D] relative'>
                    <div className='w-full text-white text-[19px] text-center'>My Wallet</div>
                    <X
                        className='absolute right-0 text-white cursor-pointer text-[26px] w-16'
                        onClick={() => navigate('/')}
                    />
                </div>
                <div className='w-full bg-[#C9A33D] p-[2.1333333333vw] pt-0'>
                    <div className='bg-[#A5852E] rounded-[1.3333333333vw] grid grid-cols-2 relative overflow-hidden p-1'>

                        {/* Deposit Tab - on the left */}
                        <div
                            onClick={() => handleTabChange('deposit')}
                            className="relative flex items-center justify-center text-center h-[8.5333333333vw] text-[3.4666666667vw] cursor-pointer rounded-[1.3333333333vw] text-white/70"
                        >
                            {currentView === 'deposit' && (
                                <motion.div
                                    layoutId="activeBg"
                                    initial={{ x: -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -100, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="absolute inset-0 rounded-[1.3333333333vw] bg-[#A56C0B]"
                                />
                            )}
                            <span className="relative z-10 font-semibold">Deposit</span>
                        </div>

                        {/* Withdrawal Tab - on the right */}
                        <div
                            onClick={() => handleTabChange('withdrawal')}
                            className="relative flex items-center justify-center text-center h-[8.5333333333vw] text-[3.4666666667vw] cursor-pointer rounded-[1.3333333333vw] text-white/70"
                        >
                            {currentView === 'withdrawal' && (
                                <motion.div
                                    layoutId="activeBg"
                                    initial={{ x: 100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 100, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="absolute inset-0 rounded-[1.3333333333vw] bg-[#A56C0B]"
                                />
                            )}
                            <span className="relative z-10 font-semibold">Withdrawal</span>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    <AnimatePresence
                        mode="wait"
                        custom={direction}
                        initial={false}
                    >
                        {currentView === 'deposit' ? (
                            <motion.div
                                key="deposit"
                                className='w-full'
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                            >
                                <div className='w-full'>
                                    <div className='p-[2.1333333333vw] w-full'>
                                        <div className='w-full bg-secondaryColor flex items-center justify-between rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                            <div className='flex items-center text-[4vw] font-medium text-white'>
                                                <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Select Promotion</div>
                                            <select
                                                className="
                                                      text-white
                                                      bg-secondaryColor
                                                      rounded-md
                                                      px-3
                                                      py-2
                                                      text-sm
                                                      w-full
                                                      max-w-[200px]
                                                      truncate
                                                  "
                                                value={selectedPromo?._id || ""}
                                                onChange={(e) => {
                                                    const promo = bonusList.find(b => b._id === e.target.value);
                                                    setSelectedPromo(promo || null);
                                                }}
                                            >
                                                <option value="">No Promotion</option>
                                                {bonusList.map((bonus) => (
                                                    <option key={bonus._id} value={bonus._id} className="truncate">
                                                        {bonus.title}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                    </div>
                                    <div className='p-[2.1333333333vw] w-full pt-0'>
                                        <div className='w-full bg-secondaryColor flex flex-wrap items-center justify-between rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                            <div className='flex items-center text-[4vw] font-medium text-white'>
                                                <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Payment Method</div>
                                            <div className="grid grid-cols-3 gap-3 mt-3 mb-4 w-full">
                                                {banks.map((bank, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            setSelectedBank(bank?.details?.payment_channel);
                                                            setSelectedPhone(bank?.details?.channel_id);
                                                            setSelected(bank?.details?.payment_channel); // Update the selected method to match bank name
                                                        }}
                                                        className={`relative flex h-[78px] flex-col items-center justify-center rounded-md cursor-pointer transition ${selectedBank === bank?.details?.payment_channel
                                                            ? "bg-[var(--radio-bg)] border border-[#ffb80c]"
                                                            : "bg-[var(--radio-bg)]"
                                                            }`}
                                                    >

                                                        <img
                                                            src={`/assets/img/deposit/${bank?.details?.payment_channel?.toLowerCase() ?? ""}.png`}
                                                            alt={bank?.details?.payment_channel}
                                                            className="w-6 h-6 mb-1"
                                                            onError={(e) => (e.target.src = "/assets/img/default-bank.png")} // Fallback to default image
                                                        />
                                                        <span className="text-xs text-white">{bank?.details?.payment_channel}</span>
                                                        {/* Bonus badge */}
                                                        {selectedPromo && getBonusAmount(Number(amount)) && (
                                                            <span className="absolute z-[3] right-[-1.0666666667vw] animate-[\_ngcontent-serverApp-c4271250685\_tagRebateBoney_1s_0.3s_forwards] tag-rebate-money shadow-[0_0_2px_#0000004d] text-white pointer-events-none px-[0.8vw] py-0 rounded-[0_0.8vw_0.8vw_0] top-[2.1333333333vw] bg-[#ff5959] text-[12px]">
                                                                +{getBonusAmount(Number(amount))}
                                                            </span>
                                                        )}
                                                        {/* Checkmark indicator when selected */}
                                                        {selectedBank === bank?.details?.payment_channel && (
                                                            <div className="absolute top-0 right-0 p-1">
                                                                <CheckIcon />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className='w-full border-t border-dashed pb-[4.2666666667vw] pt-[2.2666666667vw] grid grid-cols-2'
                                                style={{ borderColor: 'rgba(255, 255, 255, .05)' }}>
                                                <div className='text-[2.6666666667vw] text-white border h-10 flex items-center justify-center bg-[#222] border-[#ffb80c] text-center px-[2.1333333333vw] rounded-[2.6666666667vw]'>
                                                    {selectedBank || "Select a Payment Method"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='p-[2.1333333333vw] w-full pt-0'>
                                        <div className='w-full bg-secondaryColor rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                            <div className='flex items-center justify-between'>
                                                <div className='flex items-center text-[4vw] font-medium text-white'>
                                                    <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Amount</div>
                                                <span className='text-white whitespace-nowrap text-[3.2vw] bg-transparent border-0'
                                                    style={{
                                                        textOverflow: ' ellipsis'
                                                    }}>
                                                    ৳ 100.00 - ৳ 25,000.00
                                                </span>
                                            </div>
                                            <div className='grid grid-cols-5 gap-3 w-full mt-3'>
                                                {amounts.map((a, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleAmountSelect(a)}
                                                        className={`relative flex h-[40px] flex-col items-center justify-center rounded-[2.6666666667vw] text-[3.2vw] cursor-pointer transition ${selectedAmount === a
                                                            ? "bg-[var(--radio-bg)] border border-[#ffb80c]"
                                                            : "bg-[var(--radio-bg)]"
                                                            }`}
                                                    >
                                                        <span className="text-xs text-white">{a}</span>
                                                        {/* Checkmark indicator when selected */}
                                                        {selectedAmount === a && (
                                                            <div className="absolute top-0 right-0 p-0.5">
                                                                <CheckIcon />
                                                            </div>
                                                        )}
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
                                                    className='bg-[var(--form-input-bg)] pl-6 text-[#fff] rounded-[1.3333333333vw] h-[11.7333333333vw] text-[4.2666666667vw] w-full'
                                                    placeholder="Enter amount"
                                                />
                                            </div>
                                        </div>
                                        {/* <button
                                              onClick={handleSubmit}
                                              className="text-[var(--radio-bg)] mt-4 w-full text-[5.3333333333vw] rounded-[1.3333333333vw] h-[12.8vw] flex justify-center items-center"
                                              style={{
                                                  background: 'linear-gradient(180deg, #ffb80c 0%, #ffb80c 100%)'
                                              }}
                                          >
                                              {loading ? "Processing..." : "Submit"}
                                          </button> */}
                                        <div
                                            onClick={handleSubmit}
                                            className="member-content  ng-star-inserted"
                                            style={{}}
                                        >
                                            <div

                                                className="button btn-primary "
                                            >
                                                <a

                                                    className=""
                                                >
                                                    {loading ? "Processing..." : "Submit"}
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {loading && (
                                        <div
                                            style={{
                                                position: "fixed",
                                                top: 0,
                                                left: 0,
                                                width: "100vw",
                                                height: "100vh",
                                                background: "rgba(0,0,0,0.7)",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                zIndex: 9999,
                                            }}
                                        >
                                            <CgSpinner
                                                style={{
                                                    fontSize: "3rem",
                                                    color: "#fff",
                                                    animation: "spin 1s linear infinite",
                                                }}
                                            />
                                            <style>
                                                {`
                                              @keyframes spin {
                                                from { transform: rotate(0deg); }
                                                to { transform: rotate(360deg); }
                                              }
                                            `}
                                            </style>
                                        </div>
                                    )}
                                    {/* Iframe Modal */}
                                    {iframeUrl && (
                                        <div className="fixed inset-0 bg-black bg-opacity-90 z-[999] flex flex-col">
                                            <div className="flex justify-end items-center px-4 bg-black">
                                                <button
                                                    onClick={closeIframeModal}
                                                    className="text-white text-xl"
                                                >
                                                    <IoIosClose className='text-white text-[26px]' />
                                                </button>
                                            </div>
                                            <iframe
                                                src={iframeUrl}
                                                className="w-full h-full flex-grow"
                                                title="Deposit Gateway"
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="withdrawal"
                                className='w-full'
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                            >
                                <div className='w-full'>
                                    <div className='p-[2.1333333333vw] w-full'>
                                        <div className='w-full bg-secondaryColor flex flex-wrap items-center justify-between rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                            <div className='flex items-center text-[4vw] font-medium text-white'>
                                                <span className='text-white whitespace-nowrap text-[3.2vw] bg-transparent border-0'>Withdrawable Amount</span>
                                            </div>
                                            <p className='text-[9.3333333333vw] font-medium text-white text-right w-full'>{userCoins.toFixed(2) || '0.00'}</p>
                                        </div>
                                    </div>

                                    {/* <div className='p-[2.1333333333vw] w-full pt-0'>
                                          <div className='w-full bg-secondaryColor flex flex-wrap items-center justify-between rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                              <div className='flex items-center text-[4vw] font-medium text-white'>
                                                  <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Payment Method</div>
                                              <div className="grid grid-cols-3 gap-3 mt-3 mb-4 w-full">
                                                  {methods.map((m) => (
                                                      <div
                                                          key={m.id}
                                                          onClick={() => setWithdrawalSelected(m.id)}
                                                          className={`relative flex h-[78px] flex-col items-center justify-center rounded-md cursor-pointer transition ${withdrawalSelected === m.id
                                                              ? "bg-[var(--radio-bg)] border border-[#ffb80c]"
                                                              : "bg-[var(--radio-bg)]"
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
                                            <div className='w-full bg-secondaryColor rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center text-[4vw] font-medium text-white'>
                                                        <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Card</div>
                                                </div>

                                                <div className="relative mb-6">
                                                    <div className="relative h-[120px] overflow-hidden rounded-xl">
                                                        {cards.map((card, index) => (
                                                            <div
                                                                key={card.id}
                                                                className={`absolute inset-0 transition-transform duration-300 ease-in-out ${index === currentCardIndex
                                                                    ? 'translate-x-0 border-4 border-green-500 border-opacity-80'
                                                                    : 'translate-x-full'
                                                                    }`}
                                                                style={{
                                                                    transform: `translateX(${(index - currentCardIndex) * 100}%)`,
                                                                    backgroundImage: `url('${index === 1 ? '/withdrawalCardBg2.png' : '/withdrawalCardBg.png'}')`,
                                                                    backgroundSize: '100% 100%',
                                                                    backgroundPosition: 'center',
                                                                    borderRadius: '1.5rem'
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
                                                                        {/* <p className="text-lg font-bold">{card.maskedCardNumber}</p> */}
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
                                                                className={`w-2 h-2 rounded-full ${index === currentCardIndex ? 'bg-red-600' : 'bg-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className='p-[2.1333333333vw] w-full pt-0'>
                                            <div className='w-full bg-secondaryColor rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center text-[4vw] font-medium text-white'>
                                                        <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>No Cards Added</div>
                                                </div>

                                                <div
                                                    className="relative w-full flex flex-col items-center py-8 mb-6"
                                                    style={{ background: 'url(/assets/img/empty-wallet.png)', backgroundSize: 'cover', height: '192px' }}
                                                >
                                                    <div className="w-48 h-28 rounded-xl flex items-end justify-center text-gray-400 text-sm">
                                                        Empty E-Wallet
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}

                                    {/* {cards.length < 3 && (
                                        <div className='mx-2 rounded flex justify-end bg-secondaryColor mb-2 px-2'>
                                            <button
                                                className="bg-[#fe0000] rounded-full p-3 shadow-md z-10 my-2"
                                                onClick={() => setShowAddCardModal(true)}
                                            >
                                                
                                                <Plus className="w-6 h-6 text-white" />
                                            </button>
                                        </div>
                                    )} */}

                                    <div className='w-full flex relative mx-2 mb-3'>
                                        {/* <span className='text-white text-[5.7333333333vw] absolute top-0 bottom-0 left-2 flex items-center justify-center'>
                                                    ৳
                                                </span> */}
                                        <input
                                            placeholder={`Card Number`}
                                            type='tel'
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            className='bg-[var(--form-input-bg)] px-2 text-[#fff] rounded-[1.3333333333vw] h-[11.7333333333vw] text-[4.2666666667vw] w-full'
                                        />
                                    </div>

                                    <div className='p-[2.1333333333vw] w-full pt-0'>
                                        <div className='w-full bg-secondaryColor rounded-[1.3333333333vw] p-[2.1333333333vw]'>
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
                                            <div className='grid grid-cols-5 gap-3 w-full mt-3'>
                                                {amounts.map((a, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleWithdrawalAmountSelect(a)}
                                                        className={`relative flex h-[40px] flex-col items-center justify-center rounded-[2.6666666667vw] text-[3.2vw] cursor-pointer transition ${withdrawalSelectedAmount === a
                                                            ? "bg-[var(--radio-bg)] border border-[#ffb80c]"
                                                            : "bg-[var(--radio-bg)]"
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
                                                    value={withdrawalAmount}
                                                    onChange={handleWithdrawalAmountInputChange}
                                                    className='bg-[var(--form-input-bg)] pl-6 text-[#fff] rounded-[1.3333333333vw] h-[11.7333333333vw] text-[4.2666666667vw] w-full'
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    {/* <div className='p-[2.1333333333vw] w-full pt-0'>
                                          <div className='w-full bg-secondaryColor rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                              <div className='flex items-center justify-between'>
                                                  <div className='flex items-center text-[4vw] font-medium text-white'>
                                                      <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Transaction Password</div>
                                              </div>
                                              <div className='w-full flex relative mt-3'>
                                                  <input
                                                      type={showPassword ? 'text' : 'password'}
                                                      value={transactionPassword}
                                                      onChange={(e) => setTransactionPassword(e.target.value)}
                                                      className='bg-[var(--form-input-bg)] pl-4 text-[#fff] rounded-[1.3333333333vw] h-[11.7333333333vw] text-[4.2666666667vw] w-full'
                                                      placeholder="Enter transaction password"
                                                  />
                                                  <button
                                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                                                      onClick={() => setShowPassword(!showPassword)}
                                                  >
                                                      {showPassword ? 'Hide' : 'Show'}
                                                  </button>
                                              </div>
                                          </div>
                                      </div> */}

                                    {/* <button
                                          onClick={handleSubmitWithdrawal}
                                          disabled={isSubmitting}
                                          className="text-[var(--radio-bg)] mt-4 w-full text-[5.3333333333vw] rounded-[1.3333333333vw] h-[12.8vw] flex justify-center items-center"
                                          style={{
                                              background: isSubmitting
                                                  ? 'linear-gradient(180deg, #cccccc 0%, #cccccc 100%)'
                                                  : 'linear-gradient(180deg, #ffb80c 0%, #ffb80c 100%)'
                                          }}
                                      >
                                          {isSubmitting ? "Processing..." : "Submit"}
                                      </button> */}
                                    <div
                                        onClick={handleSubmitWithdrawal}
                                        disabled={isSubmitting}
                                        className="member-content  ng-star-inserted"
                                        style={{}}
                                    >
                                        <div

                                            className="button btn-primary "
                                        >
                                            <a

                                                className=""
                                            >
                                                {isSubmitting ? "Processing..." : "Submit"}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Add Card Modal */}
                                    {showAddCardModal && (
                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                            <div className="bg-secondaryColor rounded-[1.3333333333vw] p-[2.1333333333vw] w-full max-w-md">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-white text-lg font-bold">Add New Card</h3>
                                                    <button
                                                        onClick={() => setShowAddCardModal(false)}
                                                        className="text-white"
                                                    >
                                                        <X size={24} />
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-white text-sm mb-2">Select Bank</label>
                                                        <div className="grid grid-cols-2 gap-3 mt-2 bg-[#A5852E] rounded">
                                                            {["Nagad", "bKash"].map((method) => (
                                                                <div
                                                                    key={method}
                                                                    onClick={() => setWithdrawalSelected(method)}
                                                                    className={` relative flex py-4 flex-col items-center justify-center rounded-md cursor-pointer transition ${withdrawalSelected === method
                                                                        ? "bg-[#ffb80c] text-white" // Selected style
                                                                        : " text-white" // Default style
                                                                        }`}
                                                                >
                                                                    <span className="text-xs">{method}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-white text-sm mb-2">Card Number</label>
                                                        <input
                                                            type="text"
                                                            value={newCardNumber}
                                                            onChange={(e) => setNewCardNumber(e.target.value)}
                                                            className="w-full bg-[var(--form-input-bg)] text-white rounded-[1.3333333333vw] p-3"
                                                            placeholder="Enter card number"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-white text-sm mb-2">Card Name</label>
                                                        <input
                                                            type="text"
                                                            value={newCardName}
                                                            onChange={(e) => setNewCardName(e.target.value)}
                                                            className="w-full bg-[var(--form-input-bg)] text-white rounded-[1.3333333333vw] p-3"
                                                            placeholder="Enter card name"
                                                        />
                                                    </div>

                                                    <div className="flex space-x-3 pt-2">
                                                        <button
                                                            onClick={() => setShowAddCardModal(false)}
                                                            className="flex-1 bg-gray-500 text-white py-3 rounded-[1.3333333333vw] font-medium"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button
                                                            onClick={handleAddCard}
                                                            disabled={isAddingCard}
                                                            className="flex-1 bg-red-600 text-white py-3 rounded-[1.3333333333vw] font-medium"
                                                        >
                                                            {isAddingCard ? "Adding..." : "Add Card"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}

