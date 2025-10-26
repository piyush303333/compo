export const specTooltips: Record<string, string> = {
  // CPU Specs
  cores: 'The number of physical processing units. More cores generally mean better performance in multi-threaded tasks like video editing and 3D rendering.',
  threads: 'The number of independent processes a CPU can handle at once. Often double the core count with hyper-threading technology.',
  boostClock: 'The maximum speed the CPU can achieve on a single core under load for a short duration. Higher is better for gaming and responsive applications.',
  baseClock: 'The standard operating speed of the CPU when not under heavy load.',
  l3Cache: 'A high-speed memory on the CPU that stores frequently accessed data to speed up operations. Larger L3 caches can significantly improve gaming performance.',
  tdp: 'Thermal Design Power. An indicator of the heat output a CPU produces, which also relates to its power consumption. A lower TDP is more power-efficient.',
  idlePower: 'The amount of power consumed when the component is not under any significant load (e.g., at the desktop). A lower value is better for energy efficiency.',
  peakPower: 'The maximum power consumed under heavy load, like gaming or stress testing. This value is important for choosing an adequate power supply (PSU) and cooling solution. A lower value is more power-efficient.',
  socket: 'The physical connector on the motherboard that the CPU plugs into. The CPU and motherboard must have a matching socket.',
  integratedGraphics: 'A graphics processor built directly into the CPU, eliminating the need for a separate graphics card for basic display output and light tasks.',
  releaseDate: 'The date when the processor was first released to the market.',
  cinebenchR23MultiCore: 'A benchmark score representing the CPU\'s performance in multi-core rendering tasks. A higher score indicates better performance for professional workloads.',
  cinebenchR23SingleCore: 'A benchmark score representing the CPU\'s performance in single-core tasks. A higher score is important for gaming and general application responsiveness.',

  // GPU Specs
  vram: 'Video RAM. Dedicated memory for the graphics card to store textures, frame buffers, and other graphical data. More is better for higher resolutions and detailed textures.',
  memoryType: 'The type of memory used by the GPU, such as GDDR6 or GDDR6X. Newer types are generally faster and offer more bandwidth.',
  architecture: 'The underlying design and technology generation of the GPU (e.g., NVIDIA Ada Lovelace, AMD RDNA 3).',
  timeSpyGraphicsScore: 'A 3DMark benchmark score representing DirectX 12 gaming performance at 1440p resolution. Higher is better.',
  portRoyalRayTracingScore: 'A 3DMark benchmark score representing real-time ray tracing performance. A higher score indicates better visuals in games that support ray tracing.',
};