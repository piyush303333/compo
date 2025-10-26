import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSuggestionClick: (suggestion: string) => void;
    suggestions: string[];
    placeholder?: string;
    error?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    id,
    label,
    value,
    onChange,
    onSuggestionClick,
    suggestions,
    placeholder,
    error,
}) => {
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userInput = e.currentTarget.value;
        if (userInput) {
            const newFiltered = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(userInput.toLowerCase())
            );
            setFilteredSuggestions(newFiltered.slice(0, 8)); // Limit suggestions
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
        onChange(e); // Propagate to parent
        setActiveSuggestionIndex(-1);
    };

    const handleSuggestionClick = (suggestion: string) => {
        onSuggestionClick(suggestion);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (showSuggestions && filteredSuggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestionIndex(prev =>
                    prev < filteredSuggestions.length - 1 ? prev + 1 : prev
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : 0));
            } else if (e.key === 'Enter') {
                if (activeSuggestionIndex > -1) {
                    e.preventDefault();
                    handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
                }
            } else if (e.key === 'Escape') {
                setShowSuggestions(false);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const inputClass = `w-full bg-black/20 text-gray-200 border rounded-md py-2 px-3 focus:outline-none focus:ring-2 transition ${
        error
            ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
            : 'border-blue-800/50 focus:ring-cyan-500 focus:border-cyan-500'
    }`;

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
            <div ref={wrapperRef} className="relative">
                <input
                    id={id}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={inputClass}
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-controls={`${id}-suggestions`}
                />
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <ul
                        id={`${id}-suggestions`}
                        className="absolute z-10 w-full bg-gray-900/80 backdrop-blur-md border border-blue-800/50 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg"
                        role="listbox"
                    >
                        {filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={suggestion}
                                className={`px-3 py-2 cursor-pointer text-gray-300 hover:bg-cyan-600/30 ${
                                    index === activeSuggestionIndex ? 'bg-cyan-600/30' : ''
                                }`}
                                onClick={() => handleSuggestionClick(suggestion)}
                                onMouseEnter={() => setActiveSuggestionIndex(index)}
                                role="option"
                                aria-selected={index === activeSuggestionIndex}
                            >
                                {suggestion}
                            </li>
                        ))}
                    </ul>
                )}
                {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
            </div>
        </div>
    );
};

export default AutocompleteInput;