import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import FeedbackService from '../services/feedback.service';
import Card from './ui/Card';
import Button from './ui/Button';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

const FeedbackForm = ({ onFeedbackSubmit, selectedSubmission }) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5);
    const [dimensions, setDimensions] = useState({ clarity: 5, technical: 5, design: 5, docs: 5 });
    const [selectedTags, setSelectedTags] = useState([]);
    const availableTags = ["Needs Examples", "Too Long", "Good Visuals", "Clear Logic", "Buggy"];
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { refreshUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);

        try {
            await FeedbackService.createFeedback({
                submissionId: selectedSubmission ? selectedSubmission.id : "general",
                comments: content,
                rating: rating,
                dimensionRatings: dimensions,
                tags: selectedTags
            });
            toast.success('Feedback submitted successfully!');
            setContent('');
            setRating(5);
            setDimensions({ clarity: 5, technical: 5, design: 5, docs: 5 });
            setSelectedTags([]);
            if (onFeedbackSubmit) onFeedbackSubmit();
            await refreshUser();
        } catch (error) {
            toast.error('Failed to submit feedback. Please try again.');
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
                <div className="space-y-4 mb-4">
                    <label className="block text-sm font-medium text-gray-300">Detailed Ratings</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Clarity', 'Technical', 'Design', 'Docs'].map((dim) => (
                            <div key={dim} className="bg-white/5 p-3 rounded-lg">
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{dim}</span>
                                    <span className="text-xs text-blue-300 font-bold">{dimensions[dim.toLowerCase()]}/5</span>
                                </div>
                                <input
                                    type="range"
                                    min="1" max="5"
                                    value={dimensions[dim.toLowerCase()]}
                                    onChange={(e) => setDimensions({ ...dimensions, [dim.toLowerCase()]: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quick Tags</label>
                    <div className="flex flex-wrap gap-2">
                        {availableTags.map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter(t => t !== tag));
                                    else setSelectedTags([...selectedTags, tag]);
                                }}
                                className={`px-3 py-1 rounded-full text-xs border transition-colors ${selectedTags.includes(tag)
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                                    : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-500'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Overall Rating</label>
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
