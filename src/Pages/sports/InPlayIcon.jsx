import React from "react";

export default function InPlayIcon() {
    return (
        <>
            <span>
                <strong className="bg-[#1876b2] w-[16px] h-[14px] rounded-[.8vw]  flex items-center justify-center p-[2px]">
                    <img src="assets/img/play.svg" />
                </strong>
            </span>
            <span className="flex">
                <strong className="bg-[#60ba1e] w-[16px] h-[14px] rounded-[.8vw] mr-[0] flex items-center justify-center p-[2px]"
                    style={{ borderRadius: '.8vw 0 0 .8vw' }}>
                    <img src="assets/img/inplay.svg" />
                </strong>
                <strong className="bg-[#0a92a5] w-[16px] h-[14px] mr-[0] flex items-center justify-center p-[2px]"
                    style={{ borderRadius: '0 .8vw .8vw 0' }}>
                    <img src="assets/img/fancy.svg" />
                </strong>
            </span>
            <span className="flex">
                <strong className="bg-[#60ba1e] w-[16px] h-[14px] rounded-[.8vw] mr-[0] flex items-center justify-center p-[2px]"
                    style={{ borderRadius: '.8vw 0 0 .8vw' }}>
                    <img src="assets/img/inplay.svg" />
                </strong>
                <strong className="bg-[#0a92a5] w-[16px] h-[14px] mr-[0] flex items-center justify-center p-[2px]"
                    style={{ borderRadius: '0 .8vw .8vw 0' }}>
                    <img src="assets/img/booker.svg" />
                </strong>
            </span>
            <span>
                <strong className="bg-[#e4550f] w-[16px] h-[14px] rounded-[.8vw]  flex items-center justify-center p-[2px]">
                    <img src="assets/img/p.svg" />
                </strong>
            </span>
        </>
    )
}