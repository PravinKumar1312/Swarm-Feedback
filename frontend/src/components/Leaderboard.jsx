import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from './ui/Card';
import { Trophy, Medal, Award, User } from 'lucide-react';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/users/leaderboard').then(res => {
            setUsers(res.data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-white text-center py-8">Loading leaderboard...</div>

    return (
        <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Trophy className="text-yellow-400" /> Top Reviewers
            </h2>
            <div className="space-y-4">
                {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-500/30 transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg
                                ${index === 0 ? 'bg-yellow-500 text-black' :
                                    index === 1 ? 'bg-gray-300 text-black' :
                                        index === 2 ? 'bg-orange-500 text-black' : 'bg-gray-700 text-white'}`}>
                                {index + 1}
                            </div>
                            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border border-white/20">
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={20} /></div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-white font-medium">{user.username}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${user.level === 'Gold' ? 'bg-yellow-500/20 text-yellow-300' :
                                        user.level === 'Silver' ? 'bg-gray-300/20 text-gray-300' :
                                            'bg-orange-500/20 text-orange-300'
                                    }`}>
                                    {user.level || 'Bronze'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-400 font-bold text-xl">{user.points}</p>
                            <p className="text-xs text-gray-400">Points</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default Leaderboard;
