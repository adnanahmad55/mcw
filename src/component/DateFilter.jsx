import React, { useState, useEffect } from 'react';

const DateFilter = ({ 
  onDateSelect, 
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
  // useEffect(() => {
  //   // Only send default values if no initial data was provided
  //   if (!hasInitialData) {
  //     const defaultFilters = {
  //       fromPeriod: getDefaultDate(),
  //       toPeriod: getDefaultDate(),
  //       filterByDay: 'today',
  //     };
  //     onDateSelect(defaultFilters);
  //   }
  // }, []); // Empty dependency array means this runs once on mount

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

  // Custom Calendar Component
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

    // Get selected dates
    const selectedFromDate = filters.fromPeriod ? new Date(filters.fromPeriod) : null;
    const selectedToDate = filters.toPeriod ? new Date(filters.toPeriod) : null;

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
          }}>
            <div 
              onClick={() => setDateSelectionMode('from')}
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
              onClick={() => setDateSelectionMode('to')}
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
              onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
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
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
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
              const isFromDate = selectedFromDate && dayObj.date.toDateString() === selectedFromDate.toDateString();
              const isToDate = selectedToDate && dayObj.date.toDateString() === selectedToDate.toDateString();
              const isInRange = selectedFromDate && selectedToDate && 
                               dayObj.date >= selectedFromDate && dayObj.date <= selectedToDate;
              
              // Format date for comparison
              const dateStr = dayObj.date.toISOString().split('T')[0];
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setFilters(prev => {
                      if (dateSelectionMode === 'from') {
                        // If setting from date, also update to date if it's before from date
                        const newToDate = (!prev.toPeriod || dateStr > prev.toPeriod) ? dateStr : prev.toPeriod;
                        return {
                          ...prev,
                          fromPeriod: dateStr,
                          toPeriod: newToDate,
                          filterByDay: ''
                        };
                      } else {
                        // If setting to date, also update from date if it's after to date
                        const newFromDate = (!prev.fromPeriod || dateStr < prev.fromPeriod) ? dateStr : prev.fromPeriod;
                        return {
                          ...prev,
                          fromPeriod: newFromDate,
                          toPeriod: dateStr,
                          filterByDay: ''
                        };
                      }
                    });
                  }}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    backgroundColor: isFromDate || isToDate ? '#2196F3' : 
                                   isInRange ? '#e3f2fd' : 
                                   isToday ? '#fff3e0' : 'transparent',
                    color: !dayObj.isCurrentMonth ? '#ccc' : 
                           isFromDate || isToDate ? '#fff' : 
                           isInRange ? '#2196F3' : 
                           isToday ? '#ff9800' : '#333',
                    fontWeight: isFromDate || isToDate || isToday ? '600' : 'normal',
                    minHeight: '44px',
                    transition: 'all 0.2s ease',
                    border: isToday ? '1px solid #ff9800' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isFromDate && !isToDate && dayObj.isCurrentMonth) {
                      e.target.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isFromDate && !isToDate) {
                      e.target.style.backgroundColor = isFromDate || isToDate ? '#2196F3' : 
                                                     isInRange ? '#e3f2fd' : 
                                                     isToday ? '#fff3e0' : 'transparent';
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
              onClick={() => {
                const newFilters = {
                  fromPeriod: '',
                  toPeriod: '',
                  filterByDay: '',
                };
                setFilters(newFilters);
                onDateSelect(newFilters);
                onClose();
              }}
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
              onClick={() => {
                onDateSelect(filters);
                onClose();
              }}
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

  const handleQuickFilter = (filterType) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    let newFilters = { ...filters };

    switch (filterType) {
      case 'today':
        newFilters = {
          fromPeriod: formatDate(today),
          toPeriod: formatDate(today),
          filterByDay: 'today'
        };
        break;
      case 'yesterday':
        newFilters = {
          fromPeriod: formatDate(yesterday),
          toPeriod: formatDate(yesterday),
          filterByDay: 'yesterday'
        };
        break;
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        newFilters = {
          fromPeriod: formatDate(weekAgo),
          toPeriod: formatDate(today),
          filterByDay: 'week'
        };
        break;
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        newFilters = {
          fromPeriod: formatDate(monthAgo),
          toPeriod: formatDate(today),
          filterByDay: 'month'
        };
        break;
      default:
        break;
    }

    setFilters(newFilters);
    onDateSelect(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      fromPeriod: '',
      toPeriod: '',
      filterByDay: '',
    };
    setFilters(newFilters);
    onDateSelect(newFilters);
  };

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      borderRadius: '12px', 
      // marginBottom: '20px'
    }}>
      {/* Quick Filter Buttons - Only show if showDayButtons is true */}
      {showDayButtons && (
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          // marginBottom: '16px',
          alignItems: 'center',
          justifyContent:'flex-start'
        }}>
          
          {[
            { key: 'today', label: 'Today' },
            { key: 'yesterday', label: 'Yesterday' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleQuickFilter(key)}
              style={{
                padding: '8px 10px',
                backgroundColor: filters.filterByDay === key ? '#2196F3' : '#f8f9fa',
                color: filters.filterByDay === key ? '#fff' : '#2196F3',
                border: '1px solid',
                borderColor: '#2196F3',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: filters.filterByDay === key ? '600' : '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (filters.filterByDay !== key) {
                  e.target.style.borderColor = '#2196F3';
                  e.target.style.color = '#2196F3';
                }
              }}
              onMouseLeave={(e) => {
                if (filters.filterByDay !== key) {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.color = '#6c757d';
                }
              }}
            >
              {label}
            </button>
          ))}

          <button
            onClick={() => {
              setDateSelectionMode('from');
              setShowDatePicker(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #2196F3',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#2196F3',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              minWidth: '120px'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#2196F3';
              e.target.style.backgroundColor = '#f0f8ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e9ecef';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
          >
            {/* <img src="/calendar.svg" alt="" /> */}
          <span>
          {filters.fromPeriod && filters.toPeriod
              ? `${new Date(filters.fromPeriod).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })} - ${new Date(filters.toPeriod).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}`
              : "Select date range"}
          </span>
          </button>

          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            flexWrap: 'wrap'
          }}>
            {/* {(filters.fromPeriod || filters.toPeriod || filters.filterByDay) && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#fff',
                  border: '1px solid #dc3545',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#dc3545',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#dc3545';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff';
                  e.target.style.color = '#dc3545';
                }}
              >
                Clear All
              </button>
            )} */}
          </div>
        </div>
      )}

      {/* Calendar Button - Always show, but full width when day buttons are hidden */}
      {!showDayButtons && (
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          // marginBottom: '16px'
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
              transition: 'all 0.2s ease',
              textWrap:'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#2196F3';
              e.target.style.backgroundColor = '#f0f8ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#e9ecef';
              e.target.style.backgroundColor = '#f8f9fa';
            }}
          >
            <img src="/calendar.svg" alt="" height={16} width={16}/>
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
    </div>
  );
};

export default DateFilter;