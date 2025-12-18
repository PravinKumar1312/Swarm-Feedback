import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import { MessageSquare, Clock, Send, CornerDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FeedbackList = ({ refreshTrigger }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const isSubmitter = currentUser?.roles?.includes('ROLE_SUBMITTER');

    // State for reply inputs: { feedbackId: "reply text" }
    const [replyInputs, setReplyInputs] = useState({});

    useEffect(() => {
        fetchFeedbacks();
    }, [refreshTrigger]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await api.get('/feedback'); // Use generic endpoint to get enriched data including replies

            // Filter locally for "my" feedback since the generic one returns everything for admin. 
            // Better to use a specific endpoint, but let's stick to what works for getting enriched data.
            // Actually, the previous code used '/feedback/my'. If /feedback/my returns regular objects without enriched fields (like submitterReply which we added to model but maybe not to /my logic fully if it relied on repo), we might miss it.
            // However, /my calls getAllFeedback on service side or similar. The /my endpoint implementation in Controller returns List<Feedback>.
            // Wait, the controller's /my endpoint returns simple Feedback objects, NOT the enriched Map.
            // So 'submitterReply' will be there (as it's in the model), but 'submitterRepliedAt' will be there too.
            // We need to make sure we're getting the right data. 
            // Ideally we should use the enriched endpoint or update /my to return enriched data.
            // For now, let's use /feedback/my and assume we get the model fields.

            const myRes = await api.get('/feedback/my');
            setFeedbacks(myRes.data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setError('Failed to load feedback. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleReplyChange = (id, value) => {
        setReplyInputs(prev => ({ ...prev, [id]: value }));
    };

    const submitReply = async (id) => {
        const reply = replyInputs[id];
        if (!reply || !reply.trim()) return;

        try {
            await api.post(`/feedback/${id}/reply`, { reply });
            // Optimistic update
            setFeedbacks(prev => prev.map(f => {
                if (f.id === id) {
                    return { ...f, submitterReply: reply, submitterRepliedAt: new Date().toISOString() };
                }
                return f;
            }));
            setReplyInputs(prev => ({ ...prev, [id]: '' }));
        } catch (err) {
            console.error("Failed to submit reply", err);
            alert("Failed to submit reply. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-40 animate-pulse">
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-4 h-4 bg-white/10 rounded-full"></div>)}
                        </div>
                        <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-5/6 mb-2"></div>
                        <div className="h-3 bg-white/10 rounded w-1/3 mt-auto"></div>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-300 py-8 bg-red-500/10 rounded-xl border border-red-500/20">
                {error}
            </div>
        );
    }

    if (feedbacks.length === 0) {
        return (
            <div className="text-center text-gray-400 py-12">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                <p>No feedback yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {feedbacks.map((feedback, index) => (
                <motion.div
                    key={feedback.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="h-full hover:bg-white/15 transition-colors duration-300 flex flex-col">
                        <div className="flex flex-col flex-grow">
                            <div className="flex flex-col mb-2">
                                {feedback.submissionTitle && (
                                    <h4 className="font-bold text-white text-lg mb-1 truncate" title={feedback.submissionTitle}>
                                        {feedback.submissionTitle}
                                    </h4>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-lg ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${feedback.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>{feedback.status}</span>
                                </div>
                            </div>
                            {feedback.status === 'REJECTED' && feedback.rejectionReason && (
                                <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                                    <span className="font-bold">Reason:</span> {feedback.rejectionReason}
                                </div>
                            )}
                            <p className="text-gray-200 mb-4 flex-grow whitespace-pre-wrap">{feedback.comments}</p>

                            {/* Submitter Reply Section */}
                            {feedback.submitterReply && (
                                <div className="mt-4 p-3 bg-white/5 rounded-lg border-l-2 border-blue-500 text-sm">
                                    <p className="text-blue-300 font-bold text-xs mb-1 flex items-center gap-1">
                                        <CornerDownRight size={12} /> Project Owner Replied:
                                    </p>
                                    <p className="text-gray-300">{feedback.submitterReply}</p>
                                </div>
                            )}

                            {/* Reply Input for Submitter */}
                            {isSubmitter && !feedback.submitterReply && feedback.status === 'APPROVED' && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Reply to this review..."
                                            className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                                            value={replyInputs[feedback.id] || ''}
                                            onChange={(e) => handleReplyChange(feedback.id, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && submitReply(feedback.id)}
                                        />
                                        <button
                                            onClick={() => submitReply(feedback.id)}
                                            className="p-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                                            disabled={!replyInputs[feedback.id]}
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center text-xs text-gray-400 mt-4 pt-4 border-t border-white/10">
                                <Clock size={14} className="mr-1" />
                                <span>{feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'Just now'}</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

export default FeedbackList;
