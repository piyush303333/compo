import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import ComparisonTable from './components/ComparisonTable';
import GpuComparisonTable from './components/GpuComparisonTable';
import { compareCpus, compareGpus } from './services/geminiService';
import type { ComparisonResult, CpuComparison, GpuComparison } from './types';

type Mode = 'cpu' | 'gpu';

const App: React.FC = () => {
    const [mode, setMode] = useState<Mode>('cpu');

    // CPU state
    const [cpu1, setCpu1] = useState<string>('Ryzen 7 7800X3D');
    const [cpu2, setCpu2] = useState<string>('Intel Core i9-13900K');

    // GPU state
    const [gpu1, setGpu1] = useState<string>('GeForce RTX 4080');
    const [gpu2, setGpu2] = useState<string>('Radeon RX 7900 XTX');

    const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleModeChange = (newMode: Mode) => {
        if (mode === newMode) return;
        setMode(newMode);
        setComparisonResult(null);
        setError(null);
    };

    const handleCompare = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setComparisonResult(null);

        try {
            if (mode === 'cpu') {
                if (!cpu1 || !cpu2) {
                    setError("Please enter both CPU models to compare.");
                    return;
                }
                const result = await compareCpus(cpu1, cpu2);
                setComparisonResult(result);
            } else { // mode === 'gpu'
                if (!gpu1 || !gpu2) {
                    setError("Please enter both GPU models to compare.");
                    return;
                }
                const result = await compareGpus(gpu1, gpu2);
                setComparisonResult(result);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [mode, cpu1, cpu2, gpu1, gpu2]);

    const canCompare = useMemo(() => {
        if (isLoading) return false;
        if (mode === 'cpu') {
            return cpu1.trim() !== '' && cpu2.trim() !== '';
        }
        return gpu1.trim() !== '' && gpu2.trim() !== '';
    }, [isLoading, mode, cpu1, cpu2, gpu1, gpu2]);
    
    const TabButton: React.FC<{ targetMode: Mode, children: React.ReactNode }> = ({ targetMode, children }) => {
        const isActive = mode === targetMode;
        return (
            <button
                onClick={() => handleModeChange(targetMode)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none ${
                    isActive
                        ? 'bg-gray-800/50 text-blue-400 border-b-2 border-blue-400'
                        : 'text-gray-400 hover:text-gray-200'
                }`}
                aria-current={isActive ? 'page' : undefined}
            >
                {children}
            </button>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
                <div className="bg-gray-800/50 rounded-xl shadow-2xl border border-gray-700">
                    <div className="flex border-b border-gray-700 px-6">
                        <TabButton targetMode="cpu">CPU Compare</TabButton>
                        <TabButton targetMode="gpu">GPU Compare</TabButton>
                    </div>

                    <div className="p-6 md:p-8">
                        {mode === 'cpu' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="cpu1" className="block text-sm font-medium text-gray-400 mb-2">Processor 1</label>
                                    <input id="cpu1" type="text" value={cpu1} onChange={(e) => setCpu1(e.target.value)} placeholder="e.g., Ryzen 9 7950X" className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                </div>
                                <div>
                                    <label htmlFor="cpu2" className="block text-sm font-medium text-gray-400 mb-2">Processor 2</label>
                                    <input id="cpu2" type="text" value={cpu2} onChange={(e) => setCpu2(e.target.value)} placeholder="e.g., Intel Core i9-14900K" className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                </div>
                            </div>
                        )}

                        {mode === 'gpu' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label htmlFor="gpu1" className="block text-sm font-medium text-gray-400 mb-2">Graphics Card 1</label>
                                    <input id="gpu1" type="text" value={gpu1} onChange={(e) => setGpu1(e.target.value)} placeholder="e.g., GeForce RTX 4090" className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                </div>
                                <div>
                                    <label htmlFor="gpu2" className="block text-sm font-medium text-gray-400 mb-2">Graphics Card 2</label>
                                    <input id="gpu2" type="text" value={gpu2} onChange={(e) => setGpu2(e.target.value)} placeholder="e.g., Radeon RX 7900 XTX" className="w-full bg-gray-700 text-gray-200 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleCompare}
                            disabled={!canCompare}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                        >
                            {isLoading ? 'Comparing...' : `Compare ${mode.toUpperCase()}s`}
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    {isLoading && <Loader />}
                    {error && <ErrorDisplay message={error} />}
                    
                    {comparisonResult && 'cpu1' in comparisonResult && (
                        <ComparisonTable data={comparisonResult as CpuComparison} />
                    )}
                    {comparisonResult && 'gpu1' in comparisonResult && (
                         <GpuComparisonTable data={comparisonResult as GpuComparison} />
                    )}

                    {!isLoading && !error && !comparisonResult && (
                        <div className="text-center text-gray-500 p-8 bg-gray-800/30 rounded-lg">
                            <h2 className="text-2xl text-gray-400 mb-2">Ready to Compare?</h2>
                            <p>Enter two {mode.toUpperCase()} models above and click "Compare" to see a detailed analysis.</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
