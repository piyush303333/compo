
import React from 'react';
import type { CpuComparison, CpuSpec } from '../types';
import { SpecRow, SummaryCard } from './SharedComparisonComponents';

const ComparisonTable: React.FC<{ data: CpuComparison }> = ({ data }) => {
    const { cpu1, cpu2, summary } = data;

    const specOrder: { label: string; key: keyof CpuSpec; higherIsBetter?: boolean }[] = [
        { label: 'Cores', key: 'cores', higherIsBetter: true },
        { label: 'Threads', key: 'threads', higherIsBetter: true },
        { label: 'Boost Clock', key: 'boostClock', higherIsBetter: true },
        { label: 'Base Clock', key: 'baseClock', higherIsBetter: true },
        { label: 'L3 Cache', key: 'l3Cache', higherIsBetter: true },
        { label: 'TDP', key: 'tdp', higherIsBetter: false },
        { label: 'Socket', key: 'socket', higherIsBetter: undefined },
        { label: 'Integrated Graphics', key: 'integratedGraphics', higherIsBetter: undefined },
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
                            <th className="py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-center">{cpu1.model}</th>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-center">{cpu2.model}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {specOrder.map(spec => (
                            <SpecRow 
                                key={spec.key} 
                                label={spec.label} 
                                value1={cpu1[spec.key]} 
                                value2={cpu2[spec.key]} 
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
                    <SummaryCard title="Performance Winner" winner={summary.performanceWinner} name1={cpu1.model} name2={cpu2.model} />
                    <SummaryCard title="Gaming Winner" winner={summary.gamingWinner} name1={cpu1.model} name2={cpu2.model} />
                    <SummaryCard title="Best Value" winner={summary.valueWinner} name1={cpu1.model} name2={cpu2.model} />
                </div>
                 <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h4 className="text-xl font-bold text-gray-200 mb-2">Overall Recommendation</h4>
                    <p className="text-gray-300 leading-relaxed">{summary.overallRecommendation}</p>
                </div>
            </div>
        </div>
    );
};

export default ComparisonTable;
