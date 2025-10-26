import React, { useState, useCallback, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import ComparisonTable from './components/ComparisonTable';
import GpuComparisonTable from './components/GpuComparisonTable';
import AutocompleteInput from './components/AutocompleteInput';
import { compareCpus, compareGpus } from './services/geminiService';
import type { ComparisonResult, CpuComparison, GpuComparison } from './types';
import { cpuModelNames, gpuModelNames } from './data/hardwareData';


type Mode = 'cpu' | 'gpu';

const cpuPresets = [
  { id: 'cpu-high', label: 'i9-14900K vs 7950X', cpu1: 'Intel Core i9-14900K', cpu2: 'AMD Ryzen 9 7950X' },
  { id: 'cpu-mid', label: 'i5-14600K vs 7800X3D', cpu1: 'Intel Core i5-14600K', cpu2: 'AMD Ryzen 7 7800X3D' },
  { id: 'cpu-budget', label: 'i3-14100 vs 7600', cpu1: 'Intel Core i3-14100', cpu2: 'AMD Ryzen 5 7600' },
];

const gpuPresets = [
  { id: 'gpu-high', label: 'RTX 4090 vs 7900 XTX', gpu1: 'NVIDIA GeForce RTX 4090', gpu2: 'AMD Radeon RX 7900 XTX' },
  { id: 'gpu-mid', label: 'RTX 4070 Super vs 7800 XT', gpu1: 'NVIDIA GeForce RTX 4070 Super', gpu2: 'AMD Radeon RX 7800 XT' },
  { id: 'gpu-budget', label: 'RTX 4060 vs 7600', gpu1: 'NVIDIA GeForce RTX 4060', gpu2: 'AMD Radeon RX 7600' },
];


const App: React.FC = () => {
    const [mode, setMode] = useState<Mode>('cpu');

    // CPU state
    const [cpu1, setCpu1] = useState<string>('Intel Core i9-14900K');
    const [cpu2, setCpu2] = useState<string>('AMD Ryzen 9 7950X');

    // GPU state
    const [gpu1, setGpu1] = useState<string>('NVIDIA GeForce RTX 4090');
    const [gpu2, setGpu2] = useState<string>('AMD Radeon RX 7900 XTX');

    const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [inputErrors, setInputErrors] = useState<Record<string, string | undefined>>({});

    const validateInput = (name: string): string | null => {
        const trimmedName = name.trim();
        if (trimmedName === '') {
            return "Model name cannot be empty.";
        }
        if (trimmedName.length < 3) {
            return "Model name seems too short. Please enter a valid model.";
        }
        if (trimmedName.length > 50) {
            return "Model name seems too long.";
        }
        return null;
    };

    const handleModeChange = (newMode: Mode) => {
        if (mode === newMode) return;
        setMode(newMode);
        setComparisonResult(null);
        setError(null);
        setInputErrors({});
    };

    const handlePresetSelect = (preset: (typeof cpuPresets[0] | typeof gpuPresets[0])) => {
        if (mode === 'cpu' && 'cpu1' in preset) {
            setCpu1(preset.cpu1);
            setCpu2(preset.cpu2);
        } else if (mode === 'gpu' && 'gpu1' in preset) {
            setGpu1(preset.gpu1);
            setGpu2(preset.gpu2);
        }
        setInputErrors({});
    };

    const handleCompare = useCallback(async () => {
        setError(null);
        setComparisonResult(null);
        
        const newErrors: Record<string, string | undefined> = {};
        let hasError = false;

        const inputsToValidate = mode === 'cpu' ? { cpu1, cpu2 } : { gpu1, gpu2 };
        
        for (const [key, value] of Object.entries(inputsToValidate)) {
            const err = validateInput(value);
            if (err) {
                newErrors[key] = err;
                hasError = true;
            }
        }

        setInputErrors(newErrors);

        if (hasError) {
            return;
        }

        setIsLoading(true);
        try {
            if (mode === 'cpu') {
                const result = await compareCpus(cpu1, cpu2);
                setComparisonResult(result);
            } else { // mode === 'gpu'
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
    
    const handleInputChange = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        errorKey: string
    ) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setter(e.target.value);
        if (inputErrors[errorKey]) {
            setInputErrors(prev => ({ ...prev, [errorKey]: undefined }));
        }
    };

    const handleSuggestionSelect = (
        setter: React.Dispatch<React.SetStateAction<string>>,
        errorKey: string
    ) => (suggestion: string) => {
        setter(suggestion);
        if (inputErrors[errorKey]) {
            setInputErrors(prev => ({ ...prev, [errorKey]: undefined }));
        }
    };

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
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 focus:outline-none ${
                    isActive
                        ? 'text-cyan-300'
                        : 'text-gray-400 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
            >
                {children}
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"></span>}
            </button>
        );
    }

    return (
        <div className="min-h-screen font-sans flex flex-col items-center p-4">
            <Header />
            <main className="flex-grow w-full max-w-5xl">
                <div className="relative bg-black/30 backdrop-blur-xl rounded-2xl glow-border">
                    <div className="flex border-b border-blue-500/20 px-6">
                        <TabButton targetMode="cpu">CPU Compare</TabButton>
                        <TabButton targetMode="gpu">GPU Compare</TabButton>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="space-y-6 mb-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Load an example comparison
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {(mode === 'cpu' ? cpuPresets : gpuPresets).map((preset) => (
                                        <button
                                            key={preset.id}
                                            onClick={() => handlePresetSelect(preset)}
                                            className="px-3 py-1 text-xs border border-blue-800/50 bg-blue-900/20 hover:bg-blue-800/40 text-gray-300 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {mode === 'cpu' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AutocompleteInput
                                        id="cpu1"
                                        label="Processor 1"
                                        value={cpu1}
                                        onChange={handleInputChange(setCpu1, 'cpu1')}
                                        onSuggestionClick={handleSuggestionSelect(setCpu1, 'cpu1')}
                                        suggestions={cpuModelNames}
                                        placeholder="e.g., Ryzen 9 7950X"
                                        error={inputErrors.cpu1}
                                    />
                                    <AutocompleteInput
                                        id="cpu2"
                                        label="Processor 2"
                                        value={cpu2}
                                        onChange={handleInputChange(setCpu2, 'cpu2')}
                                        onSuggestionClick={handleSuggestionSelect(setCpu2, 'cpu2')}
                                        suggestions={cpuModelNames}
                                        placeholder="e.g., Intel Core i9-14900K"
                                        error={inputErrors.cpu2}
                                    />
                                </div>
                            )}

                            {mode === 'gpu' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AutocompleteInput
                                        id="gpu1"
                                        label="Graphics Card 1"
                                        value={gpu1}
                                        onChange={handleInputChange(setGpu1, 'gpu1')}
                                        onSuggestionClick={handleSuggestionSelect(setGpu1, 'gpu1')}
                                        suggestions={gpuModelNames}
                                        placeholder="e.g., GeForce RTX 4090"
                                        error={inputErrors.gpu1}
                                    />
                                    <AutocompleteInput
                                        id="gpu2"
                                        label="Graphics Card 2"
                                        value={gpu2}
                                        onChange={handleInputChange(setGpu2, 'gpu2')}
                                        onSuggestionClick={handleSuggestionSelect(setGpu2, 'gpu2')}
                                        suggestions={gpuModelNames}
                                        placeholder="e.g., Radeon RX 7900 XTX"
                                        error={inputErrors.gpu2}
                                    />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleCompare}
                            disabled={!canCompare}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-cyan-300/50 disabled:transform-none shadow-lg shadow-blue-600/20"
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
                        <div className="text-center text-gray-500 p-8 bg-black/10 rounded-lg">
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