import React, { useState, useEffect } from "react";
import {
    RefreshCcw,
    PlusCircle,
    Wallet,
    DollarSign,
    CircleUserRound,
} from "lucide-react";
import { User, FileText, Headphones, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setCredentials } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function WalletBar() {
    const { isLogin, token, username, totalCoins } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [profileDrop, setProfileDrop] = useState(false);
    const navigate = useNavigate();
    const [userCoins, setUserCoins] = useState(totalCoins);
    const [bonusCoins, setBonusCoins] = useState(0);
    const [iexposure, setIexposure] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    // ✅ Refresh Coins Function with minimum 1 second loader
    const handleRefreshCoins = async () => {
        setIsLoading(true);
        
        try {
            const authData = JSON.parse(localStorage.getItem("auth"));
            if (!authData || !authData.token || !authData.username) {
                console.error("Auth data missing");
                return;
            }

            const { token, username } = authData;

            // Start the API request
            const response = await fetch(
                `${import.meta.env.VITE_APP_API_BASE_URL}v1/user/get-user-balance`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ username }),
                }
            );

            const data = await response.json();

            if (response.ok && data.success) {
                setUserCoins(data.data?.totalCoins);
                setIexposure(data.data?.ninew_exposure);
                setBonusCoins(data.data?.bonusCoins);
                localStorage.setItem('wallet_balance', (data?.data?.totalCoins ?? 0).toFixed(2))
            } else {
                handleLogout();
                console.error("Failed to refresh coins:", data.message);
            }
        } catch (error) {
            console.error("Error refreshing coins:", error);
        } finally {
            // Ensure loader shows for at least 1 second
            setTimeout(() => {
                setIsLoading(false);
            }, 1000); // 1000ms = 1 second minimum
        }
    };
    
    useEffect(() => {
        handleRefreshCoins();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleRefreshCoins();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // ✅ Add the keyframes style directly in component
    const loaderStyles = `
        @keyframes pulse {
            0%, 80%, 100% {
                transform: scale(0.6);
                opacity: 0.6;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;

    return (
        <div className="flex relative items-center bg-[#0f172a] px-2 py-2 rounded-full text-white">
            {/* Inject the animation styles */}
            <style>{loaderStyles}</style>
            
            {/* Balance + refresh */}
            <div className="flex items-center bg-[#1e293b] px-2 py-1 rounded-full space-x-2">
                {isLoading ? (
                    // ✅ Expanding dots loader with inline animation
                    <div className="flex items-center space-x-1 min-w-[80px] h-5">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <div
                                key={index}
                                className="w-2 h-2 bg-gray-400 rounded-full"
                                style={{
                                    animation: `pulse 1.4s infinite ease-in-out`,
                                    animationDelay: `${index * 0.1}s`,
                                }}
                            ></div>
                        ))}
                    </div>
                ) : (
                    <>
                            <div>
                                <span className="flex items-center" style={{fontSize:'11px'}}>৳ <span className="text-[10px] px-1"> (M) </span> {Number(userCoins).toFixed(2)}</span>
                                {bonusCoins > 0 && <span className="flex items-center" style={{fontSize:'11px'}}>৳ <span className="text-[8px] px-1"> (B) </span> {Number(bonusCoins).toFixed(2)}</span>}
                            </div>
                            <span style={{ fontSize: '8px' }}>({Number(iexposure).toFixed(2)})</span>
                        </>
                )}

                {/* ✅ Refresh button with onClick */}
                <RefreshCcw
                    size={16}
                    className={`cursor-pointer ${isLoading ? "animate-spin" : ""}`}
                    onClick={handleRefreshCoins}
                    disabled={isLoading}
                />
            </div>

            {/* Action icons */}
            <button className="p-2 bg-[#1e293b] rounded-full hover:bg-[#334155] hidden md:block">
                <PlusCircle size={18} />
            </button>
            <button className="p-2 bg-[#1e293b] rounded-full hover:bg-[#334155] hidden md:block">
                <Wallet size={18} />
            </button>
        </div>
    );
}