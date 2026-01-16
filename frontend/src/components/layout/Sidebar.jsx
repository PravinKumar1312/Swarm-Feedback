import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, PlusCircle, History, User, LogOut, FileText, MessageSquare, Hexagon, ChevronRight } from 'lucide-react';
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
            icon: <Home size={22} />,
            color: '#d946ef' // Neon Pink
        },
        ...(isAdmin ? [
            { path: '/dashboard?tab=projects', label: 'Projects', icon: <FileText size={22} />, color: '#8b5cf6' }, // Electric Purple
            { path: '/dashboard?tab=feedback', label: 'Feedback', icon: <MessageSquare size={22} />, color: '#0ea5e9' }, // Vivid Blue
            { path: '/dashboard?tab=users', label: 'Users', icon: <User size={22} />, color: '#06b6d4' }, // Neon Cyan
        ] : []),
        ...((isSubmitter) ? [
            { path: '/submit', label: 'Submit', icon: <PlusCircle size={22} />, color: '#f97316' }, // Orange
            { path: '/history', label: 'History', icon: <History size={22} />, color: '#a855f7' } // Purple
        ] : []),
        ...(isReviewer && !isSubmitter && !isAdmin ? [
            { path: '/history', label: 'My Reviews', icon: <History size={22} />, color: '#3b82f6' }
        ] : []),
        ...(!isAdmin ? [
            { path: '/contact-help', label: 'Help', icon: <MessageSquare size={22} />, color: '#ec4899' },
            { path: '/profile', label: 'Profile', icon: <User size={22} />, color: '#6366f1' }
        ] : []),
    ];

    const isLinkActive = (item) => {
         // Handle query params for accurate active state
         if (item.path.includes('?')) {
            return location.pathname + location.search === item.path;
         }
         return location.pathname === item.path && (!location.search || item.path === '/dashboard');
    };

    return (
        <>
            {/* Mobile Hamburger - Floating Orb */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleMobileMenu}
                className="fixed top-4 left-4 z-50 p-3 glass-strong rounded-full text-white shadow-lg md:hidden border border-white/10"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            {/* Neural Dock Container */}
            <AnimatePresence>
                {(isMobileOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className={`fixed left-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-6
                            ${!isMobileOpen ? 'hidden md:flex' : 'flex'}
                        `}
                    >
                        {/* The Dock Pill */}
                        <div className="glass-strong rounded-[2rem] p-3 flex flex-col items-center gap-4 shadow-2xl border border-white/10 backdrop-blur-3xl relative overflow-visible">
                            
                            {/* Logo Orb */}
                            <motion.div 
                                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-2 relative group cursor-pointer"
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Hexagon size={24} className="text-white fill-white/20" />
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                            </motion.div>

                            {/* Separator */}
                            <div className="w-8 h-[1px] bg-white/10 rounded-full" />

                            {/* Navigation Items */}
                            <nav className="flex flex-col gap-3">
                                {menuItems.map((item) => {
                                    const active = isLinkActive(item);
                                    return (
                                        <div key={item.label} className="relative group flex items-center">
                                            
                                            {/* Tooltip Label (Floats right) */}
                                            <div className="absolute left-full ml-4 px-3 py-1.5 glass rounded-xl text-sm font-medium text-white opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl">
                                                {item.label}
                                                {/* Arrow */}
                                                <div className="absolute right-full top-1/2 -translate-y-1/2 -mr-1 border-4 border-transparent border-r-white/10" />
                                            </div>

                                            <Link to={item.path} onClick={() => setIsMobileOpen(false)}>
                                                <motion.div
                                                    className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                                        active ? 'text-white' : 'text-gray-400 hover:text-white'
                                                    }`}
                                                    whileHover={{ scale: 1.15 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {/* Active Liquid Background */}
                                                    {active && (
                                                        <motion.div
                                                            layoutId="active-pill"
                                                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-inner"
                                                            initial={false}
                                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                        >
                                                            {/* Active Glow Dot */}
                                                            <div 
                                                                className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full blur-[1px]"
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                            <div 
                                                                className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full opacity-50 blur-md"
                                                                style={{ backgroundColor: item.color }}
                                                            />
                                                        </motion.div>
                                                    )}

                                                    {/* The Icon */}
                                                    <div className="relative z-10">
                                                        {item.icon}
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </nav>

                            {/* Separator */}
                            <div className="w-8 h-[1px] bg-white/10 rounded-full mt-auto" />

                            {/* User Profile & Logout */}
                            <div className="flex flex-col gap-3 mt-2">
                                {/* Profile Mini-Orb */}
                                <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-sm font-bold text-white border border-white/10 hover:border-white/30 transition-colors cursor-pointer group relative">
                                    {currentUser?.username?.charAt(0).toUpperCase()}
                                    <div className="absolute right-0 bottom-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]" />
                                    
                                    {/* User Tooltip */}
                                    <div className="absolute left-full ml-4 bottom-0 px-4 py-2 glass-strong rounded-2xl text-left opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none min-w-[140px] border border-white/10">
                                        <p className="text-white font-bold text-sm">{currentUser?.username}</p>
                                        <p className="text-xs text-gray-400">{currentUser?.email}</p>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <motion.button
                                    onClick={logout}
                                    whileHover={{ scale: 1.1, rotate: -15, color: '#ef4444' }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-white/5 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </motion.button>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop for mobile */}
            {isMobileOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
