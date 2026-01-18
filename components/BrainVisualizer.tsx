
import React, { useMemo } from 'react';
import { BrainRegion } from '../types';

interface BrainVisualizerProps {
  activeRegion: string;
  syncRate: number;
}

const BrainVisualizer: React.FC<BrainVisualizerProps> = ({ activeRegion, syncRate }) => {
  const regions = useMemo(() => [
    { name: BrainRegion.Prefrontal, cx: 100, cy: 100, r: 40 },
    { name: BrainRegion.Parietal, cx: 200, cy: 80, r: 35 },
    { name: BrainRegion.Occipital, cx: 280, cy: 130, r: 30 },
    { name: BrainRegion.Temporal, cx: 180, cy: 150, r: 45 },
    { name: BrainRegion.Cerebellum, cx: 250, cy: 220, r: 25 },
    { name: BrainRegion.Amygdala, cx: 160, cy: 120, r: 15 },
  ], []);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center p-4">
      <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
        {/* Brain Outlines - Placeholder style */}
        <path
          d="M 50,150 C 50,50 350,50 350,150 C 350,250 250,300 150,300 C 50,300 50,250 50,150"
          fill="none"
          stroke="rgba(34,211,238,0.1)"
          strokeWidth="2"
        />

        {/* Region Nodes */}
        {regions.map((region) => (
          <g key={region.name}>
            <circle
              cx={region.cx}
              cy={region.cy}
              r={region.r}
              fill={activeRegion === region.name ? 'rgba(34,211,238,0.2)' : 'rgba(34,211,238,0.05)'}
              stroke={activeRegion === region.name ? '#22d3ee' : 'rgba(34,211,238,0.3)'}
              strokeWidth="2"
              className="transition-all duration-500"
            />
            {activeRegion === region.name && (
              <circle
                cx={region.cx}
                cy={region.cy}
                r={region.r + 5}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1"
                className="animate-ping opacity-75"
              />
            )}
            <text
              x={region.cx}
              y={region.cy + region.r + 15}
              textAnchor="middle"
              fill={activeRegion === region.name ? '#22d3ee' : 'rgba(255,255,255,0.4)'}
              fontSize="10"
              className="pointer-events-none uppercase tracking-tighter"
            >
              {region.name}
            </text>
          </g>
        ))}

        {/* Neural Network Connections */}
        <path
          d="M 100,100 L 200,80 L 280,130 L 180,150 L 100,100 M 200,80 L 180,150 M 280,130 L 250,220"
          stroke="rgba(34,211,238,0.2)"
          strokeWidth="1"
          strokeDasharray="5,5"
          className="animate-[dash_20s_linear_infinite]"
        />
      </svg>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 font-mono text-xs text-cyan-400">
        SCAN_TYPE: SAT_LINK_V4<br/>
        SYNC_LOCK: {syncRate}%<br/>
        ENCRYPTION: AES-NEURAL
      </div>
    </div>
  );
};

export default BrainVisualizer;
