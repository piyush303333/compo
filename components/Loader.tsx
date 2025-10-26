import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative w-16 h-16">
                 <div className="absolute top-0 left-0 w-6 h-6 bg-cyan-400 rounded-sm animate-spin" style={{animationDuration: '3s'}}></div>
                 <div className="absolute top-0 right-0 w-6 h-6 bg-blue-500 rounded-sm animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
                 <div className="absolute bottom-0 left-0 w-6 h-6 bg-blue-500 rounded-sm animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
                 <div className="absolute bottom-0 right-0 w-6 h-6 bg-cyan-400 rounded-sm animate-spin" style={{animationDuration: '3s'}}></div>
            </div>
            <p className="text-gray-300">Analyzing hardware...</p>
        </div>
    );
};

export default Loader;