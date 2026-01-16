import React from 'react';

const Card = ({ children, className = '', hover = true }) => {
    return (
        <div 
            className={`
                glass rounded-3xl p-6 
                ${hover ? 'hover-lift hover:shadow-2xl hover:border-white/20' : ''}
                ${className}
            `}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)'
            }}
        >
            {children}
        </div>
    );
};

export default Card;
