import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import axios from "axios";
import BackHeader from "../component/BackHeader";

export default function WithdrawHistory() {
  const { t } = useTranslation(); // Initialize translation function
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("today"); // today | yesterday | 7days
  const [dateRange, setDateRange] = useState(""); // date range input

  const authData = JSON.parse(localStorage.getItem("auth"));
  const username = authData?.username;
  const userId = authData?.userId;

  useEffect(() => {
    fetchWithdrawals();
  }, [activeTab, dateRange]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}get-withdraw-list`,
        {
          params: {
            username: username,
            operator_id: import.meta.env.VITE_APP_OPERATOR_ID,
            player_id: userId,
            dateFilter: activeTab === "today" ? "today" :
                      activeTab === "yesterday" ? "yesterday" :
                      activeTab === "7days" ? "7-days" : "recent",
          },
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );

      if (res?.data?.status) {
        setWithdrawals(res?.data?.data || []);
      }
    } catch (err) {
      console.error("Error fetching withdrawals:", err);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <>
      <div className="flex flex-col h-screen">
        <BackHeader text={t('record.withdrawHistory')} />
        <div className="flex-1 overflow-y-auto py-4 bg-white">
          {/* --------- HEADER FILTER --------- */}
          <div className="flex px-2 items-center justify-between border-b pb-2 mb-4">
            <button
              onClick={() => setActiveTab("today")}
              className={`flex-1 text-center pb-1 ${
                activeTab === "today"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              {t('record.filter.today')}
            </button>
            <button
              onClick={() => setActiveTab("yesterday")}
              className={`flex-1 text-center pb-1 ${
                activeTab === "yesterday"
                  ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-600"
              }`}
            >
              {t('record.filter.yesterday')}
            </button>
            <button
              onClick={() => setActiveTab("7days")}
              className={`flex-1 text-center pb-1 ${
                activeTab === "7days"
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
              style={{ width: '150px' }}
            />
          </div> */}

          {/* --------- WITHDRAWAL LIST --------- */}
          {loading ? (
            <p>{t('record.loading')}</p>
          ) : withdrawals.length === 0 ? (
            <p className="text-gray-500 text-center">{t('record.noRecords')}</p>
          ) : (
            <div className="space-y-4 px-2">
              {withdrawals?.map((item, idx) => {
                const statusInfo = getStatus(item.withdraw_status);
                return (
                  <div
                    key={idx}
                    className="border border-gray-300 rounded-md p-4 shadow-sm bg-white"
                  >
                    <p className="text-sm text-gray-700 font-medium">
                      {item?.bank_name?.toUpperCase()}{" "}
                      <span className="text-xs text-gray-400 ml-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">{t('record.transaction.withdrawalRef')}:</span>{" "}
                        {item._id}
                      </p>
                      <p>
                        <span className="font-medium">{t('record.transaction.method')}:</span>{" "}
                        {item?.withdraw_method.toUpperCase()}
                      </p>
                      
                      {/* <p>
                        <span className="font-medium">{t('record.transaction.transactionId')}:</span>{" "}
                        {item?.transaction_details?.sql_transaction_id || "N/A"}
                      </p> */}
                    </div>
                    <div className="flex justify-between items-center mt-3 text-sm">
                      <p>
                        <span className="font-medium">{t('record.transaction.requestAmount')}:</span>{" "}
                        {item?.amount.toFixed(2)}
                      </p>
                      {/* <p>
                        <span className="font-medium">{t('record.transaction.approvedAmount')}:</span>{" "}
                        {item.approved_amount.toFixed(2)}
                      </p> */}
                      <p className={`${statusInfo.color} font-semibold`}>
                        {statusInfo.text}
                      </p>
                    </div>
                  </div>
                );
              })}
              {/* Footer Total */}
              <div className="text-right font-medium border-t pt-2 pb-2">
                {t('record.transaction.totalRequested')}:{" "}
                {withdrawals.reduce((sum, w) => sum + w.amount, 0).toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}