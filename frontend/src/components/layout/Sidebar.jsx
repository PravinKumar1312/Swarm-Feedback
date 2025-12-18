import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, PlusCircle, History, User, LogOut, FileText, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isCollapsed, toggleCollapsed }) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { logout, currentUser } = useAuth();
    const isReviewer = currentUser?.roles?.includes('ROLE_REVIEWER');
    const isSubmitter = currentUser?.roles?.includes('ROLE_SUBMITTER');
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');
    const location = useLocation();

    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    const menuItems = [
        {
            path: isAdmin ? '/dashboard?tab=home' : '/dashboard',
            label: 'Home',
            icon: <Home size={20} />,
            isActive: (path) => location.pathname === '/dashboard' && (!location.search || location.search.includes('tab=home') || (!isAdmin && !location.search))
        },

        ...(isAdmin ? [
            { path: '/dashboard?tab=projects', label: 'Projects', icon: <FileText size={20} />, isActive: () => location.search.includes('tab=projects') },
            { path: '/dashboard?tab=feedback', label: 'Feedback', icon: <MessageSquare size={20} />, isActive: () => location.search.includes('tab=feedback') },
            { path: '/dashboard?tab=users', label: 'Users', icon: <User size={20} />, isActive: () => location.search.includes('tab=users') },
        ] : []),

        ...((isSubmitter) ? [
            { path: '/submit', label: 'Submit', icon: <PlusCircle size={20} /> },
            { path: '/history', label: 'History', icon: <History size={20} /> }
        ] : []),

        ...(isReviewer && !isSubmitter && !isAdmin ? [
            { path: '/history', label: 'My Reviews', icon: <History size={20} /> }
        ] : []),

        ...(!isAdmin ? [
            { path: '/contact-help', label: 'Help', icon: <MessageSquare size={20} /> },
            { path: '/profile', label: 'Profile', icon: <User size={20} /> }
        ] : []),
    ];

    const isLinkActive = (item) => {
        if (item.isActive) return item.isActive(item.path);
        return location.pathname === item.path;
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleMobileMenu}
                className="fixed top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors md:hidden"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <AnimatePresence>
                {(isMobileOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col transition-all duration-300 ${!isMobileOpen ? 'hidden md:flex' : 'flex'
                            } ${isCollapsed ? 'md:w-20' : 'md:w-64'} w-64`}
                    >
                        <div className={`p-6 border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                            {!isCollapsed && (
                                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 whitespace-nowrap overflow-hidden">
                                    Swarm
                                </h2>
                            )}
                            {isCollapsed && (
                                <span className="text-xl font-bold text-blue-400">S</span>
                            )}

                            {/* Desktop Collapse Toggle */}
                            <button
                                onClick={toggleCollapsed}
                                className="hidden md:flex p-1 hover:bg-white/10 rounded text-gray-400 transition-colors"
                            >
                                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                            </button>
                        </div>

                        <nav className="flex-1 p-4 space-y-2 overflow-x-hidden">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.label}
                                    to={item.path}
                                    onClick={() => setIsMobileOpen(false)}
                                    title={isCollapsed ? item.label : ''}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${isLinkActive(item)
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        } ${isCollapsed ? 'justify-center' : ''}`}
                                >
                                    {item.icon}
                                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={logout}
                                title={isCollapsed ? "Logout" : ""}
                                className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors whitespace-nowrap ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <LogOut size={20} />
                                {!isCollapsed && <span className="font-medium">Logout</span>}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
