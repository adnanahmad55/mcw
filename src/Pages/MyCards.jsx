import React, { useEffect, useState } from "react";
import BackHeader from "../component/BackHeader";
import { toast } from "react-toastify";

export default function MyCards() {
    const [cards, setCards] = useState([]);
    const [availableWithdrawals, setAvailableWithdrawals] = useState(0);

    const fetchWithdrawalWallets = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem("auth"));
            const user_id = authData?.userId;
            const username = authData?.username;

            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}withdraw/get-withdrawal-wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData?.token}`
                },
                body: JSON.stringify({
                    user_id,
                    username
                })
            });

            const data = await response.json();
            
            if (response.ok && data.status) {
                const formattedCards = data.data.withdraw_wallet.map((wallet, index) => ({
                    id: `${wallet.bdt_id}-${index}`,
                    bank: wallet.bank_name,
                    cardNumber: wallet.bdt_id,
                    maskedCardNumber: wallet.bdt_id.length > 3 
                        ? '*'.repeat(wallet.bdt_id.length - 3) + wallet.bdt_id.slice(-3) 
                        : wallet.bdt_id,
                    name: "User",
                    dateAdded: new Date().toISOString().split('T')[0] // Use current date
                }));
                setCards(formattedCards);
                setAvailableWithdrawals(data?.data?.availableWithdrawals);
            } else {
                toast.error(data.message || "Failed to fetch wallets");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        }
    };

    useEffect(() => {
        fetchWithdrawalWallets();
    }, []);

    // Function to get icon based on bank name
    const getBankIcon = (bankName) => {
        const bankLower = bankName.toLowerCase().trim();
        return `/assets/img/deposit/${bankLower}.png`;
    };

    return (
        <>
            <div className="bg-[#333]">
                <BackHeader text="My Cards" />
            </div>

            <div className="min-h-screen bg-white flex items-start justify-center p-4">
                <div className="w-full max-w-sm space-y-2">
                    {/* Wallet Count */}
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">• E-wallet added :</span> {cards.length}
                    </p>

                    {/* Wallet Cards */}
                    {cards.length > 0 ? (
                        cards.map((card) => (
                            <div
                                key={card.id}
                                className="relative bg-orange-50 rounded-lg p-4 flex items-center justify-between shadow"
                                style={{
                                    backgroundImage: "url('/assets/img/withdraw-card-bg.png')",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "right bottom",
                                    backgroundSize: "cover",
                                }}
                            >
                                {/* Icon + Info */}
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={getBankIcon(card.bank)}
                                        alt={card.bank}
                                        className="w-[79px] object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevent infinite loop
                                            e.target.src = '/assets/img/deposit/default.png'; // Fallback image
                                        }}
                                    />
                                    <div className="text-sm text-gray-700">
                                        <div className="font-semibold">{card.bank}</div>
                                        <div className="text-xs text-gray-600">{card.maskedCardNumber}</div>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="text-xs text-gray-500 absolute bottom-2 right-3">
                                    {card.dateAdded}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No wallets added yet
                        </div>
                    )}

                    {/* Available Withdrawals */}
                    {availableWithdrawals > 0 && (
                        <div className="text-sm text-gray-600 mt-4">
                            <span className="font-medium">• Available withdrawals:</span> {availableWithdrawals}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}