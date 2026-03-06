import React, { useEffect, useState } from "react";
import { ChevronDown, Clipboard } from "lucide-react";
import axios from "axios";
import selecteCheck from '../assets/img/select-check.svg';
import BackHeader from "../component/BackHeader";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Deposit = () => {
    const [depositType, setDepositType] = useState("");
    const agentType = "Agent(ক্যাশ আউট করুন)";
    const personalType = "Personal(সেন্ডমানি করুন)"; 
    const [accountType, setAccountType] = useState(agentType);
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [loading, setLoading] = useState(false);
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState(null);
    const { t } = useTranslation();
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
    const [hasYoutubeError, setHasYoutubeError] = useState(false);
    const navigate = useNavigate()

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


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedBank || !transactionId || !amount) {
            toast.error(t('deposit.errors.fillAllFields'));
            return;
        }

        if (amount < 100) {
          toast.error(t('deposit.errors.minimumAmount'));
          return;
        }

        // Show success toast immediately
        toast.success(t('deposit.success.requestSubmitted'));
        
        // Remove loading instantly
        setLoading(false);

        navigate('/deposit-history')
        
        // Reset form fields
        setDepositType("");
        setAmount("");
        setTransactionId("");
        setSelectedBank(null);
        setRemark('');

        try {
            await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}deposit/dubai-pay-deposit`, {
            // await axios.post(`${import.meta.env.VITE_APP_API_BASE_URL}deposit/player-deposit`, {
                user_id,
                username,
                ip: window.location.hostname,
                remarks: remark,
                bdt_id: selectedBank.bdt_id,
                device_id: deviceID,
                // device_id:"azx021",
                promotion_id: selectedPromo?._id || "",
                promo_code: selectedPromo?.bonus_code || "",
                txnId: transactionId.toUpperCase(),
                phone: selectedBank.bdt_id,
                amount: amount,
                bank_type: selectedBank.bank_name
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            // Show error toast if there's an exception
            toast.error(`${err.response?.data?.message} Please try again`);
        }
    };

      const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setTransactionId(text);
            // toast.success("Transaction ID pasted successfully");
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
            toast.error("Failed to paste from clipboard");
        }
      };

    const handleCopy = async (text, fieldName) => {
      try {
        await navigator.clipboard.writeText(text);
        toast.success(`${fieldName} copied to clipboard`);
      } catch (err) {
        console.error(`Failed to copy ${fieldName}: `, err);
        toast.error(`Failed to copy ${fieldName}`);
      }
    };


    const amounts = [100, 200, 500, 1000, 2000, 5000, 8000, 10000, 20000, 25000];



    return (
        <>
            <div className="bg-[#333]">
                <BackHeader text={t('deposit.deposit')} />
            </div>
            <div className="usrTrans-wrapper common-box form-f bg-white px-2 pt-4">

                <div className="withdraw-form usrTrans-form">
                    <form onSubmit={handleSubmit}>
                        <div className="member-menu-box member-list select-group checkbox-style ">
                            <div className="transaction-title">
                                <span>{t('deposit.selectBank')}</span><span className="important-icon">*</span>
                            </div>
                            {/* {console.log(banks)} */}
                            <ul className="col3">
                                {banks.map((bank, index) => (
                                  <li
                                    key={index}
                                    onClick={() => {
                                      setSelectedBank(bank);
                                      setSelectedPhone(bank.bdt_id);
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name="bank"
                                      value={bank.bank_name}
                                      checked={selectedBank?.bank_name === bank.bank_name}
                                      readOnly
                                    />
                                    <label style={{ position: "relative" }}>
                                      <div className="bank">
                                        <span></span>
                                        <img
                                          alt={bank.bank_name}
                                            src={`/assets/img/deposit/${bank?.bank_name?.toLowerCase() ?? ""}.png`}
                                          onError={(e) => (e.target.src = selecteCheck)}
                                        />

                                      </div>
                                      <span style={{ textTransform: "capitalize" }}>{bank.bank_name}</span>
                                      <span className="item-icon">
                                        {selectedBank?.bank_name === bank.bank_name && (
                                          <img alt="selected" src={selecteCheck} />
                                        )}
                                      </span>
                                    </label>
                                  </li>
                                ))}

                            </ul>
                            <div className="p-2 my-2 text-red-600">‼️‼️ NOTE: অনুগ্রহ করে আপনার ডিপোজিট করার পরে অবশ্যই আপনার Trx-ID আইডি সাবমিট করবেন। তাহলে খুব দ্রুত আপনার একাউন্টের মধ্যে টাকা যোগ হয়ে যাবে। ⚠️⚠️⚠️</div>
                       </div>
                        {selectedBank && 
                          <div className="usrTrans-seperate bankInfoField bankInfo">
                            <div className="transaction-title">
                              <span>{t('deposit.accountType')}</span>
                            </div>
                            <div className="transaction-option m-auto relative"> {/* Added relative class */}
                              <input
                                value={accountType}
                                className="text-input pr-8" // Added padding to accommodate button
                                readOnly
                              />
                            </div>
                          </div>
                        }
                        {/* Bank Account (bdt_id) */}
                         <div className="usrTrans-seperate bankInfoField bankInfo">
                          <div className="transaction-title">
                            <span>{t('deposit.bankAccount')}</span>
                          </div>
                          <div className="transaction-option m-auto relative"> {/* Added relative class */}
                            <input
                              value={selectedBank?.bdt_id || ""}
                              className="text-input pr-8" // Added padding to accommodate button
                              readOnly
                            />
                            {selectedBank?.bdt_id && ( // Only show button if there's a value to copy
                              <button
                                type="button"
                                onClick={() => handleCopy(selectedBank.bdt_id, t('deposit.bankAccount'))}
                                className="absolute right-2 top-2"
                                aria-label="Copy Bank Account"
                              >
                                {/* <Clipboard className="w-5 h-5 text-gray-500" /> */}
                                <span className="px-2 py-1 border border-gray-700 bg-gray-200 rounded-sm text-xs">{t('deposit.copy')}</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Deposit Amounts */}
                        <div className="mb-3">
                            <h3 className="font-semibold text-sm mb-2">{t('deposit.depositAmount')}</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {amounts.map((amt) => {
                                  const bonusAmount = getBonusAmount(amt);
                                  return (
                                    <button
                                      key={amt}
                                      type="button"
                                      onClick={() => setAmount(amt)}
                                      className={`relative border rounded-md py-3 text-md font-semibold overflow-hidden ${Number(amount) === amt
                                        ? "border-red-500 bg-red-50"
                                        : "border-gray-300 hover:border-gray-400"
                                      }`}
                                    >
                                      {selectedPromo && bonusAmount && (
                                        <span 
                                          className="absolute top-0 right-0 transform text-xs font-bold text-white px-2 w-full text-right"
                                          style={{
                                            background: 'linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 0, 0, 1) 100%)',
                                            zIndex: 1
                                          }}
                                        >
                                          +{bonusAmount}
                                        </span>
                                      )}
                                      {amt}
                                    </button>
                                  );
                                })}
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="usrTrans-seperate deposit-amount">
                          <div className="transaction-title">
                              <span>{t('deposit.amount')}</span><span className="important-icon">(১০০৳-৩০০০০৳) *</span>
                          </div>
                          <div className="transaction-option m-auto relative overflow-hidden rounded">
                              {selectedPromo && amount && getBonusAmount(Number(amount)) && (
                                <span 
                                  className="absolute top-0 right-0 w-full text-right text-xs font-bold text-white px-2"
                                  style={{
                                    background: 'linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(255, 0, 0, 1) 100%)',
                                    zIndex: 1
                                  }}
                                >
                                  +{getBonusAmount(Number(amount))}
                                </span>
                              )}
                              <input
                                  type="number"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  className="text-input"
                                  style={{paddingTop:'14px'}}
                              />
                          </div>
                        </div>

                        {/* Transaction ID */}
                        <div className="usrTrans-seperate default-type">
                            <div className="transaction-title">
                                <span>{t('deposit.transactionId')}</span><span className="important-icon">*</span>
                            </div>
                            <div className="transaction-option m-auto relative">
                                <input
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="text-input pr-8"
                                    maxLength={12} 
                                    style={{textTransform: 'uppercase'}}
                                />
                                <button
                                    type="button"
                                    onClick={handlePaste}
                                    className="absolute right-2 top-2"
                                    aria-label="Paste Transaction ID"
                                >
                                    {/* <Clipboard className="w-5 h-5 text-gray-500" /> */}
                                    <span className="px-2 py-1 border border-gray-700 bg-gray-200 rounded-sm text-xs">{t('deposit.paste')}</span>
                                </button>
                            </div>
                        </div>

                        {/* <div className="usrTrans-seperate default-type">
                            <div className="transaction-title">
                                <span>Phone No</span><span className="important-icon">*</span>
                            </div>
                            <div className="transaction-option m-auto">
                                <input
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    className="text-input"
                                    type="number"
                                />
                            </div>
                        </div> */}

                       
                        {eligible && 
                          <div className="usrTrans-seperate default-type">
                              {bonusList.length > 0 && 
                              <div className="transaction-title">
                                  <span>{t('deposit.promotions')}</span>
                              </div>
                              }

                              <div className="transaction-option m-auto">
                                  {bonusList.map((bonus) => (
                                    <div key={bonus._id} className="promotions_deposit_promo " style={{ marginBottom: '10px' }}
                                        onClick={() => setSelectedPromo({ _id: bonus._id, bonus_code: bonus.bonus_code })}>
                                        <div className={`before_dot ${selectedPromo?._id === bonus._id ? "after_dot" : ""}`} style={{ padding: '4px 25px' }}>
                                            {bonus?.title}
                                        </div>
                                    </div>
                                  ))}
                                    <div className="promotions_deposit_promo " style={{ marginBottom: '10px' }}
                                        onClick={() => setSelectedPromo(null)}>
                                        <div className={`before_dot ${selectedPromo === null ? "after_dot" : ""} `} style={{ padding: '4px 25px' }}>
                                            {t('deposit.noPromotion')}
                                        </div>
                                    </div>
                              </div>
                          </div>
                        }

                        
                        {/* Submit */}
                        <div className="usrTrans-seperate">
                            <div className="transaction-option">
                                <div className="transaction-btn">
                                    <button type="submit" className="btn-submit bg-gradient-primary " style={{ background: '#ec2529', color: '#fff', border: '0' }}>
                                        {loading ? t('deposit.processing') : t('deposit.submit')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    {/* <div style={{ width: "100%", height: "500px", position: "relative" }}>
                      {!hasYoutubeError ? (
                        <iframe
                          width="100%" 
                          height="500" 
                          src={`https://www.youtube.com/embed/${import.meta.env.VITE_APP_YOUTUBE_DEPOSIT_ID}?autoplay=1&mute=0&playsinline=1`}
                          title="Deposit" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen
                          onLoad={() => setHasYoutubeError(false)}
                          onError={() => setHasYoutubeError(true)}
                        />
                      ) : (
                        <div></div>
                      )}
                    </div> */}
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

        </>
    );
};

export default Deposit;