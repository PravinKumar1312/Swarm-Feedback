import React, { useEffect, useState } from 'react';
import anime from 'animejs';
import { motion } from 'framer-motion';

const LoadingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animate logo particles - Smoother
        anime({
            targets: '.particle',
            translateX: () => anime.random(-80, 80), // Reduced range for cleaner look
            translateY: () => anime.random(-80, 80),
            scale: () => anime.random(0.5, 1.5),
            opacity: [0, 0.8, 0],
            duration: 1500, // Slower, smoother
            delay: anime.stagger(80),
            easing: 'easeInOutExpo', // Premium easing
            loop: true
        });

        // Animate logo text - Smoother stagger
        anime({
            targets: '.logo-text path',
            strokeDashoffset: [anime.setDashoffset, 0],
            easing: 'easeInOutExpo',
            duration: 1500,
            delay: (el, i) => 300 * i,
        });

        // Progress bar animation - graceful
        const progressAnimation = anime({
            targets: { value: 0 },
            value: 100,
            duration: 2000, // Smooth filling
            easing: 'easeInOutExpo',
            update: function(anim) {
                setProgress(Math.round(anim.animations[0].currentValue));
            },
            complete: () => {
                setTimeout(() => {
                    onComplete();
                }, 400); // Slight pause before exit
            }
        });

        return () => progressAnimation.pause();
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }} // Smooth exit
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            style={{
                background: 'radial-gradient(circle at center, #1e1b4b 0%, #020617 100%)',
            }}
        >
            {/* Animated background particles */}
            <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="particle absolute w-1.5 h-1.5 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `linear-gradient(135deg, #6366f1, #06b6d4)`,
                            boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center">
                {/* Animated logo - Swarm Network */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like bezier
                    className="mb-8"
                >
                    <svg
                        width="140"
                        height="140"
                        viewBox="0 0 120 120"
                        className="mx-auto logo-text"
                    >
                        <defs>
                            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="50%" stopColor="#6366f1" />
                                <stop offset="100%" stopColor="#d946ef" />
                            </linearGradient>
                        </defs>
                        {/* Outer Hexagon */}
                        <path
                            d="M60 10 L103.3 35 V85 L60 110 L16.7 85 V35 Z"
                            fill="none"
                            stroke="url(#logoGradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Inner Cube/Network */}
                        <path
                            d="M60 10 L60 60 M60 60 L103.3 85 M60 60 L16.7 85"
                            fill="none"
                            stroke="url(#logoGradient)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.8"
                        />
                         {/* Nodes */}
                        <circle cx="60" cy="10" r="3" fill="#06b6d4" />
                        <circle cx="103.3" cy="35" r="3" fill="#6366f1" />
                        <circle cx="103.3" cy="85" r="3" fill="#d946ef" />
                        <circle cx="60" cy="110" r="3" fill="#6366f1" />
                        <circle cx="16.7" cy="85" r="3" fill="#06b6d4" />
                        <circle cx="16.7" cy="35" r="3" fill="#d946ef" />
                        <circle cx="60" cy="60" r="4" fill="#fff" />
                    </svg>
                </motion.div>

                {/* Brand name with gradient */}
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-5xl font-bold mb-2"
                    style={{
                        background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #d946ef 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Swarm Feedback
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-gray-400 mb-12 text-sm tracking-wider"
                >
                    Collaborative Platform
                </motion.p>

                {/* Progress bar */}
                <div className="w-64 mx-auto">
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)',
                                boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)',
                            }}
                            initial={{ width: 0 }}
                        />
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-gray-500 text-xs mt-3 tracking-widest"
                    >
                        INITIALIZING {progress}%
                    </motion.p>
                </div>

                {/* Pulsing dots */}
                <div className="flex justify-center gap-2 mt-8">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-transparent blur-3xl" />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-tl from-blue-500 to-transparent blur-3xl" />
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
