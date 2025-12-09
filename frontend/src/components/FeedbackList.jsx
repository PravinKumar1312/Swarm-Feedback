import React, { useEffect, useState } from 'react';
import api from '../services/api';
import FeedbackService from '../services/feedback.service';
import Card from './ui/Card';
import { MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const FeedbackList = ({ refreshTrigger }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFeedbacks();
    }, [refreshTrigger]);

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            // Use the new /my endpoint to get relevant feedback for the user
            const response = await api.get('/feedback/my');
            setFeedbacks(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching feedbacks:', err);
            setError('Failed to load feedback. Please try again later.');
        } finally {
            setLoading(false);
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
                    <Card className="h-full hover:bg-white/15 transition-colors duration-300">
                        <div className="flex flex-col h-full">
                            <div className="flex flex-col mb-2">
                                {feedback.submissionTitle && (
                                    <h4 className="font-bold text-white text-lg mb-1 truncate" title={feedback.submissionTitle}>
                                        {feedback.submissionTitle}
                                    </h4>
                                )}
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`text-lg ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-200 mb-4 flex-grow whitespace-pre-wrap">{feedback.comments}</p>
                            <div className="flex items-center text-xs text-gray-400 mt-auto pt-4 border-t border-white/10">
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
