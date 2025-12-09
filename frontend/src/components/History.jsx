import React, { useState } from 'react';
import SubmissionList from './SubmissionList';
import FeedbackList from './FeedbackList';
import { FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FuturisticButton from './ui/FuturisticButton';

const History = () => {
    const { currentUser } = useAuth();
    const isReviewer = currentUser?.roles?.includes('ROLE_REVIEWER');
    const isSubmitter = currentUser?.roles?.includes('ROLE_SUBMITTER');
    const isAdmin = currentUser?.roles?.includes('ROLE_ADMIN');

    // If ONLY reviewer (and not submitter/admin), default to feedback
    const [activeTab, setActiveTab] = useState((isReviewer && !isSubmitter && !isAdmin) ? 'feedback' : 'projects');

    const showProjectsTab = isSubmitter || isAdmin;
    const showFeedbackTab = true; // Everyone can see feedback (Submitters: received, Reviewers: given)

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    {(isReviewer && !isSubmitter && !isAdmin) ? 'My Reviews' : 'History'}
                </h1>
                <p className="text-gray-400">
                    {(isReviewer && !isSubmitter && !isAdmin)
                        ? 'View the feedback you have provided to others.'
                        : 'View your past submissions and received feedback.'}
                </p>
            </header>

            <div className="flex gap-4 mb-8">
                {showProjectsTab && (
                    <FuturisticButton
                        variant={activeTab === 'projects' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('projects')}
                    >
                        <FileText size={18} /> My Projects
                    </FuturisticButton>
                )}
                {showFeedbackTab && (
                    <FuturisticButton
                        variant={activeTab === 'feedback' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('feedback')}
                    >
                        <MessageSquare size={18} /> {(isReviewer && !isSubmitter && !isAdmin) ? 'My Reviews' : 'Received Feedback'}
                    </FuturisticButton>
                )}
            </div>

            <div>
                {activeTab === 'projects' && showProjectsTab ? (
                    <SubmissionList mode="my" />
                ) : (
                    <FeedbackList />
                )}
            </div>
        </div>
    );
};

export default History;
