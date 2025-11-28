import React, { useEffect, useState } from 'react';
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
            const response = await FeedbackService.getAllFeedback();
            // Assuming the backend returns the list directly or in a data property
            // Adjust based on actual API response structure. 
            // Spring Boot usually returns the object directly.
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
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
                            <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i} className={`text-lg ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`}>
                                        ★
                                    </span>
                                ))}
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
