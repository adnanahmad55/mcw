import React, { useState, useEffect } from 'react'
import bgImg from '../assets/img/mall-bg.jpg'
import BackHeader from '../component/BackHeader'
import { useSelector } from 'react-redux';
import { IoCloseCircleOutline } from 'react-icons/io5'

export default function RescueFund() {
    const { username } = useSelector((state) => state.auth);
    const [modalOpen, setModalOpen] = useState(false);

    // Static rescue fund data
    const rescueData = {
        Fish: [
            { netLoss: '≥300.00', amount: '5%' },
            { netLoss: '≥3,000.00', amount: '6%' },
            { netLoss: '≥30,000.00', amount: '7%' },
            { netLoss: '≥100,000.00', amount: '8%' },
            { netLoss: '≥300,000.00', amount: '9%' },
            { netLoss: '≥1,000,000.00', amount: '10%' },
            { netLoss: '≥5,000,000.00', amount: '19%' },
            { netLoss: '≥10,000,000.00', amount: '39%' }
        ],
        Slot: [
            { netLoss: '≥300.00', amount: '5%' },
            { netLoss: '≥3,000.00', amount: '6%' },
            { netLoss: '≥30,000.00', amount: '7%' },
            { netLoss: '≥100,000.00', amount: '8%' },
            { netLoss: '≥300,000.00', amount: '9%' },
            { netLoss: '≥1,000,000.00', amount: '10%' },
            { netLoss: '≥5,000,000.00', amount: '19%' },
            { netLoss: '≥10,000,000.00', amount: '39%' }
        ]
    };

    // Open modal when component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
            setModalOpen(true);
        }, 500); // Small delay for smooth animation
        
        return () => clearTimeout(timer);
    }, []);

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <>
            <div className='w-full bg-[#f5f5f9] min-h-screen'>
                <div className="bg-black w-full">
                    <BackHeader text="Rescue Fund" />
                </div>
                <div className='w-full h-[158px]'
                    style={{ backgroundImage: `url(${bgImg})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <div className="pt-7 pl-6 flex items-center w-full">
                        <img
                            src="./assets/img/user.png"
                            alt="profile"
                            className="w-14 h-14 rounded-full border-2 border-white"
                        />
                        <div className="ml-3">
                            <h3 className="font-medium text-white">{username}</h3>
                            <p className="text-base font-bold text-white">৳ {localStorage.getItem('wallet_balance')} </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Overlay */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
                    <div 
                        className={`bg-white w-full shadow-lg transform transition-transform duration-300 ease-out h-[50vh] ${
                            modalOpen ? 'translate-y-0' : 'translate-y-full'
                        }`}
                        style={{ maxHeight: '80vh', overflowY: 'auto' }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Rescue fund</h3>
                            <button 
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                <IoCloseCircleOutline />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-4">
                            <div className="rescue-content">
                                <table className="w-full border-collapse" style={{ lineHeight: '1.5' }}>
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-medium text-gray-700">Product</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-700">Net loss</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-700">Amount available</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(rescueData).map(([product, data]) => 
                                            data.map((item, index) => (
                                                <tr key={`${product}-${index}`} className="border-b border-gray-100">
                                                    {index === 0 && (
                                                        <td 
                                                            className="py-2 px-3 text-gray-800 font-medium align-top border-r"
                                                            rowSpan={data.length}
                                                        >
                                                            {product}
                                                        </td>
                                                    )}
                                                    <td className="py-2 px-3 text-gray-700">{item.netLoss}</td>
                                                    <td className="py-2 px-3 text-gray-700">{item.amount}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}