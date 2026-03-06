import React from "react";
import { Link } from "react-router-dom";

export default function MobSetting() {
    return (
        <>
            <div className="w-full min-h-[100vh] bg-white">
                <div className="w-full flex items-center justify-between "
                    style={{ background: 'linear-gradient(180deg,#474747,#070707)' }}>
                    <div className="text-[#ffb200] text-[4vw] font-bold flex gap-1 items-center pl-[1.8666666667vw]">
                        <img src="assets/img/setting-y.svg" /> Setting
                    </div>
                    <Link className="border-l border-[#be7809] py-[3.4666666667vw] px-[3.4666666667vw]"
                    to="/">
                        <img src="assets/img/close1.svg" />
                    </Link>
                </div>
                <div
                    className="px-[1.8666666667vw] md:hidden w-full font-bold border-t-0 border-[#ccc] text-white text-left text-[3.7333333333vw] p-1 flex justify-start gap-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(-180deg, rgb(46, 75, 94), rgb(36, 58, 72) 82%)"
                    }}
                >
                    Stake
                </div>
                <div className="px-[1.8666666667vw] w-full flex items-center gap-1 text-[#243a48] font-bold py-3 border-b border-[#e0e6e6]">
                    Default stake
                    <input type="text" className="w-[35.6666666667vw] border border-[#aaa] rounded-[1.6vw] text-[4vw] py-[1.366667vw] px-[.866667vw]"
                        style={{ boxShadow: 'inset 0 .5333333333vw #0000001a' }} />
                </div>
                <div className="w-full px-[1.8666666667vw]">
                    <div className="w-full mb-1 flex items-center gap-1 text-[#243a48] font-bold">
                        Default stake

                    </div>
                    <div className="w-full grid grid-cols-4 gap-1">
                        {[1000, 5000, 10000, 20000, 25000, 50000, 100000, 200000].map((val) => (
                            <button
                                key={val}
                                className={`${val === 100000 || val === 200000 ? 'border-[#aaa] bg-[#eee] text-[#1e1e1e]' : 'border-[#222] bg-[#444] text-[#ffb200]'}  py-1 text-center rounded-[1.6vw] text-[4vw] font-bold w-full border `}
                                style={{ boxShadow: 'inset 0 .5333333333vw #0000001a' }}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                    <div className="w-full font-bold justify-center text-[#243a48] mt-3 flex items-center gap-1 bg-[#c5d0d766] border border-[#7e97a7] rounded-[1.6vw]"
                        style={{ boxShadow: 'inset 0 .5333333333vw #fffc', lineHeight: ' 2.6' }}>
                        Edit Stakes <img src="assets/img/editicon.svg" />
                    </div>

                </div>

                <div
                    className="mt-3 px-[1.8666666667vw] md:hidden w-full font-bold border-t-0 border-[#ccc] text-white text-left text-[3.7333333333vw] p-1 flex justify-start gap-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(-180deg, rgb(46, 75, 94), rgb(36, 58, 72) 82%)"
                    }}
                >
                    Odds
                </div>
                <div className="px-[1.8666666667vw] w-full flex items-center justify-between gap-1 text-[#243a48] font-bold py-3 border-b border-[#e0e6e6]">
                    Highlight when odds change
                    <div className="bg-[#6bbd11] w-[9.3333333333vw] h-[9.3333333333vw] rounded-[1.6vw]  overflow-hidden relative">
                        <span className="absolute block w-[2.6666666667vw] top-[1.0666666667vw] right-[1.0666666667vw] rounded-[1.0666666667vw] h-[7.2vw] bg-white"
                            style={{ boxShadow: '0 .5333333333vw 1.0666666667vw #00000080,inset 0 -.8vw #cad5d5' }}></span>
                    </div>
                </div>

                <div className="flex gap-2 mt-2 px-2">
                    <button className="w-1/2 py-2 bg-white border border-[#aaa] rounded-md"
                        style={{ background: 'linear-gradient(-180deg,#fff,#eee 89%)' }}>
                        Cancel
                    </button>
                    <button
                        className={`w-1/2 py-2 bg-gray-400 text-[#ffb200] rounded-md cursor-not-allowed `}
                        style={{ background: 'linear-gradient(180deg,#474747,#070707)' }}
                    >
                        Save
                    </button>
                </div>

            </div>
        </>
    )
}