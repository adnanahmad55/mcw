import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../redux/slice/gameSlice";
import { useTranslation } from "react-i18next";

export default function Category() {
    const dispatch = useDispatch();
    const { selectedCategory } = useSelector((state) => state.game);
    const { t } = useTranslation();

    const categories = [
        { name: "Hot Games", icon: "/categories/icon-hotgame.svg" },
        { name: "Sports", icon: "/categories/icon-sport.svg" },
        { name: "Slots", icon: "/categories/icon-slot.svg" },
        { name: "Live", icon: "/categories/icon-casino.svg" },
        { name: "Table", icon: "/categories/icon-table.svg" },
        { name: "Crash", icon: "/categories/icon-crash.svg" },
        { name: "Fish", icon: "/categories/icon-fish.svg" },
        { name: "Arcade", icon: "/categories/icon-arcade.svg" },
        { name: "Lottery", icon: "/categories/icon-lottery.svg" },
    ];

    return (
        <div className="w-full bg-secondaryColor px-0">
            <div className="flex justify-around items-center gap-1 text-white text-sm overflow-auto px-2 py-1" style={{scrollbarWidth: 'none'}}>
                {categories.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => dispatch(setCategory(item.name))}
                      className={`flex flex-col items-center gap-1 font-semibold cursor-pointer transition-all duration-200 rounded-lg px-2 py-2
                        ${selectedCategory === item.name ? 'bg-[#394471] text-white' : 'text-[#c9a33d]'}
                      `}
                      style={{ minWidth: '86px' }}
                    >
                      <div
                        className="w-7 h-7 transition-all duration-200"
                        style={{
                          backgroundImage: `url(${item.icon})`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          filter: selectedCategory === item.name 
                            ? 'brightness(0) invert(1)' // White
                            : 'invert(64%) sepia(53%) saturate(466%) hue-rotate(8deg) brightness(92%) contrast(87%)' // #c9a33d gold color
                        }}
                      />

                      <span className="text-[14px] whitespace-nowrap">
                        {t(`category.${item.name}`)}
                      </span>
                    </div>
                ))}
            </div>
        </div>
    );
}