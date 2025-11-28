import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import Button from './ui/Button';
import { UserPlus, AlertCircle, Check } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-[80vh] py-12">
            <Card className="w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-gray-400">Join Swarm Feedback today</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 flex items-center gap-2">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                            minLength={3}
                            maxLength={20}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">I want to...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'submitter' })}
                                className={`p-4 rounded-xl border transition-all text-left relative ${formData.role === 'submitter'
                                    ? 'bg-blue-500/20 border-blue-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <div className="font-semibold mb-1">Submit Projects</div>
                                <div className="text-xs opacity-70">Get feedback on your work</div>
                                {formData.role === 'submitter' && (
                                    <div className="absolute top-2 right-2 text-blue-400">
                                        <Check size={16} />
                                    </div>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'reviewer' })}
                                className={`p-4 rounded-xl border transition-all text-left relative ${formData.role === 'reviewer'
                                    ? 'bg-purple-500/20 border-purple-500 text-white'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <div className="font-semibold mb-1">Give Feedback</div>
                                <div className="text-xs opacity-70">Review others&apos; projects</div>
                                {formData.role === 'reviewer' && (
                                    <div className="absolute top-2 right-2 text-purple-400">
                                        <Check size={16} />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full flex justify-center items-center gap-2" disabled={loading}>
                        {loading ? 'Creating Account...' : <><UserPlus size={18} /> Create Account</>}
                    </Button>
                </form>

                <div className="mt-6 text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">
                        Sign in
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Register;
