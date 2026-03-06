import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import the translation hook
import axios from 'axios';
import BackHeader from '../component/BackHeader';
import AccountRecordDateFilter from './AccountRecordDateFilter';

const AccountRecord = () => {
  const { t } = useTranslation(); // Initialize translation function
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({ start: null, end: null });

  const getTransactionLogs = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      const auth = JSON.parse(localStorage.getItem("auth"));
      const token = auth?.token;
      const { status, data: response_data } = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}v1/user/transaction/bet-logs`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      if (status === 200 && response_data?.success) {
        setTransactions(response_data.results.data || []);
        setTotalPages(response_data.results.totalPages || 1);
      } else {
        throw new Error(response_data?.message || 'Failed to load transaction logs');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactionLogs();
  }, [page]);

  const displayValue = (value) => {
    if (value === null || value === undefined || value === '')
      return <span style={{ color: '#6c757d', fontSize: '14px' }}>--</span>;
    return value;
  };

  // Frontend date filtering
  const filteredTransactions = transactions.filter((tx) => {
    if (!dateRange.start || !dateRange.end) return true;
    const txDate = new Date(tx.createdAt);
    return txDate >= dateRange.start && txDate <= dateRange.end;
  });

  if (error) {
    return (
      <div
        className="alert alert-danger"
        style={{
          margin: '1rem',
          padding: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      >
        <img src="/no_data.svg" alt="" />
      </div>
    );
  }

  return (
    <>
      <BackHeader text={t('record.accountRecord')} />
      <div
        className="account-statement-container"
        style={{
          width: '100%',
          margin: '0 auto',
          fontFamily: 'Helvetica, Tahoma, sans-serif',
          backgroundColor: '#fff',
          boxSizing: 'border-box',
          fontSize: '14px',
          minHeight: '100vh'
        }}
      >
        {/* Date Filter */}
        <AccountRecordDateFilter onDateChange={setDateRange} />

        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>{t('record.loading')}</p>
        ) : filteredTransactions.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>{t('record.noRecords')}</p>
        ) : (
          filteredTransactions
            .filter((tx) => tx.amount !== 0)
            .map((tx) => {
              const amount = parseFloat(tx.amount).toFixed(2);
              const balance = Array.isArray(tx.newBalance)
                ? tx.newBalance[0]?.toFixed(2)
                : parseFloat(tx.newBalance || 0).toFixed(2);

              const remark = tx.eventId || tx.isCasinoBetting === true
                ? `${tx.gameType.charAt(0).toUpperCase() + tx.gameType.slice(1)} ${tx.gameName ? `/ ${tx.gameName}` : ''} ${tx.eventId ? `/ ${tx.eventId}` : ''} ${tx.runnerName ? `/ ${tx.runnerName}` : ''} ${tx.betType ? `/ ${tx.betType}` : ''} / ${tx.betFaireType}`
                : `${tx.remark ? tx.remark : 'Agent Deposit'}`;

              const fromUser = tx.transactionType === "credit" ? "" : "You";
              const toUser = tx.transactionType === "credit" ? "You" : "";

              const isCredit = tx.transactionType === "credit";
              const isDebit = tx.transactionType === "debit";

              return (
                <div
                  key={tx._id}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '12px',
                    margin: '10px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                  }}
                >
                  {/* Header with icon + title + time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <img
                        src="https://www.nbajee10.club/mobile/mc/bill.b01b2d35.png"
                        alt="tx-icon"
                        style={{ width: '20px', height: '20px' }}
                      />
                      <strong>{isCredit ? t('record.transaction.transferIn') : t('record.transaction.transferOut')}</strong>
                    </div>
                    <span style={{ fontSize: '12px', color: '#6c757d' }}>
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Order no. + From → To */}
                  <div style={{ fontSize: '13px', marginBottom: '4px' }}>
                    <strong>{t('record.transaction.orderNo')}:</strong> {tx._id}
                  </div>
                  <div style={{ fontSize: '13px', marginBottom: '8px', color: '#555' }}>
                    {fromUser} {t('record.transaction.from')} → {t('record.transaction.to')} {toUser}
                  </div>

                  {/* Balance + Transaction amount */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('record.transaction.balance')}</div>
                      <div style={{ fontWeight: 'bold' }}>{balance}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#6c757d' }}>{t('record.transaction.transactionAmount')}</div>
                      <div
                        style={{
                          color: isCredit ? '#198754' : '#dc3545',
                          fontWeight: 'bold',
                        }}
                      >
                        {isCredit ? `+${amount}` : `-${amount}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
        )}

        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '10px 0',
            fontSize: '14px',
            gap: '10px',
          }}
        >
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: '6px 12px',
              backgroundColor: page <= 1 ? '#e0e0e0' : '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: page <= 1 ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            {t('record.pagination.previous')}
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: '6px 12px',
              backgroundColor: page >= totalPages ? '#e0e0e0' : '#007BFF',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: '16px',
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountRecord;
