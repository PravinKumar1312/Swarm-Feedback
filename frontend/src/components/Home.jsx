import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from './ui/Card';
import { Sparkles, Activity, MessageSquare, FileText } from 'lucide-react';
import api from '../services/api';
import SubmissionList from './SubmissionList';

const Home = () => {
    const { currentUser } = useAuth();
    const isReviewer = currentUser?.roles?.includes('ROLE_REVIEWER');

    const [stats, setStats] = useState({
        totalSubmissions: 0,
        totalFeedback: 0,
        reviewDistribution: {}, // { "5": 10, "4": 2 ... }
        recentActivity: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (isReviewer) {
                    // Fetch reviewer-specific stats
                    const feedbackRes = await api.get('/feedback/my'); // Returns reviews given
                    const myReviews = feedbackRes.data || [];

                    const dist = {};
                    myReviews.forEach(r => {
                        const rating = r.rating || 0;
                        dist[rating] = (dist[rating] || 0) + 1;
                    });

                    setStats({
                        totalFeedback: myReviews.length,
                        reviewDistribution: dist,
                        recentActivity: myReviews.map(r => ({
                            type: 'review',
                            date: r.createdAt,
                            title: r.submissionTitle || 'Project Review'
                        })).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
                    });
                } else {
                    // Fetch submitter-specific stats
                    const submissionsRes = await api.get('/submissions/my');
                    const submissions = submissionsRes.data || [];

                    const feedbackRes = await api.get('/feedback/my');
                    const feedback = feedbackRes.data || [];

                    setStats({
                        totalSubmissions: submissions.length,
                        totalFeedback: feedback.length,
                        recentActivity: [
                            ...submissions.map(s => ({ type: 'submission', date: s.createdAt, title: s.title })),
                            ...feedback.map(f => ({ type: 'feedback', date: f.createdAt, title: 'Received feedback' }))
                        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
                    });
                }
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        fetchStats();
    }, [isReviewer]);

    // Simple Pie Chart Component using CSS Conic Gradient
    const ReviewPieChart = ({ distribution }) => {
        const total = Object.values(distribution).reduce((a, b) => a + b, 0);
        if (total === 0) return <div className="text-gray-500 text-xs">No reviews yet</div>;

        let currentPercent = 0;
        const colors = {
            5: '#22c55e', // green-500
            4: '#3b82f6', // blue-500
            3: '#eab308', // yellow-500
            2: '#f97316', // orange-500
            1: '#ef4444'  // red-500
        };

        const segments = Object.keys(distribution).sort((a, b) => b - a).map(rating => {
            const count = distribution[rating];
            const percent = (count / total) * 100;
            // Simplified gradient approach only works usually for one segment per CSS stop if we accumulate, 
            // but for a true multi-segment we need stops: color start% end%
            // Let's build the gradient string manually
            return { rating, percent, color: colors[rating] };
        });

        let gradientString = 'conic-gradient(';
        let cumulative = 0;
        segments.forEach((seg, i) => {
            gradientString += `${seg.color} ${cumulative}% ${cumulative + seg.percent}%`;
            cumulative += seg.percent;
            if (i < segments.length - 1) gradientString += ', ';
        });
        gradientString += ')';

        return (
            <div className="flex items-center gap-4">
                <div
                    className="w-16 h-16 rounded-full"
                    style={{ background: gradientString }}
                ></div>
                <div className="flex flex-col gap-1 text-xs">
                    {segments.map(seg => (
                        <div key={seg.rating} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: seg.color }}></span>
                            <span className="text-gray-300">{seg.rating} stars ({Math.round(seg.percent)}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Using state to trigger refreshes if needed, though Feed handles its own data
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // If strictly reviewer (and not admin/submitter), show the feed directly
    if (isReviewer && !currentUser?.roles?.includes('ROLE_ADMIN') && !currentUser?.roles?.includes('ROLE_SUBMITTER')) {
        return (
            <div className="space-y-8">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{currentUser?.username}</span>
                    </h1>
                    <p className="text-gray-400">Here are the latest projects waiting for your review.</p>
                </header>

                <SubmissionList refreshTrigger={refreshTrigger} />
            </div>
        );
    }

    // Original view for Submitters or mixed roles
    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{currentUser?.username}</span>
                </h1>
                <p className="text-gray-400">Here's what's happening with your {isReviewer ? 'reviews' : 'projects'}.</p>
            </header>

            <div className={`grid grid-cols-1 ${isReviewer ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>

                {/* CARD 1: Total Projects (Submitter) or Feedback Given (Reviewer) */}
                <Card className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${isReviewer ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {isReviewer ? <MessageSquare size={24} /> : <FileText size={24} />}
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">{isReviewer ? 'Feedback Given' : 'Total Projects'}</p>
                            <p className="text-2xl font-bold text-white">{isReviewer ? stats.totalFeedback : stats.totalSubmissions}</p>
                        </div>
                    </div>
                </Card>

                {/* CARD 2: Feedback Received (Submitter) or Review Distribution (Reviewer) */}
                <Card className="p-6 bg-white/5 border-white/10">
                    {isReviewer ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-400 text-sm mb-1">Value of the review</p>
                            <ReviewPieChart distribution={stats.reviewDistribution} />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-full bg-purple-500/20 text-purple-400">
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Feedback Received</p>
                                <p className="text-2xl font-bold text-white">{stats.totalFeedback}</p>
                            </div>
                        </div>
                    )}
                </Card>



            </div>

            <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Sparkles className="text-yellow-400" size={20} /> Recent Activity
                </h2>
                <div className="space-y-4">
                    {stats.recentActivity.length > 0 ? (
                        stats.recentActivity.map((activity, index) => (
                            <Card key={index} className="p-4 flex items-center justify-between bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${activity.type === 'submission' ? 'bg-blue-400' : 'bg-purple-400'}`}></div>
                                    <div>
                                        <p className="text-white font-medium">
                                            {activity.type === 'submission'
                                                ? `Submitted project: "${activity.title}"`
                                                : activity.type === 'review'
                                                    ? `Reviewed project: "${activity.title}"`
                                                    : `New feedback received`}
                                        </p>
                                        <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-500 italic">No recent activity to show.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
