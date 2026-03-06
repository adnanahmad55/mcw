import React, { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { useNavigate } from "react-router-dom";

const NineWickets = ({ title }) => {
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, username } = useSelector((state) => state.auth);
  const apiPath = {
    casinoAmountAdd: 'v1/user/casino-amount-add',
    doLoginAndLaunchGame: 'v1/wallet/doLoginAndLaunchGame',
    getUserBalance: 'v1/user/get-user-balance'
  };
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
  const NINE_WICKETS_BASE_URL = `${import.meta.env.VITE_APP_API_BASE_URL}`
  const nineWicketsApi = {
    launch: `${NINE_WICKETS_BASE_URL}9-wick/launch`,
    deposit: `${NINE_WICKETS_BASE_URL}9-wick/deposit`,
    withdraw: `${NINE_WICKETS_BASE_URL}9-wick/withdraw`
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
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
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
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
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
      const depositResponse = await fetch(nineWicketsApi.deposit, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(depositPayload),
      });
      const depositData = await depositResponse.json();
      if (!depositData.status || depositData.subCode !== 200) {
        console.warn("9Wickets deposit failed:", depositData.message);
      } else {
        console.log("9Wickets deposit successful:", depositData.message);
      }
      window.location.assign(gameUrl)
      // .then(response => response.json())
      // .then(data => {
      //   if (!data.status || data.subCode !== 200) {
      //     console.warn("9Wickets deposit failed:", data.message);
      //   } else {
      //     console.log("9Wickets deposit successful:", data.message);
      //   }
      // })
      // .catch(error => {
      //   console.error("Error in 9Wickets deposit:", error);
      // });

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

  const sports9WktsGames = [
    { img: '/dataImages/9wickets/exchange.png', title: "All Exchange" },
    { img: '/dataImages/9wickets/bti.png', title: "Sportsbook BTi" },
    { img: '/dataImages/9wickets/saba.png', title: "Sportsbook Saba" },
    { img: '/dataImages/9wickets/bc.png', title: "BC Sports" },
    { img: '/dataImages/9wickets/kabaddi.png', title: "Kabaddi" },
    { img: '/dataImages/9wickets/cricket.png', title: "Cricket" },
    { img: '/dataImages/9wickets/soccer.png', title: "Soccer" },
    { img: '/dataImages/9wickets/tennis.png', title: "Tennis" },
  ]
  return (
    <>
      {loader && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}
      {sports9WktsGames.map((game, index) => (
        <div className="nineWickets-list desktop shine rounded-lg overflow-hidden shadow-md cursor-pointer hover:scale-105 transition-transform duration-300 relative" key={index}
          onClick={() => navigate('/mob-sport')}>
          <div className="nineWickets-inner-main" style={{ padding: '2.666667vw 0 1.66vw' }}>
            <div className="nineWickets-inner">
              <span>
                <img src={game.img} alt={game.title} />
              </span>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '1rem' }}>{game.title}</p>
          </div>
        </div>
      ))}
    </>
  );
}
export default NineWickets;