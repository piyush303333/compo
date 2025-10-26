import React from 'react';

const ProcessorIcon = () => (
    <svg 
        className="w-10 h-10 md:w-12 md:h-12 text-cyan-400 mr-4 animate-pulse"
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <rect x="5" y="5" width="14" height="14" rx="2" ry="2"></rect>
        <line x1="9" y1="1" x2="9" y2="5"></line>
        <line x1="15" y1="1" x2="15" y2="5"></line>
        <line x1="9" y1="19" x2="9" y2="23"></line>
        <line x1="15" y1="19" x2="15" y2="23"></line>
        <line x1="1" y1="9" x2="5" y2="9"></line>
        <line x1="1" y1="15" x2="5" y2="15"></line>
        <line x1="19" y1="9" x2="23" y2="9"></line>
        <line x1="19" y1="15" x2="23" y2="15"></line>
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="text-center p-4 md:p-6 my-8">
            <div className="flex justify-center items-center">
                <ProcessorIcon />
                <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
                    CPU Pro Compare
                </h1>
            </div>
            <p className="text-gray-400 mt-2 text-md md:text-lg">
                Intelligent processor analysis powered by Gemini
            </p>
        </header>
    );
};

export default Header;