import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Server, ShieldCheck, Zap, Activity, Pickaxe,
  Users, ShoppingBag, Monitor, Smartphone, Play, Square,
  Shield, Clock
} from 'lucide-react';

// ==========================================
// KONSTANTE
// ==========================================
const BASE_PICO_REWARD = 100;
const KYC_MINING_BOOST = 2;
const NODE_BOOST = 1.5;

// ==========================================
// NODE SIMULATOR (Desktop strana)
// ==========================================
const NodeSimulator = ({ onStatusChange, isActive }) => {
  const [blockHeight, setBlockHeight] = useState(124500);
  const [dockerStatus, setDockerStatus] = useState('STOPPED');
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);
  const consensusInterval = useRef(null);

  // Auto-scroll na nove logove
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Cleanup intervala
  useEffect(() => {
    return () => {
      if (consensusInterval.current) clearInterval(consensusInterval.current);
    };
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time: timestamp, msg: message, type }].slice(-20));
  };

  const startConsensus = () => {
    consensusInterval.current = setInterval(() => {
      setBlockHeight(prev => {
        const newHeight = prev + 1;
        if (newHeight % 5 === 0) {
          addLog(`SCP Consensus: Block #${newHeight}`, 'info');
        }
        return newHeight;
      });
    }, 3000);
  };

  const toggleNode = () => {
    if (isActive) {
      // Zaustavljanje
      onStatusChange(false);
      setDockerStatus('STOPPED');
      clearInterval(consensusInterval.current);
      addLog('Node Service Stopped.', 'warning');
    } else {
      // Pokretanje
      setDockerStatus('STARTING');
      addLog('Initializing Pi Node Interface...', 'info');
      setTimeout(() => {
        setDockerStatus('RUNNING');
        onStatusChange(true);
        addLog('Docker container started.', 'success');
        addLog('Connected to Testnet.', 'success');
        startConsensus();
      }, 2000);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 p-6 rounded-xl border border-slate-700 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Server className="text-purple-400" /> Node Terminal
        </h2>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
          {isActive ? 'SYNCED' : 'OFFLINE'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <div className="text-slate-400 text-xs uppercase">Block Height</div>
          <div className="text-2xl font-mono text-blue-400">#{blockHeight}</div>
        </div>
        <button
          onClick={toggleNode}
          className={`p-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isActive ? <><Square size={18}/> STOP NODE</> : <><Play size={18}/> START NODE</>}
        </button>
      </div>

      <div className="flex-1 bg-black rounded-lg border border-slate-700 p-3 overflow-hidden flex flex-col font-mono text-xs">
        <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1">System Logs</div>
        <div className="overflow-y-auto flex-1 space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-slate-600">[{log.time}]</span>
              <span className={
                log.type === 'error' ? 'text-red-400' :
                log.type === 'success' ? 'text-green-400' :
                log.type === 'warning' ? 'text-yellow-400' :
                'text-slate-300'
              }>
                {log.msg}
              </span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500 text-center">
        Running this Node boosts your mobile mining rate by x{NODE_BOOST}!
      </div>
    </div>
  );
};

// ==========================================
// PICO LOGO
// ==========================================
const PicoLogo = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`${className} drop-shadow-xl`}>
    <circle cx="60" cy="60" r="58" fill="url(#logoGradient)" stroke="white" strokeWidth="2" />
    <path d="M35 45 H85 M45 45 V80 M75 45 V80" stroke="white" strokeWidth="8" strokeLinecap="round" />
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="120" y2="120">
        <stop offset="0%" stopColor="#4338ca" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
    </defs>
  </svg>
);

// ==========================================
// MOBILE APP SIMULATOR
// ==========================================
const PicoApp = ({ isNodeRunning }) => {
  const [activeTab, setActiveTab] = useState('mine');

  // LocalStorage persistence
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('pico_balance');
    return saved ? parseFloat(saved) : 12500.00;
  });

  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('pico_energy');
    return saved ? parseInt(saved) : 85;
  });

  const [username, setUsername] = useState(() => {
    return localStorage.getItem('pico_username') || 'Guest';
  });

  const kycStatus = 'verified';

  // Računanje mining rate-a
  let miningRate = BASE_PICO_REWARD;
  if (kycStatus === 'verified') miningRate *= KYC_MINING_BOOST;
  if (isNodeRunning) miningRate *= NODE_BOOST;

  const formatPico = (num) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(num);

  // Spremanje u localStorage
  useEffect(() => {
    localStorage.setItem('pico_balance', balance);
    localStorage.setItem('pico_energy', energy);
    localStorage.setItem('pico_username', username);
  }, [balance, energy, username]);

  // Regeneracija energije
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, 100));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMine = () => {
    if (energy < 10) return;
    setEnergy(prev => prev - 10);
    setBalance(prev => prev + miningRate);
  };

  return (
    <div className="bg-slate-900 h-full rounded-xl border border-slate-700 relative overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <div className="bg-slate-800/80 backdrop-blur p-4 flex justify-between items-center border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">P</div>
          <div className="flex flex-col">
            <div className="text-white font-bold text-sm">PiCo Network</div>
            <div className="text-[10px] text-slate-400">Hi, {username}</div>
          </div>
        </div>
        <div className="bg-slate-900 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2">
          <Zap size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-white font-mono">{formatPico(balance)}</span>
        </div>
      </div>

      {/* Energy Bar */}
      <div className="mx-4 mt-4">
        <div className="bg-slate-800 p-1 rounded-full border border-slate-700">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300" style={{ width: `${energy}%` }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'mine' && (
          <div className="space-y-6">
            {/* Mining Button */}
            <div className="flex flex-col items-center justify-center py-6">
              <button
                onClick={handleMine}
                disabled={energy < 10}
                className="relative group active:scale-95 transition-transform disabled:opacity-60"
              >
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 group-hover:opacity-40 rounded-full transition-opacity" />
                <PicoLogo size={180} />
                {energy < 10 && (
                  <div className="absolute inset-0 flex items-center justify-center text-red-400 font-bold bg-black/50 rounded-full backdrop-blur-[2px]">
                    Recharging...
                  </div>
                )}
              </button>
              <div className="mt-6 text-center">
                <div className="text-3xl font-bold text-white font-mono">+{formatPico(miningRate)}</div>
                <div className="text-xs text-slate-400 uppercase tracking-widest">Pico / Tap</div>
              </div>
            </div>

            {/* Boosts */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border bg-green-900/20 border-green-500/30 flex flex-col items-center text-center">
                <ShieldCheck size={20} className="text-green-400 mb-1" />
                <div className="text-[10px] text-slate-400 uppercase">KYC Status</div>
                <div className="text-green-400 font-bold text-xs">Active (x{KYC_MINING_BOOST})</div>
              </div>
              <div className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${isNodeRunning ? 'bg-purple-900/30 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-800 border-slate-700 opacity-50'}`}>
                <Server size={20} className={isNodeRunning ? "text-purple-400 animate-pulse mb-1" : "text-slate-500 mb-1"} />
                <div className="text-[10px] text-slate-400 uppercase">Node Boost</div>
                <div className={`font-bold text-xs ${isNodeRunning ? 'text-purple-300' : 'text-slate-500'}`}>
                  {isNodeRunning ? `Active (x${NODE_BOOST})` : 'Offline'}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="text-xs text-slate-400 uppercase font-bold mb-3 flex items-center gap-2">
                <Activity size={14} /> Recent Activities
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Daily Grant</span>
                  <span className="text-green-400">+500 Pico</span>
                </div>
                {isNodeRunning && (
                  <div className="flex justify-between text-xs animate-pulse">
                    <span className="text-purple-300">Node Validator Reward</span>
                    <span className="text-purple-400">+12.5 Pico/s</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                <Users className="text-indigo-400" size={20} /> Security Circle
              </h3>
              <div className="space-y-3">
                {[1,2,3].map(i => (
                  <div key={i} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">User</div>
                      <div className="text-sm text-slate-300">Pioneer_{1000+i}</div>
                    </div>
                    <span className="text-xs text-green-400 font-mono">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center">
              <Zap className="text-yellow-400 mb-2" size={32} />
              <h3 className="text-white font-bold text-sm">Energy Refill</h3>
              <p className="text-slate-400 text-[10px] mb-3">Restore 100% Energy</p>
              <button
                onClick={() => {
                  if (balance >= 1000) {
                    setBalance(b => b - 1000);
                    setEnergy(100);
                  }
                }}
                className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white font-bold"
              >
                1,000 Pico
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-slate-900 border-t border-slate-800 p-2 flex justify-around">
        <button onClick={() => setActiveTab('mine')} className={`p-2 flex flex-col items-center transition-colors ${activeTab === 'mine' ? 'text-indigo-400' : 'text-slate-600'}`}>
          <Pickaxe size={20}/>
          <span className="text-[10px] font-bold mt-1">Mine</span>
        </button>
        <button onClick={() => setActiveTab('social')} className={`p-2 flex flex-col items-center transition-colors ${activeTab === 'social' ? 'text-indigo-400' : 'text-slate-600'}`}>
          <Users size={20}/>
          <span className="text-[10px] font-bold mt-1">Team</span>
        </button>
        <button onClick={() => setActiveTab('market')} className={`p-2 flex flex-col items-center transition-colors ${activeTab === 'market' ? 'text-indigo-400' : 'text-slate-600'}`}>
          <ShoppingBag size={20}/>
          <span className="text-[10px] font-bold mt-1">Market</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// GLAVNA KOMPONENTA
// ==========================================
export default function PiEcosystem() {
  const [nodeActive, setNodeActive] = useState(false);
  const [view, setView] = useState('split'); // 'split', 'mobile', 'node'

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8 font-sans selection:bg-purple-500/30">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            PiCo Pi Network Ecosystem
          </h1>
          <p className="text-xs text-slate-500">Integrated Environment: Consensus Node & Mobile Layer</p>
        </div>

        {/* View Switcher */}
        <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex gap-1">
          <button onClick={() => setView('split')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'split' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
            Split View
          </button>
          <button onClick={() => setView('node')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${view === 'node' ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
            <Monitor size={12} /> Node
          </button>
          <button onClick={() => setView('mobile')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${view === 'mobile' ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300'}`}>
            <Smartphone size={12} /> App
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto h-[800px] md:h-[600px] relative">
        {view === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Node */}
            <div className="h-full">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Desktop / Server Side</div>
              <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />
            </div>
            {/* Mobile App */}
            <div className="h-full flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Mobile / User Side</div>
              <div className="w-[320px] h-full border-[8px] border-slate-800 rounded-[2.5rem] bg-black overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                <PicoApp isNodeRunning={nodeActive} />
              </div>
            </div>
          </div>
        )}

        {view === 'node' && <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />}

        {view === 'mobile' && (
          <div className="flex justify-center h-full">
            <div className="w-full max-w-md h-full border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <PicoApp isNodeRunning={nodeActive} />
            </div>
          </div>
        )}
      </div>

      {/* Connection Indicator (samo u split viewu) */}
      {view === 'split' && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-4 text-xs font-mono opacity-50 pointer-events-none">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-purple-500"></div>
          <span className={nodeActive ? "text-green-400" : "text-slate-600"}>
            {nodeActive ? "DATA LINK ESTABLISHED" : "WAITING FOR NODE..."}
          </span>
          <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-indigo-500"></div>
        </div>
      )}
    </div>
  );
}