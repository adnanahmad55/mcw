import React, { Children } from 'react'
import titleBg from "../assets/img/title-bg.png";
import { Link, useNavigate } from 'react-router-dom';
import { setCategory } from '../redux/slice/gameSlice';
import { useDispatch } from 'react-redux';

export default function GameBox({ title, children, showAllBtn, categoryName, length }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className=" rounded-xl overflow-hidden py-2">
            {/* Header */}
            {/* <div
                className="flex title-bg justify-between items-center text-white mb-4 pl-[20px] h-[43.9467px] md:h-[68px] rounded pr-[20px] md:pr-[58px]"
            >
                <h3 className="flex items-center gap-2 font-bold text-[18px] md:text-[28px]">
                    {title}
                    <div style={{
                        width: '2px',
                        height: '40px',
                        margin: "0 15px",
                        background: "linear-gradient(180deg, #38a6fb, #096fd1)",
                        transform: "rotate(45deg)"
                    }}></div>
                    
                    <div className="text-center text-white text-xs font-semibold"><strong className="text-base font-semibold">{length}</strong> <span className="block opacity-70">Total</span></div>

                </h3>
            </div> */}
            {children}
            {/* {console.log(children)} */}
            <div className='md:hidden flex justify-center my-4'>
                {showAllBtn && <button
                    onClick={() => {
                        if (categoryName) {
                            navigate('/game-list');
                            dispatch(setCategory(categoryName));
                        }
                    }}
                    style={{
                        background: 'radial-gradient(50% 60.61% at 50% 50%, #174593 0, #0f3157 100%)'
                    }}
                    className='flex items-center justify-center  h-[27.4667px] text-[13px] font-extrabold text-white whitespace-nowrap rounded-3xl mx-auto my-0 px-[10.9867px] py-0'>
                    See All
                </button>}
            </div>
        </div>
    )
}
