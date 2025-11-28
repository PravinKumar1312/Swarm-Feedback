import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import FuturisticButton from './ui/FuturisticButton';
import Background3D from './ui/Background3D';
import { UserPlus, AlertCircle, Check, User, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'submitter' // Default role
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData.username, formData.email, formData.password, [formData.role]);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden py-12">
            <Background3D />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-4 z-10"
            >
                <Card className="w-full p-8 backdrop-blur-xl bg-black/40 border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">Join the Swarm</h2>
                            <p className="text-gray-400">Initialize your presence</p>
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 flex items-center gap-2 border border-red-500/30"
                        >
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="Username"
                                    required
                                    minLength={3}
                                    maxLength={20}
                                />
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-gray-600"
                                    placeholder="Password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Select Designation</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'submitter' })}
                                    className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${formData.role === 'submitter'
                                        ? 'bg-blue-500/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="font-semibold mb-1 relative z-10">Submitter</div>
                                    <div className="text-xs opacity-70 relative z-10">Submit projects for review</div>
                                    {formData.role === 'submitter' && (
                                        <div className="absolute top-2 right-2 text-blue-400">
                                            <Check size={16} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'reviewer' })}
                                    className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${formData.role === 'reviewer'
                                        ? 'bg-purple-500/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="font-semibold mb-1 relative z-10">Reviewer</div>
                                    <div className="text-xs opacity-70 relative z-10">Provide feedback</div>
                                    {formData.role === 'reviewer' && (
                                        <div className="absolute top-2 right-2 text-purple-400">
                                            <Check size={16} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            </div>
                        </div>

                        <FuturisticButton
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            variant="primary"
                        >
                            {loading ? 'Registering...' : <><UserPlus size={18} /> Create Account</>}
                        </FuturisticButton>
                    </form>

                    <div className="mt-8 text-center text-gray-400">
                        <p className="text-sm">
                            Already initialized?{' '}
                            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline decoration-blue-400/30 underline-offset-4 transition-all">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Register;
