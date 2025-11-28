import api from './api';

const getAllFeedback = () => {
    return api.get('/feedback');
};

const createFeedback = (feedback) => {
    return api.post('/feedback', feedback);
};

const FeedbackService = {
    getAllFeedback,
    createFeedback,
};

export default FeedbackService;
