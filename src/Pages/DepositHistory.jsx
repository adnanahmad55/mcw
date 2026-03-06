import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import axios from "axios";
import BackHeader from "../component/BackHeader";

export default function DepositHistory() {
  const { t } = useTranslation(); // Initialize translation function
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("today"); // today | yesterday | 7days
  const [dateRange, setDateRange] = useState(""); // date range input

  const authData = JSON.parse(localStorage.getItem("auth"));
  const username = authData?.username;
  const [createdTime, setCreatedTime] = useState('');
  const fetchDeposits = async () => {
    const authData = JSON.parse(localStorage.getItem("auth"));
    const { token, username, userId } = authData;
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}deposit-history`,
        {
          params: {
            // limit: tableLength,
            // pageNo: pageNo,
            // status: filters.status,
            dateFilter: activeTab === "today" ? "today" :
              activeTab === "yesterday" ? "yesterday" :
                activeTab === "7days" ? "7-days" : "recent",

            dateRange: dateRange,
            searchPlayer: userId,
            from: dateRange,
            to: dateRange,
          },
          headers: {
            admin_auth_token: localStorage.getItem("authToken"),
            opr_auth_token: localStorage.getItem("token"),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );
      if (res?.data?.status) {
        setDeposits(res?.data?.data?.data || []);
      }
    } catch (err) {
      console.error("Error fetching deposits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Run API on load
    fetchDeposits();

    // Set up timeout to run API again after 5 seconds
    const timer = setTimeout(() => {
      fetchDeposits();
    }, 5000);

    // Cleanup function to clear the timeout if component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [activeTab]); // Empty dependency array means this runs only on mount

  const getStatus = (status) => {
    switch (status) {
      case 0:
        return { text: t('record.status.pending'), color: "text-yellow-500" };
      case 1:
        return { text: t('record.status.approved'), color: "text-green-600" };
      case 2:
        return { text: t('record.status.rejected'), color: "text-red-600" };
      default:
        return { text: t('record.status.unknown'), color: "text-gray-600" };
    }
  };

  const [timeLeft, setTimeLeft] = useState(0);
  const getRemainingTime = (createdAt) => {
    const expiryTime = new Date(createdAt).getTime() + 10 * 60 * 1000; // 10 min
    const diff = expiryTime - Date.now();

    if (diff <= 0) return null;

    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { minutes, seconds };
  };
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(v => v + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    if (!createdTime) return;

    const expiryTime =
      new Date(createdTime).getTime() + 10 * 60 * 1000; // 10 minutes

    const interval = setInterval(() => {
      const diff = expiryTime - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdTime]);

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);
  useEffect(() => {
    const pendingDeposit = deposits.find(d => d.deposit_status === 0);

    if (pendingDeposit?.createdAt) {
      setCreatedTime(pendingDeposit.createdAt);
    }
  }, [deposits]);
  return (
    <>
      <div className="flex flex-col h-screen">
        <BackHeader text={t('record.depositHistory')} />
        <div className="flex-1 overflow-y-auto py-4 bg-white">
          {/* <h2 className="text-lg font-semibold mb-4">Deposit History</h2> */}
          {/* --------- HEADER FILTER --------- */}
          <div className="flex px-2 items-center justify-between border-b pb-2 mb-4">
            <button
              onClick={() => setActiveTab("today")}
              className={`flex-1 text-center pb-1 ${activeTab === "today"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-600"
                }`}
            >
              {t('record.filter.today')}
            </button>
            <button
              onClick={() => setActiveTab("yesterday")}
              className={`flex-1 text-center pb-1 ${activeTab === "yesterday"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-600"
                }`}
            >
              {t('record.filter.yesterday')}
            </button>
            <button
              onClick={() => setActiveTab("7days")}
              className={`flex-1 text-center pb-1 ${activeTab === "7days"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-600"
                }`}
            >
              {t('record.filter.sevenDays')}
            </button>
          </div>
          {/* Right Side Filters */}
          {/* <div className="flex gap-2 justify-between bg-[#f0f0f0] p-2 mb-3">
              <button className="border border-blue-400 text-blue-500 px-3 py-1 rounded">
                All
              </button>
              <button className="border border-blue-400 text-blue-500 px-3 py-1 rounded">
                Types
              </button>
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="09/05 - 09/05"
                className="border bg-transparent border-blue-400 text-blue-500 px-3 py-1 rounded text-center"
                style={{width:'150px'}}
              />
            </div> */}

          {/* --------- DEPOSIT LIST --------- */}
          {loading ? (
            <p className="text-center">{t('record.loading')}</p>
          ) : deposits.length === 0 ? (
            <p className="text-gray-500 text-center">{t('record.noRecords')}</p>
          ) : (
            <div className="space-y-4 px-2">
              {Array.isArray(deposits) &&
                deposits
                  // .filter(item => item.deposit_status === 1)
                  .map((item, idx) => {
                    const statusInfo = getStatus(item.deposit_status);
                    return (
                      <div
                        key={item._id || idx}
                        className="border border-gray-300 rounded-md p-4 shadow-sm bg-white"
                        style={{ position: 'relative' }}
                      >
                        <p className="text-sm text-gray-700 font-medium">
                          {item.deposit_method?.toUpperCase?.() || "UNKNOWN"}{" "}
                          <span className="text-xs text-gray-400 ml-2">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : "N/A"}
                          </span>
                        </p>

                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          {/* <p>
                            <span className="font-medium">{t('record.transaction.transactionId')}:</span>{" "}
                            {item.txnId || "-"}
                          </p> */}
                          <p>
                            <span className="font-medium">{t('record.transaction.handlingFee')}:</span> 0.00
                          </p>
                          {/* <p>
                            <span className="font-medium">{t('record.transaction.promotions')}:</span>{" "}
                            {item.promotion_type || "N/A"}
                          </p> */}
                          <p>
                            <span className="font-medium">{t('record.transaction.remarks')}:</span>{" "}
                            {item.remarks || "-"}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-3 text-sm">
                          <p>
                            <span className="font-medium">{t('record.transaction.requestAmount')}:</span>{" "}
                            {typeof item.amount === "number"
                              ? item.amount.toFixed(2)
                              : "0.00"}
                          </p>
                          <p>
                            <span className="font-medium">{t('record.transaction.receivedAmount')}:</span>{" "}
                            {typeof item.approved_amount === "number"
                              ? item.approved_amount.toFixed(2)
                              : "0.00"}
                          </p>
                          <p className={`${statusInfo.color} font-semibold`}>
                            {statusInfo.text}
                          </p>
                          {item.deposit_status === 0 && (() => {
                            const time = getRemainingTime(item.createdAt);
                            if (!time) return null;

                            return (
                              <>
                                <span className="dp-h">পরবর্তী ডেপোসিট করতে পারবেন</span>
                                <span
                                  className="text-green-600 font-semibold"
                                  style={{ position: 'absolute', right: '1rem', top: '1rem' }}
                                >
                                  {time.minutes}:{time.seconds.toString().padStart(2, "0")}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    );
                  })}

              {/* Footer Total */}
              <div className="text-right font-medium border-t pt-2 pb-2">
                {t('record.transaction.totalAmount')}:{" "}
                {deposits.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}