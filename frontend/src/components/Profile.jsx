import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from './ui/Card';
import FuturisticButton from './ui/FuturisticButton';
import Background3D from './ui/Background3D';
import { User, Mail, Shield, Save, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import ImageUpload from './ImageUpload';

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { currentUser } = useAuth();

    if (currentUser?.roles && currentUser.roles.includes('ROLE_ADMIN')) {
        return <Navigate to="/dashboard" replace />;
    }

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [reviewerStats, setReviewerStats] = useState({ count: 0, avgRating: 0 });
    const [formData, setFormData] = useState({
        name: '',
        bio: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me');
            const userData = response.data;
            setUser(userData);

            // If user is Reviewer, fetch their feedback history to calculate stats
            if (userData.roles && userData.roles.includes('ROLE_REVIEWER')) {
                fetchReviewerStats();
            }

            setFormData({
                name: userData.name || '',
                bio: userData.bio || '',
                age: userData.age || '',
                regNumber: userData.regNumber || '',
                profilePic: userData.profilePic || '',
                skills: userData.skills ? userData.skills.join(', ') : ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response && (error.response.status === 401 || error.response.status === 404)) {
                toast.error('Session expired or user not found. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Optional: Redirect immediately or let the user click "Go to Login"
            } else {
                toast.error('Failed to load profile.');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewerStats = async () => {
        try {
            const response = await api.get('/feedback/my');
            const myFeedback = response.data || [];
            const count = myFeedback.length;
            const sum = myFeedback.reduce((acc, curr) => acc + (curr.rating || 0), 0);
            const avg = count > 0 ? (sum / count).toFixed(1) : 0;
            setReviewerStats({ count, avgRating: avg });
        } catch (error) {
            console.error('Error fetching reviewer stats:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };
            const response = await api.put('/users/me', payload);
            setUser(response.data);
            setEditing(false);
            import('canvas-confetti').then((confetti) => {
                confetti.default({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white relative">
                <Background3D />
                <div className="text-center z-10 p-8 bg-black/50 rounded-xl backdrop-blur-md border border-white/10">
                    <h2 className="text-2xl font-bold mb-4 text-red-400">Failed to load profile</h2>
                    <p className="text-gray-300 mb-6">Could not retrieve user details. Please try again or log in.</p>
                    <div className="flex gap-4 justify-center">
                        <FuturisticButton onClick={fetchProfile} variant="primary">
                            Retry
                        </FuturisticButton>
                        <FuturisticButton onClick={() => window.location.href = '/login'} variant="outline">
                            Go to Login
                        </FuturisticButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white relative py-20 px-4">
            <div className="max-w-3xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="p-8 glass-strong shadow-2xl">
                        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                User Profile
                            </h1>
                            {!editing && (
                                <FuturisticButton onClick={() => setEditing(true)} variant="outline">
                                    <Edit2 size={16} /> Edit Profile
                                </FuturisticButton>
                            )}
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 flex flex-col items-center text-center">
                                <div className="relative w-36 h-36 rounded-full mb-4 group">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-2 border-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm">
                                        {user.profilePic ? (
                                            <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={72} className="text-gray-300" />
                                        )}
                                    </div>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-1">{user.username}</h2>
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    {user.roles && user.roles.map(role => (
                                        <span key={role} className="px-3 py-1 rounded-full text-xs font-bold glass border border-blue-500/30 text-blue-300">
                                            {role.replace('ROLE_', '')}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                {editing ? (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                                                <input
                                                    type="number"
                                                    value={formData.age}
                                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                                    className="w-full px-4 py-3 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                                                    placeholder="Age"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">Registration Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.regNumber}
                                                    onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                                                    className="w-full px-4 py-3 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                                                    placeholder="Reg Number"
                                                />
                                            </div>
                                            <div>
                                                {/* Replaced URL input with ImageUpload component */}
                                                <ImageUpload
                                                    currentImage={formData.profilePic}
                                                    onImageUpdate={(newUrl) => setFormData({ ...formData, profilePic: newUrl })}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Skills (comma separated)</label>
                                            <input
                                                type="text"
                                                value={formData.skills}
                                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                                className="w-full px-4 py-3 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-500"
                                                placeholder="Java, React, Spring Boot"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                                            <textarea
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="w-full h-32 px-4 py-3 glass rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                        <div className="flex gap-4 justify-end">
                                            <FuturisticButton type="button" variant="outline" onClick={() => setEditing(false)}>
                                                Cancel
                                            </FuturisticButton>
                                            <FuturisticButton type="submit" variant="primary">
                                                <Save size={16} /> Save Changes
                                            </FuturisticButton>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            <div className="overflow-hidden">
                                                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                    <Mail size={14} /> Email
                                                </h3>
                                                <p className="text-lg text-gray-200 truncate font-medium tracking-wide" title={user.email}>{user.email}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                    <User size={14} /> Display Name
                                                </h3>
                                                <p className="text-lg text-gray-200 font-medium tracking-wide">{user.name || 'Not set'}</p>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500 mb-2">Age</h3>
                                                <p className="text-lg text-gray-200 font-medium">{user.age || 'Not set'}</p>
                                            </div>

                                            {user.roles && user.roles.includes('ROLE_REVIEWER') ? (
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Reputation</h3>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex gap-2 items-center">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${(user.level === 'Gold') ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' :
                                                                    (user.level === 'Silver') ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black' :
                                                                        'bg-gradient-to-r from-orange-700 to-orange-500 text-white'
                                                                }`}>
                                                                {user.level || 'Bronze'} Level
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-300 text-sm mt-1">
                                                            Points: <span className="text-blue-400 font-bold">{user.points || 0}</span>
                                                        </p>
                                                        <p className="text-gray-300 text-sm">
                                                            Reviews Given: <span className="font-bold">{user.reviewsGiven || 0}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Project Ratings</h3>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-lg text-yellow-400 font-bold">{user.ratings ? user.ratings.toFixed(1) : 'N/A'}</span>
                                                        <span className="text-gray-400 text-sm">/ 5</span>
                                                    </div>
                                                </div>
                                            )}

                                            {!user.roles?.includes('ROLE_REVIEWER') && (
                                                <div className="md:col-span-2">
                                                    <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                                                        <Shield size={14} /> Registration Number
                                                    </h3>
                                                    <p className="text-lg text-gray-200 font-medium tracking-wide font-mono">{user.regNumber || 'Not set'}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {user.skills && user.skills.length > 0 ? (
                                                    user.skills.map((skill, index) => (
                                                        <span key={index} className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-sm">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-400 italic">No skills listed</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 min-h-[100px]">
                                                <p className="text-gray-300 whitespace-pre-wrap">
                                                    {user.bio || 'No bio provided yet.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
