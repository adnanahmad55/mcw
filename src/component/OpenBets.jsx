import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const formatCurrency = (amount) => {
  if (!amount) return "0.00";
  return parseFloat(amount).toFixed(2);
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Bet card component for individual bets
const BetCard = ({ bet, betType, onCancel }) => {
  const getBetTypeColor = () => {
    if (bet.betType?.toLowerCase() === "back") return "text-blue-400";
    if (bet.betType?.toLowerCase() === "lay") return "text-red-500";
    return "text-gray-400";
  };

  const getProfitLossColor = () => {
    const profit = parseFloat(bet.profitAmount || 0);
    const loss = parseFloat(bet.loseAmount || 0);
    if (profit > loss) return "text-green-500";
    if (loss > profit) return "text-red-500";
    return "text-gray-400";
  };

  const getSelectionName = () => {
    return bet.selectionName || bet.runnerName || bet.teamName || "Unknown";
  };

  const getOdds = () => {
    return bet.bhav || "N/A";
  };

  return (
    <div className={`border border-[#2a3441] rounded-lg p-4 my-3 ${
      bet.isMatched ? "bg-[#1a2332]" : "bg-[#2a2a1a]"
    }`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className={`text-sm font-bold uppercase ${getBetTypeColor()}`}>
            {bet.betType || "BET"}
          </span>
          <span className={`ml-2 px-2 py-1 rounded text-xs font-bold ${
            bet.isMatched ? "bg-green-500 text-white" : "bg-yellow-500 text-black"
          }`}>
            {bet.isMatched ? "MATCHED" : "UNMATCHED"}
          </span>
        </div>
        {!bet.isMatched && onCancel && (
          <button
            onClick={() => onCancel(bet._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Selection Info */}
      <div className="mb-3">
        <div className="text-lg font-bold text-white">
          {getSelectionName()}
        </div>
        <div className="text-xs text-gray-400">
          {/* {betType} */}
          {bet.marketName}
        </div>
      </div>

      {/* Bet Details */}
      <div className="flex justify-between text-sm">
        <div>
          <div className="text-gray-400">Odds: <span className="font-medium text-white">{getOdds()}</span></div>
          <div className="text-gray-400">Stake: <span className="font-medium text-white">৳{formatCurrency(bet.amount)}</span></div>
        </div>
        <div className="text-right">
          <div className={getProfitLossColor()}>
            Profit: <span className="font-medium">৳{formatCurrency(bet.profitAmount)}</span>
          </div>
          <div className="text-red-500">
            Risk: <span className="font-medium">৳{formatCurrency(bet.loseAmount)}</span>
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="text-xs text-gray-500 mt-3 text-right">
        {formatDate(bet.timeInserted)}
      </div>
    </div>
  );
};

// Match group component
const MatchGroup = ({ matchName, betTypes, onCancel, onToggleExpand, isExpanded }) => {
  const totalBets = Object.values(betTypes).reduce((sum, bets) => sum + bets.length, 0);
  const matchedBets = Object.values(betTypes).reduce((sum, bets) => 
    sum + bets.filter(bet => bet.isMatched).length, 0);
  const unmatchedBets = totalBets - matchedBets;

  return (
    <div className="mb-4 border border-[#2a3441] rounded-lg overflow-hidden">
      {/* Match Header */}
      <div 
        onClick={onToggleExpand}
        className="bg-[#1a2332] text-white p-4 cursor-pointer flex justify-between items-center"
      >
        <div>
          <div className="text-lg font-bold">{matchName}</div>
          <div className="text-xs text-gray-400">
            Total: {totalBets} • Matched: {matchedBets} • Unmatched: {unmatchedBets}
          </div>
        </div>
        <div className="text-xl">
          {isExpanded ? "−" : "+"}
        </div>
      </div>

      {/* Match Bets */}
      {isExpanded && (
        <div className="p-4 bg-[#0f1419]">
          {/* Group by bet type */}
          {Object.entries(betTypes).map(([betType, bets]) => {
            const matchedBets = bets.filter(bet => bet.isMatched);
            const unmatchedBets = bets.filter(bet => !bet.isMatched);

            return (
              <div key={betType} className="mb-4 last:mb-0">
                <div className="text-sm font-bold text-blue-400 mb-2 uppercase">
                  {betType} ({bets.length})
                </div>
                
                {/* Matched Bets */}
                {matchedBets.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-bold text-green-500 mb-2 ml-2">
                      Matched ({matchedBets.length})
                    </div>
                    {matchedBets.map(bet => (
                      <BetCard key={bet._id} bet={bet} betType={betType} />
                    ))}
                  </div>
                )}

                {/* Unmatched Bets */}
                {unmatchedBets.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-yellow-500 mb-2 ml-2">
                      Unmatched ({unmatchedBets.length})
                    </div>
                    {unmatchedBets.map(bet => (
                      <BetCard key={bet._id} bet={bet} betType={betType} onCancel={onCancel} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Main OpenBets Component as a Page
const OpenBets = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [betsData, setBetsData] = useState({});
  const [expandedMatches, setExpandedMatches] = useState({});

  // Category mapping
  const categoryMap = {
    1: "BetFair",
    2: "Fancy Bet",
    4: "SportsBook",
    5: "Bookmaker"
  };

  // Fetch data from single API
  const fetchBets = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}v1/user/match/my-bets?provider=9w`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setBetsData(response.data.results);
      } else {
        setError("Failed to load bets");
      }
    } catch (err) {
      setError("Failed to load bets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Process and group bets by matches and category type
  const processedMatches = useMemo(() => {
    const matches = {};

    // Process matched bets
    if (betsData.matched?.data) {
      betsData.matched.data.forEach(bet => {
        const matchKey = bet.matchName || "Unknown Match";
        const categoryType = bet.categoryType;
        const category = categoryMap[categoryType] || "Other";
        
        if (!matches[matchKey]) matches[matchKey] = {};
        if (!matches[matchKey][category]) matches[matchKey][category] = [];
        
        matches[matchKey][category].push({ ...bet, isMatched: true });
      });
    }

    // Process unmatched bets
    if (betsData.unMatched?.data) {
      betsData.unMatched.data.forEach(bet => {
        const matchKey = bet.matchName || "Unknown Match";
        const categoryType = bet.categoryType;
        const category = categoryMap[categoryType] || "Other";
        
        if (!matches[matchKey]) matches[matchKey] = {};
        if (!matches[matchKey][category]) matches[matchKey][category] = [];
        
        matches[matchKey][category].push({ ...bet, isMatched: false });
      });
    }

    return matches;
  }, [betsData]);

  const toggleMatchExpansion = (matchName) => {
    setExpandedMatches(prev => ({
      ...prev,
      [matchName]: !prev[matchName]
    }));
  };

  const handleCancelBet = async (betId) => {
    // Implement cancel bet logic here
    console.log("Cancel bet:", betId);
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to previous page
  };

  useEffect(() => {
    fetchBets();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2332] via-[#0f1419] to-[#0a0e13] text-white">
      {/* Header with back arrow and title */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a3441]">
        <button
          onClick={handleGoBack}
          className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h1 className="text-xl font-bold">Open Bets</h1>
        
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading && (
          <div className="text-center py-10 text-gray-400">
            Loading bets...
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {!loading && !error && Object.keys(processedMatches).length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <div className="text-lg mb-2">No open bets found</div>
            <div className="text-sm">You don't have any active bets at the moment</div>
          </div>
        )}

        {/* Render Matches */}
        {Object.entries(processedMatches).map(([matchName, betTypes]) => (
          <MatchGroup
            key={matchName}
            matchName={matchName}
            betTypes={betTypes}
            onCancel={handleCancelBet}
            onToggleExpand={() => toggleMatchExpansion(matchName)}
            isExpanded={expandedMatches[matchName]}
          />
        ))}
      </div>
    </div>
  );
};

export default OpenBets;