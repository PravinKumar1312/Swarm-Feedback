import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
        px-6 py-3 rounded-xl font-semibold text-white
        bg-gradient-to-r from-blue-600 to-purple-600
        hover:from-blue-500 hover:to-purple-500
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-lg shadow-blue-500/30
        transition-all duration-200
        ${className}
      `}
        >
            {children}
        </motion.button>
    );
};

export default Button;
