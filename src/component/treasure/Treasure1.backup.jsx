import { useState, useEffect } from 'react';
import axios from "axios";
import treasureGif from '/eventImages/treasure/temu-history-box.5cd73118.gif';
import buttonBg from '/eventImages/treasure/temu-popup-btn.ab73688a.png';
import bgImage from '/eventImages/treasure/temu-popup-bg1.fb307171.png';
import bgImage2 from '/eventImages/treasure/temu-popup-bg2.c6fa87f3.png';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { FaRegCircleCheck, FaXmark } from 'react-icons/fa6';
import { MdOutlineWatchLater } from 'react-icons/md';
import { CheckCircle, XCircle, Clock, RotateCcw, Share, Upload, Download } from 'lucide-react';
import { FaLine, FaTelegram, FaWhatsapp, FaFacebookMessenger } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { LuLink } from 'react-icons/lu';
import DownloadPopup from '../DownloadPopup';

const DEFAULT_TASKS = [
  {
    _id: "default-telegram",
    promotion_type: "join-telegram",
    title: "Join Telegram",
    amount: 15,
    is_claimed: false,
    is_claimable: false,
    has_expired: false,
    completion_date: null
  },
  {
    _id: "default-whatsapp",
    promotion_type: "join-whatsapp",
    title: "Join WhatsApp",
    amount: 15,
    is_claimed: false,
    is_claimable: false,
    has_expired: false,
    completion_date: null
  },
  {
    _id: "default-facebook",
    promotion_type: "join-facebook",
    title: "Join Facebook",
    amount: 15,
    is_claimed: false,
    is_claimable: false,
    has_expired: false,
    completion_date: null
  },
  {
    _id: "default-app",
    promotion_type: "app-download",
    title: "Download App",
    amount: 18,
    is_claimed: false,
    is_claimable: false,
    has_expired: false,
    completion_date: null
  },
  {
    _id: "default-deposit",
    promotion_type: "first-deposit",
    title: "Make First Deposit",
    amount: 198,
    is_claimed: false,
    is_claimable: false,
    has_expired: false,
    completion_date: null
  }
];

const DEFAULT_REFERRAL = [
  {
    _id: "default-referral",
    activity_type: "invite-friend",
    reward_amt: 508,
    reward_status: "unclaimed", // "unclaimed", "claimed"
    // Add other properties as needed
  }
];

const TaskTab = ({ turnoverData, referralRewardsData, handleClaim, handleReferralClaim, setRefModal, loading, referralLoading, channelNames, calculateDaysUntilExpiry, calculateProgress, onClose, setDownloadPopup }) => {
  // Process referral rewards: show only one entry, and if any is claimed, show it as claimed
  const processedReferralData = referralRewardsData && referralRewardsData.length > 0 ?
    [{
      ...referralRewardsData[0],
      reward_status: referralRewardsData.some(item => item?.reward_status === "claimed") ? "claimed" : referralRewardsData[0]?.reward_status
    }] : [];

  // Check if app download task exists and is unclaimable
  const appDownloadTask = turnoverData.find(item => item?.promotion_type === "app-download");
  const hasAppDownloadTask = !!appDownloadTask;
  const isAppDownloadUnclaimable = hasAppDownloadTask && !appDownloadTask.is_claimable;

  return (
    <div className="temu-task-condition">
      {/* Turnover Tasks */}
      {turnoverData.length > 0 ? (
        turnoverData.map(item => {
          const daysUntilExpiry = item?.completion_date ? calculateDaysUntilExpiry(item?.completion_date) : null;
          const channelName = channelNames[item?.promotion_type] || item?.promotion_type;

          return (
            <div key={item?._id} className="condition-item-wrap">
              <div className="condition-item">
                <div className={`item-info ${item?.promotion_type.replace('-', '')}`}>
                  <div className="info-title">
                    {item.title ? (item?.title === "Primary Turnover" ? "First Deposit" : item?.title) : channelName}
                  </div>
                  <div className="info-subtitle">
                    <div className="wysiwyg">
                      {item?.completion_date && (
                        <div className="text-sm mt-1">
                          <span className={`${
                            daysUntilExpiry !== null ? (daysUntilExpiry > 7 ? 'text-green-600' : daysUntilExpiry > 3 ? 'text-yellow-600' : 'text-red-600') : 'text-gray-400'
                          }`}>
                            Expires in: {daysUntilExpiry !== null ? (
                              daysUntilExpiry > 0 ? `${daysUntilExpiry} days` :
                              daysUntilExpiry === 0 ? 'Today' : `${Math.abs(daysUntilExpiry)} days ago`
                            ) : 'N/A'}

                          </span>
                        </div>
                      )}
                      {item?.promotion_type === "first-deposit" && (
                            <p>Make first deposit to claim</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="condition-btn mr-2">
                  {item?.is_claimed ? (
                    <span className="flex flex-col items-end">
                      <span className="text-[20px] mt-1 text-orange-600">৳{item?.amount}</span>
                      <span className="text-xs px-2 py-2 rounded text-white bg-green-900 flex items-center justify-center min-w-[100px] gap-1">
                        <CheckCircle size={12} /> Claimed
                      </span>
                    </span>
                  ) : item?.is_claimable && !item?.has_expired ? (
                    <div className="flex flex-col items-end">
                      <span className="text-[20px] mt-1 text-orange-600">৳{item?.amount}</span>
                      <button
                        className="bg-green-700 text-white text-xs px-3 py-2 rounded flex items-center justify-center min-w-[100px] gap-1 hover:bg-green-600 transition-colors"
                        style={{ border: "0", cursor: "pointer" }}
                        disabled={!!loading[item?._id]}
                        onClick={() => handleClaim(item?._id)}
                      >
                        {loading[item?._id] ? <RotateCcw size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                        {loading[item?._id] ? "Claiming..." : "Claim"}
                      </button>
                    </div>
                  ) : (
                    item?.promotion_type === "app-download" ? (
                      // Show download button when app download task is unclaimable
                      <div className="flex flex-col items-end">
                        <span className="text-[20px] mt-1 text-orange-600">৳{item?.amount}</span>
                        <button
                          className="bg-gray-500 text-white text-xs px-3 py-2 rounded flex items-center justify-center min-w-[100px] gap-1 cursor-pointer"
                          style={{ border: "0" }}
                          onClick={() => {
                            onClose();
                            setDownloadPopup(true);
                          }}
                        >
                          <Download size={12}/> Download
                        </button>
                      </div>
                    ) : (
                      item?.promotion_type === "first-deposit" ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[20px] mt-1 text-orange-600">৳{item?.amount}</span>
                          <button
                            className="bg-gray-500 text-white text-xs px-3 py-2 rounded flex items-center justify-center min-w-[100px] gap-1 cursor-pointer"
                            style={{ border: "0" }}
                            onClick={() => {
                              window.location.href = "/deposit";
                            }}
                          >
                            <Upload size={12}/> Deposit
                          </button>
                        </div>
                      ) : (
                        <span className="flex flex-col items-end">
                          <span className="text-[20px] mt-1 text-orange-600">৳{item?.amount}</span>
                          <span className="text-xs px-3 py-2 rounded text-white bg-gray-500 flex items-center justify-center min-w-[100px] gap-1 cursor-not-allowed">
                            <XCircle size={12} /> Unclaimable
                          </span>
                        </span>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center p-4 text-gray-500">
          No tasks available at the moment
        </div>
      )}

      {/* Referral Rewards - Only show one entry */}
      {processedReferralData && processedReferralData.length > 0 && (
        <>
          {processedReferralData.map(item => (
            <div key={item?._id} className="condition-item-wrap">
              <div className="condition-item">
                <div className="item-info">
                  <div className="info-title">
                    Friend Invite Bonus
                  </div>
                  <div className="info-subtitle">
                    <div className="wysiwyg">
                      Invite a friend to claim
                    </div>
                  </div>
                </div>
                <div className="condition-btn mr-2">
                  {item?.reward_status === "claimed" ? (
                    <span className="flex flex-col items-end">
                      <span className="text-[20px] mt-1 text-orange-600">৳{item?.reward_amt}</span>
                      <span className="text-xs px-2 py-2 rounded text-white bg-green-900 flex justify-center min-w-[100px] items-center gap-1">
                        <CheckCircle size={12} /> Claimed
                      </span>
                    </span>
                  ) : item?.reward_claimable ? (
                    <div className="flex flex-col items-end">
                      <span className="text-[20px] mt-1 text-orange-600">৳{item?.reward_amt}</span>
                      <button
                        className="bg-green-700 min-w-[100px] text-white text-xs px-3 py-2 rounded flex justify-center items-center gap-1 hover:bg-green-600 transition-colors"
                        style={{ border: "0", cursor: "pointer" }}
                        disabled={!!referralLoading[item?._id]}
                        onClick={() => handleReferralClaim(item?._id)}
                      >
                        {referralLoading[item?._id] ? <RotateCcw size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                        {referralLoading[item?._id] ? "Claiming..." : "Claim"}
                      </button>
                    </div>
                  ) : (
                    <span className="flex flex-col items-end">
                      <span className="text-[20px] mt-1 text-orange-600">৳{item?.reward_amt}</span>
                      <button
                        className="bg-gray-500 min-w-[100px] text-white text-xs px-3 py-2 rounded flex justify-center items-center gap-1 cursor-pointer"
                        style={{ border: "0" }}
                        onClick={() => setRefModal(true)}
                      >
                        <Share size={12} /> Invite
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const DescriptionTab = () => {
  return (
    <div className="description-content p-4">
      <p className="text-[#bc862f]">শেয়ার করে জিতুন</p>
    </div>
  );
};

const DetailsTab = ({ turnoverData, referralRewardsData, channelNames }) => {
  // Process referral rewards: show only one entry, and if any is claimed, show it as claimed
  const processedReferralData = referralRewardsData && referralRewardsData.length > 0 ?
    [{
      ...referralRewardsData[0],
      reward_status: referralRewardsData.some(item => item?.reward_status === "claimed") ? "claimed" : referralRewardsData[0]?.reward_status
    }] : [];

  return (
    <div className="task-details-content p-4">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[#FEEAC1] text-sm text-amber-800">
            <th className="px-4 py-2 text-center border border-yellow-200 w-3/4">
              Condition
            </th>
            <th className="px-4 py-2 text-center border border-yellow-200 w-1/4">
              Added amount
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Turnover Tasks */}
          {turnoverData && turnoverData.length > 0 ? (
            turnoverData.map((item, index) => {
              const channelName = channelNames[item?.promotion_type] || item?.promotion_type;
              return (
                <tr key={item?._id || `turnover-${index}`} className='text-sm'>
                  <td className="px-4 py-3 border border-yellow-200 text-[#B8A06C]">
                    {item?.title || channelName}
                  </td>
                  <td className="px-4 py-3 border border-yellow-200 text-right font-semibold text-[#B8A06C]">
                    ৳{item?.amount?.toFixed(2)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="2" className="px-4 py-3 border border-yellow-200 text-center text-[#B8A06C]">
                No tasks available at the moment
              </td>
            </tr>
          )}

          {/* Referral Rewards - Only show one entry */}
          {processedReferralData && processedReferralData.length > 0 && (
            <>
              <tr className="bg-[#FEEAC1]">
                <td colSpan="2" className="px-4 py-2 text-center text-sm text-amber-800 font-semibold border border-yellow-200">
                  Invite Friends Rewards
                </td>
              </tr>
              {processedReferralData.map((item, index) => (
                <tr key={item?._id || `referral-${index}`} className='text-sm'>
                  <td className="px-4 py-3 border border-yellow-200 text-[#B8A06C]">
                    Friend Invite Bonus
                  </td>
                  <td className="px-4 py-3 border border-yellow-200 text-right font-semibold text-[#B8A06C]">
                    ৳{item?.reward_amt?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function Treasure1({ onClose }) {
  const authData = JSON.parse(localStorage.getItem("auth"));
  const user_id = authData?.userId;
  const username = authData?.username;
  const token = authData?.token;

  const [mainModal, setMainModal] = useState(true);
  const [rewardModal, setRewardModal] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [activeTab, setActiveTab] = useState('task');
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 19,
    minutes: 32,
    seconds: 0
  });
  const [turnoverData, setTurnoverData] = useState(DEFAULT_TASKS);
  const [referralRewardsData, setReferralRewardsData] = useState(DEFAULT_REFERRAL);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState({});
  const [referralLoading, setReferralLoading] = useState({});
  const [refModal, setRefModal] = useState(false);
  const [downloadPopup, setDownloadPopup] = useState(false);


  const channelNames = {
    "join-telegram": "Telegram",
    "join-whatsapp": "Whatsapp",
    "join-facebook": "Facebook",
    "app-download": "App Download",
    "first-deposit": "First Deposit"
  };

  const calculateProgress = () => {
    const claimedCount = turnoverData.filter(item => item?.is_claimed).length;
    return Math.min(claimedCount * 20, 100);
  };

  const tabs = [
    { id: 'task', label: 'TASK' },
    { id: 'description', label: 'Description' },
    { id: 'details', label: 'Task Details' }
  ];

  const calculateDaysUntilExpiry = (completionDate) => {
    if (!completionDate) return null;

    const today = new Date();
    const completion = new Date(completionDate);

    today.setHours(0, 0, 0, 0);
    completion.setHours(0, 0, 0, 0);

    const timeDiff = completion.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
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
        const filteredData = res?.data?.data?.turnover?.promotions?.filter(item =>
          ['app-download', 'join-telegram', 'join-whatsapp', 'join-facebook', 'first-deposit'].includes(item?.promotion_type)
        ) || [];

        // Override defaults with actual data
        const updatedTasks = DEFAULT_TASKS.map(defaultTask => {
          const actualTask = filteredData.find(item => item?.promotion_type === defaultTask.promotion_type);
          return actualTask ? actualTask : { ...defaultTask, is_claimable: false };
        });

        // Add any additional tasks not in defaults
        const additionalTasks = filteredData.filter(item =>
          !DEFAULT_TASKS.some(defaultTask => defaultTask.promotion_type === item?.promotion_type)
        );

        const total = [...updatedTasks, ...additionalTasks].reduce((sum, item) => sum + (item?.amount || 0), 0);
        setTotalAmount(total + 508);
        setTurnoverData([...updatedTasks, ...additionalTasks]);
      } else {
        // If API returns no data, keep defaults
        setTotalAmount(DEFAULT_TASKS.reduce((sum, task) => sum + task.amount, 0));
      }
    } catch (err) {
      // On error, keep defaults
      setTotalAmount(DEFAULT_TASKS.reduce((sum, task) => sum + task.amount, 0));
    }
  };

  const fetchReferralRewards = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}promotion/referral-count-offer?username=${username}`
      );
      if (res?.data?.subCode === 200) {
        // Get ALL referral data, not just claimable ones
        const allReferralData = res?.data?.data?.referral_earning?.filter(item =>
          item?.activity_type === "invite-friend"
        ) || [];

        // If we have actual data, use it; otherwise keep default
        if (allReferralData.length > 0) {
          setReferralRewardsData(allReferralData);
        } else {
          // Keep default but mark as unclaimable
          setReferralRewardsData(DEFAULT_REFERRAL.map(item => ({
            ...item,
            reward_claimable: false
          })));
        }
      } else {
        // On API error, keep defaults
        setReferralRewardsData(DEFAULT_REFERRAL.map(item => ({
          ...item,
          reward_claimable: false
        })));
      }
    } catch (err) {
      // On error, keep defaults
      setReferralRewardsData(DEFAULT_REFERRAL.map(item => ({
        ...item,
        reward_claimable: false
      })));
    }
  };

  const handleClaim = async (turnoverId) => {
    try {
      setLoading(prev => ({ ...prev, [turnoverId]: true }));

      const body = { username, turnover_id: turnoverId };

      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}promotion/claim-turnover`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.data?.status) {
        alert(res?.data?.message);

        const redirectUrl = res?.data?.data?.redirect_url;
        if (redirectUrl) {
          window.open(redirectUrl, "_blank");
          getPlayerTurnover();
        } else {
          getPlayerTurnover();
        }
      } else {
        alert(res?.data?.message || "Claim failed ❌");
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Something went wrong ❌");
    } finally {
      setLoading(prev => {
        const updated = { ...prev };
        delete updated[turnoverId];
        return updated;
      });
    }
  };

  const handleReferralClaim = async (referralId) => {
    try {
      setReferralLoading(prev => ({ ...prev, [referralId]: true }));
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_BASE_URL}promotion/claim-referral-bonus`,
        {
          username: username,
          claim_id_array: [referralId],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response?.data?.subCode === 200) {
        alert(response?.data?.message || "Referral bonus claimed successfully!");
        // Refresh data after claiming
        fetchReferralRewards();
        getPlayerTurnover();
      } else {
        alert(response?.data?.message || "Failed to claim referral bonus");
      }
    } catch (err) {
      console.error("Claim referral bonus error:", err);
      // Handle network errors or other unexpected errors
      const msg = err?.response?.data?.message ||
                 err?.data?.message ||
                 err?.message ||
                 "Something went wrong while claiming referral bonus";
      alert(msg);
    } finally {
      setReferralLoading(prev => {
        const updated = { ...prev };
        delete updated[referralId]; // Remove the specific loading state
        return updated;
      });
    }
  };

  // 🔥 NEW: Load turnover on mount so clicking from mainModal works instantly
  useEffect(() => {
    getPlayerTurnover();
    fetchReferralRewards();
  }, []);

  useEffect(() => {
    if (taskModal || rewardModal) {
      getPlayerTurnover();
      fetchReferralRewards();
    }
  }, [taskModal, rewardModal]);

  useEffect(() => {
    if (taskModal) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          let { days, hours, minutes, seconds } = prev;

          if (seconds > 0) {
            seconds--;
          } else {
            seconds = 59;
            if (minutes > 0) {
              minutes--;
            } else {
              minutes = 59;
              if (hours > 0) {
                hours--;
              } else {
                hours = 23;
                if (days > 0) {
                  days--;
                }
              }
            }
          }

          if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
            clearInterval(timer);
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
          }

          return { days, hours, minutes, seconds };
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [taskModal]);

  const formatTime = (time) => time.toString().padStart(2, '0');

  const totalClaimedAmount = turnoverData.reduce((sum, item) => {
    return item?.is_claimed ? sum + (item?.amount || 0) : sum;
  }, 0);

  const totalReferralAmount = referralRewardsData.reduce((sum, item) => {
    return item?.reward_claimable ? sum + (item?.reward_amt || 0) : sum;
  }, 0);


  const referral_code = authData?.referral_code;
  const referralLink = `${import.meta.env.VITE_APP_SITE_URL}/register?r=${referral_code}`;

  const handleCopy = () => {
      const textToCopy = `${import.meta.env.VITE_APP_SITE_URL}/register?r=${referral_code}`;

      if (navigator.clipboard && window.isSecureContext) {

          navigator.clipboard.writeText(textToCopy)
              .then(() => {
                  toast.success('Copied Successfully!', { position: "top-center", autoClose: 1500 });
              })
              .catch(() => {
                  toast.error('Failed to copy!', { position: "top-center", autoClose: 1500 });
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

  return (
    <div>
      {mainModal && (
        <div className="bg-black/80 fixed inset-0 z-50">
          <div className="w-full h-full px-2 relative flex items-center justify-center">
            <div className="w-full max-w-[550px] relative">
              <div className="relative w-full" style={{ aspectRatio: '375/667' }}>
                <img
                  src={bgImage}
                  alt="Treasure Main"
                  className="absolute inset-0 w-full h-full object-contain"
                />

                <div
                  className="absolute text-center font-black text-[5.5vw] sm:text-[1.35rem] leading-tight text-[#f8600e]"
                  style={{
                    top: '29%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    WebkitTextStroke: "0.01rem #fcf8d8",
                    WebkitTextFillColor: "#f8600e",
                    textShadow: "0 0 0.2rem #fff, 0 0 0.2rem #fff",
                    letterSpacing: "-0.04rem"
                  }}
                >
                  শেয়ার করে জিতুন
                </div>

                <div
                  className="absolute"
                  style={{
                    top: '55%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%'
                  }}
                >
                  <img
                    src={treasureGif}
                    className="w-full"
                    alt="Treasure"
                  />
                </div>

                {/* 🔥 UPDATED CLICK HANDLER HERE */}
                <div
                  onClick={() => {
                    const alreadyClaimed = turnoverData.some(item => item?.is_claimed);

                    setMainModal(false);

                    if (alreadyClaimed) {
                      setTaskModal(true);
                      setRewardModal(false);
                    } else {
                      setRewardModal(true);
                    }
                  }}
                  className="cursor-pointer absolute bg-cover bg-center
                             text-[#fffbd6] text-[4.0vw] sm:text-[1rem] font-black
                             px-6 py-4 flex items-center justify-center hover:scale-105 transition-transform"
                  style={{
                    bottom: '15%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    minWidth: '70%',
                    backgroundImage: `url(${buttonBg})`
                  }}
                >
                  Get free bonus
                </div>
              </div>

              <IoCloseCircleOutline
                className="text-white absolute text-4xl cursor-pointer z-50 hover:scale-110 transition-transform"
                style={{
                  bottom: '0%',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      )}

      {rewardModal && (
        <div className="bg-black/80 fixed inset-0 z-50">
          <div className="w-full h-full px-2 relative flex items-center justify-center">
            <div className="w-full max-w-[550px] relative">
              <div className="relative w-full" style={{ aspectRatio: '375/667' }}>
                <img
                  src={bgImage2}
                  alt="Reward Background"
                  className="absolute inset-0 w-full h-full object-contain"
                />

                <div
                  className="flex flex-col gap-2 items-center absolute"
                  style={{
                    top: '65%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%'
                  }}
                >
                  <div className="text-[8vw] sm:text-3xl text-[#f44915] font-black">
                    Congratulations
                  </div>

                  <div className="mt-2 text-[5vw] sm:text-[0.85rem] font-semibold text-[#73491d]">
                    Won a free reward
                  </div>

                  <div className="mt-1 text-[#f44a15] text-[14vw] sm:text-[1.9rem] font-bold flex items-end leading-none">
                    <span className="text-[5vw] sm:text-[1.5rem]">৳</span>
                    <span className="ml-1 flex items-end">
                      {totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-center mt-1 text-[#826849] font-semibold text-[4vw] sm:text-[0.9rem] leading-tight px-4">
                    Can be claimed once accumulated to <span className="text-[#e22e25]">৳ 1,088.00</span>
                  </div>

                  <div
                    className="cursor-pointer mt-3 bg-cover bg-center
                               text-[#fffbd6] text-[4.5vw] sm:text-[1rem] font-black px-6 py-5 leading-none
                               flex items-center justify-center text-center hover:scale-105 transition-transform"
                    style={{
                      minWidth: '80%',
                      backgroundImage: `url(${buttonBg})`
                    }}
                    onClick={() => {
                      setRewardModal(false);
                      setTaskModal(true)
                    }}
                  >
                    Complete tasks to claim free bonuses
                  </div>
                </div>
              </div>

              <IoCloseCircleOutline
                className="text-white absolute text-4xl cursor-pointer z-50 hover:scale-110 transition-transform"
                style={{
                  bottom: '-8%',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      )}

      {taskModal && (
        <div className="bg-black/80 fixed inset-0 z-50 py-10">
          <IoCloseCircleOutline
            className="text-white absolute text-4xl cursor-pointer z-50 hover:scale-110 transition-transform"
            style={{
              top: '0%',
              right: '0%',
              transform: 'translateX(-50%)'
            }}
            onClick={onClose}
          />

          <div className="temu-condition-wrapper">
            <div className="temu-condition-content">
              <div className="condition-header">
                <div className="condition-title">
                  <span>শেয়ার করে জিতুন</span>
                </div>
                <div className="header-img">
                  <img src="/mobile/mc/temu-history-box.5cd73118.gif" alt="" />
                </div>
                <div className="header-amount">৳ {totalClaimedAmount.toFixed(2)} claimed</div>
              </div>
              <div className="condition-count-wrap">
                <div className="count-wrap">
                  <div className="time">
                    <div className="wysiwyg">
                      {timeLeft.days} Day {formatTime(timeLeft.hours)} : {formatTime(timeLeft.minutes)} : {formatTime(timeLeft.seconds)}
                    </div>
                  </div>
                  <div className="txt">Expired</div>
                </div>
                <div className="progress-wrap">
                  <div className="amount-balance-common progress-target">
                    <span className="currency ">৳</span>
                    <span className="number-mc undefined">
                      <div className="wysiwyg">
                        {totalAmount.toFixed(2)}
                      </div>
                    </span>
                  </div>
                  <div className="progress-item">
                    <div className="progress-done" style={{ width: `${calculateProgress()}%`, height: "100%" }}>
                      <span className="progress-current" />
                    </div>
                    <div className="progress-info animate-bounce">
                      <span>Claiming soon</span>
                    </div>
                  </div>
                  <div className="current-info">
                    <div className="wysiwyg">
                      Only <label>৳ {(1088.00 - totalAmount).toFixed(2)}</label> away from claim to wallet
                    </div>
                  </div>
                </div>
                <div className="current-button invite">
                  Invite friends to speed up claim
                </div>
              </div>
              <div className="condition-tab-wrapper">
                <div className="am-tabs am-tabs-top condition-tab-wrap">
                  <div className="am-tabs-bar">
                    {tabs.map(tab => (
                      <div
                        key={tab.id}
                        className={`${activeTab === tab.id ? 'am-tabs-tab-active am-tabs-tab' : 'am-tabs-tab'}`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {tab.label}
                      </div>
                    ))}
                  </div>
                  <div className="am-tabs-content am-tabs-content-no-animated">
                    <div
                      className={`am-tabs-tabpane ${activeTab === 'task' ? 'am-tabs-tabpane-active' : 'am-tabs-tabpane-inactive'}`}
                      style={{ display: activeTab === 'task' ? 'block' : 'none' }}
                    >
                      <TaskTab
                        turnoverData={turnoverData}
                        referralRewardsData={referralRewardsData}
                        handleClaim={handleClaim}
                        handleReferralClaim={handleReferralClaim}
                        setRefModal={setRefModal}
                        loading={loading}
                        referralLoading={referralLoading}
                        channelNames={channelNames}
                        calculateDaysUntilExpiry={calculateDaysUntilExpiry}
                        calculateProgress={calculateProgress}
                        onClose={onClose}
                        setDownloadPopup={setDownloadPopup}
                      />
                    </div>

                    <div
                      className={`am-tabs-tabpane ${activeTab === 'description' ? 'am-tabs-tabpane-active' : 'am-tabs-tabpane-inactive'}`}
                      style={{ display: activeTab === 'description' ? 'block' : 'none' }}
                    >
                      <DescriptionTab />
                    </div>

                    <div
                      className={`am-tabs-tabpane ${activeTab === 'details' ? 'am-tabs-tabpane-active' : 'am-tabs-tabpane-inactive'}`}
                      style={{ display: activeTab === 'details' ? 'block' : 'none' }}
                    >
                      <DetailsTab
                        turnoverData={turnoverData}
                        referralRewardsData={referralRewardsData}
                        channelNames={channelNames}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {refModal && (
        <div
          className='bg-black/80 fixed inset-0 z-50 flex justify-center items-end pb-4'
          onClick={() => setRefModal(false)}
        >
          <div className='bg-white text-black w-full max-w-md rounded-t-xl p-4 mx-2 shadow-lg'
          onClick={(e) => e.stopPropagation()}
              style={{
                  background: 'linear-gradient(180deg,#f3f7fb,#e0e9f1)'
              }}>
              <p className="font-semibold mb-2 text-[#3b2987] text-center">Share to your friends</p>
              <div className="flex space-x-3 mb-3 items-center">
                  <div className="text-[#566073]">Share to your friends</div>

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
                      Copy
                  </button>
            </div>
          </div>
        </div>
      )}

      {downloadPopup && <DownloadPopup isOpen={downloadPopup} onClose={() => setDownloadPopup(false)} />}

    </div>
  );
}