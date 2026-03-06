import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Login from "./Login";

const LoginRoute = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [referralCode, setReferralCode] = useState("");
    const [agentId, setAgentId] = useState("");
    const [initialTab, setInitialTab] = useState("login");

    useEffect(() => {
        // Check for referral code or agent ID
        const code = searchParams.get('r');
        const agent = searchParams.get('agent');
        
        if (code) {
            setReferralCode(code);
            setInitialTab("register");
        } else if (agent) {
            setReferralCode(agent);
            setInitialTab("register");
        }
        
        if (code || agent) {
            // Clean up URL
            setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                if (code) newParams.delete('r');
                if (agent) newParams.delete('agent');
                return newParams;
            });
        }
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        // Set tab based on route
        if (location.pathname.includes("register")) {
            setInitialTab("register");
        } else {
            setInitialTab("login");
        }
    }, [location.pathname]);

    const handleClose = () => {
        navigate("/");
    };

    return (
        <Login 
            isOpen={true}
            onClose={handleClose}
            initialTab={initialTab}
            referralCode={referralCode}
            agentId={agentId}
            isRoute={true}
        />
    );
};

export default LoginRoute;