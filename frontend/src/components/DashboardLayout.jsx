import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Clients', path: '/clients' },
    { name: 'Campaigns', path: '/campaigns' }, // <--- Added Campaigns here!
    { name: 'Leads', path: '/leads' },
    { name: 'Pipeline', path: '/pipeline' },
    { name: 'Analytics', path: '/analytics' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans flex flex-col">
      
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo & Navigation Links */}
            <div className="flex items-center gap-8">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold tracking-tight text-gray-900">
                  CRM<span className="text-blue-600">Engine</span>
                </span>
              </div>
              
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right side (Version & Logout) */}
            <div className="flex items-center gap-6">
              <span className="hidden sm:block text-xs font-medium text-gray-400">
                v1.0.0
              </span>
              <button className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
                Logout
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
}