
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import VideoPanel from '../../components/session/VideoPanel';
import ChatPanel from '../../components/session/ChatPanel';
import Whiteboard from '../../components/session/Whiteboard';

const SessionPage: React.FC = () => {
    const { sessionId } = useParams();

    return (
        <div className="bg-neutral-900 min-h-screen flex flex-col text-white">
            <Header />
            <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="bg-neutral-800 p-2 rounded-lg mb-4">
                    <h1 className="text-xl font-bold">Grade 8 Mathematics Session</h1>
                    <p className="text-sm text-neutral-400">Session ID: {sessionId}</p>
                </div>
                <div className="flex flex-col lg:flex-row gap-4 flex-grow h-[calc(100vh-150px)]">
                    {/* Main Content: Video + Whiteboard */}
                    <main className="flex-grow lg:w-3/4 flex flex-col gap-4">
                       <VideoPanel />
                       <Whiteboard />
                    </main>

                    {/* Sidebar: Chat */}
                    <aside className="lg:w-1/4 h-full">
                        <ChatPanel />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default SessionPage;
