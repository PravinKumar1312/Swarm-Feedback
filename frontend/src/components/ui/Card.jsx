import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 ${className}`}>
            {children}
        </div>
    );
};

export default Card;
