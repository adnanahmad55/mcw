import React, { useState, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import CasinoModal from "./CasinoModal";
import DepositRequiredModal from "./DepositRequiredModal"; // Import the new modal
import DownloadRequiredModal from "./DownloadRequiredModal"; // Import the new modal

export default function GameCard({ img, title, provider, platform, gameCode, gameType, game}) {
  const [loader, setLoader] = useState(false);
  const [casinoUrl, setCasinoUrl] = useState("");
  const [isCasinoModalOpen, setIsCasinoModalOpen] = useState(false);
  const [iframeHistory, setIframeHistory] = useState([]);
  const [iframeIndex, setIframeIndex] = useState(-1);
  const [isDepositRequiredModalOpen, setIsDepositRequiredModalOpen] = useState(false);
  const [depositRequiredMessage, setDepositRequiredMessage] = useState("");
  const [isDownloadRequiredModalOpen, setIsDownloadRequiredModalOpen] = useState(false);
  const [downloadRequiredMessage, setDownloadRequiredMessage] = useState("");
  const dispatch = useDispatch();

  const { token, username, userId } = useSelector((state) => state.auth);

  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

  const apiPath = {
    casinoAmountAdd: 'v1/user/casino-amount-add',
    doLoginAndLaunchGame: 'v1/wallet/doLoginAndLaunchGame',
    getUserBalance: 'v1/user/get-user-balance'
  };
  const NINE_WICKETS_BASE_URL = `${import.meta.env.VITE_APP_API_BASE_URL}`
  const nineWicketsApi = {
    launch: `${NINE_WICKETS_BASE_URL}9-wick/launch`,
    deposit: `${NINE_WICKETS_BASE_URL}9-wick/deposit`,
    withdraw: `${NINE_WICKETS_BASE_URL}9-wick/withdraw`
  };

  const apiPost = async (endpoint, payload) => {
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return { status: response.status, data: response.data };
    } catch (error) {
      // dispatch(logout())
      return { 
        status: error.response?.status || 500, 
        data: error.response?.data || { message: error.message } 
      };
    }
  };

  // Get user balance
  const getUserBalance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${apiPath.getUserBalance}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        return data.data?.totalCoins || 0;
      } else {
        console.error("Failed to get user balance:", data.message);
        return 0;
      }
    } catch (error) {
      console.error("Error getting user balance:", error);
      return 0;
    }
  };

  // Generate random transaction code
  const generateTsCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // 9Wickets withdraw on modal close
  const handle9WicketsWithdraw = async () => {
    try {
      const withdrawPayload = {
        username,
        withdrawAll: 1,
        // balance: 100,
        tsCode: generateTsCode()
      };

      const response = await fetch(nineWicketsApi.withdraw, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(withdrawPayload),
      });

      const data = await response.json();
      
      if (data.status && data.subCode === 200) {
        console.log("9Wickets withdraw successful:", data.message);
      } else {
        console.error("9Wickets withdraw failed:", data.message);
      }
    } catch (error) {
      console.error("Error in 9Wickets withdraw:", error);
    }
  };

  // Launch 9Wickets game in modal
  const launch9Wickets = async () => {
    if (!token || !username) {
      toast.error("Please login to play 9Wickets");
      return;
    }

    setLoader(true);
    try {
      // Step 1: Launch 9Wickets to get URL
      const launchPayload = {
        username
      };

      const launchResponse = await fetch(nineWicketsApi.launch, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(launchPayload),
      });

      const launchData = await launchResponse.json();
      // console.log(launchData)

      if (!launchData.status || !launchData.data?.url) {
        const errorMessage = launchData.message || "Failed to launch 9Wickets";
        // Check if the error message indicates a deposit is required
        if (errorMessage.toLowerCase().includes("deposit is required") || errorMessage.toLowerCase().includes("no deposit record found")) {
          setDepositRequiredMessage("Deposit is required to play the game");
          setIsDepositRequiredModalOpen(true);
        } else if (errorMessage.toLowerCase().includes("device id not found")) {
          setDownloadRequiredMessage("Download the app to play games");
          setIsDownloadRequiredModalOpen(true);
        } else {
          toast.error(errorMessage);
        }
        return;
      }

      const gameUrl = launchData.data.url;

      // Step 2: Get user balance
      const userBalance = await getUserBalance();

      // Step 3: Deposit balance to 9Wickets (immediately after launch)
      const depositPayload = {
        username,
        balance: userBalance,
        tsCode: generateTsCode()
      };

      // Fire deposit request immediately without waiting
      fetch(nineWicketsApi.deposit, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(depositPayload),
      })
      .then(response => response.json())
      .then(data => {
        if (!data.status || data.subCode !== 200) {
          console.warn("9Wickets deposit failed:", data.message);
        } else {
          console.log("9Wickets deposit successful:", data.message);
        }
      })
      .catch(error => {
        console.error("Error in 9Wickets deposit:", error);
      });
      // window.location.replace(gameUrl);
      window.location.assign(gameUrl)
      // window.location.href = gameUrl

      // Step 4: Open in casino modal
      // setCasinoUrl(gameUrl);
      // setIframeHistory([gameUrl]);
      // setIframeIndex(0);
      // setIsCasinoModalOpen(true);

    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong while launching 9Wickets.";
      // Check if the error message indicates a deposit is required
      if (errorMessage.toLowerCase().includes("deposit is required") || errorMessage.toLowerCase().includes("no deposit record found")) {
        setDepositRequiredMessage("Deposit is required to play the game");
        setIsDepositRequiredModalOpen(true);
      } else if (errorMessage.toLowerCase().includes("device id not found")) {
        setDownloadRequiredMessage("Download the app to play games");
        setIsDownloadRequiredModalOpen(true);
      } else {
        toast.error("Something went wrong while launching 9Wickets.");
        console.error("Error launching 9Wickets:", error);
      }
    } finally {
      setLoader(false);
    }
  };

  const launchCasino = async () => {
    if (!token || !userId) {
      toast.error("Please login to play casino games");
      dispatch(logout())
      return;
    }

    setLoader(true);
    try {
      const { status: amountStatus, data: amountResponse } = await apiPost(
        apiPath.casinoAmountAdd,
        { amount: 0, platForm: platform }
      );

      if (amountStatus === 200 && amountResponse.success) {
        const casinoUserId = amountResponse?.results?.aeCasinoUserId || userId;

        const payload = {
          userId: casinoUserId,
          platForm: platform === "1" ? "" : platform,
          gameType: gameType,
          gameCode: gameCode,
          isLobbyTrue: false,
          ...(platform === "SEXYBCRT" && {
            gameTableId: game.gameTableId
          }),
        };

        const { status: loginStatus, data: loginResponse } = await apiPost(
          apiPath.doLoginAndLaunchGame, 
          payload
        );

        if (loginStatus === 200) {
          if (loginResponse.status && loginResponse.data.status === "0000") {
            const gameUrl = loginResponse.data.url;

            const casinoSession = {
              url: gameUrl,
              request: {
                platform,
                gameType,
                gameCode,
                title
              },
              userId: casinoUserId,
              timestamp: Date.now()
            };
            sessionStorage.setItem('casinoSession', JSON.stringify(casinoSession));

            setIframeHistory([gameUrl]);
            setIframeIndex(0);
            setCasinoUrl(gameUrl);
            setIsCasinoModalOpen(true);
          } else {
            const errorMessage = loginResponse?.data?.desc || loginResponse?.message || "";
            // Check if the error message indicates a deposit is required
            if (errorMessage.toLowerCase().includes("deposit is required") || errorMessage.toLowerCase().includes("no deposit record found")) {
              setDepositRequiredMessage("Deposit is required to play the game");
              setIsDepositRequiredModalOpen(true);
            } else if (errorMessage.toLowerCase().includes("device id not found")) {
              setDownloadRequiredMessage("Download the app to play games");
              setIsDownloadRequiredModalOpen(true);
            } else {
              toast.error(errorMessage);
              // dispatch(logout())
            }
          }
        } else {
          const errorMessage = loginResponse?.message || "API error";
          // Check if the error message indicates a deposit is required
          if (errorMessage.toLowerCase().includes("deposit is required") || errorMessage.toLowerCase().includes("no deposit record found")) {
            setDepositRequiredMessage("Deposit is required to play the game");
            setIsDepositRequiredModalOpen(true);
          } else if (errorMessage.toLowerCase().includes("device id not found")) {
            setDownloadRequiredMessage("Download the app to play games");
            setIsDownloadRequiredModalOpen(true);
          } else {
            toast.error(errorMessage);
            // dispatch(logout())
          }
        }
      } else {
        const errorMessage = amountResponse?.message || "Failed to initialize casino";
        // Check if the error message indicates a deposit is required
        if (errorMessage.toLowerCase().includes("deposit is required") || errorMessage.toLowerCase().includes("no deposit record found")) {
          setDepositRequiredMessage("Deposit is required to play the game");
          setIsDepositRequiredModalOpen(true);
        } else if (errorMessage.toLowerCase().includes("device id not found")) {
          setDownloadRequiredMessage("Download the app to play games");
          setIsDownloadRequiredModalOpen(true);
        } else {
          // dispatch(logout())
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || "Something went wrong while launching the casino.";
      // Check if the error message indicates a deposit is required
      if (errorMessage.toLowerCase().includes("deposit is required") || errorMessage.toLowerCase().includes("no deposit record found")) {
        setDepositRequiredMessage("Deposit is required to play the game");
        setIsDepositRequiredModalOpen(true);
      } else if (errorMessage.toLowerCase().includes("device id not found")) {
        setDownloadRequiredMessage("Download the app to play games");
        setIsDownloadRequiredModalOpen(true);
      } else {
        toast.error("Something went wrong while launching the casino.");
        console.error("Error launching casino:", error);
        // dispatch(logout())
      }
    } finally {
      setLoader(false);
    }
  };

  const launchSports = async (gameTypeParam) => {
    if (!token || !username) {
      toast.error("Please login to play sports games");
      return;
    }

    setLoader(true);
    try {
      // Fetch user balance
      const balancePayload = {
        key: "Y4QYMBl2RYH1EfgF6X4",
        message: {
          action: "getBalance",
          userId: username,
        },
      };

      const balanceResponse = await fetch(
        `${API_BASE_URL}api/transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(balancePayload),
        }
      );

      const balanceData = await balanceResponse.json();

      if (balanceData.balance === undefined) {
        toast.error("Failed to get balance");
        return;
      }

      // Launch sports or exchange
      const sportsPayload = {
        username,
        gameType: gameTypeParam,
      };

      const sportsResponse = await fetch(
        `${API_BASE_URL}sports/get-iframe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sportsPayload),
        }
      );

      const sportsData = await sportsResponse.json();

      if (sportsData.success && sportsData.data?.iframeUrl) {
        // Redirect directly to the sports URL
        window.location.replace(sportsData.data.iframeUrl);
      } else {
        dispatch(logout())
        toast.error(sportsData.message || "Failed to launch sports");
      }
    } catch (error) {
      dispatch(logout())
      toast.error("Something went wrong while launching sports.");
      console.error("Error launching sports:", error);
    } finally {
      setLoader(false);
    }
  };

  const goBack = () => {
    if (iframeIndex > 0) {
      const newIndex = iframeIndex - 1;
      setIframeIndex(newIndex);
      setCasinoUrl(iframeHistory[newIndex]);
    }
  };

  const goForward = () => {
    if (iframeIndex < iframeHistory.length - 1) {
      const newIndex = iframeIndex + 1;
      setIframeIndex(newIndex);
      setCasinoUrl(iframeHistory[newIndex]);
    }
  };

  const restoreCasinoSession = () => {
    try {
      const storedSession = sessionStorage.getItem('casinoSession');
      if (storedSession) {
        const session = JSON.parse(storedSession);
        const now = Date.now();
        const sessionAge = now - session.timestamp;
        const maxAge = 30 * 60 * 1000; 

        if (sessionAge < maxAge) {
          setCasinoUrl(session.url);
          setIframeHistory([session.url]);
          setIframeIndex(0);
          setIsCasinoModalOpen(true);
          return true;
        } else {
          sessionStorage.removeItem('casinoSession');
        }
      }
    } catch (error) {
      console.error('Error restoring casino session:', error);
      sessionStorage.removeItem('casinoSession');
    }
    return false;
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isCasinoModalOpen) {
        sessionStorage.removeItem('casinoSession');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    const storedSession = sessionStorage.getItem('casinoSession');
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        if (session.request?.gameCode === gameCode && 
            session.request?.platform === platform) {
          restoreCasinoSession();
        }
      } catch (error) {
        console.error('Error checking stored session:', error);
        sessionStorage.removeItem('casinoSession');
      }
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameCode, platform, isCasinoModalOpen, token, username]);

  const closeCasinoModal = () => {
    // Run withdraw when closing the modal
    if (title === "9Wickets") {
      handle9WicketsWithdraw();
    }
    
    sessionStorage.removeItem('casinoSession');
    setIsCasinoModalOpen(false);
    setCasinoUrl("");
    setIframeHistory([]);
    setIframeIndex(-1);
  };

  const closeDepositRequiredModal = () => {
    setIsDepositRequiredModalOpen(false);
    setDepositRequiredMessage("");
  };

  const closeDownloadRequiredModal = () => {
    setIsDownloadRequiredModalOpen(false);
    setDownloadRequiredMessage("");
  };

  const handleCardClick = () => {
    if (loader) return;
    
    // Handle different game types
    if (title === "Sports") {
      launchSports("sports");
    } else if (title === "Exchange") {
      launchSports("exchange");
    } else if (title === "9Wickets") {
      launch9Wickets();
    } else {
      // Handle casino games
      launchCasino();
    }
  };

  return (
    <>
      <div 
        className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform duration-300 relative"
        onClick={handleCardClick}
      >
        {loader && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}

        <FaRegHeart className="absolute top-1 left-1 text-white z-5" />

        <img 
          src={img} 
          alt={title} 
          className={`w-full ${title && 'md:h-32'} object-cover`} 
        />
        
        {provider && provider !== "https://images.6492394993.com//TCG_PROD_IMAGES/RNG_LIST_VENDOR/KM-COLOR.png" && (
          <div 
            className="p-0 h-[27px] md:h-[31px] text-white text-center" 
            style={{
              background: 'linear-gradient(180deg,#192540,#253c5b)',
              borderRadius: '0 0 15px 15px'
            }}
          >
            <img 
              src={provider} 
              alt={title} 
              className="h-[26.368px] md:h-[30px] w-auto mx-auto object-cover" 
            />
          </div>
        )}
        
        {title && title !== "Sports" && title !== "Exchange" && title !== "9Wickets" && (
          <h4 
            className="text-[13.184px] md:text-sm font-semibold truncate text-center text-white whitespace-nowrap"
            style={{ textOverflow: 'ellipsis' }}
          >
            {title}
          </h4>
        )}
      </div>

      <CasinoModal
        isOpen={isCasinoModalOpen}
        onClose={closeCasinoModal}
        casinoUrl={casinoUrl}
        onGoBack={goBack}
        onGoForward={goForward}
        canGoBack={iframeIndex > 0}
        canGoForward={iframeIndex < iframeHistory.length - 1}
      />

      <DepositRequiredModal
        isOpen={isDepositRequiredModalOpen}
        onClose={closeDepositRequiredModal}
        message={depositRequiredMessage}
      />

      <DownloadRequiredModal
        isOpen={isDownloadRequiredModalOpen}
        onClose={closeDownloadRequiredModal}
        message={downloadRequiredMessage}
      />
    </>
  );
}