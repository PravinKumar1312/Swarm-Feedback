import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Card from './ui/Card';
import FuturisticButton from './ui/FuturisticButton';
import { Check, X, User, FileText, MessageSquare, Bell, Mail, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'home';

    const [submissions, setSubmissions] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Rejection Modal State
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectItem, setRejectItem] = useState(null); // { type: 'submission' | 'feedback', id: string }
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Load everything needed for users tab calculation or home tab summaries
            const [subsRes, feedsRes, usersRes, msgsRes] = await Promise.all([
                api.get('/submissions'),
                api.get('/feedback'),
                (activeTab === 'users' || activeTab === 'home') ? api.get('/users') : Promise.resolve({ data: [] }),
                (activeTab === 'home') ? api.get('/messages') : Promise.resolve({ data: [] })
            ]);

            setSubmissions(subsRes.data || []);
            setFeedbacks(feedsRes.data || []);
            setUsers(usersRes.data || []);
            setMessages(msgsRes.data || []);

        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (type, id) => {
        try {
            const endpoint = type === 'submission' ? `/submissions/${id}/status` : `/feedback/${id}/status`;
            await api.put(endpoint, { status: 'APPROVED' });
            fetchData();
        } catch (error) {
            console.error("Error approving:", error);
        }
    };

    const openRejectModal = (type, id) => {
        setRejectItem({ type, id });
        setRejectionReason('');
        setRejectModalOpen(true);
    };

    const handleReject = async () => {
        if (!rejectItem) return;
        try {
            const endpoint = rejectItem.type === 'submission'
                ? `/submissions/${rejectItem.id}/status`
                : `/feedback/${rejectItem.id}/status`;

            await api.put(endpoint, {
                status: 'REJECTED',
                rejectionReason: rejectionReason
            });

            setRejectModalOpen(false);
            setRejectItem(null);
            fetchData();
        } catch (error) {
            console.error("Error rejecting:", error);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to remove this user? This action cannot be undone.")) {
            try {
                await api.delete(`/users/${userId}`);
                fetchData();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 capitalize">
                {activeTab === 'home' ? 'Admin Dashboard' :
                    activeTab === 'projects' ? 'Project Approvals' :
                        activeTab === 'feedback' ? 'Feedback Approvals' : 'User Details'}
            </h1>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'home' && <HomeView submissions={submissions} feedbacks={feedbacks} messages={messages} />}
                    {activeTab === 'projects' && (
                        <ProjectsView
                            submissions={submissions}
                            onApprove={(id) => handleApprove('submission', id)}
                            onReject={(id) => openRejectModal('submission', id)}
                        />
                    )}
                    {activeTab === 'feedback' && (
                        <FeedbackView
                            feedbacks={feedbacks}
                            onApprove={(id) => handleApprove('feedback', id)}
                            onReject={(id) => openRejectModal('feedback', id)}
                        />
                    )}
                    {activeTab === 'users' && <UsersView users={users} submissions={submissions} feedbacks={feedbacks} onDelete={handleDeleteUser} />}
                </motion.div>
            </AnimatePresence>

            {/* Rejection Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                    >
                        <h3 className="text-xl font-bold mb-4">Reject {rejectItem?.type === 'submission' ? 'Project' : 'Feedback'}</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Please provide a reason for rejection. This will be visible to the user.
                        </p>
                        <textarea
                            className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 transition-colors h-32 resize-none"
                            placeholder="Reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <FuturisticButton variant="outline" onClick={() => setRejectModalOpen(false)}>
                                Cancel
                            </FuturisticButton>
                            <FuturisticButton
                                variant="danger"
                                onClick={handleReject}
                                disabled={!rejectionReason.trim()}
                            >
                                Confirm Rejection
                            </FuturisticButton>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const HomeView = ({ submissions, feedbacks, messages }) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Build Notifications from real data (pending items)
    const pendingProjects = submissions.filter(s => s.status === 'PENDING').map(s => ({
        id: s.id, type: 'notification', title: `New Project: ${s.title}`, description: s.description, time: new Date(s.createdAt).toLocaleTimeString(), category: 'Project'
    }));
    const pendingFeedback = feedbacks.filter(f => f.status === 'PENDING').map(f => ({
        id: f.id, type: 'notification', title: `New Feedback for ${f.submissionTitle || 'Project'}`, description: f.comments, time: new Date(f.createdAt).toLocaleTimeString(), category: 'Feedback'
    }));

    const notifications = [...pendingProjects, ...pendingFeedback];

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 h-full border-blue-500/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                        <Bell size={24} />
                    </div>
                    <h2 className="text-xl font-bold">Notifications</h2>
                </div>
                <div className="space-y-4">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => handleItemClick(n)}
                            className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <p className="font-medium text-white">{n.title}</p>
                                <span className="text-xs bg-blue-500 px-2 py-0.5 rounded text-white">{n.category}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm">No new notifications.</p>
                    )}
                </div>
            </Card>

            <Card className="p-6 h-full border-purple-500/20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Messages</h2>
                        <p className="text-xs text-gray-500">Bugs & User Reports</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {messages.length > 0 ? messages.map(m => (
                        <div
                            key={m.id}
                            onClick={() => handleItemClick({ ...m, type: 'message' })}
                            className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 cursor-pointer"
                        >
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm text-purple-400">{m.senderUsername}</span>
                                <span className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-white font-medium text-sm">{m.subject}</p>
                            <p className="text-gray-400 text-xs mt-1 truncate">{m.description}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500 text-sm">No new messages.</p>
                    )}
                </div>
            </Card>

            {/* Detail Popup */}
            {showModal && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setShowModal(false)}><X size={20} /></button>

                        {selectedItem.type === 'notification' ? (
                            <>
                                <h3 className="text-xl font-bold mb-2 text-blue-400">{selectedItem.title}</h3>
                                <div className="mb-4 text-xs text-gray-500">Time: {selectedItem.time}</div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-gray-300">
                                    <h4 className="font-bold text-sm text-white mb-2">Details:</h4>
                                    <p>{selectedItem.description}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-bold mb-2 text-purple-400">{selectedItem.subject}</h3>
                                <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
                                    <span>From: {selectedItem.senderUsername}</span>
                                    <span>{new Date(selectedItem.createdAt).toLocaleDateString()} {new Date(selectedItem.createdAt).toLocaleTimeString()}</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-lg border border-white/10 text-gray-300 space-y-3">
                                    <p><span className="font-bold text-white">Message:</span><br />{selectedItem.description}</p>

                                    {selectedItem.mediaUrl && (
                                        <div className="mt-4">
                                            <h4 className="font-bold text-sm text-white mb-2">Attachment:</h4>
                                            {selectedItem.mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                <img src={selectedItem.mediaUrl} alt="Attachment" className="max-w-full rounded-lg border border-white/10" />
                                            ) : (
                                                <a href={selectedItem.mediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                                                    <ExternalLink size={16} /> View Attached File
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="mt-6 flex justify-end">
                            <FuturisticButton variant="primary" onClick={() => setShowModal(false)}>Close</FuturisticButton>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

const ProjectsView = ({ submissions, onApprove, onReject }) => {
    return (
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
                        {sub.rejectionReason && (
                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">
                                <span className="font-bold">Reason:</span> {sub.rejectionReason}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {sub.status !== 'APPROVED' && (
                            <FuturisticButton
                                variant="primary"
                                className="!py-2 !px-4 text-sm bg-green-600 border-green-500 hover:shadow-green-500/50"
                                onClick={() => onApprove(sub.id)}
                            >
                                <Check size={16} /> Approve
                            </FuturisticButton>
                        )}
                        {sub.status !== 'REJECTED' && (
                            <FuturisticButton
                                variant="danger"
                                className="!py-2 !px-4 text-sm"
                                onClick={() => onReject(sub.id)}
                            >
                                <X size={16} /> Reject
                            </FuturisticButton>
                        )}
                    </div>
                </Card>
            ))}
            {submissions.length === 0 && <p className="text-gray-500 text-center py-8">No projects found.</p>}
        </div>
    );
};

const FeedbackView = ({ feedbacks, onApprove, onReject }) => {
    return (
        <div className="grid gap-4">
            {feedbacks.map(fb => (
                <Card key={fb.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border-white/10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex text-yellow-400 text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>{i < fb.rating ? '★' : '☆'}</span>
                                ))}
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${fb.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                fb.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {fb.status}
                            </span>
                        </div>
                        <p className="text-gray-300">{fb.comments}</p>
                        <div className="mt-2 text-xs text-gray-500">
                            by {fb.reviewerUsername || 'Unknown'} • Project: {fb.submissionTitle || fb.submissionId}
                        </div>
                        {fb.rejectionReason && (
                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">
                                <span className="font-bold">Reason:</span> {fb.rejectionReason}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {fb.status !== 'APPROVED' && (
                            <FuturisticButton
                                variant="primary"
                                className="!py-2 !px-4 text-sm bg-green-600 border-green-500 hover:shadow-green-500/50"
                                onClick={() => onApprove(fb.id)}
                            >
                                <Check size={16} /> Approve
                            </FuturisticButton>
                        )}
                        {fb.status !== 'REJECTED' && (
                            <FuturisticButton
                                variant="danger"
                                className="!py-2 !px-4 text-sm"
                                onClick={() => onReject(fb.id)}
                            >
                                <X size={16} /> Reject
                            </FuturisticButton>
                        )}
                    </div>
                </Card>
            ))}
            {feedbacks.length === 0 && <p className="text-gray-500 text-center py-8">No feedback found.</p>}
        </div>
    );
};

const UsersView = ({ users, submissions, feedbacks, onDelete }) => {
    // Split users
    const submitters = users.filter(u => u.roles.some(r => r.name === 'ROLE_SUBMITTER' || r === 'ROLE_SUBMITTER'));
    const reviewers = users.filter(u => u.roles.some(r => r.name === 'ROLE_REVIEWER' || r === 'ROLE_REVIEWER'));

    const UserList = ({ title, userList, type }) => (
        <Card className="flex-1 flex flex-col border-white/10 h-full">
            <h3 className="text-xl font-bold mb-4 px-2 flex items-center gap-2">
                <User size={20} className={type === 'submitter' ? 'text-blue-400' : 'text-purple-400'} />
                {title} <span className="text-sm bg-white/10 px-2 rounded-full text-gray-400 ml-auto">{userList.length}</span>
            </h3>
            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                {userList.map(user => {
                    const subCount = submissions.filter(s => s.ownerUserId === user.id).length;
                    const feedCount = feedbacks.filter(f => f.reviewerUserId === user.id).length;

                    return (
                        <div key={user.id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors border border-white/5 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-white">{user.name || user.username}</h4>
                                    <p className="text-xs text-gray-400 font-mono mb-2">{user.regNumber || 'No Reg #'}</p>
                                    <div className="flex gap-3 text-xs mt-2">
                                        <span className="bg-blue-500/10 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/20">
                                            {subCount} Projects
                                        </span>
                                        <span className="bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/20">
                                            {feedCount} Reviews
                                        </span>
                                        {user.ratings !== undefined && user.ratings !== null && (
                                            <span className="bg-yellow-500/10 text-yellow-300 px-1.5 py-0.5 rounded border border-yellow-500/20 flex items-center gap-1">
                                                ★ {user.ratings.toFixed(1)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onDelete(user.id)}
                                    className="text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                                    title="Remove User"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
                {userList.length === 0 && <p className="text-gray-500 text-center py-4">No users found.</p>}
            </div>
        </Card>
    );

    return (
        <div className="grid md:grid-cols-2 gap-8 h-full items-start">
            <UserList title="Submitters" userList={submitters} type="submitter" />
            <UserList title="Reviewers" userList={reviewers} type="reviewer" />
        </div>
    );
};

export default AdminDashboard;
