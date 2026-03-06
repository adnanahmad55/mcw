import React, { useEffect, useState } from 'react'
import BackHeader from '../component/BackHeader'
import PageTab from '../component/PageTab'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Cross, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
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

export default function Deposit() {
    const [selected, setSelected] = useState("bKash");
    const [selectedAmount, setSelectedAmount] = useState("");
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const [selectedPhone, setSelectedPhone] = useState(null)

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
    const navigate = useNavigate();

    // State for iframe modal
    const [iframeUrl, setIframeUrl] = useState(null);

    // 🔹 Check Promotion eligibility
    useEffect(() => {
        const checkPromotion = async () => {
            try {
                const data = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-all-user-eligible-promotion?username=${username}&user_id=${user_id}`, {
                  
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
        const fetchBanks = async () => {
            try {
                const data = await axios.get(`${import.meta.env.VITE_APP_API_BASE_URL}deposit/fetch-bdt-accounts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (data?.data?.status) {
                    // alert(data.data.message)
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
            
            const response = await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}okpay/deposit`, {
                operator: "001",
                user_id,
                username,
                amount: Number(amount),
                ip: window.location.hostname,
                remarks: "Deposit via OKPay",
                device_id: deviceID,
                promotion_id: selectedPromo?._id || "",
                txnId: randomTxnId,
                bdt_id: selectedBank.bdt_id,
                bank_name: selectedBank.bank_name
            });


            if (response.data.status) {
                toast.success(response.data.message);
                setIframeUrl(response.data.url);
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
    const amounts = ['500', '1,000', '2,000', '5,000', '10,000', '100', '50', '10', '5', '1'];

    const wallet_balance = localStorage.getItem("wallet_balance");

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
                        <div className='w-full text-white text-[19px] text-center'>Deposit</div>
                        <X className='absolute right-0  text-white cursor-pointer text-[26px] w-16' onClick={() => navigate('/')} />
                    </div>
                    <PageTab />
                    <motion.div
                        className='w-full'
                        initial={{ x: "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 20 }}
                    >
                        <div className='p-[2.1333333333vw] w-full'>
                            <div className='w-full bg-[#2b2922] flex items-center justify-between rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                <div className='flex items-center text-[4vw] font-medium text-white'>
                                    <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Select Promotion</div>
                                <select
                                    className="
                                        text-white 
                                        bg-[#2b2922] 
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
                            <div className='w-full bg-[#2b2922] flex flex-wrap items-center justify-between rounded-[1.3333333333vw] p-[2.1333333333vw]'>
                                <div className='flex items-center text-[4vw] font-medium text-white'>
                                    <span className='bg-[#ffb80c] w-[1.0666666667vw] h-[4.2666666667vw] mr-[1.3333333333vw] rounded-[.5333333333vw]'></span>Payment Method</div>
                                <div className="grid grid-cols-3 gap-3 mt-3 mb-4 w-full">
                                    {banks.map((bank, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setSelectedBank(bank);
                                                setSelectedPhone(bank.bdt_id);
                                                setSelected(bank.bank_name); // Update the selected method to match bank name
                                            }}
                                            className={`relative flex h-[78px] flex-col items-center justify-center rounded-md cursor-pointer transition ${
                                                selectedBank?.bank_name === bank.bank_name
                                                    ? "bg-[#222222] border border-[#ffb80c]"
                                                    : "bg-[#222222]"
                                            }`}
                                        >
                                            <img
                                                src={`/assets/img/deposit/${bank?.bank_name?.toLowerCase() ?? ""}.png`}
                                                alt={bank.bank_name}
                                                className="w-6 h-6 mb-1"
                                                onError={(e) => (e.target.src = "/assets/img/default-bank.png")} // Fallback to default image
                                            />
                                            <span className="text-xs text-white">{bank.bank_name}</span>
                                            {/* Bonus badge */}
                                            {selectedPromo && getBonusAmount(Number(amount)) && (
                                                <span className="absolute z-[3] right-[-1.0666666667vw] animate-[\_ngcontent-serverApp-c4271250685\_tagRebateBoney_1s_0.3s_forwards] tag-rebate-money shadow-[0_0_2px_#0000004d] text-white pointer-events-none px-[0.8vw] py-0 rounded-[0_0.8vw_0.8vw_0] top-[2.1333333333vw] bg-[#ff5959] text-[12px]">
                                                    +{getBonusAmount(Number(amount))}
                                                </span>
                                            )}
                                            {/* Checkmark indicator when selected */}
                                            {selectedBank?.bank_name === bank.bank_name && (
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
                                        {selectedBank?.bank_name || "Select a Payment Method"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='p-[2.1333333333vw] w-full pt-0'>
                            <div className='w-full bg-[#2b2922] rounded-[1.3333333333vw] p-[2.1333333333vw]'>
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
                                        className='bg-[#3b392f] pl-6 text-[#fff] rounded-[1.3333333333vw] h-[11.7333333333vw] text-[4.2666666667vw] w-full'
                                        placeholder="Enter amount"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="text-[#222222] mt-4 w-full text-[5.3333333333vw] rounded-[1.3333333333vw] h-[12.8vw] flex justify-center items-center"
                                style={{
                                    background: 'linear-gradient(180deg, #ffb80c 0%, #ffb80c 100%)'
                                }}
                            >
                                {loading ? "Processing..." : "Submit"}
                            </button>
                        </div>
                    </motion.div>
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
                        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
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
        </AnimatePresence>
    )
}