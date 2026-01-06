import React, { useEffect, useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../services/api';
import Card from './ui/Card';

const Insights = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        try {
            // Fetch my submissions
            const subRes = await api.get('/submissions/my');
            const submissions = subRes.data;

            // Fetch feedback for these submissions
            // Ideally backend aggregating this is better, but doing client-side for now as per prompt "compute per-dimension averages on Submission and User" (could be backend, but I chose client for speed)
            // Wait, I didn't implement backend aggregation endpoint yet.
            // I'll fetch feedback for each submission or all feedback received.
            const feedRes = await api.get('/feedback/my'); // This gets received feedback for submitter
            const feedbacks = feedRes.data.filter(f => f.status === 'APPROVED');

            // Process Data
            const dimensions = { Clarity: 0, Technical: 0, Design: 0, Docs: 0 };
            const counts = { Clarity: 0, Technical: 0, Design: 0, Docs: 0 };

            feedbacks.forEach(f => {
                if (f.dimensionRatings) {
                    Object.keys(f.dimensionRatings).forEach(k => {
                        const key = k.charAt(0).toUpperCase() + k.slice(1);
                        if (dimensions[key] !== undefined) {
                            dimensions[key] += f.dimensionRatings[k];
                            counts[key]++;
                        }
                    });
                }
            });

            const radarData = Object.keys(dimensions).map(key => ({
                subject: key,
                A: counts[key] ? (dimensions[key] / counts[key]).toFixed(1) : 0,
                fullMark: 5
            }));

            // Trend Data (Last 6 feedbacks)
            const sortedFeedbacks = [...feedbacks].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const trendData = sortedFeedbacks.slice(-6).map((f, i) => ({
                name: `Fb ${i + 1}`,
                rating: f.rating
            }));

            setData({ radarData, trendData });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading insights...</div>;
    if (!data) return <div>No data available</div>;

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Quality Dimensions</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData}>
                            <PolarGrid stroke="#4b5563" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#9ca3af' }} />
                            <Radar name="My Projects" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Rating Trend</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                            <YAxis domain={[0, 5]} tick={{ fill: '#9ca3af' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                            <Line type="monotone" dataKey="rating" stroke="#82ca9d" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default Insights;
