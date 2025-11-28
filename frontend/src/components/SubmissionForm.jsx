import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const SubmissionForm = ({ onSubmissionCreate }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        fileUrls: [''] // Start with one empty URL field
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);

    const handleUrlChange = (index, value) => {
        const newUrls = [...formData.fileUrls];
        newUrls[index] = value;
        setFormData({ ...formData, fileUrls: newUrls });
    };

    const addUrlField = () => {
        setFormData({ ...formData, fileUrls: [...formData.fileUrls, ''] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            // Filter out empty URLs
            const cleanedData = {
                ...formData,
                fileUrls: formData.fileUrls.filter(url => url.trim() !== '')
            };

            await api.post('/submissions', cleanedData);
            setMessage({ type: 'success', text: 'Project submitted successfully!' });
            setFormData({ title: '', description: '', fileUrls: [''] });
            if (onSubmissionCreate) onSubmissionCreate();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to submit project. Please try again.' });
            console.error('Error submitting project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Submit a Project</h2>
                <p className="text-gray-300">Share your work to get feedback from the community.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="e.g., REST API Design"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                        placeholder="Describe what you need feedback on..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">File/Resource URLs</label>
                    {formData.fileUrls.map((url, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                placeholder="https://..."
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addUrlField}
                        className="text-sm text-blue-400 hover:text-blue-300"
                    >
                        + Add another URL
                    </button>
                </div>

                {message && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-medium">{message.text}</span>
                    </div>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                        {isSubmitting ? 'Submitting...' : <><Upload size={18} /> Submit Project</>}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default SubmissionForm;
