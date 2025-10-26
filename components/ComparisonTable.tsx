import React from 'react';
import type { CpuComparison, CpuSpec } from '../types';
import { SpecRow, SummaryCard } from './SharedComparisonComponents';
import { specTooltips } from '../data/specTooltips';

const ComparisonTable: React.FC<{ data: CpuComparison }> = ({ data }) => {
    const { cpu1, cpu2, summary } = data;

    const specOrder: { label: string; key: keyof CpuSpec; higherIsBetter?: boolean, tooltip?: string }[] = [
        { label: 'Cores', key: 'cores', higherIsBetter: true, tooltip: specTooltips.cores },
        { label: 'Threads', key: 'threads', higherIsBetter: true, tooltip: specTooltips.threads },
        { label: 'Boost Clock', key: 'boostClock', higherIsBetter: true, tooltip: specTooltips.boostClock },
        { label: 'Base Clock', key: 'baseClock', higherIsBetter: true, tooltip: specTooltips.baseClock },
        { label: 'L3 Cache', key: 'l3Cache', higherIsBetter: true, tooltip: specTooltips.l3Cache },
        { label: 'TDP', key: 'tdp', higherIsBetter: false, tooltip: specTooltips.tdp },
        { label: 'Idle Power', key: 'idlePower', higherIsBetter: false, tooltip: specTooltips.idlePower },
        { label: 'Peak Power Draw', key: 'peakPower', higherIsBetter: false, tooltip: specTooltips.peakPower },
        { label: 'Socket', key: 'socket', higherIsBetter: undefined, tooltip: specTooltips.socket },
        { label: 'Integrated Graphics', key: 'integratedGraphics', higherIsBetter: undefined, tooltip: specTooltips.integratedGraphics },
        { label: 'Release Date', key: 'releaseDate', higherIsBetter: undefined, tooltip: specTooltips.releaseDate },
    ];
    
    const benchmarkOrder: { label: string; key: keyof CpuSpec; higherIsBetter?: boolean, tooltip?: string }[] = [
        { label: 'Cinebench R23 (Multi)', key: 'cinebenchR23MultiCore', higherIsBetter: true, tooltip: specTooltips.cinebenchR23MultiCore },
        { label: 'Cinebench R23 (Single)', key: 'cinebenchR23SingleCore', higherIsBetter: true, tooltip: specTooltips.cinebenchR23SingleCore },
    ];


    return (
        <div className="space-y-8 animate-fade-in">
            {/* Specs Table */}
            <div className="bg-black/20 backdrop-blur-md rounded-lg overflow-hidden border border-blue-500/20">
                <table className="w-full text-left">
                    <thead className="bg-black/30">
                        <tr>
                            <th className="py-3 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Specification</th>
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
                                tooltip={spec.tooltip}
                            />
                        ))}

                        {/* Benchmark Section */}
                        <tr className="bg-black/20">
                            <td colSpan={3} className="py-2 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Benchmarks</td>
                        </tr>

                        {benchmarkOrder.map(spec => (
                            <SpecRow 
                                key={spec.key} 
                                label={spec.label} 
                                value1={cpu1[spec.key]} 
                                value2={cpu2[spec.key]} 
                                higherIsBetter={spec.higherIsBetter}
                                tooltip={spec.tooltip}
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
                 <div className="bg-black/20 backdrop-blur-md rounded-lg p-6 border border-blue-500/20">
                    <h4 className="text-xl font-bold text-gray-200 mb-2">Overall Recommendation</h4>
                    <p className="text-gray-300 leading-relaxed">{summary.overallRecommendation}</p>
                </div>
            </div>
        </div>
    );
};

export default ComparisonTable;