import React from 'react';
import Sidebar from './Sidebar';
import Background3D from '../ui/Background3D';

const MainLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(true); // Default collapsed as per request

    return (
        <div className="min-h-screen text-white selection:bg-purple-500/30 relative flex">
            <Background3D />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-purple-900/20 to-slate-900/80 pointer-events-none -z-10"></div>

            <Sidebar isCollapsed={isCollapsed} toggleCollapsed={() => setIsCollapsed(!isCollapsed)} />

            <main className={`flex-1 min-h-screen relative z-10 transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20 md:pt-12">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
