import React, { useState, useEffect, useRef } from "react";
import { useLoginUserMutation, useSignupUserMutation } from "../redux/service/api";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slice/authSlice";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import logo from '/logo.webp'
import axios from "axios";
import CryptoJS from "crypto-js";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from "react-toastify";

const Login = ({
  isOpen,
  onClose,
  initialTab = "login",
  referralCode = "", // Add referralCode prop
  agentId = "", // New prop
  isRoute = false // Add flag to determine if it's used as a route
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [form, setForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    referred_by: referralCode,
    verificationCode: "",
    phone: ""
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
  const [signupUser, { isLoading: isSignupLoading }] = useSignupUserMutation();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [deviceID, setDeviceID] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [canvasCode, setCanvasCode] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate()

  useEffect(() => {
    generateCanvasCode();
  }, []);

  const generateCanvasCode = () => {
    const chars = '1234567890'; // Avoid confusing characters
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCanvasCode(result);
  };

  // Update referral code and agent ID when prop changes
  useEffect(() => {
    if (referralCode) {
      setRegisterForm(prev => ({
        ...prev,
        referred_by: referralCode
      }));
      setActiveTab("register");
    } else if (agentId) {
      // When agentId is present, set referred_by to empty
      setRegisterForm(prev => ({
        ...prev,
        referred_by: ""
      }));
      setActiveTab("register");
    }
  }, [referralCode, agentId]);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEncrypted = localStorage.getItem('rememberedCredentials');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedRememberMe && savedEncrypted) {
      try {
        const key = `${window.location.hostname}_${navigator.userAgent}`;
        const decrypted = CryptoJS.AES.decrypt(savedEncrypted, key).toString(CryptoJS.enc.Utf8);
        const [username, password] = decrypted.split('|');

        if (username && password) {
          setForm({
            username: username,
            password: password
          });
          setRememberMe(true);
        }
      } catch (e) {
        console.error('Failed to decrypt credentials', e);
      }
    }
  }, []);

  useEffect(() => {
    const loadDeviceId = () => {
      if (window.deviceId && typeof window.deviceId === 'string') {
        console.log('Using mobile device ID:', window.deviceId);
        setDeviceID(window.deviceId);
      } else {
        console.log('Using web identifier: web');
        setDeviceID("web");
      }
    };

    const fetchIp = async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(res.data.ip);
      } catch (err) {
        console.error("IP fetch failed", err);
        setIpAddress("127.0.0.1");
      }
    };

    loadDeviceId();
    fetchIp();
  }, []);

  const getPlatform = () => {
    const ua = navigator.userAgent.toLowerCase();
    if (/mobi|android|iphone|ipad|tablet/.test(ua)) {
      return "mobile";
    }
    return "web";
  };

  useEffect(() => {
    if (isOpen || isRoute) {
      setActiveTab(initialTab);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, initialTab, isRoute]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      if (value.length > 10) {
        return;
      }
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        return;
      }
    }

    setRegisterForm({ ...registerForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      ...form,
      device_id: deviceID,
      ip_address: ipAddress,
      operator_id: import.meta.env.VITE_APP_OPERATOR_ID,
      platform_id: getPlatform()
    };

    try {
      const res = await loginUser(loginData).unwrap();

      if (res.status) {
        const isNotWeb = res?.results?.device_id !== "web";
        localStorage.setItem('isNotWebDevice', JSON.stringify(isNotWeb));
        dispatch(
          setCredentials({
            token: res?.data?.authToken,
            refresh_token: res?.data?.token,
            username: res?.data?.display_name,
            userId: res?.data?.player_id,
            totalCoins: res?.data?.wallet_balance,
            referral_code: res?.data?.referral_code
          })
        );
        localStorage.setItem("authToken", JSON.stringify(res?.data?.authToken));
        if (rememberMe) {
          const key = `${window.location.hostname}_${navigator.userAgent}`;
          const encrypted = CryptoJS.AES.encrypt(`${form.username}|${form.password}`, key).toString();
          localStorage.setItem('rememberedCredentials', encrypted);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedCredentials');
          localStorage.removeItem('rememberMe');
        }

        console.log("Login Success:", res);
        localStorage.setItem('showTreasureAfterLogin', 'true');
        onClose();
      } else {
        toast.error(res?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login Failed:", err);
      toast.error(err?.data?.message || "Login failed");
    }
  };

  const handleRegisterSubmit = async (e) => {
    if (registerForm.verificationCode.toUpperCase() !== canvasCode) {
      toast.error('Invalid Captcha Code');
      return;
    }
    e.preventDefault();

    if (registerForm.username.length > 10) {
      toast.error(t('login.usernameTooLong'));
      return;
    }

    if (!/^[a-zA-Z0-9]*$/.test(registerForm.username)) {
      toast.error(t('login.usernameInvalidChars'));
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error(t('login.passwordNotMatch'));
      return;
    }

    if (!registerForm.phone || registerForm.phone.trim() === "") {
      toast.error('Phone number is required.');
      return;
    }

    // Determine the createdBy value
    const createdByValue = agentId || import.meta.env.VITE_APP_AGENT_ID;

    const registerData = {
      username: registerForm.username,
      password: registerForm.password,
      operator_id: import.meta.env.VITE_APP_OPERATOR_ID,
      country_code: "+880",
      // firstName: "",
      // lastName: "",
      email: "",
      login_type: "username",
      mobile_number: registerForm.phone,
      // timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      // website: window.location.hostname,
      currency: "BDT",
      new_user: "",
      // ip_address: ipAddress,
      referred_by: agentId ? "" : (registerForm.referred_by || ""), // Empty if agentId exists
      // device_id: deviceID,
      // platform_id: getPlatform(),
      // uniqueId: Date.now().toString(),
      // confirmPassword: registerForm.confirmPassword,
      // createdBy: createdByValue
      device_details: {
        device_id: ""
      },
    };

    try {
      const res = await signupUser(registerData).unwrap();

      if (res.status) {
        const isNotWeb = res?.results?.device_id !== "web";
        localStorage.setItem('isNotWebDevice', JSON.stringify(isNotWeb));
        dispatch(
          setCredentials({
            token: res.token,
            refresh_token: res.authToken,
            username: res.display_name,
            userId: res.player_id,
            totalCoins: res.wallet_balance,
            referral_code: '',
          })
        );
        localStorage.setItem("authToken", JSON.stringify(res.authToken));
        localStorage.setItem('wallet_balance', (res.wallet_balance ?? 0).toFixed(2));
        console.log("Signup Success:", res);
        localStorage.setItem('showTreasureAfterLogin', 'true');
        onClose();
      } else {
        toast.error(res?.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup Failed:", err);
      toast.error(err?.response?.data?.message || 'Something went wrong please try again');
    }
  };

  if (!isOpen && !isRoute) return null;

  // Animation variants for the entire modal
  const modalVariants = {
    initial: {
      opacity: 0,
      y: "50%",
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: "50%",
      scale: 0.98,
    },
  };

  // Common content JSX
  const content = (
    <>
      {/* Login Form */}
      {activeTab === "login" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="max-w-md rounded mx-auto"
        >
          <div className="space-y-3 px-4">
            <div className="py-4 px-3 bg-secondaryColor rounded">
              <div className="mb-4">
                <p className="font-medium">Username</p>
                <input
                  type="text"
                  name="username"
                  placeholder={t('login.username')}
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-2 py-3 bg-[var(--form-input-bg)] border rounded border-[#2a3441] text-white placeholder-gray-400 focus:outline-none focus:border-[var(--form-input-border-hover)] transition-colors text-base"
                />
              </div>

              <div className="relative">
                <p>Password</p>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login.password')}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 px-2 py-3 bg-[var(--form-input-bg)] border rounded border-[#2a3441] text-white placeholder-gray-400 focus:outline-none focus:border-[var(--form-input-border-hover)] transition-colors text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-11 transform -translate-y-1/2"
                >
                  <img
                    src={showPassword ? "/eye_open.svg" : "/eye_close.svg"}
                    alt="Toggle password visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>
              <div className="">
                <p className="text-[#c9a33d] border border-[#c9a33d] p-1 text-sm w-full flex justify-end ">
                  {t('login.forgotPassword')}
                </p>
              </div>
            </div>


            {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded text-white font-medium transition-all text-[22px] shadow-lg"
              style={{ background: 'var(--btn-main-bg)' }}
              disabled={isLoginLoading}
            >
              {isLoginLoading ? t('login.loggingIn') : t('login.logIn')}
            </button>
          </div>

          <p className="text-center text-sm mt-3">
            {t('login.noAccount')} {" "}
            <button
              onClick={() => setActiveTab("register")}
              className="text-[#c9a33d] hover:underline"
            >
              {t('header.register')}
            </button>
          </p>
        </motion.div>
      )}

      {/* Register Form */}
      {activeTab === "register" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="max-w-md rounded mx-auto"
        >

          <div
            className="menu-box  ng-star-inserted"
          >
            <div

              className="input-group currency-number third-party-input-group-title  ng-star-inserted"
            >
              <label className="">
                Choose currency
              </label>
              <div

                className="input-wrap currency-wrap "
              >
                <div

                  className="currency-area-code "
                >
                  <div

                    className="lang-select "
                  >
                    <div

                      className="button btn-select currency-list-area "
                    >
                      <li

                        className=""
                      >
                        <img

                          alt="BD"
                          className=""
                          src="/mcw/h5/assets/images/flag/BD.webp"
                          loading="lazy"
                        />
                        <span

                          className=""
                        >
                          BDT
                        </span>
                      </li>
                    </div>
                    <div

                      className="currency-code-list-group "
                    >
                      <ul

                        className="currency-code-list currency-list-area "
                      >
                        <li

                          className=" ng-star-inserted"
                          key={0}
                        >
                          <img

                            alt="BD"
                            className=""
                            src="/mcw/h5/assets/images/flag/BD.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            BDT
                          </span>
                        </li>
                        <li

                          className=" ng-star-inserted"
                          key={1}
                        >
                          <img

                            alt="VN"
                            className=""
                            src="/mcw/h5/assets/images/flag/VN.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            VND
                          </span>
                        </li>
                        <li

                          className=" ng-star-inserted"
                          key={2}
                        >
                          <img

                            alt="PH"
                            className=""
                            src="/mcw/h5/assets/images/flag/PH.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            PHP
                          </span>
                        </li>
                        <li

                          className=" ng-star-inserted"
                          key={3}
                        >
                          <img

                            alt="KR"
                            className=""
                            src="/mcw/h5/assets/images/flag/KR.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            KRW
                          </span>
                        </li>
                        <li

                          className=" ng-star-inserted"
                          key={4}
                        >
                          <img

                            alt="KH"
                            className=""
                            src="/mcw/h5/assets/images/flag/KH.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            USD
                          </span>
                        </li>
                        <li

                          className=" ng-star-inserted"
                          key={5}
                        >
                          <img

                            alt="NP"
                            className=""
                            src="/mcw/h5/assets/images/flag/NP.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            NPR
                          </span>
                        </li>
                        <li

                          className=" ng-star-inserted"
                          key={6}
                        >
                          <img

                            alt="MY"
                            className=""
                            src="/mcw/h5/assets/images/flag/MY.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            MYR
                          </span>
                        </li>
                        <li

                          className=" ng-star-inserted"
                          key={7}
                        >
                          <img

                            alt="PK"
                            className=""
                            src="/mcw/h5/assets/images/flag/PK.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            PKR
                          </span>
                        </li>
                        <li

                          className=" ng-star-inserted"
                          key={8}
                        >
                          <img

                            alt="IN"
                            className=""
                            src="/mcw/h5/assets/images/flag/IN.webp"
                            loading="lazy"
                          />
                          <span

                            className="currency-list-area "
                          >
                            INR
                          </span>
                        </li>
                        {/**/}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="space-y-6">
            <div className="menu-box bg-secondaryColor rounded">
              <div className="mb-4">
                <p className="font-medium">Username</p>
                <input
                  type="text"
                  name="username"
                  placeholder={t('login.username')}
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  required
                  className="w-full mt-1 px-2 py-3 bg-[var(--form-input-bg)] border rounded border-[#2a3441] text-white placeholder-gray-400 focus:outline-none focus:border-[var(--form-input-border-hover)] transition-colors text-base"
                />
              </div>

              <div className="relative mb-4">
                <p className="font-medium">Password</p>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login.password')}
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  required
                  className="w-full mt-1 px-2 py-3 bg-[var(--form-input-bg)] border rounded border-[#2a3441] text-white placeholder-gray-400 focus:outline-none focus:border-[var(--form-input-border-hover)] transition-colors text-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-11 transform -translate-y-1/2"
                >
                  <img
                    src={showPassword ? "/eye_open.svg" : "/eye_close.svg"}
                    alt="Toggle password visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>

              <div className="relative mb-4">
                <p className="font-medium">Confirm Password</p>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('login.confirmPassword')}
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  className="w-full mt-1 px-2 py-3 bg-[var(--form-input-bg)] border rounded border-[#2a3441] text-white placeholder-gray-400 focus:outline-none focus:border-[var(--form-input-border-hover)] transition-colors text-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-11 transform -translate-y-1/2"
                >
                  <img
                    src={showConfirmPassword ? "/eye_open.svg" : "/eye_close.svg"}
                    alt="Toggle confirm password visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>

              {/* Conditionally render referral input */}
              {!agentId && (
                <div className="mb-4">
                  <p className="font-medium">{`${t('login.referralCode')} ${t('login.optional')}`}</p>
                  <input
                    type="text"
                    name="referred_by"
                    placeholder={`${t('login.referralCode')} ${t('login.optional')}`}
                    value={registerForm.referred_by}
                    onChange={handleRegisterChange}
                    className="w-full mt-1 px-2 py-3 bg-[var(--form-input-bg)] border rounded border-[#2a3441] text-white placeholder-gray-400 focus:outline-none focus:border-[var(--form-input-border-hover)] transition-colors text-base"
                  />
                </div>
              )}

              <div className="password-message-block">
                <div

                  className="password-message disabled ng-star-inserted"
                >
                  <span

                    className="icon"
                    style={{
                      maskImage:
                        'url("/mcw/h5/assets/images/icon-set/icon-check-type07.svg")'
                    }}
                  />
                  <span className="message">
                    Between 6~20 characters.{" "}
                  </span>
                </div>
                <div

                  className="password-message disabled ng-star-inserted"
                >
                  <span

                    className="icon"
                    style={{
                      maskImage:
                        'url("/mcw/h5/assets/images/icon-set/icon-check-type07.svg")'
                    }}
                  />
                  <span className="message">
                    At least one alphabet.{" "}
                  </span>
                </div>
                <div

                  className="password-message disabled ng-star-inserted"
                >
                  <span

                    className="icon"
                    style={{
                      maskImage:
                        'url("/mcw/h5/assets/images/icon-set/icon-check-type07.svg")'
                    }}
                  />
                  <span className="message">
                    At least one number. (Special character, symbols are allowed){" "}
                  </span>
                </div>
              </div>

            </div>

            {/* {error && <p className="text-re d-500 text-sm">{error}</p>} */}

            <div className="menu-box">
              <div

                className="input-group phone-number ng-star-inserted"
              >
                <label> Phone Number </label>
                <div className="input-wrap phone-wrap">
                  <div className="phone-area-code">
                    <div className="lang-select">
                      <button

                        className="btn-select only"
                      >
                        <li>
                          <img

                            value="BD"
                            alt="BD"
                            src="/mcw/h5/assets/images/flag/BD.webp"
                            loading="lazy"
                          />
                          <span>+880</span>
                        </li>
                      </button>
                      {/**/}
                    </div>
                  </div>
                  <input
                    type="tel" // Use 'tel' for better mobile keyboard experience
                    inputMode="tel" // Hint for virtual keyboards
                    name="phone" // Correct name attribute
                    className="input ng-untouched ng-pristine ng-invalid" // You might want to add Tailwind classes similar to others
                    placeholder="Enter your phone number." // Placeholder
                    value={registerForm.phone} // Link to state
                    onChange={handleRegisterChange} // Link to handler
                  // Add any validation attributes like maxLength, pattern if needed
                  // e.g., maxLength={15} pattern="[0-9]{0,15}"
                  />
                  <input className="clear" />
                </div>
                {/**/}
              </div>
              <div

                className="input-group verification third-party-input-group-title ng-star-inserted"
              >
                <label>Verification Code</label>
                <input
                  value={registerForm.verificationCode}
                  onChange={handleRegisterChange}
                  type="text"
                  name="verificationCode"
                  className="input ng-untouched ng-pristine ng-invalid"
                  placeholder="Enter 4 Digit Code"
                />
                <div className="flex items-center h-[11.73vw] absolute top-[6.4vw] right-12 font-mono text-2xl  font-bold tracking-wider">
                  {canvasCode}
                </div>
                <div
                  onClick={generateCanvasCode}
                  className="refresh"
                  style={{
                    maskImage:
                      'url("/mcw/h5/assets/images/icon-set/icon-refresh-type01.svg")'
                  }}
                />
                {/**/}
              </div>
            </div>

            <div className="m-[3.2vw]">
              <button
                onClick={handleRegisterSubmit}
                className="w-full py-4 rounded text-white font-medium transition-all text-[22px] shadow-lg"
                style={{ background: 'var(--btn-main-bg)' }}
                disabled={isSignupLoading}
              >
                {/* {isSignupLoading ? t('login.registering') : t('login.register')} */}
                Submit
              </button>
            </div>
          </div>

          <p className="text-center mt-4 mb-2">
            {t('login.haveAccount')} {" "}
            <button
              onClick={() => setActiveTab("login")}
              className="text-[#c9a33d] hover:underline"
            >
              {t('login.logIn')}
            </button>
          </p>

          <div className="third-party-login">
            <p className="footer-tips ng-star-inserted">
              I certify that I am at least 18 years old and that I agree to the{" "}
              <a href="" target="_blank" style={{ color: "var(--login-link)", marginLeft: "2.1333333333vw" }}>
                Terms &amp; Conditions
              </a>
            </p>
          </div>

        </motion.div>
      )}


    </>
  );

  // Render differently based on isRoute prop
  if (isRoute) {
    return (
      <AnimatePresence>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={modalVariants}
          className="min-h-screen bg-currentColor text-white overflow-auto"
        >
          <div className='flex justify-between items-center h-[13.3vw] bg-[#C9A33D] relative'>
            <div className='w-full text-white text-[19px] text-center'>{activeTab === "login" ? "Login" : "Sign Up"}</div>
            <X
              className='absolute right-0 text-white cursor-pointer text-[26px] w-16'
              onClick={() => navigate('/')}
            />
          </div>
          <img src="/logo.webp" alt="" className="h-12 mx-auto my-8" />
          <div className="">
            {content}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.div
      className={`fixed inset-0 bg-currentColor text-white z-50 overflow-auto`}
      variants={modalVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className='flex justify-between items-center h-[13.3vw] bg-[#C9A33D] relative'>
        <div className='w-full text-white text-[19px] text-center'>{activeTab === "login" ? "Login" : "Sign Up"}</div>
        <X
          className='absolute right-0 text-white cursor-pointer text-[26px] w-16'
          onClick={onClose}
        />
      </div>
      <img src="/logo.webp" alt="" className="h-12 mx-auto my-8" />
      <div className="">
        {content}
      </div>
    </motion.div>
  );
};

export default Login;