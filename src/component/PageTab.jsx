import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PageTab() {
    const location = useLocation();
    const navigate = useNavigate();

    const isDeposit = location.pathname === "/deposit";
    const isWithdrawal = location.pathname === "/withdrawal";

    return (
        <div className='w-full bg-[#2b2922] p-[2.1333333333vw]'>
            <div className='bg-[#222222] rounded-[1.3333333333vw] grid grid-cols-2 relative overflow-hidden'>

                {/* Deposit Tab */}
                <div
                    onClick={() => navigate('/deposit', {
                        state: { backgroundLocation: location },
                    })}
                    className="relative flex items-center justify-center text-center h-[8.5333333333vw] text-[3.4666666667vw] cursor-pointer rounded-[1.3333333333vw] text-white/70"
                >
                    {isDeposit && (
                        <motion.div
                            layoutId="activeBg"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute inset-0 rounded-[1.3333333333vw] bg-[#ffb80c]"
                        />
                    )}
                    <span className="relative z-10">Deposit</span>
                </div>

                {/* Withdrawal Tab */}
                <div
                    onClick={() => navigate("/withdrawal")}
                    className="relative flex items-center justify-center text-center h-[8.5333333333vw] text-[3.4666666667vw] cursor-pointer rounded-[1.3333333333vw] text-white/70"
                >
                    {isWithdrawal && (
                        <motion.div
                            layoutId="activeBg"
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute inset-0 rounded-[1.3333333333vw] bg-[#ffb80c]"
                        />
                    )}
                    <span className="relative z-10">Withdrawal</span>
                </div>
            </div>
        </div>
    )
}
