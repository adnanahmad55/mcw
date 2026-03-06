import { useEffect, useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './ref.css'
import Header from './component/Header'
import Footer from './component/Footer'
import Home from './Pages/Home'
import { useDispatch, useSelector } from 'react-redux'
import { loadUserFromStorage } from './redux/slice/authSlice'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Promotions from './Pages/Promotions'
import Turnover from './Pages/Turnover'
import Deposit from './Pages/Deposit'
import DepositHistory from './Pages/DepositHistory'
import Reward from './Pages/Reward'
import useIsMobile from './hooks/useIsMobile'
import Account from './Pages/Account'
import Cashback from './Pages/Cashback'
import ProfitAndLoss from './Pages/ProfitAndLoss'
import MyAccount from './Pages/MyAccount'
import SecurityCenter from './Pages/SecurityCenter'
import WebEmail from './Pages/WebEmail'
import Suggestion from './Pages/Suggestion'
import MyCards from './Pages/MyCards'
import GameList from './Pages/GameList'
import InviteFriends from './Pages/InviteFriends'
import Benefits from './Pages/Benefits'
import BettingRecord from './Pages/BettingRecord'
import Bonus from './Pages/Bonus'
import ProfitLoss from './Pages/ProfitLoss'
import AccountRecord from './Pages/AccountRecord'
import WithdrawHistory from './Pages/WithdrawHistory'
import Withdrawal from './Pages/Withdrawal'
import MyWallet from './Pages/MyWallet'
import RescueFund from './Pages/RescueFund'
import OpenBets from './component/OpenBets'
import Login from './component/Login'
import LoginRoute from './component/LoginRoute'
import DownloadBanner from './component/DownloadBanner'
import LiveAgentButton from './component/LiveAgentButton'
import EventScrollBox from './component/EventScrollBox'
import './i18n'; // Import the i18n configuration - this initializes i18n - this initializes i18n
import FooterNav from './component/FooterNav'
import SportsMobile from './Pages/sports/SportsMobile'
import MobileSports from './Pages/sports/MobileSports'
import MobMatch from './Pages/sports/MobMatch'
import MobInplay from './Pages/sports/MobInplay'
import { useRefreshTokenMutation } from './redux/service/api'
import MobBets from './Pages/sports/MobBets'
import MobSetting from './Pages/sports/MobSetting'
import TransactionRecord from './Pages/TransactionRecord'
import DesktopLayout from './component/desktop/DesktopLayout'


function App() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const location = useLocation();
  const state = location.state;
  const [refreshToken] = useRefreshTokenMutation();
  const initiateApiCall = useSelector((state) => state.sportsState.initiateApiCall);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(loadUserFromStorage());

    // simulate splash screen for 2s (adjust as needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname === "/") {
      document.body.classList.add("home-page");
    } else {
      document.body.classList.remove("home-page");
    }
  }, [location.pathname]);

  const { isLogin, username } = useSelector((state) => state.auth);
  const authData = JSON.parse(localStorage.getItem("auth"));
  const user_id = authData?.userId;
  const token = authData?.token;

  // const hasDeviceId = authData?.device_id || localStorage.getItem('isNotWebDevice') !== null;
  const hasDeviceId = authData?.device_id;

  const withdrawSportsBalance = async (username) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}sports/withdraw-balance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      // console.log('withdrawSportsBalance', data)
      if (!data.success) {
        console.warn("Withdraw failed:", data.message);
      }
      return data;
    } catch (error) {
      console.error("Error in withdrawSportsBalance:", error);
      throw error;
    }
  };
  const getDailyBonus = async () => {
    try {

      if (!user_id || !username) {
        console.error("User not logged in properly");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_BASE_URL}promotion/get-daily-bonus?username=${username}&user_id=${user_id}`
      );

      if (res?.data?.status) {
        // console.log("Daily Bonus Data:", res?.data?.data);
        // setOfferClaim(res?.data?.data?.claim_bonus?.is_claimable);
        // console.log(data?.data?.claim_bonus?.is_claimable, 'data?.data?.claim_bonus?.is_claimable');

      } else {
        console.warn("No bonus available or API error:", res?.data?.message);
      }
    } catch (err) {
      console.error("Get daily bonus error:", err);
    }
  };
  const generateTsCode = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };
  const handle9WicketsWithdraw = async () => {
    try {
      const withdrawPayload = {
        username,
        withdrawAll: 1,
        // balance: 100,
        tsCode: generateTsCode()
      };
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}9-wick/withdraw`, {
        // const response = await fetch(`http://192.168.0.246:5010/9-wick/withdraw`, {
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


  // useEffect(() => {
  //   if (isLogin) {
  //     withdrawSportsBalance(username);
  //     handle9WicketsWithdraw()
  //   }
  // }, [isLogin, username]);

  const allowedPages = ["/", "/game-list", "/turnover"];
  const showHeaderFooter = allowedPages.includes(location.pathname);
  const allowedFooterPages = ["/deposit", "/withdrawal", "/promotions"];
  const showFooter = allowedFooterPages.includes(location.pathname);
  const isHomePage = location.pathname === "/";

  // if (loading) {
  //   return (
  //       <div className="v-overlay__content">
  //         <div className="pulse">
  //           <img src="/logo.webp" style={{ width:"209px"}} />
  //         </div>
  //       </div>
  //   );
  // }

  const handleInitiateGame = async () => {
    // setLoginLoader(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_INITIATE}/get-Initiate-Game-V2`,
        {
          operator_code: import.meta.env.VITE_APP_OPERATOR_ID,
          game_code: "MGP030119",
          integration_env: "H5",
          ip: 'http://192.168.0.59'
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('authToken'))}`,
          },
        }
      );
      if (response.data.status) {
        // console.log(, 'response.data.data.player_id');
        localStorage.setItem('initiatePlayerId', JSON.stringify(response?.data?.data?.userinfo?.player_id));
        // localStorage.setItem('session_token', JSON.stringify(response?.data?.data?.userinfo?.session_token))
        // localStorage.setItem("wallet_balance", JSON.stringify(response?.data?.data?.userinfo?.wallet));
        // dispatch(currentWalletBalance(response?.data?.data?.userinfo?.wallet));



        const authData = JSON.parse(localStorage.getItem("auth"));

        const { token, username, userId } = authData;

        const playerId = userId;
        const oprId = import.meta.env.VITE_APP_OPERATOR_ID;

        if (playerId && oprId) {
          // refreshToken({ playerId, oprId, token: "" });
          const res = await refreshToken({ playerId, oprId }).unwrap();
          if (res?.message === "token updated successfully") {
            // setLoginLoader(false);
            localStorage.setItem("authToken", JSON.stringify(res.token));
            console.log(res.token, "✅ Token saved to localStorage");
            return
          } else if (res?.message === 'invalid current auth token') {
            // setLoginLoader(false);
            console.log('invalid current auth token');
            localStorage.clear()
            // dispatch(isLoggedIn(false));
            navigate(`/`);
          }
        }


      }
      else {
        if (response?.data?.message === 'Invalid Token') {
          alert('Authentication failed. Kindly re-login to continue.');
          localStorage.clear()
          dispatch(isLoggedIn(false));
          navigate('/');
          window.location.reload();
          sessionStorage.clear();
          // dispatch(setSportsBetBtnEnable(true));
        }

      }

      // console.log("✅ API Response:", response.data);
      // Do something with response.data
    } catch (error) {
      if (error?.response?.data?.message === 'Invalid Token') {
        alert('Authentication failed. Kindly re-login to continue.');
        localStorage.clear()
        dispatch(isLoggedIn(false));
        navigate('/');
        window.location.reload();
        sessionStorage.clear();
      }
      console.error("❌ Error:", error);
    }
  };

  useEffect(() => {
    if (!isLogin) {
      return
    }
    if (initiateApiCall && isLogin) {
      handleInitiateGame();
    }
  }, [initiateApiCall]);

  // Shared routes for both mobile and desktop
  const renderRoutes = () => (
    <>
      <Routes location={location.state?.backgroundLocation || location}>
        <Route path="/" element={<Home />} />

        <Route path="/promotions" element={<Promotions />} />
        <Route path="/turnover" element={<Turnover />} />
        <Route path="/game-list" element={<GameList />} />
        <Route path="/reward" element={<Reward />} />
        <Route path="/vip" element={<Benefits />} />
        <Route path="/bonus" element={<Bonus />} />

        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<LoginRoute />} />

        <Route path="/account" element={<Account />} />
        <Route path="/deposit-history" element={<DepositHistory />} />
        <Route path="/withdraw-history" element={<WithdrawHistory />} />

        <Route path="/cashback" element={<Cashback />} />
        <Route path="/profitandloss" element={<ProfitAndLoss />} />
        <Route path="/profit-loss" element={<ProfitLoss />} />
        <Route path="/betting-record" element={<BettingRecord />} />
        <Route path="/account-record" element={<AccountRecord />} />

        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/securityCenter" element={<SecurityCenter />} />
        <Route path="/webEmail" element={<WebEmail />} />
        <Route path="/suggestion" element={<Suggestion />} />
        <Route path="/my-cards" element={<MyCards />} />
        <Route path="/invite-friends" element={<InviteFriends />} />

        <Route path="/rescue-fund" element={<RescueFund />} />
        <Route path="/openbets" element={<OpenBets />} />

        {/* Sports */}
        <Route path='/mob-sport' element={<SportsMobile />} />
        <Route path='/mobile-sports' element={<MobileSports />} />
        <Route path='/mob-match' element={<MobMatch />} />
        <Route path='/mob-inplay' element={<MobInplay />} />
        <Route path='/mob-setting' element={<MobSetting />} />
        <Route path='/mob-bets' element={<MobBets />} />
        <Route path='/transaction-record' element={<TransactionRecord />} />
      </Routes>

      {/* Overlay Routes */}
      <AnimatePresence>
        {location.state?.backgroundLocation && (
          <Routes location={location}>
            <Route
              path="/deposit"
              element={<MyWallet isDeposit={true} isOverlay />}
            />
            <Route
              path="/withdrawal"
              element={<MyWallet isDeposit={false} isOverlay />}
            />
          </Routes>
        )}
      </AnimatePresence>
    </>
  );

  // ============ DESKTOP VIEW (≥1024px) ============
  if (!isMobile) {
    return (
      <>
        <DesktopLayout showFooter={isHomePage}>
          <div className="w-full bg-bodyColor overflow-hidden">
            {renderRoutes()}
          </div>
        </DesktopLayout>

        {isLogin && <EventScrollBox />}
        <ToastContainer />
      </>
    );
  }

  // ============ MOBILE VIEW (<1024px) ============
  return (
    <>
      {showHeaderFooter && <Header />}

      <div className="w-full bg-bodyColor overflow-hidden">
        <div className="max-w-[1000px] mx-auto">
          {renderRoutes()}
        </div>
      </div>

      {isLogin && <EventScrollBox />}

      {isHomePage && <Footer />}

      {(showHeaderFooter || showFooter) && <FooterNav />}

      <ToastContainer />
    </>
  );
}

export default App
