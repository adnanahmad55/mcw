import React from "react";
import { useTranslation } from 'react-i18next'; // Import the translation hook
import { FaUser, FaEnvelope, FaIdCard, FaPhone } from "react-icons/fa";
import BackHeader from "../component/BackHeader";
import { useSelector } from "react-redux";

export default function MyAccount() {
    const { isLogin, username, totalCoins } = useSelector((state) => state.auth);
    const { t } = useTranslation(); // Initialize translation function
    return (
        <>
            <div className="bg-black">
                <BackHeader text={t('myAccount.myAccount')} />
            </div>
            <div className="min-h-screen bg-gray-50 flex justify-center p-4">
                <div className="bg-white p-6 w-full max-w-sm rounded-xl shadow">
                    {/* Username */}
                    <p className="text-sm mb-4">
                        <span className="font-medium">{t('myAccount.username')}:</span>{" "}
                        <span className="text-gray-700">{username}</span>
                    </p>

                    {/* Input Fields */}
                    <form className="space-y-3">
                        {/* Nickname */}
                        <div className="flex items-center px-3 py-2 bg-gray-100 rounded">
                            <FaUser className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder={t('myAccount.enterNickname')}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex items-center px-3 py-2 bg-gray-100 rounded">
                            <FaEnvelope className="text-gray-400 mr-2" />
                            <input
                                type="email"
                                placeholder={t('myAccount.enterEmail')}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Masked Value */}
                        <div className="flex items-center px-3 py-2 bg-gray-300 rounded">
                            <FaIdCard className="text-gray-500 mr-2" />
                            <input
                                type="password"
                                value={t('myAccount.maskedValue')}
                                readOnly
                                className="w-full bg-transparent outline-none text-sm text-gray-700"
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="flex items-center px-3 py-2 bg-gray-100 rounded">
                            <FaPhone className="text-gray-400 mr-2" />
                            <input
                                type="tel"
                                placeholder={t('myAccount.enterPhone')}
                                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                            />
                        </div>

                        {/* Privacy Note */}
                        <div className="text-xs text-center mt-2">
                            <a href="#" className="text-blue-500 font-medium">{t('myAccount.privacyNote')}</a>
                            <p className="text-gray-500 mt-1">
                                {t('myAccount.privacyPolicy')}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded font-medium shadow hover:opacity-90 transition"
                        >
                            {t('myAccount.submit')}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
