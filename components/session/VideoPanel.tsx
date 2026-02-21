
import React from 'react';

const VideoPanel: React.FC = () => {
    return (
        <div className="bg-black rounded-lg p-4 flex-grow h-1/2 flex items-center justify-center relative">
             <div className="grid grid-cols-2 gap-2 w-full h-full">
                {/* Main Speaker (Tutor) */}
                <div className="bg-neutral-700 rounded-md flex flex-col items-center justify-center">
                    <p className="font-bold">Tutor's Video</p>
                    <p className="text-sm text-neutral-400">(Placeholder)</p>
                </div>
                {/* Student */}
                <div className="bg-neutral-700 rounded-md flex flex-col items-center justify-center">
                    <p className="font-bold">Student's Video</p>
                    <p className="text-sm text-neutral-400">(Placeholder)</p>
                </div>
             </div>
             {/* Controls */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-700/50 backdrop-blur-sm p-2 rounded-full flex gap-4">
                <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center" title="End Call">📞</button>
                <button className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center" title="Mute">🎤</button>
                <button className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center" title="Stop Video">📹</button>
                <button className="w-10 h-10 bg-neutral-600 rounded-full flex items-center justify-center" title="Share Screen">🖥️</button>
            </div>
        </div>
    );
};

export default VideoPanel;
