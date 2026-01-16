import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Background3D from '../ui/Background3D';
import { useAuth } from '../../context/AuthContext';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { toast } from 'react-hot-toast';

const MainLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const { currentUser, refreshUser } = useAuth();

    useEffect(() => {
        let stompClient = null;
        if (currentUser?.id) {
            // NOTE: In production, URL should be dynamic
            const socket = new SockJS('http://localhost:8082/ws/notifications');
            stompClient = Stomp.over(socket);
            stompClient.debug = () => { }; // Disable debug logs

            stompClient.connect({}, () => {
                stompClient.subscribe('/topic/user/' + currentUser.id, (message) => {
                    // Check if message body is JSON
                    let msg = "You have received new feedback!";
                    try {
                        // backend sends: Map("type", "NEW_FEEDBACK", "submissionId", ...)
                        // STOMP body is stringified JSON
                        const body = JSON.parse(message.body);
                        if (body.type === 'NEW_FEEDBACK') {
                            msg = "New feedback received on your project!";
                        }
                    } catch (e) {
                        // ignore
                    }

                    refreshUser(); // Update submitter stats instantly

                    toast(msg, {
                        icon: '🔔',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                        duration: 5000
                    });
                });
            });
        }

        return () => {
            if (stompClient && stompClient.connected) stompClient.disconnect();
        }
    }, [currentUser]);

    return (
        <div className="min-h-screen text-white selection:bg-purple-500/30 relative flex">
            <Background3D />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-purple-900/20 to-slate-900/80 pointer-events-none -z-10"></div>

            <Sidebar isCollapsed={isCollapsed} toggleCollapsed={() => setIsCollapsed(!isCollapsed)} />

            <main className="flex-1 min-h-screen relative z-10 transition-all duration-300 md:ml-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20 md:pt-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
