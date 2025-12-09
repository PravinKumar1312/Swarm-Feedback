import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, PlusCircle, History, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout, currentUser } = useAuth();
    const isReviewer = currentUser?.roles?.includes('ROLE_REVIEWER');
    const isSubmitter = currentUser?.roles?.includes('ROLE_SUBMITTER');
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');
    const location = useLocation();

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        { path: '/dashboard', label: 'Home', icon: <Home size={20} /> },
        // Show Submit Project only if Submitter or Admin
        ...((isSubmitter || isAdmin) ? [{ path: '/submit', label: 'Submit Project', icon: <PlusCircle size={20} /> }] : []),

        // Show History for everyone, but label might change conceptuall, or we keep it as History
        { path: '/history', label: isReviewer && !isSubmitter && !isAdmin ? 'My Reviews' : 'History', icon: <History size={20} /> },

        { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    ];

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={toggleMenu}
                className="fixed top-4 left-4 z-50 p-2 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors md:hidden"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <AnimatePresence>
                {(isOpen || window.innerWidth >= 768) && (
                    <motion.div
                        initial={{ x: -300 }}
                        animate={{ x: 0 }}
                        exit={{ x: -300 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`fixed top-0 left-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col ${!isOpen ? 'hidden md:flex' : 'flex'
                            }`}
                    >
                        <div className="p-6 border-b border-white/10">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                Swarm
                            </h2>
                        </div>

                        <nav className="flex-1 p-4 space-y-2">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={logout}
                                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut size={20} />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
