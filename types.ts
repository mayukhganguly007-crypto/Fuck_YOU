
export interface NeuralState {
  synapticLoad: number;
  latency: number;
  syncRate: number;
  satelliteClusterCount: number;
  activeRegion: string;
  optimizationLevel: number;
}

export interface SatelliteInfo {
  id: string;
  status: 'online' | 'optimizing' | 'offline';
  strength: number;
  azimuth: number;
  elevation: number;
}

export enum BrainRegion {
  Prefrontal = 'Prefrontal Cortex',
  Parietal = 'Parietal Lobe',
  Occipital = 'Occipital Lobe',
  Temporal = 'Temporal Lobe',
  Cerebellum = 'Cerebellum',
  Amygdala = 'Amygdala'
}

export interface TelemetryReport {
  timestamp: string;
  summary: string;
  recommendations: string[];
  threatLevel: 'Low' | 'Moderate' | 'Critical';
}
