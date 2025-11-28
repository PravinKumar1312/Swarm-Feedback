import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Card from './ui/Card';
import FuturisticButton from './ui/FuturisticButton';
import { Check, X, Edit2, Trash2, User, FileText, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [submissions, setSubmissions] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingFeedback, setEditingFeedback] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'projects') {
                const response = await api.get('/submissions');
                setSubmissions(response.data || []);
            } else {
                const response = await api.get('/feedback');
                setFeedbacks(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/submissions/${id}/status`, { status });
            fetchData(); // Refresh
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleFeedbackUpdate = async (e) => {
        e.preventDefault();
        if (!editingFeedback) return;

        try {
            await api.put(`/feedback/${editingFeedback.id}`, {
                comments: editingFeedback.comments,
                rating: editingFeedback.rating
            });
            setEditingFeedback(null);
            fetchData();
        } catch (error) {
            console.error("Error updating feedback:", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex gap-4 mb-8">
                <FuturisticButton
                    variant={activeTab === 'projects' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('projects')}
                >
                    <FileText size={18} /> Manage Projects
                </FuturisticButton>
                <FuturisticButton
                    variant={activeTab === 'feedback' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('feedback')}
                >
                    <MessageSquare size={18} /> Manage Feedback
                </FuturisticButton>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'projects' ? (
                        <div className="grid gap-4">
                            {submissions.map(sub => (
                                <Card key={sub.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border-white/10">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{sub.title}</h3>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${sub.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                                    sub.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mb-2">{sub.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1"><User size={12} /> Owner ID: {sub.ownerUserId}</span>
                                            <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {sub.status !== 'APPROVED' && (
                                            <FuturisticButton
                                                variant="primary"
                                                className="!py-2 !px-4 text-sm bg-green-600 border-green-500 hover:shadow-green-500/50"
                                                onClick={() => handleStatusUpdate(sub.id, 'APPROVED')}
                                            >
                                                <Check size={16} /> Approve
                                            </FuturisticButton>
                                        )}
                                        {sub.status !== 'REJECTED' && (
                                            <FuturisticButton
                                                variant="danger"
                                                className="!py-2 !px-4 text-sm"
                                                onClick={() => handleStatusUpdate(sub.id, 'REJECTED')}
                                            >
                                                <X size={16} /> Reject
                                            </FuturisticButton>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {feedbacks.map(fb => (
                                <Card key={fb.id} className="p-6 bg-white/5 border-white/10">
                                    {editingFeedback?.id === fb.id ? (
                                        <form onSubmit={handleFeedbackUpdate} className="space-y-4">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Rating</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    value={editingFeedback.rating}
                                                    onChange={e => setEditingFeedback({ ...editingFeedback, rating: parseInt(e.target.value) })}
                                                    className="bg-black/20 border border-white/10 rounded px-3 py-2 text-white w-20"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Comments</label>
                                                <textarea
                                                    value={editingFeedback.comments}
                                                    onChange={e => setEditingFeedback({ ...editingFeedback, comments: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white h-24"
                                                />
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <FuturisticButton type="button" variant="outline" onClick={() => setEditingFeedback(null)}>Cancel</FuturisticButton>
                                                <FuturisticButton type="submit" variant="primary">Save Changes</FuturisticButton>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="flex text-yellow-400 text-sm">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i}>{i < fb.rating ? '★' : '☆'}</span>
                                                        ))}
                                                    </div>
                                                    <span className="text-gray-500 text-xs">
                                                        by {fb.reviewerUsername || 'Unknown'} (ID: {fb.reviewerUserId})
                                                    </span>
                                                </div>
                                                <p className="text-gray-300">{fb.comments}</p>
                                                <div className="mt-2 text-xs text-gray-500">
                                                    Project ID: {fb.submissionId}
                                                </div>
                                            </div>
                                            <FuturisticButton
                                                variant="outline"
                                                className="!py-2 !px-4 text-sm"
                                                onClick={() => setEditingFeedback(fb)}
                                            >
                                                <Edit2 size={16} /> Edit
                                            </FuturisticButton>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default AdminDashboard;
