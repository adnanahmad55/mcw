import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setCategory } from '../../redux/slice/gameSlice';
import { useTranslation } from 'react-i18next';

export default function DesktopSidebar() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCategory } = useSelector((state) => state.game);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Hot Games', icon: '/categories/icon-hotgame.svg', label: 'HOT' },
    { name: 'Sports', icon: '/categories/icon-sport.svg', label: 'Sports' },
    { name: 'Live', icon: '/categories/icon-casino.svg', label: 'Casino' },
    { name: 'Slots', icon: '/categories/icon-slot.svg', label: 'Slot' },
    { name: 'Crash', icon: '/categories/icon-crash.svg', label: 'Crash' },
    { name: 'Table', icon: '/categories/icon-table.svg', label: 'Table' },
    { name: 'Fish', icon: '/categories/icon-fish.svg', label: 'Fishing' },
    { name: 'Arcade', icon: '/categories/icon-arcade.svg', label: 'Arcade' },
    { name: 'Lottery', icon: '/categories/icon-lottery.svg', label: 'Lottery' },
  ];

  const navLinks = [
    { label: t('sidebar.promotion') || 'Promotions', icon: '/mcw/h5/assets/images/icon-set/theme-icon/icon-promotion.svg', path: '/promotions' },
    { label: 'Winner Board', icon: '/mcw/h5/assets/images/icon-set/theme-icon/icon-records.svg', path: '/winner-board' },
    { label: 'VIP', icon: '/mcw/h5/assets/images/icon-set/theme-icon/icon-vip.svg', path: '/vip' },
    { label: 'Download', icon: '/mcw/h5/assets/images/icon-set/theme-icon/icon-download.svg', path: '#' },
    { label: 'Affiliates', icon: '/mcw/h5/assets/images/icon-set/theme-icon/icon-affiliate.svg', path: '/invite-friends' },
    { label: 'Partnerships', icon: '/mcw/h5/assets/images/icon-set/theme-icon/icon-partnership.svg', path: '#' },
  ];

  const handleCategoryClick = (categoryName) => {
    dispatch(setCategory(categoryName));
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <aside className="dt-sidebar">
      {/* Search */}
      <div className="dt-sidebar__search">
        <div className="dt-sidebar__search-box">
          <svg className="dt-sidebar__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search Games"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Game Categories */}
      <div className="dt-sidebar__categories">
        {categories.map((cat, idx) => {
          const isActive = selectedCategory === cat.name && location.pathname === '/';
          return (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat.name)}
              className={`dt-sidebar__cat-item ${isActive ? 'dt-sidebar__cat-item--active' : ''}`}
            >
              <img src={cat.icon} alt={cat.label} className="dt-sidebar__cat-icon" />
              <span className="dt-sidebar__cat-label">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="dt-sidebar__divider" />

      {/* Navigation Links */}
      <div className="dt-sidebar__nav">
        {navLinks.map((link, idx) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={idx}
              to={link.path}
              className={`dt-sidebar__nav-item ${isActive ? 'dt-sidebar__nav-item--active' : ''}`}
            >
              <img src={link.icon} alt={link.label} className="dt-sidebar__nav-icon" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
