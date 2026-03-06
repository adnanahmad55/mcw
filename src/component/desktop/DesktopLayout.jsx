import React, { useState } from 'react';
import DesktopHeader from './DesktopHeader';
import DesktopFooter from './DesktopFooter';
import LeftSidebarModal from '../Sidebar';

export default function DesktopLayout({ children, showFooter = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dt-layout">
      {/* Header + Games Nav */}
      <DesktopHeader onToggleSidebar={() => setSidebarOpen(true)} />

      {/* Sidebar overlay (same as mobile sidebar) */}
      {sidebarOpen && (
        <div className="dt-sidebar-wrapper">
          <LeftSidebarModal setLeftSidebar={setSidebarOpen} />
        </div>
      )}

      {/* Main content */}
      <div className="dt-layout__body">
        <main className="dt-layout__content">
          {children}
        </main>
      </div>

      {/* Footer */}
      {showFooter && <DesktopFooter />}
    </div>
  );
}
