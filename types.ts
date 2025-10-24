export interface CpuSpec {
  model: string;
  cores: number | string;
  threads: number | string;
  baseClock: string;
  boostClock: string;
  tdp: string;
  l3Cache: string;
  socket: string;
  integratedGraphics: string;
  releaseDate: string;
}

export interface CpuComparison {
  cpu1: CpuSpec;
  cpu2: CpuSpec;
  summary: {
    performanceWinner: string;
    valueWinner: string;
    gamingWinner: string;
    overallRecommendation: string;
  };
}

export interface GpuSpec {
  model: string;
  vram: string;
  memoryType: string;
  boostClock: string;
  tdp: string;
  architecture: string;
  releaseDate: string;
}

export interface GpuComparison {
  gpu1: GpuSpec;
  gpu2: GpuSpec;
  summary: {
    performanceWinner: string;
    valueWinner: string;
    gamingWinner: string;
    overallRecommendation: string;
  };
}

export type ComparisonResult = CpuComparison | GpuComparison;
