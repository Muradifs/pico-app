import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Server, Shield, Zap, Activity, Globe, Lock, Cpu, Play, Square,
  Pickaxe, ShoppingBag, Users, Heart, Send, Trophy, CheckCircle2, 
  Settings, History, BarChart3, X, ShieldCheck, Copy, LogIn, AlertCircle, 
  Clock, Check, Loader2, Wallet, Map, PieChart, Info, Smartphone, Monitor
} from 'lucide-react';

// ==========================================
// KONSTANTE (Realistični Pi Network parametri za 2025.)
// ==========================================
const BASE_MINING_RATE = 0.003; // ~0.003 π/h (Base rate pada s vremenom)
const KYC_MINING_BOOST = 2;     // x2 Boost za KYC
const NODE_BOOST = 4.5;         // Node Bonus (ovisi o dostupnosti, prosjek x4.5)
const SECURITY_CIRCLE_BOOST = 2; // x2 ako je krug pun (5/5)

// ==========================================
// NODE SIMULATOR (Desktop strana - Pi Node)
// ==========================================
const NodeSimulator = ({ onStatusChange, isActive }) => {
  const [blockHeight, setBlockHeight] = useState(2850000); // Realističan blok za Mainnet
  const [dockerStatus, setDockerStatus] = useState('STOPPED'); 
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);
  const consensusInterval = useRef(null);

  // Auto-scroll logova
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // Čišćenje intervala
  useEffect(() => {
    return () => {
      if (consensusInterval.current) clearInterval(consensusInterval.current);
    };
  }, []);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time: timestamp, msg: message, type }].slice(-20));
  };

  const toggleNode = () => {
    if (isActive) {
      // Gašenje
      onStatusChange(false);
      setDockerStatus('STOPPED');
      clearInterval(consensusInterval.current);
      addLog('Pi Node Service Stopped.', 'warning');
    } else {
      // Paljenje
      setDockerStatus('STARTING');
      addLog('Initializing Pi Node (Docker Container)...', 'info');
      
      setTimeout(() => {
        setDockerStatus('RUNNING');
        onStatusChange(true); // Signaliziraj parent komponenti
        addLog('Docker container [pi-consensus] started.', 'success');
        addLog('Connected to Pi Mainnet (Open Network).', 'success');
        addLog('SCP (Stellar Consensus Protocol) Active.', 'success');
        startConsensus();
      }, 2500);
    }
  };

  const startConsensus = () => {
    consensusInterval.current = setInterval(() => {
      setBlockHeight(prev => {
        const newHeight = prev + 1;
        // SCP je brz, logiramo svaki 5. blok da ne spamamo
        if (newHeight % 5 === 0) {
           addLog(`SCP Consensus Achieved: Block #${newHeight.toLocaleString()}`, 'success');
        }
        return newHeight;
      });
    }, 4000); // Simulacija vremena bloka
  };

  return (
    <div className="bg-slate-900 text-slate-200 p-6 rounded-xl border border-slate-700 h-full flex flex-col font-mono">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Server className="text-purple-500" /> Pi Node Terminal
        </h2>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isActive ? 'bg-green-900/30 text-green-400 border-green-600' : 'bg-red-900/30 text-red-400 border-red-600'}`}>
          {isActive ? 'MAINNET SYNCED' : 'OFFLINE'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
           <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Latest Block</div>
           <div className="text-2xl text-blue-400 font-bold">#{blockHeight.toLocaleString()}</div>
        </div>
        <button 
          onClick={toggleNode}
          className={`p-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
            isActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isActive ? <><Square size={18}/> STOP NODE</> : <><Play size={18}/> START NODE</>}
        </button>
      </div>

      <div className="flex-1 bg-black rounded-lg border border-slate-700 p-3 overflow-hidden flex flex-col text-xs shadow-inner">
         <div className="text-slate-500 mb-2 border-b border-slate-800 pb-1 flex justify-between">
           <span>System Logs</span>
           <span className="text-[10px] text-slate-600">v1.10.2 (Docker)</span>
         </div>
         <div className="overflow-y-auto flex-1 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
            {logs.length === 0 && <div className="text-slate-700 italic">Waiting for node initialization...</div>}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 font-mono">
                <span className="text-slate-600">[{log.time}]</span>
                <span className={
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'warning' ? 'text-yellow-400' : 'text-slate-300'
                }>
                  {log.msg}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
         </div>
      </div>
      
      <div className="mt-4 p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg text-xs text-purple-200 text-center">
        Running a Node contributes to network security and boosts your mining rate by <span className="font-bold">x{NODE_BOOST}</span>!
      </div>
    </div>
  );
};

// ==========================================
// MOBILE APP SIMULATOR (Pi App)
// ==========================================
const PiLogo = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`${className} drop-shadow-2xl`}>
    <circle cx="60" cy="60" r="58" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
    <path d="M40 80 V45 H80 V80" stroke="#7e22ce" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M30 45 H90" stroke="#7e22ce" strokeWidth="8" strokeLinecap="round" />
    <path d="M60 45 V80" stroke="#7e22ce" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

const PiApp = ({ isNodeRunning }) => {
  const [activeTab, setActiveTab] = useState('mine');
  
  // Stanje s LocalStorage (da se ne resetira)
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('pi_balance');
    return saved ? parseFloat(saved) : 1450.00;
  });
  
  const [energy, setEnergy] = useState(() => {
    const saved = localStorage.getItem('pi_energy');
    return saved ? parseInt(saved) : 100;
  });

  const [username, setUsername] = useState('Pioneer');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const kycStatus = 'verified'; 

  // Izračun brzine rudarenja (Pi/h)
  let miningBoost = 1;
  if (kycStatus === 'verified') miningBoost += KYC_MINING_BOOST;
  if (isNodeRunning) miningBoost += NODE_BOOST;
  
  const currentRate = (BASE_MINING_RATE * miningBoost).toFixed(4);

  // Formatiranje
  const formatPi = (num) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(num);

  // Spremanje stanja
  useEffect(() => {
    localStorage.setItem('pi_balance', balance);
    localStorage.setItem('pi_energy', energy);
  }, [balance, energy]);

  // Pi SDK Integracija
  useEffect(() => {
    const initPi = async () => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true });
          const scopes = ['username', 'payments'];
          const auth = await window.Pi.authenticate(scopes, (p) => console.log(p));
          setUsername(auth.user.username);
          setIsAuthenticated(true);
        } catch (e) { console.error(e); }
      }
    };
    initPi();
  }, []);

  // Punjenje energije
  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prev => Math.min(prev + 1, 100));
    }, 1000); // 1% svake sekunde
    return () => clearInterval(timer);
  }, []);

  // Rudarenje na klik
  const handleMine = () => {
    if (energy < 10) return;
    setEnergy(prev => prev - 10);
    setBalance(prev => prev + (parseFloat(currentRate) / 60)); 
  };

  return (
    <div className="bg-white h-full rounded-[2rem] overflow-hidden flex flex-col font-sans relative shadow-inner">
      {/* Status Bar Fake */}
      <div className="bg-purple-900 text-white px-6 pt-3 pb-2 flex justify-between items-center text-xs">
         <span>12:45</span>
         <div className="flex gap-1">
           <Activity size={12}/>
           <Zap size={12}/>
         </div>
      </div>

      {/* App Header */}
      <div className="bg-purple-900 p-4 pb-6 flex justify-between items-center text-white shadow-lg z-10">
        <div className="flex items-center gap-2">
           <div className="font-bold text-xl tracking-tight">PiCo Network</div>
           <div className="bg-yellow-500 text-purple-900 text-[10px] px-1.5 rounded font-bold">TESTNET</div>
        </div>
        <div className="text-right">
           <div className="text-[10px] opacity-70">Welcome,</div>
           <div className="font-bold leading-none">{username}</div>
        </div>
      </div>

      {/* Main Balance Area */}
      <div className="bg-slate-50 flex-1 overflow-y-auto">
        
        {activeTab === 'mine' && (
          <div className="flex flex-col items-center pt-8">
             <div className="text-slate-500 text-xs font-bold tracking-widest mb-1">TOTAL BALANCE</div>
             <div className="text-4xl font-bold text-slate-800 font-mono mb-8 flex items-baseline gap-1">
               {formatPi(balance)} <span className="text-lg text-purple-700">π</span>
             </div>

             {/* Lightning Button */}
             <div className="relative mb-8">
               <button 
                 onClick={handleMine}
                 className="w-32 h-32 rounded-full bg-white shadow-xl border-4 border-slate-100 flex items-center justify-center active:scale-95 transition-transform relative z-10"
               >
                 <Zap size={48} className={energy >= 10 ? "fill-purple-600 text-purple-600" : "text-slate-300"} />
               </button>
               {/* Pulse effect - standard CSS animation */}
               <div className="absolute inset-0 bg-purple-500 rounded-full opacity-10 animate-ping"></div>
             </div>

             <div className="text-center mb-6">
                <div className="text-lg font-bold text-green-600 flex items-center justify-center gap-1">
                   <Zap size={16} className="fill-green-600"/> {currentRate} π/h
                </div>
                <div className="text-xs text-slate-400">Current Mining Rate</div>
             </div>

             {/* Energy */}
             <div className="w-3/4 bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${energy}%` }}></div>
             </div>
             <div className="text-[10px] text-slate-400 mb-8">{energy}% Energy</div>

             {/* Checklist */}
             <div className="w-full px-6 space-y-3">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="text-green-500" size={20} />
                      <div className="text-sm font-bold text-slate-700">KYC Status</div>
                   </div>
                   <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">VERIFIED</span>
                </div>

                <div className={`bg-white p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-center ${isNodeRunning ? 'border-purple-200 bg-purple-50' : ''}`}>
                   <div className="flex items-center gap-3">
                      <Monitor className={isNodeRunning ? "text-purple-600" : "text-slate-400"} size={20} />
                      <div>
                        <div className="text-sm font-bold text-slate-700">Node Bonus</div>
                        {isNodeRunning && <div className="text-[10px] text-purple-600">Active connection established</div>}
                      </div>
                   </div>
                   <span className={`text-xs px-2 py-1 rounded font-bold ${isNodeRunning ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-400'}`}>
                     {isNodeRunning ? `+${NODE_BOOST.toFixed(2)}` : 'INACTIVE'}
                   </span>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'team' && (
           <div className="p-6">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="text-purple-600"/> Referral Team</h3>
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                 {[1,2,3,4,5].map(i => (
                    <div key={i} className="p-4 border-b border-slate-50 last:border-0 flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                             P{i}
                          </div>
                          <div>
                             <div className="text-sm font-bold text-slate-700">Pioneer_{2025+i}</div>
                             <div className="text-[10px] text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Mining</div>
                          </div>
                       </div>
                       <div className="text-xs font-bold text-slate-400">Ping</div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-4 bg-purple-600 text-white py-3 rounded-lg font-bold shadow-lg active:scale-95 transition-transform">
                 Invite New Pioneers
              </button>
           </div>
        )}

        {activeTab === 'utility' && (
           <div className="p-6 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                 <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                    <Zap className="text-yellow-600" />
                 </div>
                 <h4 className="font-bold text-slate-700 text-sm">Boost Energy</h4>
                 <p className="text-[10px] text-slate-400 mb-3">Refill to 100% instantly</p>
                 <button onClick={() => {if(balance>=1){setBalance(b=>b-1); setEnergy(100)}}} className="text-xs bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-full font-bold text-slate-600 transition-colors">
                    1.00 π
                 </button>
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center opacity-75">
                 <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Globe className="text-purple-600" />
                 </div>
                 <h4 className="font-bold text-slate-700 text-sm">Pi Browser</h4>
                 <p className="text-[10px] text-slate-400 mb-3">Web3 Access</p>
                 <button className="text-xs bg-purple-50 text-purple-400 px-4 py-1.5 rounded-full font-bold">
                    Installed
                 </button>
              </div>
           </div>
        )}

      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-slate-100 p-2 flex justify-around pb-6">
         <button onClick={() => setActiveTab('mine')} className={`flex flex-col items-center gap-1 p-2 w-16 rounded-lg transition-colors ${activeTab === 'mine' ? 'text-purple-700' : 'text-slate-400'}`}>
            <Pickaxe size={22} className={activeTab === 'mine' ? "fill-purple-100" : ""} />
            <span className="text-[10px] font-bold">Mine</span>
         </button>
         <button onClick={() => setActiveTab('utility')} className={`flex flex-col items-center gap-1 p-2 w-16 rounded-lg transition-colors ${activeTab === 'utility' ? 'text-purple-700' : 'text-slate-400'}`}>
            <ShoppingBag size={22} className={activeTab === 'utility' ? "fill-purple-100" : ""} />
            <span className="text-[10px] font-bold">Utility</span>
         </button>
         <button onClick={() => setActiveTab('team')} className={`flex flex-col items-center gap-1 p-2 w-16 rounded-lg transition-colors ${activeTab === 'team' ? 'text-purple-700' : 'text-slate-400'}`}>
            <Users size={22} className={activeTab === 'team' ? "fill-purple-100" : ""} />
            <span className="text-[10px] font-bold">Team</span>
         </button>
         <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 p-2 w-16 rounded-lg transition-colors ${activeTab === 'profile' ? 'text-purple-700' : 'text-slate-400'}`}>
            <Shield size={22} />
            <span className="text-[10px] font-bold">Roles</span>
         </button>
      </div>
    </div>
  );
};

// ==========================================
// MAIN SYSTEM
// ==========================================
export default function PiEcosystem() {
  const [nodeActive, setNodeActive] = useState(false);
  const [view, setView] = useState('split'); 

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 p-4 md:p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto h-[850px] md:h-[700px] flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex justify-between items-end pb-4 border-b border-slate-800">
           <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">PiCo Pi Network Ecosystem <span className="text-purple-500">2025</span></h1>
              <p className="text-slate-500 text-sm">Integrated Node Consensus & Mobile Application Simulation</p>
           </div>
           <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button onClick={() => setView('split')} className={`px-4 py-2 text-xs font-bold rounded ${view === 'split' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>Split View</button>
              <button onClick={() => setView('node')} className={`px-4 py-2 text-xs font-bold rounded ${view === 'node' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>Node Only</button>
              <button onClick={() => setView('mobile')} className={`px-4 py-2 text-xs font-bold rounded ${view === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>App Only</button>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative">
           {view === 'split' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />
                <div className="flex justify-center items-center bg-slate-900/50 rounded-2xl border border-slate-800">
                   <div className="w-[360px] h-[720px] bg-black rounded-[2.5rem] p-3 shadow-2xl border-[8px] border-slate-800 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                      <PiApp isNodeRunning={nodeActive} />
                   </div>
                </div>
             </div>
           )}

           {view === 'node' && <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />}
           
           {view === 'mobile' && (
              <div className="flex justify-center h-full">
                 <div className="w-[375px] h-full bg-black rounded-[2.5rem] p-3 shadow-2xl border-[8px] border-slate-800 relative">
                     <PiApp isNodeRunning={nodeActive} />
                 </div>
              </div>
           )}
        </div>

      </div>
    </div>
  );
}