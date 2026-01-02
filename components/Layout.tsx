import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Truck, Package, MessageSquare, Bell, User, LogOut, Sun, Moon, Menu, X, History } from 'lucide-react';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { currentUser, logout, notifications, markNotificationRead, isDarkMode, toggleTheme } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setIsMenuOpen(false)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
          isActive 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        <Icon size={20} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                  <Truck size={24} />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">RuralLink</span>
              </Link>
            </div>

            {/* Desktop Nav */}
            {currentUser && (
              <nav className="hidden md:flex space-x-4">
                {currentUser.role === 'FactoryOwner' ? (
                  <>
                    <NavItem to="/factory-dashboard" icon={Package} label="Dashboard" />
                    <NavItem to="/market" icon={Truck} label="Marketplace" />
                    <NavItem to="/history" icon={History} label="History" />
                  </>
                ) : (
                  <>
                    <NavItem to="/trucker-dashboard" icon={Truck} label="My Truck" />
                    <NavItem to="/history" icon={History} label="History" />
                  </>
                )}
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {currentUser && (
                <>
                  <div className="relative">
                    <button 
                      onClick={() => setIsNotifOpen(!isNotifOpen)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative"
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    {/* Notification Dropdown */}
                    {isNotifOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                        <div className="px-4 py-2 border-b dark:border-slate-700 font-semibold text-gray-700 dark:text-gray-200">
                          Notifications
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {userNotifications.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500">No notifications</div>
                          ) : (
                            userNotifications.map(n => (
                              <div 
                                key={n.id} 
                                onClick={() => markNotificationRead(n.id)}
                                className={`px-4 py-3 border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer ${!n.read ? 'bg-blue-50 dark:bg-slate-700/50' : ''}`}
                              >
                                <p className={`text-sm ${n.type === 'SOS' ? 'text-red-600 font-bold' : 'text-gray-800 dark:text-gray-200'}`}>
                                  {n.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp).toLocaleTimeString()}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="hidden md:flex items-center space-x-1 text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={20} />
                  </button>
                  
                  {/* Mobile Menu Button */}
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-gray-500 rounded-md"
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && currentUser && (
          <div className="md:hidden bg-white dark:bg-slate-800 border-t dark:border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {currentUser.role === 'FactoryOwner' ? (
                <>
                  <NavItem to="/factory-dashboard" icon={Package} label="Dashboard" />
                  <NavItem to="/market" icon={Truck} label="Marketplace" />
                  <NavItem to="/history" icon={History} label="History" />
                </>
              ) : (
                <>
                  <NavItem to="/trucker-dashboard" icon={Truck} label="My Truck" />
                  <NavItem to="/history" icon={History} label="History" />
                </>
              )}
              <div className="border-t border-gray-200 dark:border-slate-700 pt-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};