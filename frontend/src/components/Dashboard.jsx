import React, { useState } from 'react';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';
import SubmissionForm from './SubmissionForm';
import SubmissionList from './SubmissionList';
import { Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FuturisticButton from './ui/FuturisticButton';
import Background3D from './ui/Background3D';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const feedbackFormRef = React.useRef(null);
    const { currentUser, logout } = useAuth();

    const handleRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handleReview = (submission) => {
        setSelectedSubmission(submission);
        if (feedbackFormRef.current) {
            feedbackFormRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isReviewer = currentUser?.roles.includes('ROLE_REVIEWER') || currentUser?.roles.includes('ROLE_ADMIN');
    const isSubmitter = currentUser?.roles.includes('ROLE_SUBMITTER') || currentUser?.roles.includes('ROLE_ADMIN');
    const isAdmin = currentUser?.roles.includes('ROLE_ADMIN');

    return (
        <div className="min-h-screen text-white selection:bg-purple-500/30 relative">
            <Background3D />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-purple-900/20 to-slate-900/80 pointer-events-none -z-10"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="flex justify-between items-center mb-16">
                    <div className="text-center flex-1">
                        <div className="inline-flex items-center justify-center p-2 bg-white/5 rounded-2xl mb-4 backdrop-blur-sm border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <Sparkles className="text-yellow-400 mr-2" size={24} />
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                Swarm Feedback
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 drop-shadow-lg">
                            We Value Your Input
                        </h1>
                        <div className="flex flex-col items-center gap-2">
                            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                                Welcome, <span className="text-white font-semibold">{currentUser?.username}</span>
                            </p>
                            <div className="flex gap-2">
                                {currentUser?.roles.map(role => (
                                    <span key={role} className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${role === 'ROLE_ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                        role === 'ROLE_REVIEWER' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                            'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        }`}>
                                        {role.replace('ROLE_', '')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <FuturisticButton onClick={logout} variant="danger" className="absolute top-0 right-0 mt-4 mr-4">
                        <LogOut size={18} /> Logout
                    </FuturisticButton>
                </header>

                <main className="space-y-16">
                    {isAdmin ? (
                        <AdminDashboard />
                    ) : (
                        <>
                            {isSubmitter && (
                                <section>
                                    <SubmissionForm onSubmissionCreate={handleRefresh} />
                                </section>
                            )}

                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-2xl font-bold">
                                        {(!isReviewer && isSubmitter) ? 'My Projects' : 'Recent Projects'}
                                    </h2>
                                    <div className="h-px flex-grow bg-gradient-to-r from-white/20 to-transparent"></div>
                                </div>
                                <SubmissionList refreshTrigger={refreshTrigger} onReview={handleReview} />
                            </section>

                            {isReviewer && (
                                <section ref={feedbackFormRef}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <h2 className="text-2xl font-bold">
                                            {selectedSubmission ? `Give Feedback on "${selectedSubmission.title}"` : 'Give Feedback (General)'}
                                        </h2>
                                        <div className="h-px flex-grow bg-gradient-to-r from-white/20 to-transparent"></div>
                                    </div>
                                    <FeedbackForm
                                        onFeedbackSubmit={() => {
                                            handleRefresh();
                                            setSelectedSubmission(null);
                                        }}
                                        selectedSubmission={selectedSubmission}
                                    />
                                </section>
                            )}

                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-2xl font-bold">
                                        {(!isReviewer && isSubmitter) ? 'My Feedback' : 'Recent Feedback'}
                                    </h2>
                                    <div className="h-px flex-grow bg-gradient-to-r from-white/20 to-transparent"></div>
                                </div>
                                <FeedbackList refreshTrigger={refreshTrigger} />
                            </section>
                        </>
                    )}
                </main>

                <footer className="mt-20 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Swarm Feedback. Built with Spring Boot & React.</p>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;
