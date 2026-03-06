import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import the translation hook
import axios from 'axios';
import DateFilter from '../component/DateFilter';
import BackHeader from '../component/BackHeader';

const ProfitLoss = () => {
  const { t } = useTranslation(); // Initialize translation function
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromPeriod: '',
    toPeriod: '',
    filterByDay: '', // This will hold 'today', 'yesterday', etc.
  });

  const tabs = {
    sports_exchange: { label: t('record.exchange'), betType: 'sports_exchange' },
    casino: { label: t('record.casino'), betType: 'casino' },
  };

  const fetchDataForAllTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create promises for all bet types
      const promises = Object.values(tabs).map(tab => {
        const params = {
          betType: tab.betType,
          page: 1,
          // Only add date parameters if filterByDay is not 'today' or 'yesterday'
          ...(filters.filterByDay !== 'today' && filters.filterByDay !== 'yesterday' && filters.fromPeriod && { fromPeriod: filters.fromPeriod }),
          ...(filters.filterByDay !== 'today' && filters.filterByDay !== 'yesterday' && filters.toPeriod && { toPeriod: filters.toPeriod }),
          // Add filterByDay if it's 'today' or 'yesterday'
          ...(filters.filterByDay && (filters.filterByDay === 'today' || filters.filterByDay === 'yesterday') && { filterByDay: filters.filterByDay }),
          // Add filterByDay if it's not 'today' or 'yesterday' and not empty
          ...(filters.filterByDay && filters.filterByDay !== 'today' && filters.filterByDay !== 'yesterday' && { filterByDay: filters.filterByDay }),
          // Only add provider for sports
          ...(tab.betType !== 'casino' && { provider: '9w' })
        };

        const auth = JSON.parse(localStorage.getItem("auth"));
        const token = auth?.token;

        return axios.get(
          `${import.meta.env.VITE_APP_API_BASE_URL}v1/user/match/profit-loss-v2`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params,
          }
        );
      });

      // Wait for all requests to complete
      const responses = await Promise.all(promises);
      
      // Process and combine all data
      let combinedData = [];
      
      responses.forEach((response, index) => {
        const tabKey = Object.keys(tabs)[index];
        const tab = tabs[tabKey];
        
        if (response.status === 200 && response.data?.success) {
          const results = response.data.results;
          
          if (tabKey === 'casino' && Array.isArray(results.data)) {
            // Flatten casino bets
            const flattenedBets = [];
            results.data.forEach(platformGroup => {
              if (platformGroup.bets_list && Array.isArray(platformGroup.bets_list)) {
                platformGroup.bets_list.forEach(bet => {
                  flattenedBets.push({
                    ...bet,
                    parentPlatform: platformGroup.platform || bet.platform,
                    gameType: platformGroup.gameType || bet.gameType,
                    betType: tab.betType,
                    betTypeLabel: tab.label,
                    createdAt: bet.timeInserted || bet.createdAt,
                    amount: bet.betAmount,
                    profitLoss: (bet.profitAmount || 0) - (bet.loseAmount || 0)
                  });
                });
              }
            });
            combinedData = [...combinedData, ...flattenedBets];
          } else if (tabKey === 'sports_exchange' && Array.isArray(results.data)) {
            // Process sports data with new API structure
            const flattenedBets = [];
            results.data.forEach(matchGroup => {
              if (matchGroup.bets_list && Array.isArray(matchGroup.bets_list)) {
                matchGroup.bets_list.forEach(bet => {
                  flattenedBets.push({
                    ...bet,
                    // Add match group level info to each bet
                    eventId: matchGroup.eventId,
                    matchName: matchGroup.matchName,
                    marketName: matchGroup.marketName,
                    tournamentName: matchGroup.tournamentName,
                    eventType: matchGroup.eventType,
                    calculatedProfitLoss: matchGroup.calculatedProfitLoss,
                    totalBetAmount: matchGroup.totalBetAmount,
                    matchSettledDate: matchGroup.matchSettledDate,
                    totalBets: matchGroup.totalBets,
                    totalStake: matchGroup.totalStake,
                    totalProfit: matchGroup.totalProfit,
                    totalLoss: matchGroup.totalLoss,
                    profitLoss: matchGroup.profitLoss,
                    betType: tab.betType,
                    betTypeLabel: tab.label
                  });
                });
              }
            });
            combinedData = [...combinedData, ...flattenedBets];
          }
        }
      });

      setData(combinedData);
    } catch (err) {
      console.error('[API Error]', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataForAllTypes();
  }, [JSON.stringify(filters)]); // Use JSON.stringify to ensure any filter change triggers the effect

  const calculateProfitLoss = (item) => {
    // Handle different bet types with their specific logic
    if (item.betType === 'casino') {
      return (item.profitAmount || 0) - (item.loseAmount || 0);
    }
    
    // For sports bets (exchange, fancy, bookmaker, etc.)
    // Use the profitLoss from the match group or calculate from bet details
    if (item.profitLoss !== undefined) {
      return item.profitLoss;
    }
    
    // Fallback calculation from bet details
    if (item.profitAmount > 0) {
      return item.profitAmount;
    }
    return -item.loseAmount;
  };

  // Group data by game types
  const groupedData = () => {
    const groups = {
      all: { icon: '🎯', name: t('sidebar.all'), data },
      slot: { icon: '🎰', name: t('sidebar.slot'), data: [] },
      live: { icon: '🎲', name: t('sidebar.liveCasino'), data: [] },
      egame: { icon: '🎮', name: t('sidebar.eGame'), data: [] },
      fish: { icon: '🐠', name: t('sidebar.fish'), data: [] },
      sports: { icon: '⚽', name: t('sidebar.sports'), data: [] }
    };

    data.forEach(item => {
      // Categorize based on bet type or platform
      const betType = item.betType?.toLowerCase();
      const platform = item.parentPlatform?.toLowerCase() || item.platform?.toLowerCase() || '';
      const gameType = item.gameType?.toUpperCase() || '';
      
      if (gameType === 'SLOT' || platform.includes('slot') || betType === 'slot') {
        groups.slot.data.push(item);
      } else if (gameType === 'EGAME') {
        groups.egame.data.push(item);
      } else if (gameType === 'FISH' || gameType === 'FH' || platform.includes('fish') || platform.includes('fh') || betType === 'fish') {
        groups.fish.data.push(item);
      } else if (gameType === 'LIVE' || gameType === 'TABLE' || platform.includes('live') || betType === 'live' || item.gameName?.toLowerCase().includes('live')) {
        groups.live.data.push(item);
      } else if (betType === 'casino' && gameType !== 'SLOT' && gameType !== 'EGAME' && gameType !== 'FISH') {
        // Default casino games to live if not specifically categorized
        groups.live.data.push(item);
      } else if (betType !== 'casino') {
        // All sports-related bets
        groups.sports.data.push(item);
      }
    });

    return groups;
  };

  const calculateGroupStats = (groupData) => {
    let totalPL = 0;
    let deposit = 0;
    let withdrawal = 0;
    let bonus = 0;
    let rebate = 0;
    let income = 0;
    let expenses = 0;
    let betting = 0;
    let validBet = 0;
    let winAmount = 0;

    groupData.forEach(item => {
      const pl = calculateProfitLoss(item);
      totalPL += pl;
      
      const stake = item.amount || item.realAmount || item.betAmount || item.totalStake || 0;
      betting += stake;
      validBet += stake;
      
      if (pl > 0) {
        winAmount += pl;
        income += pl;
      } else {
        expenses += Math.abs(pl);
      }
    });

    return {
      totalPL,
      deposit,
      bonus,
      income,
      withdrawal,
      rebate,
      expenses,
      betting,
      validBet,
      winAmount
    };
  };

  const formatAmount = (amount) => {
    return Number(amount).toFixed(2);
  };

  const renderGameTypeCard = (groupKey, group) => {
    const stats = calculateGroupStats(group.data);
    const isPositive = stats.totalPL >= 0;

    return (
      <div key={groupKey} style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>{group.icon}</span>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              {group.name}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              marginBottom: '2px'
            }}>
              {t('record.profitLoss')}
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: isPositive ? '#22c55e' : '#ef4444'
            }}>
              {formatAmount(stats.totalPL)}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '16px',
          fontSize: '12px'
        }}>
          <div>
            <div style={{ color: '#666', marginBottom: '4px' }}>{t('sidebar.deposit')}</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.deposit)}</div>
          </div>
          <div>
            <div style={{ color: '#666', marginBottom: '4px' }}>{t('reward.bonus')}</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.bonus)}</div>
          </div>
          <div>
            <div style={{ color: '#666', marginBottom: '4px' }}>{t('record.income')}</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.income)}</div>
          </div>
          <div>
            <div style={{ color: '#666', marginBottom: '4px' }}>{t('account.withdrawal')}</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.withdrawal)}</div>
          </div>
          <div>
            <div style={{ color: '#666', marginBottom: '4px' }}>{t('record.rebate')}</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.rebate)}</div>
          </div>
          <div>
            <div style={{ color: '#666', marginBottom: '4px' }}>{t('record.expenses')}</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.expenses)}</div>
          </div>
        </div>

        {/* Additional stats for specific game types */}
        {(groupKey === 'slot' || groupKey === 'live' || groupKey === 'egame' || groupKey === 'fish') && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            fontSize: '12px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid #f0f0f0'
          }}>
            <div>
              <div style={{ color: '#666', marginBottom: '4px' }}>{t('record.betting')}</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.betting)}</div>
            </div>
            <div>
              <div style={{ color: '#666', marginBottom: '4px' }}>{t('record.validBet')}</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.validBet)}</div>
            </div>
            <div>
              <div style={{ color: '#666', marginBottom: '4px' }}>{t('record.winAmount')}</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.winAmount)}</div>
            </div>
            <div></div>
            <div>
              <div style={{ color: '#666', marginBottom: '4px' }}>{t('record.rebate')}</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.rebate)}</div>
            </div>
            <div>
              <div style={{ color: '#666', marginBottom: '4px' }}>{t('bonus.bonus')}</div>
              <div style={{ fontWeight: '600', color: '#333' }}>{formatAmount(stats.bonus)}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleDateFilterChange = (newFilters) => {
    console.log('Date filter changed:', newFilters); // Debug log
    setFilters({
      fromPeriod: newFilters.fromPeriod || '',
      toPeriod: newFilters.toPeriod || '',
      filterByDay: newFilters.filterByDay || ''
    });
  };

  const handleClearAll = () => {
    setFilters({
      fromPeriod: '',
      toPeriod: '',
      filterByDay: ''
    });
  };

  // Check if any filter is active
  const hasActiveFilters = filters.fromPeriod || filters.toPeriod || filters.filterByDay;

  if (loading) {
    return (
      <>
        <BackHeader/>
        <div style={{
          height: '100%',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '16px',
          fontFamily: 'Helvetica, sans-serif',
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: '16px'
          }}>
            <DateFilter
              onDateSelect={handleDateFilterChange}
              initialFromDate={filters.fromPeriod}
              initialToDate={filters.toPeriod}
              initialFilterByDay={filters.filterByDay}
            />
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#fff',
                  border: '1px solid #dc3545',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#dc3545',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  height: '40px',
                  alignSelf: 'flex-end'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#dc3545';
                }}
              >
                Clear All
              </button>
            )}
          </div>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ fontSize: '16px', color: '#6c757d' }}>{t('record.loading')}</div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BackHeader/>
        <div style={{
          height: '100%',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          padding: '16px',
          fontFamily: 'Helvetica, sans-serif',
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginBottom: '16px'
          }}>
            <DateFilter
              onDateSelect={handleDateFilterChange}
              initialFromDate={filters.fromPeriod}
              initialToDate={filters.toPeriod}
              initialFilterByDay={filters.filterByDay}
            />
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#fff',
                  border: '1px solid #dc3545',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#dc3545',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  height: '40px',
                  alignSelf: 'flex-end'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#dc3545';
                }}
              >
                Clear All
              </button>
            )}
          </div>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#dc3545' }}>
            <div>{error}</div>
          </div>
        </div>
      </>
    );
  }

  const groups = groupedData();

  return (
    <>
      <BackHeader text={t('record.profitLoss')}/>
      <div style={{
        height: '100%',
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '16px',
        fontFamily: 'Helvetica, sans-serif',
        boxSizing: 'border-box',
        backgroundColor: '#f5f5f5',
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: '16px'
        }}>
          <DateFilter
            onDateSelect={handleDateFilterChange}
            initialFromDate={filters.fromPeriod}
            initialToDate={filters.toPeriod}
            initialFilterByDay={filters.filterByDay}
          />
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              style={{
                padding: '8px 12px',
                backgroundColor: '#fff',
                border: '1px solid #dc3545',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#dc3545',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                height: '40px',
                alignSelf: 'flex-end'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dc3545';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#dc3545';
              }}
            >
              Clear All
            </button>
          )}
        </div>
        
        {/* Game Type Cards */}
        <div style={{ marginTop: '16px' }}>
          {Object.entries(groups).map(([key, group]) => 
            renderGameTypeCard(key, group)
          )}
        </div>

        {data.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#6c757d',
            textAlign: 'center',
            backgroundColor: '#fff',
            borderRadius: '12px',
            marginTop: '16px'
          }}>
            <svg className="am-icon am-icon-nodata_f4c19c2d am-icon-md nodata-icon">
              <use xlinkHref="#nodata_f4c19c2d"></use>
            </svg>
            <div>{t('record.noRecords')}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfitLoss;