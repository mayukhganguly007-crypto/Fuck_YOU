
import React, { useMemo, useEffect, useState } from 'react';
import { SatelliteInfo } from '../types';

interface SatelliteMapProps {
  satellites: SatelliteInfo[];
  optimization: number;
}

const SatelliteMap: React.FC<SatelliteMapProps> = ({ satellites, optimization }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] glass rounded-xl overflow-hidden flex flex-col p-4">
      <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 flex justify-between">
        Orbital Cluster Status
        <span className="text-slate-500">OPT_LVL: {optimization}</span>
      </h3>
      
      <div className="flex-1 relative flex items-center justify-center">
        {/* Radar Background */}
        <div className="absolute w-48 h-48 border border-cyan-500/20 rounded-full flex items-center justify-center">
          <div className="w-32 h-32 border border-cyan-500/20 rounded-full" />
          <div className="w-16 h-16 border border-cyan-500/20 rounded-full" />
          
          {/* Radar Sweep */}
          <div 
            className="absolute w-1/2 h-px bg-gradient-to-r from-transparent to-cyan-400 origin-left"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>

        {/* Satellites */}
        {satellites.map((sat, i) => {
          const angle = (sat.azimuth * Math.PI) / 180;
          const radius = (sat.elevation / 90) * 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <div
              key={sat.id}
              className={`absolute w-2 h-2 rounded-full transition-all duration-1000 ${
                sat.status === 'online' ? 'bg-cyan-400 shadow-[0_0_8px_cyan]' : 'bg-red-500'
              }`}
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
            >
              <div className="absolute -top-6 -left-4 text-[8px] font-mono text-cyan-200 whitespace-nowrap opacity-50">
                SAT-{sat.id}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full" />
          <span>Active Uplink</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-slate-600 rounded-full" />
          <span>Low Bandwidth</span>
        </div>
      </div>
    </div>
  );
};

export default SatelliteMap;
