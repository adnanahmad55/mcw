import React from "react";
import { useNavigate } from "react-router-dom";

export default function MobileFooter() {
    const navigate = useNavigate();
    return (
        <footer className="fixed bottom-0 z-50 left-0 w-full"
            style={{ backgroundImage: 'linear-gradient(-180deg,#243a48 20%,#172732 91%)' }}>
            <ul className="flex items-center justify-between py-1 pr-4">
                <li className="relative"
                >
                    <img src="assets/img/top.svg" className="absolute top-[-19px] left-0 right-0" />
                    <div className="mt-[-4.2666666667vw] w-[20vw] h-[17.8vw] relative">
                        <img src="assets/img/games.svg" className="w-full h-full" />
                    </div>
                </li>
                <li className="text-center text-[3.2vw] text-white px-1 w-[20vw]"
                    onClick={() => navigate('/mob-sport')}>
                    <img src="assets/img/home.svg" className="mx-auto block w-[5.8666666667vw]" />
                    Home
                </li>
                <li className="text-center text-[3.2vw] text-white px-1 w-[20vw]"
                onClick={() => navigate('/mob-inplay')}>
                    <img src="assets/img/inplay.svg" className="mx-auto block w-[5.8666666667vw]" />
                    In-Play
                </li>
                <li className="text-center text-[3.2vw] text-white px-1 w-[20vw]"
                onClick={() => navigate('/mob-sport')}>
                    <img src="assets/img/parlay.svg" className="mx-auto block w-[5.8666666667vw]" />
                    Parlay
                </li>
                <li className="text-center text-[3.2vw] text-white px-1 w-[20vw]"
                onClick={() => navigate('/mobile-sports')}
                >
                    <img src="assets/img/sports1.svg" className="mx-auto block w-[5.8666666667vw]" />
                    Sports
                </li>
            </ul>
        </footer>
    )
}