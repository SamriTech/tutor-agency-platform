
import React from 'react';

const ChatPanel: React.FC = () => {
    return (
        <div className="bg-neutral-800 rounded-lg p-4 h-full flex flex-col">
            <h2 className="text-lg font-bold mb-4 border-b border-neutral-700 pb-2">Session Chat</h2>
            <div className="flex-grow space-y-4 overflow-y-auto pr-2">
                {/* Messages */}
                <div className="text-sm">
                    <p className="font-semibold text-primary-light">Abebe (Tutor)</p>
                    <div className="bg-primary p-2 rounded-lg mt-1 inline-block">
                        Hi! Welcome to our session. Are you ready to start with algebra?
                    </div>
                </div>
                 <div className="text-sm text-right">
                    <p className="font-semibold text-secondary">You</p>
                    <div className="bg-secondary p-2 rounded-lg mt-1 inline-block text-left">
                        Yes, I'm ready! I had some trouble with question 5 on the worksheet.
                    </div>
                </div>
                 <div className="text-sm">
                    <p className="font-semibold text-primary-light">Abebe (Tutor)</p>
                    <div className="bg-primary p-2 rounded-lg mt-1 inline-block">
                        Great, let's take a look at it together on the whiteboard.
                    </div>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <input type="text" placeholder="Type a message..." className="flex-grow bg-neutral-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <button className="bg-primary px-4 py-2 rounded-full text-sm font-semibold">Send</button>
            </div>
        </div>
    );
};

export default ChatPanel;
