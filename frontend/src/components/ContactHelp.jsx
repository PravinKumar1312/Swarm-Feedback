import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { Upload, Send } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const ContactHelp = () => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
    });
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let mediaUrl = '';

            if (file) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const uploadRes = await api.post('/files/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                mediaUrl = uploadRes.data.url;
            }

            await api.post('/messages', {
                subject: formData.subject,
                description: formData.description,
                mediaUrl: mediaUrl
            });

            toast.success('Message sent successfully!');
            setFormData({ subject: '', description: '' });
            setFile(null);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Contact Help / Report Bug</h2>
                    <p className="text-gray-400">
                        Found a bug or need assistance? Upload a screenshot or video and describe the issue.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Upload Error, Feature Request"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Describe the issue in detail..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Attachment (Image/Video)</label>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors text-sm">
                                <Upload size={16} />
                                <span>{file ? file.name : 'Choose File'}</span>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                            </label>
                            {file && (
                                <button type="button" onClick={() => setFile(null)} className="text-xs text-red-400 hover:underline">
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                            <Send size={16} />
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default ContactHelp;
