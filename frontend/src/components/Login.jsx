import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import FuturisticButton from './ui/FuturisticButton';
import Background3D from './ui/Background3D';
import { LogIn, AlertCircle, Lock, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            toast.success('Welcome back to the Swarm!');
            navigate('/');
        } catch (err) {
            const msg = 'Failed to login. Please check your credentials.';
            setError(msg);
            toast.error(msg);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
            <Background3D />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: `linear-gradient(135deg, #FF6B9D, #C06FFF)`,
                            boxShadow: '0 0 10px rgba(255, 107, 157, 0.5)',
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md px-4 z-10"
            >
                <Card className="w-full p-8 glass-strong shadow-2xl hover-glow">
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg">
                            <Sparkles size={32} className="text-white" />
                        </div>
                    </motion.div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h2>
                            <p className="text-gray-400">Sign in to continue your journey</p>
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-3 rounded-2xl mb-6 flex items-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 107, 157, 0.1), rgba(255, 107, 157, 0.05))',
                                border: '1px solid rgba(255, 107, 157, 0.3)',
                            }}
                        >
                            <AlertCircle size={18} className="text-pink-400" />
                            <span className="text-pink-200 text-sm">{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            {/* Username field */}
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-400 transition-colors z-10" size={20} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-gray-500 relative"
                                    placeholder="Username"
                                    required
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-blue-500/0 group-focus-within:from-pink-500/10 group-focus-within:via-purple-500/10 group-focus-within:to-blue-500/10 transition-all pointer-events-none" />
                            </div>

                            {/* Password field */}
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors z-10" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-gray-500 relative"
                                    placeholder="Password"
                                    required
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-cyan-500/0 group-focus-within:from-purple-500/10 group-focus-within:via-blue-500/10 group-focus-within:to-cyan-500/10 transition-all pointer-events-none" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-end"
                        >
                            <Link to="/forgot-password" className="text-sm gradient-text-alt hover:opacity-80 transition-opacity">
                                Forgot Password?
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 rounded-2xl font-medium text-white btn-gradient hover-lift hover-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <LogIn size={18} />
                                        Sign In
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-8 text-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-gray-400">New to Swarm?</span>
                            </div>
                        </div>
                        <Link
                            to="/register"
                            className="mt-4 inline-block gradient-text-alt font-medium hover:opacity-80 transition-opacity"
                        >
                            Create an Account →
                        </Link>
                    </motion.div>
                </Card>

                {/* Decorative elements */}
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-pink-500 to-transparent rounded-full blur-3xl pointer-events-none"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-tl from-blue-500 to-transparent rounded-full blur-3xl pointer-events-none"
                />
            </motion.div>
        </div>
    );
};

export default Login;
