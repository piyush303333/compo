import React from 'react';
import type { GpuComparison, GpuSpec } from '../types';
import { SpecRow, SummaryCard } from './SharedComparisonComponents';


const GpuComparisonTable: React.FC<{ data: GpuComparison }> = ({ data }) => {
    const { gpu1, gpu2, summary } = data;

    const specOrder: { label: string; key: keyof GpuSpec; higherIsBetter?: boolean }[] = [
        { label: 'VRAM', key: 'vram', higherIsBetter: true },
        { label: 'Memory Type', key: 'memoryType', higherIsBetter: undefined },
        { label: 'Boost Clock', key: 'boostClock', higherIsBetter: true },
        { label: 'TDP', key: 'tdp', higherIsBetter: false },
        { label: 'Architecture', key: 'architecture', higherIsBetter: undefined },
        { label: 'Release Date', key: 'releaseDate', higherIsBetter: undefined },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Specs Table */}
            <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Specification</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-center">{gpu1.model}</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-center">{gpu2.model}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specOrder.map(spec => (
                            <SpecRow 
                                key={spec.key} 
                                label={spec.label} 
                                value1={gpu1[spec.key]} 
                                value2={gpu2[spec.key]}
                                higherIsBetter={spec.higherIsBetter}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Summary Section */}
            <div>
                <h3 className="text-2xl font-bold text-gray-100 mb-4">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <SummaryCard title="Performance Winner" winner={summary.performanceWinner} name1={gpu1.model} name2={gpu2.model} />
                    <SummaryCard title="Gaming Winner" winner={summary.gamingWinner} name1={gpu1.model} name2={gpu2.model} />
                    <SummaryCard title="Best Value" winner={summary.valueWinner} name1={gpu1.model} name2={gpu2.model} />
                </div>
                 <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h4 className="text-xl font-bold text-gray-200 mb-2">Overall Recommendation</h4>
                    <p className="text-gray-300 leading-relaxed">{summary.overallRecommendation}</p>
                </div>
            </div>
        </div>
    );
};

export default GpuComparisonTable;
