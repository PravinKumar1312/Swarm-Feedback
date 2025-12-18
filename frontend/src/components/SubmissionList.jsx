import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from './ui/Card';
import Button from './ui/Button';
import { FileText, Calendar, Tag, X, ExternalLink, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import FeedbackForm from './FeedbackForm';

const SubmissionList = ({ refreshTrigger, mode }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const { currentUser } = useAuth();

    const isReviewer = currentUser?.roles.includes('ROLE_REVIEWER') || currentUser?.roles.includes('ROLE_ADMIN');

    useEffect(() => {
        fetchSubmissions();
    }, [refreshTrigger, mode]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);

            let endpoint = '/submissions';
            if (mode === 'my') {
                endpoint = '/submissions/my';
            } else if (!isReviewer && currentUser?.roles.includes('ROLE_SUBMITTER')) {
                endpoint = '/submissions/my';
            }

            const response = await api.get(endpoint);
            setSubmissions(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching submissions:', err);
            setError('Failed to load submissions.');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (sub) => {
        setSelectedSubmission(sub);
    };

    const closeDetail = () => {
        setSelectedSubmission(null);
    };

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="h-48 animate-pulse">
                        <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-5/6 mb-2"></div>
                        <div className="h-4 bg-white/10 rounded w-1/2 mt-auto"></div>
                    </Card>
                ))}
            </div>
        );
    }
    if (error) return <div className="text-center py-8 text-red-400">{error}</div>;
    if (submissions.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                    {mode === 'my'
                        ? "You haven't submitted any projects yet. Share your work to get feedback!"
                        : "There are no projects available for review at the moment."}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {submissions.map((sub, index) => (
                    <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleCardClick(sub)}
                    >
                        <Card className="h-full hover:bg-white/15 transition-all duration-300 flex flex-col cursor-pointer border-transparent hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 group">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-white truncate pr-2 group-hover:text-blue-400 transition-colors">{sub.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'APPROVED' ? 'bg-green-500/20 text-green-300' :
                                    sub.status === 'REJECTED' ? 'bg-red-500/20 text-red-300' :
                                        'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                    {sub.status === 'PENDING' ? 'Pending Approval' : sub.status}
                                </span>
                            </div>

                            {sub.status === 'REJECTED' && sub.rejectionReason && (
                                <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-300">
                                    <span className="font-bold">Reason:</span> {sub.rejectionReason}
                                </div>
                            )}

                            <p className="text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">{sub.description}</p>

                            {sub.tags && sub.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {sub.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs flex items-center text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded">
                                            <Tag size={10} className="mr-1" /> {tag}
                                        </span>
                                    ))}
                                    {sub.tags.length > 3 && (
                                        <span className="text-xs text-gray-500 px-2 py-0.5">+{sub.tags.length - 3}</span>
                                    )}
                                </div>
                            )}

                            <div className="mt-auto pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center text-xs text-gray-400">
                                    <div className="flex items-center">
                                        <Calendar size={14} className="mr-1" />
                                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                                        <span className="underline decoration-transparent group-hover:decoration-blue-400 transition-all">View Details</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Detailed View Modal */}
            <AnimatePresence>
                {selectedSubmission && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-5xl shadow-2xl relative my-8 flex flex-col max-h-[90vh]"
                        >
                            {/* Sticky Header */}
                            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-slate-900/50 rounded-t-2xl backdrop-blur-xl sticky top-0 z-10 transition-all">
                                <div>
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h2 className="text-3xl font-bold text-white break-words">{selectedSubmission.title}</h2>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold tracking-wide ${selectedSubmission.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                            selectedSubmission.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/20' :
                                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20'
                                            }`}>
                                            {selectedSubmission.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 font-mono">
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            id: {selectedSubmission.id.substring(0, 8)}...
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(selectedSubmission.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={closeDetail}
                                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Left Column: Details */}
                                    <div className="lg:col-span-2 space-y-8">
                                        {/* Description */}
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                                <FileText className="text-blue-400" size={20} /> Project Description
                                            </h3>
                                            <div className="bg-white/5 p-6 rounded-xl border border-white/5 shadow-inner">
                                                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">{selectedSubmission.description}</p>
                                            </div>
                                        </div>

                                        {/* Files */}
                                        {selectedSubmission.fileUrls && selectedSubmission.fileUrls.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                                    <Download className="text-purple-400" size={20} /> Attachments
                                                </h3>
                                                <div className="grid gap-3 sm:grid-cols-2">
                                                    {selectedSubmission.fileUrls.map((url, i) => (
                                                        <a
                                                            key={i}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center p-4 bg-slate-800/50 border border-white/10 rounded-xl hover:bg-slate-800 hover:border-blue-500/30 transition-all group"
                                                        >
                                                            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400 mr-4 group-hover:scale-110 transition-transform">
                                                                <FileText size={24} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold text-white truncate">Attachment {i + 1}</p>
                                                                <p className="text-xs text-blue-300 mt-1 flex items-center gap-1">
                                                                    Open File <ExternalLink size={10} />
                                                                </p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Column: Meta & Actions */}
                                    <div className="space-y-6">
                                        {/* Tags Card */}
                                        {selectedSubmission.tags && selectedSubmission.tags.length > 0 && (
                                            <div className="bg-white/5 p-5 rounded-xl border border-white/10">
                                                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Tags</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedSubmission.tags.map(tag => (
                                                        <span key={tag} className="flex items-center text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20 text-sm font-medium">
                                                            <Tag size={12} className="mr-2" /> {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Review Area */}
                                        {isReviewer ? (
                                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                                <FeedbackForm
                                                    selectedSubmission={selectedSubmission}
                                                    onFeedbackSubmit={() => {
                                                        closeDetail();
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-white/5 rounded-xl border border-white/5 border-dashed text-center">
                                                <p className="text-gray-500">Feedback is restricted to reviewers.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SubmissionList;
