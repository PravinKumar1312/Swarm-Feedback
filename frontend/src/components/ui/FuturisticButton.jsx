import React from 'react';
import { motion } from 'framer-motion';

const FuturisticButton = ({ children, onClick, className, variant = 'primary', ...props }) => {
    const baseStyles = "relative px-6 py-3 font-bold transition-all duration-200 rounded-lg overflow-hidden group flex items-center justify-center gap-2";

    const variants = {
        primary: "text-white border-2 border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
        secondary: "text-white border-2 border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
        danger: "text-white border-2 border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]",
        outline: "text-gray-300 border border-gray-600 hover:border-gray-400 hover:text-white"
    };

    const bgColors = {
        primary: "bg-purple-500",
        secondary: "bg-blue-500",
        danger: "bg-red-500",
        outline: "bg-gray-700"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            <div className={`absolute inset-0 w-full h-full ${bgColors[variant]}/10 group-hover:${bgColors[variant]}/20 transition-all duration-300`}></div>
            {variant !== 'outline' && (
                <div className={`absolute bottom-0 left-0 w-full h-0 group-hover:h-full ${bgColors[variant]}/20 transition-all duration-300`}></div>
            )}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
        </motion.button>
    );
};

export default FuturisticButton;
