import React, { useState } from 'react';
import FeedbackService from '../services/feedback.service';
import Card from './ui/Card';
import Button from './ui/Button';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackForm = ({ onFeedbackSubmit, selectedSubmission }) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setMessage(null);

        try {
            await FeedbackService.createFeedback({
                submissionId: selectedSubmission ? selectedSubmission.id : "general",
                comments: content,
                rating: rating
            });
            setMessage({ type: 'success', text: 'Feedback submitted successfully!' });
            setContent('');
            setRating(5);
            if (onFeedbackSubmit) onFeedbackSubmit();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to submit feedback. Please try again.' });
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedSubmission ? `Reviewing: ${selectedSubmission.title}` : 'Share Your Thoughts'}
                </h2>
                <p className="text-gray-300">
                    {selectedSubmission ? 'Rate this project and provide constructive feedback.' : 'We value your feedback. Let us know what you think!'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className={`text-2xl focus:outline-none transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Comments</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your feedback here..."
                        className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        disabled={isSubmitting}
                    />
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`flex items-center gap-2 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
                                }`}
                        >
                            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                            <span className="text-sm font-medium">{message.text}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting || !content.trim()} className="flex items-center gap-2">
                        {isSubmitting ? (
                            'Submitting...'
                        ) : (
                            <>
                                <Send size={18} />
                                Submit Feedback
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default FeedbackForm;
