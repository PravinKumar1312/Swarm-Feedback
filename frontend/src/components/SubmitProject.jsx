import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubmissionForm from './SubmissionForm';

const SubmitProject = () => {
    const navigate = useNavigate();

    const handleSubmissionCreate = () => {
        // Redirect to history page after successful submission
        navigate('/history');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <SubmissionForm onSubmissionCreate={handleSubmissionCreate} />
        </div>
    );
};

export default SubmitProject;
