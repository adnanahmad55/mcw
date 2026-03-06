import React, { useState, useEffect } from 'react';

const AccountRecordDateFilter = ({ 
  onDateSelect = () => {}, 
  initialFromDate,
  initialToDate,
  initialFilterByDay,
  showDayButtons = true
}) => {
  // Set today as default if no initial values provided or if they're falsy
  const getDefaultDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dateSelectionMode, setDateSelectionMode] = useState('from'); // 'from' or 'to'
  
  // Only set default values if initial props are null, undefined, or empty strings
  const hasInitialData = initialFromDate && initialToDate;
  const [filters, setFilters] = useState({
    fromPeriod: hasInitialData ? initialFromDate : getDefaultDate(),
    toPeriod: hasInitialData ? initialToDate : getDefaultDate(),
    filterByDay: hasInitialData ? (initialFilterByDay || '') : 'today',
  });

  // Notify parent component of initial filter state only once on mount
  useEffect(() => {
    // Only send default values if no initial data was provided
    if (!hasInitialData) {
      const defaultFilters = {
        fromPeriod: getDefaultDate(),
        toPeriod: getDefaultDate(),
        filterByDay: 'today',
      };
      onDateSelect(defaultFilters);
    }
  }, []); // Empty dependency array means this runs once on mount

  // Format date for display when day buttons are hidden
  const formatDateTimeRange = (fromDate, toDate) => {
    if (!fromDate || !toDate) return "Select date range";
    
    const from = new Date(fromDate);
    const to = new Date(toDate);
    
    // Format as MM/DD HH:MM:SS - MM/DD HH:MM:SS
    const fromStr = `${(from.getMonth() + 1).toString().padStart(2, '0')}/${from.getDate().toString().padStart(2, '0')} 00:00:00`;
    const toStr = `${(to.getMonth() + 1).toString().padStart(2, '0')}/${to.getDate().toString().padStart(2, '0')} 23:59:59`;
    
    return `${fromStr} - ${toStr}`;
  };

  // Bottom Modal Component for "All" button
  const BottomModal = ({ onClose }) => {
    const transactionTypes = [
      'All',
      'Deposit',
      'Withdrawal',
      'Betting',
      'Winning',
      'Bonus',
      'Invite Rebate',
      'Other'
    ];

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: '#fff',
            // borderRadius: '12px 12px 0 0',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '70vh',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            position: 'relative',
            padding: '20px',
            borderBottom: '1px solid #f0f0f0',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333'
            }}>
              Please select the transaction type
            </div>
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#999',
                padding: '5px'
              }}
            >
              ✕
            </button>
          </div>

          {/* List */}
          <div style={{
            padding: '0',
            maxHeight: 'calc(70vh - 80px)',
            overflowY: 'auto'
          }}>
            {transactionTypes.map((type, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: index < transactionTypes.length - 1 ? '1px solid #f0f0f0' : 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
                onClick={() => {
                  console.log(`Selected: ${type}`);
                  onClose();
                }}
              >
                <img src="/dice.svg" height={24} width={24} alt="" />
                <span style={{
                  fontSize: '1.2rem',
                  color: '#333',
                  fontWeight: '500',
                  paddingLeft:'10px'
                }}>
                  {type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes slideUp {
            from {
              transform: translateY(100%);
            }
            to {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  };

  // Custom Calendar Component (functionality removed)
  const CustomCalendar = ({ onClose }) => {
    const monthNames = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const getDaysInMonth = (month, year) => {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      
      // Previous month days
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();
      
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        days.push({
          day: daysInPrevMonth - i,
          isCurrentMonth: false,
          date: new Date(prevYear, prevMonth, daysInPrevMonth - i)
        });
      }
      
      // Current month days
      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          day,
          isCurrentMonth: true,
          date: new Date(year, month, day)
        });
      }
      
      // Next month days
      const remainingDays = 42 - days.length;
      for (let day = 1; day <= remainingDays; day++) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        days.push({
          day,
          isCurrentMonth: false,
          date: new Date(nextYear, nextMonth, day)
        });
      }
      
      return days;
    };

    const days = getDaysInMonth(currentMonth, currentYear);
    const today = new Date();

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            minWidth: '350px',
            maxWidth: '400px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Separate From and To Date Displays */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div 
              style={{
                flex: 1,
                backgroundColor: dateSelectionMode === 'from' ? '#2196F3' : '#f0f8ff',
                color: dateSelectionMode === 'from' ? '#fff' : '#2196F3',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #2196F3',
                fontWeight: '500'
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.9 }}>FROM</div>
              <div style={{ fontSize: '14px' }}>
                {filters.fromPeriod || 'Select date'}
              </div>
            </div>
            
            <div 
              style={{
                flex: 1,
                backgroundColor: dateSelectionMode === 'to' ? '#2196F3' : '#f0f8ff',
                color: dateSelectionMode === 'to' ? '#fff' : '#2196F3',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #2196F3',
                fontWeight: '500'
              }}
            >
              <div style={{ fontSize: '12px', opacity: 0.9 }}>TO</div>
              <div style={{ fontSize: '14px' }}>
                {filters.toPeriod || 'Select date'}
              </div>
            </div>
          </div>

          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px',
            color: '#333',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                color: '#666',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ←
            </button>
            <span>{monthNames[currentMonth]} {currentYear}</span>
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                color: '#666',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              →
            </button>
          </div>

          {/* Day names */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '2px', 
            marginBottom: '10px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#999'
          }}>
            {dayNames.map(day => (
              <div key={day} style={{ textAlign: 'center', padding: '8px 4px' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '2px',
            marginBottom: '20px'
          }}>
            {days.map((dayObj, index) => {
              const isToday = dayObj.date.toDateString() === today.toDateString();
              
              return (
                <button
                  key={index}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    backgroundColor: isToday ? '#fff3e0' : 'transparent',
                    color: !dayObj.isCurrentMonth ? '#ccc' : 
                           isToday ? '#ff9800' : '#333',
                    fontWeight: isToday ? '600' : 'normal',
                    minHeight: '44px',
                    transition: 'all 0.2s ease',
                    border: isToday ? '1px solid #ff9800' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (dayObj.isCurrentMonth && !isToday) {
                      e.target.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isToday) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {dayObj.day}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e0e0e0';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
              }}
            >
              Clear
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#2196F3',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#1976D2';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#2196F3';
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#f0f0f0', 
    //   borderRadius: '12px', 
      padding:'10px 0',
      marginBottom:'10px'
    }}>
      {/* Quick Filter Buttons - Only show if showDayButtons is true */}
      {showDayButtons && (
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
        //   marginBottom: '16px',
          alignItems: 'center',
          justifyContent:'space-evenly'
        }}>
          
          {/* All Button with dropdown arrow */}
          <button
            onClick={() => setShowAllModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: '#e5e7eb',
              color: '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d1d5db';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
            }}
          >
            All
            <img 
              src="/down.svg" 
              alt="dropdown" 
              style={{
                width: '16px',
                height: '16px',
                marginLeft: '2px'
              }}
            />
          </button>

          {/* Today Button - Active state */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1976d2';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#2196F3';
            }}
          >
            <img 
              src="/check.svg" 
              alt="check" 
              style={{
                width: '16px',
                height: '16px',
                filter: 'invert(100%) sepia(0%) saturate(7500%) hue-rotate(325deg) brightness(103%) contrast(101%)', // White color filter
                marginRight: '4px'
              }}
            />
            Today
          </button>

          {/* Calendar Button */}
          <button
            onClick={() => {
              setDateSelectionMode('from');
              setShowDatePicker(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              // backgroundColor: '#e5e7eb',
              color: '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              minWidth: '140px'
            }}
          >
            <img 
              src="/calendar.svg" 
              alt="calendar" 
              style={{
                width: '16px',
                height: '16px',
                marginRight: '4px'
              }}
            />
            <span>09/16- 09/16</span>
          </button>
        </div>
      )}

      {/* Calendar Button - Always show, but full width when day buttons are hidden */}
      {!showDayButtons && (
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '16px'
        }}>
          <button
            onClick={() => {
              setDateSelectionMode('from');
              setShowDatePicker(true);
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 16px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #2196F3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#2196F3',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#2196F3';
              e.target.style.backgroundColor = '#f0f8ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#2196F3';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
          >
          <span>
          {formatDateTimeRange(filters.fromPeriod, filters.toPeriod)}
          </span>
          </button>
        </div>
      )}

      {/* Custom Calendar Modal */}
      {showDatePicker && (
        <CustomCalendar
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {/* Bottom Modal for All button */}
      {showAllModal && (
        <BottomModal
          onClose={() => setShowAllModal(false)}
        />
      )}
    </div>
  );
};

export default AccountRecordDateFilter;