import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import { FileText, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const SubmissionList = ({ refreshTrigger, onReview }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const isReviewer = currentUser?.roles.includes('ROLE_REVIEWER') || currentUser?.roles.includes('ROLE_ADMIN');

    useEffect(() => {
        fetchSubmissions();
    }, [refreshTrigger]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await api.get('/submissions');
            setSubmissions(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            setError('Failed to load submissions.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-8 text-gray-400">Loading projects...</div>;
    if (error) return <div className="text-center py-8 text-red-400">{error}</div>;
    if (submissions.length === 0) return <div className="text-center py-8 text-gray-400">No projects found.</div>;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submissions.map((sub, index) => (
                <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="h-full hover:bg-white/15 transition-colors duration-300 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-white truncate pr-2">{sub.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'OPEN' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>
                                {sub.status}
                            </span>
                        </div>

                        <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">{sub.description}</p>

                        {sub.tags && sub.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {sub.tags.map(tag => (
                                    <span key={tag} className="text-xs flex items-center text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                                        <Tag size={10} className="mr-1" /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-auto pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                                <div className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                </div>
                                {sub.fileUrls && sub.fileUrls.length > 0 && (
                                    <div className="flex items-center text-blue-400">
                                        <FileText size={14} className="mr-1" />
                                        <span>{sub.fileUrls.length} File(s)</span>
                                    </div>
                                )}
                            </div>

                            {isReviewer && (
                                <Button
                                    variant="outline"
                                    className="w-full text-sm py-1"
                                    onClick={() => onReview && onReview(sub)}
                                >
                                    Review Project
                                </Button>
                            )}
                        </div>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};

export default SubmissionList;
