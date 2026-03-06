import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { IoMdDownload, IoMdClose } from "react-icons/io";
import axios from "axios";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import { FaAndroid } from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";

export default function MarqueeSlide() {
    const { token } = useSelector((state) => state.auth);
    const [messages, setMessages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);

    // Get domain from window origin
    const getDomain = () => {
        if (typeof window !== 'undefined') {
            return window.location.hostname;
        }
        return 'localhost';
    };

    // Fetch messages from API
    const fetchMessages = async () => {
        try {
            const domain = getDomain();
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API_BASE_URL}v1/user/message/list?domain=${domain}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (response.data.success) {
                setMessages(response.data.results);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // if (token) {
            // fetchMessages();
        // }
    }, []);

    // Format date to month/date for marquee
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // Format full date and time for modal
    const formatFullDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get the latest message
    const getLatestMessage = () => {
        if (messages.length === 0) return null;
        
        const latest = messages.reduce((latest, current) => {
            return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
        });
        
        return latest;
    };

    const latestMessage = getLatestMessage();

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = import.meta.env.VITE_APP_DOWNLOAD_URL;
        link.setAttribute("download", import.meta.env.VITE_APP_DOWNLOAD_NAME); // Suggested filename
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    if (loading) {
        return (
            null
        );
    }

    // if (!latestMessage) {
    //     return (
    //         null
    //     )
    // }

    return (
        <>
            <div 
                className="py-2 relative bg-fillColor cursor-pointer"
                
            >
                
                <div className="absolute left-0 top-0 bottom-0 bg-fillColor text-white text-xl z-10 px-2 flex items-center rounded-md" onClick={() => setPopupOpen(true)}>
                    {/* <IoMdDownload className="text-[#309df4] text-xl" /> */}
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 48 48" version="1.1">
                        <title>icon-set/icon-speaker</title>
                        <g id="首頁" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                            <g id="icon-set/icon-speaker">
                            <rect id="Rectangle" x="0" y="0"/>
                            <path d="M26.6834171,32.8040201 L27.9698492,34.0904523 C29.5778894,35.6984925 29.5778894,38.2713568 27.9698492,39.879397 L27.9698492,39.879397 L26.040201,41.8090452 L27.6482412,43.4170854 C28.6130653,44.3819095 28.6130653,46.3115578 27.6482412,47.2763819 C26.6834171,48.241206 24.7537688,48.241206 23.7889447,47.2763819 L23.7889447,47.2763819 L17.3567839,41.1658291 L21.2160804,37.3065327 L24.4321608,40.201005 L26.361809,38.2713568 C27.0050251,37.6281407 27.0050251,36.9849246 26.361809,36.3417085 L26.361809,36.3417085 L24.4321608,34.4120603 C25.3969849,33.7688442 26.040201,33.1256281 26.6834171,32.8040201 L26.6834171,32.8040201 Z M10.6030151,24.120603 L20.8944724,34.4120603 L13.4974874,41.8090452 C11.8894472,43.4170854 8.99497487,43.4170854 7.38693467,41.8090452 L7.38693467,41.8090452 L3.20603015,37.6281407 C1.59798995,36.0201005 1.59798995,33.1256281 3.20603015,31.5175879 L3.20603015,31.5175879 L10.6030151,24.120603 Z M13.4974874,31.5175879 C13.1758794,30.8743719 12.2110553,30.8743719 11.5678392,31.5175879 L11.5678392,31.5175879 L9.63819095,33.4472362 C8.99497487,34.0904523 8.99497487,35.0552764 9.63819095,35.3768844 C10.281407,36.0201005 11.2462312,36.0201005 11.5678392,35.3768844 L11.5678392,35.3768844 L13.4974874,33.4472362 C14.1407035,32.8040201 14.1407035,31.839196 13.4974874,31.5175879 Z M18.9648241,8.68341709 L36.3316583,26.0502513 L35.6884422,26.0502513 C30.8643216,27.0150754 26.040201,29.5879397 22.5025126,32.8040201 L22.5025126,32.8040201 L12.2110553,22.5125628 C15.4271357,18.6532663 17.678392,14.1507538 18.9648241,9.00502513 L18.9648241,9.00502513 L18.9648241,8.68341709 Z M19.9296482,0.964824121 C20.8944724,-7.77156117e-16 22.8241206,-7.77156117e-16 23.7889447,0.964824121 L23.7889447,0.964824121 L42.4422111,19.2964824 C43.4070352,20.2613065 43.4070352,22.1909548 42.4422111,23.1557789 C41.4773869,24.120603 39.5477387,24.120603 38.5829146,23.1557789 L38.5829146,23.1557789 L19.9296482,4.8241206 C18.9648241,3.53768844 18.9648241,1.92964824 19.9296482,0.964824121 Z M43.7286432,10.2914573 C44.3718593,10.2914573 45.0150754,10.9346734 45.0150754,11.8994975 C45.0150754,12.8643216 44.3718593,13.8291457 43.7286432,13.8291457 L43.7286432,13.8291457 L41.1557789,13.8291457 C40.5125628,13.8291457 39.8693467,13.1859296 39.8693467,12.2211055 C39.8693467,11.2562814 40.5125628,10.6130653 41.1557789,10.6130653 L41.1557789,10.6130653 L43.7286432,10.6130653 L43.7286432,10.2914573 Z M39.2261307,3.85929648 C39.8693467,3.2160804 40.5125628,3.2160804 41.1557789,3.85929648 C41.798995,4.50251256 41.798995,5.14572864 41.1557789,5.78894472 L41.1557789,5.78894472 L38.5829146,8.36180905 C37.9396985,9.00502513 37.2964824,9.00502513 36.6532663,8.36180905 C36.0100503,7.71859296 36.0100503,7.07537688 36.6532663,6.4321608 L36.6532663,6.4321608 L39.2261307,3.85929648 Z M31.1859296,0 C32.1507538,0 32.7939698,0.64321608 32.7939698,1.28643216 L32.7939698,1.28643216 L32.7939698,3.85929648 C32.7939698,4.50251256 32.1507538,5.14572864 31.1859296,5.14572864 C30.2211055,5.14572864 29.5778894,4.50251256 29.5778894,3.85929648 L29.5778894,3.85929648 L29.5778894,1.28643216 C29.5778894,0.64321608 30.2211055,0 31.1859296,0 Z" id="形状结合" fill="#fff" fill-rule="nonzero"/>
                            </g>
                        </g>
                    </svg>

                </div>
                <Marquee pauseOnHover={true} gradient={false} speed={60}>
                    <div className="flex gap-[70px] items-center text-white text-sm" onClick={() => setIsModalOpen(true)}>
                        {/* {latestMessage ? (
                            <span>
                                {formatDate(latestMessage.createdAt)} - {latestMessage.message}
                            </span>
                        ) : (
                            <span>No announcements available</span>
                        )} */}
                        <span>MCW Advisory: Having problems accessing the MCW site? Visit </span>
                    </div>
                </Marquee>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-[#1a2332] z-50">
                    <div className="w-full h-full overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center p-4 border-b border-gray-600">
                            <img height={10} width={10} onClick={() => setIsModalOpen(false)} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAABMCAMAAADQpf7kAAAANlBMVEUAAAD////////////////////////////////////////////////////////////////////xY8b8AAAAEXRSTlMAIN/v0KCAEH9fMHC/kECwUEhp7qMAAAD4SURBVEjHvdbLrsIwDEVR59EG9wX5/5+96oBrDzA7CJUzXlLaHqeJfJtj3/b0ntz6GWXSSwJyZg/J2p/ZIqIdzdItU0CKM+klSdmRlcl8IWnVRPT5Kr/15MjGpLagR0seIOlCoiai2Xt4svA0PF6X5IleWTUTmZgoT4NkJorTIFKZJNcj7/2QyN0/Lz3OEptnmUXi/L/UgMkyuBY1ccRmssbDrH4vcBctRBt3ei6G36jBjNkOJXR36Bavxih9jFYZOESUUVyvwj/KEPU7O5SvRzscF3ymWL88BK0OIu73t5OSBieF+z3oIsB3JL5rWWZbC1FJQqio/AHxFjVdRIMU9gAAAABJRU5ErkJggg==" alt="" />
                            <h2 className="text-white flex-1 text-center" style={{fontSize:'24px'}}>Announcement</h2>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto h-[calc(100vh-80px)] bg-[#120F22]">
                            {messages.length > 0 ? (
                                messages.map((message) => (
                                    <div
                                        key={message._id}
                                        className="flex items-start gap-3 p-4 border-b border-gray-700 last:border-b-0"
                                    >
                                        
                                            <img height={24} width={24}  src="/bell.svg" alt="" />

                                        {/* Message Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Title and Time Row */}
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-white text-lg font-medium truncate pr-2">
                                                    🎉 {message.message}
                                                </h3>
                                                <span className="text-gray-400 text-xs flex-shrink-0">
                                                    {formatFullDateTime(message.createdAt)}
                                                </span>
                                            </div>
                                            
                                            {/* Full Message */}
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {message.message}
                                            </p>
                                            
                                            {/* Additional info */}
                                            <div className="mt-2 text-xs text-gray-500">
                                                {message.isImportant && (
                                                    <span className="text-red-400">• Important</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    No announcements available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {popupOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="relative">
                  {/* Background Image */}
                  <img src="/down-popup.png" alt="Download Popup" className="max-w-[90vw] max-h-[90vh]" />
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setPopupOpen(false)}
                    className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-80"
                  >
                    <X size={20} />
                  </button>

                  {/* Green Button */}
                  <div className="absolute top-[70%] inset-0 flex items-center justify-center">
                    <button
                      onClick={handleDownload}
                      className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700"
                    >
                      <FaAndroid size={20} />
                      <span className="font-semibold text-lg">অ্যান্ড্রয়েড অ্যাপ</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
        </>
    );
}