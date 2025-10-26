import React from 'react';

export const getNumericValue = (value: string | number | undefined): number => {
  if (value === undefined || value === null || value === 'N/A') return -1;
  if (typeof value === 'number') return value;
  
  if (typeof value === 'string') {
    // Remove commas and then parse
    const cleanedString = value.replace(/,/g, '');
    const match = cleanedString.match(/[0-9.]+/);
    return match ? parseFloat(match[0]) : -1;
  }
  
  return -1;
};

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WinnerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const SpecRow: React.FC<{ label: string; value1: string | number; value2: string | number, higherIsBetter?: boolean, tooltip?: string }> = ({ label, value1, value2, higherIsBetter = true, tooltip }) => {
    const num1 = getNumericValue(value1);
    const num2 = getNumericValue(value2);
    
    let class1 = "text-gray-300";
    let class2 = "text-gray-300";
    let isP1Winner = false;
    let isP2Winner = false;

    // Only apply color comparison if higherIsBetter is not undefined, we have valid numbers, and it's not a tie
    if (higherIsBetter !== undefined && num1 !== -1 && num2 !== -1 && num1 !== num2) {
        const p1IsBetterCondition = higherIsBetter ? num1 > num2 : num1 < num2;
        
        if (p1IsBetterCondition) {
            isP1Winner = true;
            class1 = "text-teal-400 font-bold";
            class2 = "text-rose-400";
        } else {
            isP2Winner = true;
            class2 = "text-teal-400 font-bold";
            class1 = "text-rose-400";
        }
    }

    return (
        <tr className="border-b border-blue-500/10 hover:bg-gray-800/20 transition-colors duration-200">
            <td className="py-3 px-4 text-gray-400 font-medium">
                {tooltip ? (
                    <div className="relative group flex items-center cursor-help">
                        <span>{label}</span>
                        <InfoIcon />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 border border-blue-800/50 rounded-lg text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
                            {tooltip}
                        </div>
                    </div>
                ) : (
                    <span>{label}</span>
                )}
            </td>
            <td className={`py-3 px-4 text-center ${class1}`}>
                <div className="flex items-center justify-center">
                    <span>{value1}</span>
                    {isP1Winner && <WinnerIcon />}
                </div>
            </td>
            <td className={`py-3 px-4 text-center ${class2}`}>
                 <div className="flex items-center justify-center">
                    <span>{value2}</span>
                    {isP2Winner && <WinnerIcon />}
                </div>
            </td>
        </tr>
    );
};

export const SummaryCard: React.FC<{ title: string; winner: string; name1: string; name2: string; }> = ({ title, winner, name1, name2 }) => {
    const getWinnerLabel = () => {
        if (winner.toLowerCase().includes('1')) return name1;
        if (winner.toLowerCase().includes('2')) return name2;
        return 'Tie';
    };

    const winnerLabel = getWinnerLabel();
    const isTie = winnerLabel === 'Tie';

    return (
        <div className="bg-black/20 backdrop-blur-md rounded-lg p-4 flex-1 border border-blue-500/20">
            <h4 className="text-gray-400 font-semibold">{title}</h4>
            <p className={`text-xl font-bold truncate ${isTie ? 'text-yellow-400' : 'text-teal-400'}`}>
                {winnerLabel}
            </p>
        </div>
    );
};