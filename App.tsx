
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  NeuralState, 
  SatelliteInfo, 
  BrainRegion, 
  TelemetryReport 
} from './types';
import { generateNeuralReport } from './services/geminiService';
import BrainVisualizer from './components/BrainVisualizer';
import SatelliteMap from './components/SatelliteMap';
import { 
  Activity, 
  Satellite, 
  Cpu, 
  Shield, 
  Terminal, 
  RefreshCcw, 
  Zap,
  ChevronRight,
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const App: React.FC = () => {
  const [neuralState, setNeuralState] = useState<NeuralState>({
    synapticLoad: 42,
    latency: 18,
    syncRate: 98,
    satelliteClusterCount: 4,
    activeRegion: BrainRegion.Prefrontal,
    optimizationLevel: 1
  });

  const [satellites, setSatellites] = useState<SatelliteInfo[]>([
    { id: 'ALPHA', status: 'online', strength: 0.9, azimuth: 45, elevation: 60 },
    { id: 'BETA', status: 'online', strength: 0.85, azimuth: 120, elevation: 45 },
    { id: 'GAMMA', status: 'online', strength: 0.7, azimuth: 210, elevation: 30 },
    { id: 'DELTA', status: 'optimizing', strength: 0.4, azimuth: 330, elevation: 80 },
  ]);

  const [report, setReport] = useState<TelemetryReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<{time: string, load: number}[]>([]);

  // Simulation: Update brain state
  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralState(prev => ({
        ...prev,
        synapticLoad: Math.min(100, Math.max(0, prev.synapticLoad + (Math.random() * 4 - 2))),
        latency: Math.min(200, Math.max(5, prev.latency + (Math.random() * 2 - 1))),
        syncRate: Math.min(100, Math.max(90, prev.syncRate + (Math.random() * 0.2 - 0.1))),
      }));

      setHistory(prev => {
        const next = [...prev, { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
          load: neuralState.synapticLoad 
        }];
        return next.slice(-20);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [neuralState.synapticLoad]);

  const handleOptimization = useCallback(() => {
    setNeuralState(prev => ({ ...prev, optimizationLevel: prev.optimizationLevel + 1 }));
    setSatellites(prev => prev.map(s => ({
      ...s,
      status: 'online',
      strength: Math.min(1, s.strength + 0.05)
    })));
  }, []);

  const triggerReport = async () => {
    setIsGenerating(true);
    const newReport = await generateNeuralReport(neuralState);
    setReport(newReport);
    setIsGenerating(false);
  };

  const changeRegion = (region: BrainRegion) => {
    setNeuralState(prev => ({ ...prev, activeRegion: region }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Brain-Drain</h1>
            <p className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Satellite Optimization v4.0.2</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 font-mono uppercase">Global Uplink</span>
            <span className="text-sm font-bold text-green-400">ENCRYPTED</span>
          </div>
          <button 
            onClick={handleOptimization}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
          >
            <RefreshCcw className="w-4 h-4" />
            Optimize Satellites
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Metrics & Map */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-4 rounded-xl border-l-4 border-cyan-500">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Synaptic Load</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {neuralState.synapticLoad.toFixed(1)}%
              </div>
            </div>
            <div className="glass p-4 rounded-xl border-l-4 border-fuchsia-500">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Sync Rate</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {neuralState.syncRate.toFixed(1)}%
              </div>
            </div>
          </div>

          <SatelliteMap satellites={satellites} optimization={neuralState.optimizationLevel} />

          <div className="glass p-4 rounded-xl">
             <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Neural History
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="load" 
                    stroke="#22d3ee" 
                    strokeWidth={2} 
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Center: Visualizer */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass rounded-2xl p-6 relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute top-0 right-0 p-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400">LIVE TELEMETRY</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">Cerebral Mapping</h2>
              <p className="text-sm text-slate-400">Localized via Cluster-{satellites[0].id}</p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <BrainVisualizer activeRegion={neuralState.activeRegion} syncRate={neuralState.syncRate} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-auto">
              {Object.values(BrainRegion).map(region => (
                <button
                  key={region}
                  onClick={() => changeRegion(region)}
                  className={`text-[10px] py-2 px-1 rounded border transition-all ${
                    neuralState.activeRegion === region 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                    : 'border-white/5 text-slate-500 hover:border-white/20'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Intelligence */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="glass p-6 rounded-xl flex flex-col gap-4 border-t-2 border-cyan-500/50">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                AI Analysis
              </h3>
              <button 
                onClick={triggerReport}
                disabled={isGenerating}
                className="text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 p-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {isGenerating ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            {!report && !isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mb-4">
                  <Info className="w-6 h-6 text-slate-700" />
                </div>
                <p className="text-xs text-slate-500 italic px-4">
                  Satellite relay active. Request AI verification to generate a full neural diagnostic report.
                </p>
                <button 
                   onClick={triggerReport}
                   className="mt-4 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  INITIALIZE SCAN
                </button>
              </div>
            ) : (
              <div className={`space-y-4 transition-opacity duration-500 ${isGenerating ? 'opacity-30' : 'opacity-100'}`}>
                {report && (
                  <>
                    <div className="p-3 bg-slate-900/50 rounded-lg border border-white/5">
                      <div className="text-[10px] text-slate-500 font-mono mb-2">TIMESTAMP: {report.timestamp}</div>
                      <p className="text-xs leading-relaxed text-slate-300">
                        {report.summary}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Protocol Directives</h4>
                      <ul className="space-y-2">
                        {report.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs flex gap-2 text-slate-400">
                            <span className="text-cyan-500">•</span> {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Threat Level</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          report.threatLevel === 'Low' ? 'bg-green-500/20 text-green-400' :
                          report.threatLevel === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {report.threatLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {isGenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                       <RefreshCcw className="w-6 h-6 text-cyan-500 animate-spin" />
                       <span className="text-[10px] font-mono text-cyan-500">CALCULATING NEURAL VECTORS...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto p-4 bg-cyan-950/20 border border-cyan-500/10 rounded-xl">
            <h4 className="text-[10px] font-bold text-cyan-400 uppercase mb-2">System Logs</h4>
            <div className="font-mono text-[9px] text-cyan-300/60 h-24 overflow-y-auto space-y-1">
              <div>[SYSTEM] Orbital sync established.</div>
              <div>[NEURAL] Handshake with Prefrontal cortex complete.</div>
              <div>[AUTH] Satellite ALPHA: Signal parity 0.98.</div>
              <div>[GEO] Lat: 34.0522, Long: -118.2437.</div>
              <div>[WARN] Minor interference detected on GAMMA band.</div>
              <div>[INFO] Optimizing cluster relay nodes...</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-white/5 py-8 px-6 text-center">
        <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">
          Brain-Drain Neural Satellite Interface &copy; 2025 Orbital Dynamics Corp.
        </p>
      </footer>
    </div>
  );
};

export default App;
