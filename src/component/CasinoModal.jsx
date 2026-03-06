import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useRefreshTokenMutation } from "../redux/service/api";
import { setCredentials } from "../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const CasinoModal = ({ isOpen, onClose, casinoUrl, provider }) => {
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const iframeRef = useRef(null);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [showIframe, setShowIframe] = useState(false);
    const hasLoadedRef = useRef(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const [refreshToken] = useRefreshTokenMutation();

    const handleIframeClose = async () => {
        const authData = JSON.parse(localStorage.getItem("auth"));

        const { token, username, userId } = authData;

        const playerId = userId;
        const oprId = import.meta.env.VITE_APP_OPERATOR_ID;
        const authToken = JSON.parse(localStorage.getItem('authToken'));

        // authToken intentionally missing hai
        if (playerId && oprId) {
            // refreshToken({ playerId, oprId, token: "" });
            if (playerId && oprId) {
                // refreshToken({ playerId, oprId, token: "" });
                const res = await refreshToken({ playerId, oprId, authToken }).unwrap();
                if (res?.message === "token updated successfully") {
                    localStorage.setItem("authToken", JSON.stringify(res.token));

                    console.log(res.token, "✅ Token saved to localStorage");
                    return
                } else if (res?.message === 'invalid current auth token') {
                    console.log('invalid current auth token');
                    localStorage.clear()
                    // dispatch(isLoggedIn(false));
                    navigate(`/`);
                }
            }
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // REMOVED: setIframeLoading(true);
            hasLoadedRef.current = false; // Reset on open

            window.history.pushState({ modal: true }, "");

            const handleResize = () => {
                setViewportHeight(window.innerHeight);
            };

            handleResize();

            window.addEventListener("resize", handleResize);
            window.addEventListener("orientationchange", handleResize);

            const handlePopState = (event) => {
                if (event.state?.modal) {
                    onClose();
                    handleIframeClose();
                }
            };

            window.addEventListener("popstate", handlePopState);

            return () => {
                window.removeEventListener("popstate", handlePopState);
                window.removeEventListener("resize", handleResize);
                window.removeEventListener("orientationchange", handleResize);
                document.body.style.overflow = "unset";
            };
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => setShowIframe(true));
        } else {
            setShowIframe(false);
            setIframeLoading(true); // Reset when closing
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && iframeRef.current && casinoUrl) {
            iframeRef.current.src = casinoUrl;
        }
    }, [isOpen, casinoUrl]);

    const handleIframeLoad = () => {
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true;
            setIframeLoading(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-[10000]"
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#00000080",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100vw",
                height: `${viewportHeight}px`,
            }}
        >
            <div
                className={`w-[98vw] bg-gray-900 overflow-hidden relative iframe-wrapper ${showIframe ? "slide-up" : ""}`}
                style={{
                    margin: "auto",
                    height: `${viewportHeight - 12}px`,
                    borderRadius: "8px",
                }}
            >
                <div className="bg-gray-800 h-6 flex items-center justify-between px-4 relative z-10" style={{ zIndex: '999' }}>
                    <div className="flex items-center space-x-2"></div>
                    <button
                        onClick={() => { handleIframeClose(); onClose(); }}
                        className="text-white hover:bg-gray-700 p-2 rounded transition-colors"
                        type="button"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="h-[calc(100%-24px)]">
                    {iframeLoading && provider && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <img src={provider} alt="Loading..." width={80} />
                        </div>
                    )}
                    <iframe
                        ref={iframeRef}
                        className="w-full h-full border-0"
                        title="Casino Game"
                        allow="fullscreen; camera; microphone; geolocation"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-pointer-lock"
                        onLoad={handleIframeLoad}
                    />
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default CasinoModal;