import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function LeftMenuProvider({ setSelectedProviderCategory, setOpen, selectedProviderCategory, item, idx }) {
    const navigate = useNavigate();
    return (
        <div
            key={idx}
            className="w-[80%] mx-auto py-[2.6666666667vw]"
            onClick={() => {
                if (item.name === 'All Provider') {
                    navigate(`/game-list/${selectedProviderCategory}/All`);
                } else {
                    navigate(`/game-list/${selectedProviderCategory}/${item.name}`);
                }
                setOpen(false);
                setSelectedProviderCategory('');
            }
            }
        >
            <img src={item.icon} alt={item.label} className="w-[11.7333333333vw] h-[11.7333333333vw] my-[1.0666666667vw] mx-auto" />
            <p className="text-[3.2vw] font-medium text-center text-white">{item.name}</p>
        </div>
    )
}
