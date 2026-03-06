import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom';

export default function BackHeader({ text }) {
    const navigate = useNavigate();
    return (
        <div className='flex justify-between items-center h-12 bg-app-color'>
            <IoIosArrowBack className='text-white cursor-pointer text-[26px] w-16'
                onClick={() => navigate('/')} />
            <div className='w-full text-white text-[19px] text-center'>{text}</div>
        </div>
    )
}
