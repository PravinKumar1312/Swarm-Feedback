import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Card from './ui/Card';
import FuturisticButton from './ui/FuturisticButton';
import Background3D from './ui/Background3D';
import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
            toast.success('Reset link sent to your email!');
        } catch (error) {
            toast.error('Failed to send reset link. Check your email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
            <Background3D />
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-4 z-10"
            >
                <Card className="w-full p-8 backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">Recover Access</h2>
                        <p className="text-gray-400">Enter your email to reset password</p>
                    </div>

                    {sent ? (
                        <div className="text-center">
                            <div className="bg-green-500/20 text-green-200 p-4 rounded-lg mb-6 border border-green-500/30">
                                <p>Check your email for the reset link.</p>
                            </div>
                             <Link to="/login">
                                <FuturisticButton variant="primary" className="w-full">
                                    Return to Login
                                </FuturisticButton>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <FuturisticButton
                                type="submit"
                                className="w-full"
                                disabled={loading}
                                variant="primary"
                            >
                                {loading ? 'Sending...' : <><ArrowRight size={18} /> Send Reset Link</>}
                            </FuturisticButton>
                             <div className="mt-4 text-center">
                                <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
