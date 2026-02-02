

import { useState } from 'react';
import './Sidebar.css';

type SidebarProps = {
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

function Sidebar({ onNavigate, currentPage }: SidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) onNavigate(page);
    // Close dropdown if navigating to dashboard
    if (page === 'dashboard') setOpenDropdown(null);
    closeMobileSidebar();
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="mobile-toggle" onClick={toggleMobileSidebar}>
        <div className="mobile-toggle-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`mobile-overlay ${mobileOpen ? 'active' : ''}`}
        onClick={closeMobileSidebar}
      ></div>

      <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <ul className="sidebar-menu">
          {/* Dashboard */}
          <li className="menu-item">
            <a 
              href="#" 
              className={`menu-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('dashboard');
              }}
            >
              <div className="menu-link-content">
                <span className="menu-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </span>
                <span>Dashboard</span>
              </div>
            </a>
          </li>

          {/* Master with Dropdown */}
          <li className="menu-item">
            <div 
              className={`menu-link ${openDropdown === 'master' ? 'active' : ''}`}
              onClick={() => toggleDropdown('master')}
            >
              <div className="menu-link-content">
                <span className="menu-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                </span>
                <span>Master</span>
              </div>
              <span className={`dropdown-arrow ${openDropdown === 'master' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`submenu ${openDropdown === 'master' ? 'open' : ''}`}>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'rolemaster' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('rolemaster'); }}
                >
                  Role
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'usermaster' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('usermaster'); }}
                >
                  User
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'category' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('category'); }}
                >
                  Category
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'areamaster' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('areamaster'); }}
                >
                  Area
                </a>
              </li>
            </ul>
          </li>

          {/* Asset Allocation with Dropdown */}
          <li className="menu-item">
            <div 
              className={`menu-link ${openDropdown === 'assetallocation' ? 'active' : ''}`}
              onClick={() => toggleDropdown('assetallocation')}
            >
              <div className="menu-link-content">
                <span className="menu-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="6" r="3"></circle>
                    <path d="M12 9v3"></path>
                    <path d="M9 12H4"></path>
                    <path d="M15 12h5"></path>
                    <rect x="2" y="16" width="6" height="6" rx="1"></rect>
                    <rect x="9" y="16" width="6" height="6" rx="1"></rect>
                    <rect x="16" y="16" width="6" height="6" rx="1"></rect>
                    <path d="M5 16v-4"></path>
                    <path d="M12 16v-4"></path>
                    <path d="M19 16v-4"></path>
                  </svg>
                </span>
                <span>Asset Allocation</span>
              </div>
              <span className={`dropdown-arrow ${openDropdown === 'assetallocation' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`submenu ${openDropdown === 'assetallocation' ? 'open' : ''}`}>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'unitofmeasurement' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('unitofmeasurement'); }}
                >
                  Unit of Measurement
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'assettype' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('assettype'); }}
                >
                  Asset Type
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'asset' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('asset'); }}
                >
                  Asset 
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'assetallocation' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('assetallocation'); }}
                >
                  Asset Allocation
                </a>
              </li>
            </ul>
          </li>

          {/* Vendor with Dropdown */}
          <li className="menu-item">
            <div 
              className={`menu-link ${openDropdown === 'vendor' ? 'active' : ''}`}
              onClick={() => toggleDropdown('vendor')}
            >
              <div className="menu-link-content">
                <span className="menu-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87m-4-12a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </span>
                <span>Vendor</span>
              </div>
              <span className={`dropdown-arrow ${openDropdown === 'vendor' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`submenu ${openDropdown === 'vendor' ? 'open' : ''}`}>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'vendormaster' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('vendormaster'); }}
                >
                  Add Vendor
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'grn' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('grn'); }}
                >
                  Good Receipt Note (GRN)
                </a>
              </li>
            </ul>
          </li>

          {/* RFID with Dropdown */}
          <li className="menu-item">
            <div 
              className={`menu-link ${openDropdown === 'rfid' ? 'active' : ''}`}
              onClick={() => toggleDropdown('rfid')}
            >
              <div className="menu-link-content">
                <span className="menu-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
                    <path d="M12 11c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                    <path d="M8 9c0-2.2 1.8-4 4-4s4 1.8 4 4"></path>
                    <path d="M6 8c0-3.3 2.7-6 6-6s6 2.7 6 6"></path>
                  </svg>
                </span>
                <span>RFID</span>
              </div>
              <span className={`dropdown-arrow ${openDropdown === 'rfid' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`submenu ${openDropdown === 'rfid' ? 'open' : ''}`}>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'rfidbinding' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('rfidbinding'); }}
                >
                  Asset Registration
                </a>
              </li>
            </ul>
          </li>

          {/* Report with Dropdown */}
          <li className="menu-item">
            <div 
              className={`menu-link ${openDropdown === 'report' ? 'active' : ''}`}
              onClick={() => toggleDropdown('report')}
            >
              <div className="menu-link-content">
                <span className="menu-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </span>
                <span>Report</span>
              </div>
              <span className={`dropdown-arrow ${openDropdown === 'report' ? 'open' : ''}`}>
                ▼
              </span>
            </div>
            <ul className={`submenu ${openDropdown === 'report' ? 'open' : ''}`}>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'allocationreport' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('allocationreport'); }}
                >
                  Asset Allocation Report
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'rfidbindingreport' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('rfidbindingreport'); }}
                >
                  Asset Registration Report
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'reconciliation' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('reconciliation'); }}
                >
                  Asset Reconciliation Report
                </a>
              </li>
              <li className="submenu-item">
                <a 
                  href="#" 
                  className={`submenu-link ${currentPage === 'deploymentreport' ? 'active' : ''}`}
                  onClick={(e) => { e.preventDefault(); handleNavigate('deploymentreport'); }}
                >
                  Deployment Report
                </a>
              </li>
            </ul>
          </li>
        </ul> 
      </div>
    </>
  );
}

export default Sidebar;