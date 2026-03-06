import React, { useEffect, useRef, useState } from "react";
import closeIcon from '../assets/img/close.png'
import { useSignupUserMutation } from "../redux/service/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slice/authSlice";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import axios from "axios";
import { generateUniqueId } from "../hooks/generateUniqueId";

const Register = ({ registerModal, onClose, referralCode  }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [error, setError] = useState("");
    const canvasRef = useRef(null);
    const [signupUser, { isLoading }] = useSignupUserMutation();
    const dispatch = useDispatch();
    const [deviceID, setDeviceID] = useState("");
    const [ipAddress, setIpAddress] = useState("");

    useEffect(() => {
        const loadFingerprint = async () => {

            const fp = await FingerprintJS.load();

            const result = await fp.get();
            setDeviceID(result.visitorId);
            console.log(result.visitorId, 'result.visitorId');

        };

        loadFingerprint();
    }, []);

    useEffect(() => {
        const fetchIp = async () => {
            try {
                const res = await axios.get("https://api.ipify.org?format=json");
                setIpAddress(res.data.ip);
            } catch (err) {
                console.error("IP fetch failed", err);
                setIpAddress("127.0.0.1");
            }
        };
        fetchIp();
    }, []);

    const getPlatform = () => {
        const ua = navigator.userAgent.toLowerCase();
        if (/mobi|android|iphone|ipad|tablet/.test(ua)) {
            return "mobile";
        }
        return "web";
    };

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        website: window.location.hostname,
        currency: "BDT",
        ip_address: ipAddress,
        referred_by: referralCode || "",
        device_id: deviceID,
        platform_id: getPlatform(),
        uniqueId: Date.now().toString(),
        // uniqueId: Math.random() * 10000,
        confirmPassword: '',
        createdBy: import.meta.env.VITE_APP_AGENT_ID
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (deviceID) {
            setFormData((prev) => ({ ...prev, device_id: deviceID }));
        }
    }, [deviceID]);

    useEffect(() => {
        if (ipAddress) {
            setFormData((prev) => ({ ...prev, ip_address: ipAddress }));
        }
    }, [ipAddress]);

    // const generateCaptcha = () => {
    //     let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //     let captchaText = "";
    //     for (let i = 0; i < 5; i++) {
    //         captchaText += chars[Math.floor(Math.random() * chars.length)];
    //     }
    //     setCaptcha(captchaText);
    // };


    // const drawCaptcha = (text) => {
    //     const canvas = canvasRef.current;
    //     const ctx = canvas.getContext("2d");

    //     const width = canvas.width;
    //     const height = canvas.height;

    //     // background clear
    //     ctx.clearRect(0, 0, width, height);

    //     // background color
    //     ctx.fillStyle = "#f9f9f9";
    //     ctx.fillRect(0, 0, width, height);

    //     // font size -> 
    //     ctx.font = `${Math.floor(height * 0.6)}px Arial`;
    //     ctx.textBaseline = "middle";


    //     const charWidth = width / (text.length + 1);

    //     for (let i = 0; i < text.length; i++) {
    //         let x = (i + 1) * charWidth;
    //         let y = height / 2 + (Math.random() * height * 0.2 - height * 0.1);
    //         let angle = (Math.random() - 0.5) * 0.5;

    //         ctx.save();
    //         ctx.translate(x, y);
    //         ctx.rotate(angle);
    //         ctx.fillStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
    //         ctx.fillText(text[i], 0, 0);
    //         ctx.restore();
    //     }

    //     // random lines
    //     for (let i = 0; i < 3; i++) {
    //         ctx.strokeStyle = "#" + Math.floor(Math.random() * 16777215).toString(16);
    //         ctx.beginPath();
    //         ctx.moveTo(Math.random() * width, Math.random() * height);
    //         ctx.lineTo(Math.random() * width, Math.random() * height);
    //         ctx.stroke();
    //     }
    // };



    // useEffect(() => {
    //     generateCaptcha();
    // }, []);

    useEffect(() => {
        if (captcha) drawCaptcha(captcha);
    }, [captcha]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");


        // if (captchaInput !== captcha) {
        //     setError("Captcha does not match!");
        //     generateCaptcha();
        //     setCaptchaInput("");
        //     return;
        // }

        if (formData.password !== formData.confirmPassword) {
            setError("Password and Confirm Password do not match!");
            return;
        }
        

        try {
            const res = await signupUser(formData).unwrap();
            dispatch(
                setCredentials({
                    token: res?.data?.token,
                    refresh_token: res?.data?.refresh_token,
                    username: res?.data?.username,
                    userId: res?.data?._id,
                    totalCoins: res?.data?.totalCoins,
                    referral_code: res?.data?.referral_code,
                })
            );
            localStorage.setItem('wallet_balance', (res?.data?.totalCoins ?? 0).toFixed(2));

            // if (res?.data?.userType === 'user') {
            // try {
            //     const signupTrackRes = await axios.post(
            //         `${import.meta.env.VITE_APP_API_BASE_URL}promotion/create-signup-bonus`,
            //         {
            //             user_id: res?.data?._id,
            //             // operator_code: res?.opr_code,
            //             username: res?.data?.username,
            //         },
                    
            //     );

            //     console.log("Signup tracking API response:", signupTrackRes?.data);
            // } catch (trackErr) {
            //     console.error("Tracking API failed:", trackErr);
            // }
            // }



            console.log("Signup Success:", res);
            onClose();
        } catch (err) {
            console.error("Signup Failed:", err);
            setError(err?.data?.message || "Signup failed");
        }
    };

    if (!registerModal) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#0a1a2f] overflow-hidden text-white p-6 rounded-lg shadow-lg md:w-[480px] relative">
                {/* Close button */}
                <button
                    className="absolute -top-1 -right-1 text-gray-400 hover:text-white"
                    onClick={onClose}
                >
                    <img src={closeIcon} className="w-11" />
                </button>

                <h2 className="text-2xl font-semibold text-left mb-6 uppercase">
                    Register
                </h2>



                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-transparent mb-4 border-b border-[#ffffff33] text-white placeholder-gray-400 focus:outline-none text-sm"
                    />

                    {/* <div className="grid grid-cols-2 gap-2">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-transparent mb-4 border-b border-[#ffffff33] text-white text-sm"
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-transparent mb-4 border-b border-[#ffffff33] text-white text-sm"
                        />
                    </div> */}

                    {/* <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-transparent mb-4 border-b border-[#ffffff33] text-white text-sm"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-transparent mb-4 border-b border-[#ffffff33] text-white text-sm"
                    /> */}

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-transparent mb-4 border-b border-[#ffffff33] text-white text-sm"
                    />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 bg-transparent mb-4 border-b border-[#ffffff33] text-white text-sm"
                    />

                    {/* Captcha */}
                    {/* <div className="relative mb-4 flex items-center">
                        <input
                            type="text"
                            placeholder="Enter Captcha"
                            value={captchaInput}
                            onChange={(e) => setCaptchaInput(e.target.value)}
                            className="w-full px-3 py-2 bg-transparent border-b border-[#ffffff33] text-white text-sm"
                        />
                        <canvas
                            ref={canvasRef}
                            width={100}
                            height={40}
                            className="ml-2 bg-gray-700"
                        ></canvas>
                    </div> */}

                    <input
                        type="text"
                        // name="username"
                        placeholder="Referral Code"
                        value={formData.referred_by}
                        onChange={handleChange}
                        // required
                        className="w-full px-3 py-2 bg-transparent mb-4 border-b border-[#ffffff33] text-white placeholder-gray-400 focus:outline-none text-sm"
                    />

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full text-white font-semibold hover:opacity-90 transition"
                        style={{
                            background: "linear-gradient(180deg,#38a6fb,#096fd1)",
                        }}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <a href="#" className="text-blue-400 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
