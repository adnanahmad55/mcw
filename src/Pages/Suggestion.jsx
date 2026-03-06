import React, { useState } from "react";
import BackHeader from "../component/BackHeader";
import { useTranslation } from "react-i18next";



export default function Suggestion() {
    const [issueType, setIssueType] = useState("");
    const [content, setContent] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

    const maxChars = 500;
    const { t } = useTranslation();

    return (
        <>
            <div className="bg-[#333]">
                <BackHeader text={t('suggestion.suggestion')} />
            </div>

            <div className="min-h-screen bg-gray-50 flex justify-center p-4">
                <div className="bg-white w-full max-w-sm p-4 rounded-xl shadow">

                    {/* Issue Type */}
                    <div className="mb-3">
                        <select
                            value={issueType}
                            onChange={(e) => setIssueType(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-600 appearance-none bg-no-repeat bg-right bg-[url('data:image/svg+xml;utf8,<svg fill=%22%233b82f6%22 height=%2224%22 viewBox=%220 0 24 24%22 width=%2224%22 xmlns=%22http://www.w3.org/2000/svg%22><path d=%22M7 10l5 5 5-5z%22/></svg>')]"
                        >
                            <option value="">* {t('suggestion.selectIssueType')}</option>
                            <option value="bug">{t('suggestion.bug')}</option>
                            <option value="feedback">{t('suggestion.feedback')}</option>
                            <option value="other">{t('suggestion.other')}</option>
                        </select>
                    </div>

                    {/* Content Textarea */}
                    <div className="mb-3">
                        <textarea
                            rows="5"
                            maxLength={maxChars}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={t('suggestion.enterContent')}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 resize-none"
                        ></textarea>
                        <div className="text-right text-xs text-gray-400">
                            ({content.length} / {maxChars})
                        </div>
                    </div>

                    {/* Upload Placeholder */}
                    <div className="mb-3">
                        <div className="w-full h-24 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-sm">
                            <div className="flex flex-col items-center space-y-1">
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                                <span>{t('suggestion.upload')}</span>
                            </div>
                        </div>
                    </div>

                    {/* Verification Code */}
                    <div className="mb-4 flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder={t('suggestion.verificationCode')}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <div className="px-3 py-2 bg-white border border-gray-300 rounded">
                            {/* CAPTCHA image can be replaced with a real one */}
                            <img
                                src="https://dummyimage.com/80x30/ffffff/000000&text=48769"
                                alt="captcha"
                                className="h-6"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        disabled
                        className="w-full bg-gray-300 text-white py-2 rounded text-sm cursor-not-allowed"
                    >
                        {t('suggestion.submit')}
                    </button>
                </div>
            </div>
        </>
    );
}
