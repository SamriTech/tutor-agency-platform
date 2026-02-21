
import React from 'react';

const Whiteboard: React.FC = () => {
    return (
        <div className="bg-white rounded-lg p-4 flex-grow text-black flex flex-col">
            <h3 className="font-bold mb-2">Collaborative Whiteboard</h3>
            <textarea 
                className="w-full h-full flex-grow resize-none border-2 border-neutral-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Start typing or drawing here..."
            ></textarea>
        </div>
    );
};

export default Whiteboard;
