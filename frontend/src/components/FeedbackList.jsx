import React from 'react';

const FeedbackList = ({ feedbacks }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Feedback</h2>
            {feedbacks.length === 0 ? (
                <p className="text-gray-500">No feedback yet.</p>
            ) : (
                <ul className="space-y-4">
                    {feedbacks.map((feedback) => (
                        <li key={feedback.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <p className="text-gray-700">{feedback.content}</p>
                            <span className="text-xs text-gray-400 mt-1 block">
                                {new Date(feedback.createdAt).toLocaleString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FeedbackList;
