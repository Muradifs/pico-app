import React, { useState, useEffect, useRef } from 'react';
import { 
  Pickaxe, ShoppingBag, Users, Heart, Send, Zap, Trophy,
  CheckCircle2, Settings, History, BarChart3, X,
  ShieldCheck, Copy, LogIn, AlertCircle, Clock, Check, Activity, Loader2,
  Wallet, Globe, Server, Square, Play
} from 'lucide-react';

// --- CONFIGURATION ---
const ENERGY_MAX = 100;
const ENERGY_REGEN_PER_SECOND = 1 / 14.4; // ~100 energy / 24h
const DAILY_BONUS = 1.0;
const REFERRAL_BONUS = 5.0;
const KYC_BONUS = 10.0;
const KYC_MINING_BOOST = 0.5;
const NODE_MULTIPLIER = 4.0; // Node boost multiplier
const MAX_SUPPLY = 100000000;

// --- TRANSLATIONS (EN/HR) ---
const TRANSLATIONS = {
  en: {
    welcome: "Welcome", mine: "Mine", social: "Social", market: "Market", home: "Home",
    connect_wallet: "Click Logo to Enter", energy: "Energy", balance: "Balance",
    start_mining: "Start Mining", tap_mine: "Tap to Mine", cost_energy: "Cost: 10 Energy",
    invite_friends: "Referral Team", buy: "Buy", tip: "Tip", like: "Like",
    post_placeholder: "What's up in Pi Network?", items: "items", miner_level: "Pioneer Lv1",
    power: "Mining Rate", active_quests: "Checklist", claim: "Claim", leaderboard: "Leaderboard",
    transactions: "History", settings: "Settings", profile: "Profile", language: "Language",
    change_name: "Verified Name", kyc_status: "KYC Status", kyc_not_started: "Not Started",
    kyc_pending: "Pending", kyc_verified: "Verified", kyc_start: "Start KYC",
    pi_login_desc: "Login with Pi Network", node_active: "Node Active", node_inactive: "Node Inactive"
  },
  hr: {
    welcome: "Dobrodošli", mine: "Rudari", social: "Društvo", market: "Trgovina", home: "Dom",
    connect_wallet: "Klikni Logo za Ulaz", energy: "Energija", balance: "Stanje",
    start_mining: "Započni Rudarenje", tap_mine: "Dodirni za Rudarenje", cost_energy: "Cijena: 10 Energije",
    invite_friends: "Referalni Tim", buy: "Kupi", tip: "Napojnica", like: "Sviđa mi se",
    post_placeholder: "Što ima u Pi mreži?", items: "predmeta", miner_level: "Pioneer Lv1",
    power: "Stopa Rudarenja", active_quests: "Lista Zadataka", claim: "Preuzmi", leaderboard: "Ljestvica",
    transactions: "Povijest", settings: "Postavke", profile: "Profil", language: "Jezik",
    change_name: "Verificirano Ime", kyc_status: "KYC Status", kyc_not_started: "Nije započeto",
    kyc_pending: "Na pregledu", kyc_verified: "Verificirano", kyc_start: "Započni KYC",
    pi_login_desc: "Prijava putem Pi Mreže", node_active: "Čvor Aktivan", node_inactive: "Čvor Neaktivan"
  }
};

const LANGUAGES = [{ code: 'en', label: 'English', flag: '🇬🇧' }, { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' }];

// --- MOCK PI SDK (For Desktop Testing) ---
const PiSDK = {
  init: async () => {
    if (window.Pi) {
      try { window.Pi.init({ version: "2.0", sandbox: true }); } catch(e) { console.warn(e); }
    }
  },
  authenticate: async () => {
    await new Promise(r => setTimeout(r, 1500));
    return { user: { username: "PiPioneer_" + Math.floor(Math.random() * 1000), uid: "uid_" + Date.now() } };
  }
};

// --- LOGO COMPONENT ---
const PicoLogo = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`${className} drop-shadow-2xl`}>
    <circle cx="60" cy="60" r="58" fill="url(#logoGradient)" stroke="url(#goldGradient)" strokeWidth="3" />
    <circle cx="60" cy="60" r="48" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
    <path d="M35 45 H85 M45 45 V80 M75 45 V80" stroke="white" strokeWidth="8" strokeLinecap="round" />
    <circle cx="35" cy="45" r="5" fill="#FCD34D" />
    <circle cx="85" cy="45" r="5" fill="#FCD34D" />
    <circle cx="45" cy="80" r="5" fill="#FCD34D" />
    <circle cx="75" cy="80" r="5" fill="#FCD34D" />
    <defs>
      <linearGradient id="logoGradient" x1="0" y1="0" x2="120" y2="120">
        <stop offset="0%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="goldGradient" x1="0" y1="0" x2="120" y2="120">
        <stop offset="0%" stopColor="#FCD34D" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

// --- STORAGE HELPER ---
const loadState = () => {
  try { return JSON.parse(localStorage.getItem('picoAppState_v4')); } catch { return null; }
};
const saveState = (state) => {
  try { localStorage.setItem('picoAppState_v4', JSON.stringify(state)); } catch (e) { console.warn(e); }
};

// ==========================================
// NODE SIMULATOR COMPONENT (Left Side)
// ==========================================
const NodeSimulator = ({ onStatusChange, isActive }) => {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);
  
  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  useEffect(() => {
    let interval;
    if (isActive) {
      addLog('Initializing Stellar Consensus Protocol...', 'info');
      setTimeout(() => addLog('Connected to Pi Testnet Peers: 8/8', 'success'), 1000);
      interval = setInterval(() => {
        const height = Math.floor(Math.random() * 1000000) + 9000000;
        addLog(`Synced block #${height} [Hash: ${Math.random().toString(36).substring(7)}]`, 'info');
      }, 2500);
    } else {
      addLog('Node Service Stopped.', 'warning');
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const addLog = (msg, type) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }].slice(-15));
  };

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 h-full flex flex-col shadow-2xl overflow-hidden font-mono">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Server className="text-purple-500" /> Node Terminal</h2>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isActive ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>
          {isActive ? 'SYNCED' : 'OFFLINE'}
        </div>
      </div>
      
      <div className="flex-1 bg-black/80 rounded-xl border border-slate-800 p-4 mb-4 overflow-y-auto text-xs space-y-2 custom-scrollbar">
        {logs.length === 0 && <div className="text-slate-600 italic">Ready to start...</div>}
        {logs.map((l, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-slate-600">[{l.time}]</span>
            <span className={l.type === 'success' ? 'text-green-400' : l.type === 'warning' ? 'text-yellow-400' : 'text-slate-300'}>{l.msg}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
          <div className="text-slate-500 text-[10px] uppercase">Local Block</div>
          <div className="text-xl text-blue-400 font-bold">{isActive ? "9,241,852" : "---"}</div>
        </div>
        <button onClick={() => onStatusChange(!isActive)} className={`rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isActive ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
          {isActive ? <><Square size={16}/> STOP</> : <><Play size={16}/> START</>}
        </button>
      </div>
      <p className="text-center text-[10px] text-slate-500 mt-4">Running Node grants <b className="text-white">x{NODE_MULTIPLIER.toFixed(1)}</b> Mining Boost</p>
    </div>
  );
};

// ==========================================
// MOBILE APP COMPONENT (The "Brain")
// ==========================================
const PicoApp = ({ isNodeRunning }) => {
  const saved = loadState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(saved?.walletConnected || false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [username, setUsername] = useState(saved?.username || 'Guest');
  const [balance, setBalance] = useState(saved?.balance || 0);
  const [energy, setEnergy] = useState(saved?.energy ?? ENERGY_MAX);
  const [kycStatus, setKycStatus] = useState(saved?.kycStatus || 'not_started');
  const [miningPower, setMiningPower] = useState(0.25);
  const [language, setLanguage] = useState(saved?.language || 'hr');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Helpers
  const t = (key) => TRANSLATIONS[language][key] || key;
  const triggerNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
  
  // Boost Calculation
  const totalRate = Number(((miningPower + (kycStatus === 'verified' ? KYC_MINING_BOOST : 0)) * (isNodeRunning ? NODE_MULTIPLIER : 1)).toFixed(2));

  // Init
  useEffect(() => { PiSDK.init(); }, []);
  
  // Save State
  useEffect(() => {
    saveState({ walletConnected, username, balance, energy, kycStatus, language });
  }, [walletConnected, username, balance, energy, kycStatus, language]);

  // Energy Regen
  useEffect(() => {
    const timer = setInterval(() => setEnergy(p => Math.min(p + ENERGY_REGEN_PER_SECOND, ENERGY_MAX)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      let user = { username: "Desktop_User" };
      if (window.Pi) {
        try {
          const auth = await Promise.race([
            window.Pi.authenticate(['username', 'payments'], () => {}),
            new Promise((_, r) => setTimeout(() => r("timeout"), 5000))
          ]);
          user = auth.user || user;
        } catch { console.log("Demo Mode"); }
      } else {
        await new Promise(r => setTimeout(r, 1000));
      }
      setUsername(user.username);
      setWalletConnected(true);
      if(balance === 0) setBalance(1.0);
    } finally { setIsAuthenticating(false); }
  };

  const handleMine = () => {
    if (energy < 10) { triggerNotification(t('cost_energy')); return; }
    setEnergy(p => p - 10);
    setBalance(p => p + totalRate);
    triggerNotification(`+${totalRate} PiCo`);
  };

  // --- RENDER LOGIN ---
  if (!walletConnected) {
    return (
      <div className="h-full bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
        <div className="z-10 space-y-8 animate-in fade-in zoom-in duration-500">
          <div onClick={handleLogin} className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse rounded-full group-hover:opacity-40 transition-opacity"></div>
            <PicoLogo size={140} className="relative z-10 mx-auto transition-transform group-hover:scale-105" />
            <div className="mt-6 text-sm text-indigo-300 uppercase tracking-widest font-bold">{t('connect_wallet')}</div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Entrance PiCo</h1>
            <p className="text-slate-500 text-sm mt-2">Web3 Social Mining</p>
          </div>
          {isAuthenticating && <div className="text-indigo-400 text-xs animate-pulse">Authenticating...</div>}
        </div>
      </div>
    );
  }

  // --- RENDER APP ---
  return (
    <div className="h-full bg-slate-900 text-white flex flex-col font-sans relative overflow-hidden">
      {/* HEADER */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-400 shadow-lg cursor-pointer" onClick={()=>setShowProfileModal(true)}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('energy')}</span>
            <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{width: `${energy}%`}}></div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2 shadow-inner">
          <Zap size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="font-mono font-bold text-sm">{balance.toFixed(2)}</span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {showProfileModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-800 w-full rounded-2xl border border-slate-700 p-4 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">{t('settings')}</h3>
                <button onClick={()=>setShowProfileModal(false)}><X size={20} className="text-slate-400"/></button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-500 uppercase">{t('language')}</p>
                <div className="flex gap-2">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={()=>setLanguage(l.code)} className={`flex-1 p-2 rounded border text-xs ${language===l.code ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}>{l.flag} {l.label}</button>
                  ))}
                </div>
              </div>
              {/* Simple KYC Toggle for Demo */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-700 flex justify-between items-center">
                 <span className="text-xs text-slate-400">KYC Status</span>
                 <button onClick={()=>setKycStatus(kycStatus==='verified'?'not_started':'verified')} className={`text-xs px-2 py-1 rounded ${kycStatus==='verified'?'bg-green-900 text-green-400':'bg-slate-800 text-slate-400'}`}>
                   {kycStatus === 'verified' ? 'VERIFIED ✅' : 'NOT STARTED'}
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] opacity-10 rotate-12"><PicoLogo size={180}/></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div>
                  <h2 className="text-slate-300 text-[10px] uppercase tracking-[0.2em]">{t('power')}</h2>
                  <div className="text-4xl font-bold text-white flex items-center justify-center gap-2 mt-1">
                    <Pickaxe size={28} className="text-yellow-400" />
                    {totalRate}/h
                  </div>
                </div>
                {isNodeRunning && (
                  <div className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1 animate-pulse">
                    <Server size={12}/> Node Boost x{NODE_MULTIPLIER}.0 Active
                  </div>
                )}
                <button onClick={() => setActiveTab('mine')} className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition active:scale-95">
                  {t('start_mining')}
                </button>
              </div>
            </div>
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <Trophy className="text-yellow-500 mb-2" size={20}/>
                  <div className="text-xs text-slate-400">Rank</div>
                  <div className="font-bold">#4,201</div>
               </div>
               <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                  <Users className="text-blue-400 mb-2" size={20}/>
                  <div className="text-xs text-slate-400">Team</div>
                  <div className="font-bold">12 Active</div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'mine' && (
          <div className="flex flex-col items-center py-10 space-y-8 animate-in zoom-in-95 duration-300">
            <button onClick={handleMine} className="relative group active:scale-90 transition-transform">
              <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <PicoLogo size={200} />
            </button>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">+{totalRate}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">PiCo / Tap</div>
            </div>
          </div>
        )}
        
        {/* Placeholder for other tabs */}
        {(activeTab === 'social' || activeTab === 'market') && (
           <div className="flex flex-col items-center justify-center h-40 text-slate-500 space-y-2">
              <Activity size={40} className="opacity-20"/>
              <span className="text-xs uppercase tracking-widest">Coming Soon</span>
           </div>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="bg-slate-900/95 backdrop-blur border-t border-slate-800 p-2 flex justify-around pb-6 md:pb-2 z-10">
        {['dashboard', 'mine', 'social', 'market'].map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)} className={`flex flex-col items-center gap-1 p-2 rounded-xl w-16 transition-all ${activeTab===tab ? 'text-indigo-400 -translate-y-1' : 'text-slate-500'}`}>
            {tab==='dashboard' && <PicoLogo size={22} className={activeTab===tab ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'grayscale opacity-50'}/>}
            {tab==='mine' && <Pickaxe size={22}/>}
            {tab==='social' && <Users size={22}/>}
            {tab==='market' && <ShoppingBag size={22}/>}
            <span className="text-[9px] font-bold uppercase tracking-wide">{t(tab === 'dashboard' ? 'home' : tab)}</span>
          </button>
        ))}
      </nav>

      {/* NOTIFICATION */}
      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-xl z-50 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 fade-in">
          <CheckCircle2 size={16}/> {notification}
        </div>
      )}
    </div>
  );
};

// ==========================================
// ROOT LAYOUT (Responsive Split View)
// ==========================================
export default function PiCoEcosystem() {
  const [nodeActive, setNodeActive] = useState(false);
  const [view, setView] = useState('split');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile to auto-switch view
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setView('mobile');
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-purple-500/30 overflow-hidden">
      {/* Desktop Ecosystem Header - Hidden on Mobile */}
      <div className="hidden md:flex flex-col md:flex-row justify-between items-center p-6 border-b border-slate-800 gap-4 bg-slate-950">
         <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">PiCo Ecosystem</h1>
            <p className="text-slate-500 text-xs">Decentralized Mining & Social Hub</p>
         </div>
         <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button onClick={() => setView('split')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'split' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>Split View</button>
            <button onClick={() => setView('node')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'node' ? 'bg-purple-900/50 text-purple-200' : 'text-slate-500 hover:text-white'}`}>Node</button>
            <button onClick={() => setView('mobile')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'mobile' ? 'bg-indigo-900/50 text-indigo-200' : 'text-slate-500 hover:text-white'}`}>App</button>
         </div>
      </div>

      <div className="h-[calc(100vh-80px)] md:p-8 flex items-center justify-center">
         {/* MOBILE VIEW (Full Screen on Phone) */}
         {isMobile ? (
            <PicoApp isNodeRunning={false} /> // Node boost mostly for desktop demo
         ) : (
            // DESKTOP VIEWS
            <div className="w-full max-w-6xl h-[650px] relative">
               {view === 'split' && (
                 <div className="grid grid-cols-2 gap-8 h-full">
                    <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />
                    <div className="flex justify-center items-center bg-slate-900/30 rounded-3xl border border-slate-800/50">
                       {/* Phone Frame */}
                       <div className="w-[320px] h-[640px] bg-black rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden ring-1 ring-white/10">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                          <PicoApp isNodeRunning={nodeActive} />
                       </div>
                    </div>
                 </div>
               )}
               
               {view === 'node' && <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />}
               
               {view === 'mobile' && (
                 <div className="flex justify-center h-full items-center">
                    <div className="w-[360px] h-[720px] bg-black rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden ring-1 ring-white/10">
                       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                       <PicoApp isNodeRunning={nodeActive} />
                    </div>
                 </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
}