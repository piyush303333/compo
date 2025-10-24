import React from 'react';

export const getNumericValue = (value: string | number | undefined): number => {
  if (value === undefined) return -1;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const match = value.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : -1;
  }
  return -1;
};

export const SpecRow: React.FC<{ label: string; value1: string | number; value2: string | number, higherIsBetter?: boolean }> = ({ label, value1, value2, higherIsBetter = true }) => {
    const num1 = getNumericValue(value1);
    const num2 = getNumericValue(value2);
    
    let class1 = "text-gray-300";
    let class2 = "text-gray-300";

    // Only apply color comparison if higherIsBetter is not undefined
    if (higherIsBetter !== undefined && num1 !== -1 && num2 !== -1) {
        const p1_is_better = higherIsBetter ? num1 > num2 : num1 < num2;
        const p2_is_better = higherIsBetter ? num2 > num1 : num2 < num1;

        if (p1_is_better) {
            class1 = "text-green-400 font-bold";
            class2 = "text-red-400";
        } else if (p2_is_better) {
            class2 = "text-green-400 font-bold";
            class1 = "text-red-400";
        }
    }

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-800/50 transition-colors duration-200">
            <td className="py-3 px-4 text-gray-400 font-medium">{label}</td>
            <td className={`py-3 px-4 text-center ${class1}`}>{value1}</td>
            <td className={`py-3 px-4 text-center ${class2}`}>{value2}</td>
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
        <div className="bg-gray-800 rounded-lg p-4 flex-1">
            <h4 className="text-gray-400 font-semibold">{title}</h4>
            <p className={`text-xl font-bold ${isTie ? 'text-yellow-400' : 'text-green-400'}`}>
                {winnerLabel}
            </p>
        </div>
    );
};
