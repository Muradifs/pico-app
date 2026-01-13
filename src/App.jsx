import React, { useState, useEffect, useRef } from 'react';
import { 
  Pickaxe, ShoppingBag, Users, Heart, Send, Zap, Trophy,
  CheckCircle2, Settings, History, BarChart3, X,
  ShieldCheck, Copy, LogIn, AlertCircle, Clock, Check, Activity, Loader2,
  Wallet, Globe, Server, Square, Play, FileText, Info
} from 'lucide-react';

// --- CONFIGURATION ---
const ENERGY_MAX = 100;
const ENERGY_REGEN_PER_SECOND = 1 / 14.4; // ~100 energy / 24h
const DAILY_BONUS = 1.0;
const REFERRAL_BONUS = 5.0;
const KYC_BONUS = 10.0;
const KYC_MINING_BOOST = 0.5;
const NODE_MULTIPLIER = 4.0;
const MAX_SUPPLY = 100000000;

// --- TRANSLATIONS ---
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
    pi_login_desc: "Login with Pi Network", node_active: "Node Active", 
    legal: "Legal & About", privacy: "Privacy Policy", terms: "Terms of Service"
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
    pi_login_desc: "Prijava putem Pi Mreže", node_active: "Čvor Aktivan",
    legal: "Pravno i O nama", privacy: "Pravila Privatnosti", terms: "Uvjeti Korištenja"
  }
};

const LANGUAGES = [{ code: 'en', label: 'English', flag: '🇬🇧' }, { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' }];

// --- REAL PI SDK INTEGRATION ---
// Assuming the Pi SDK script is loaded in index.html: <script src="https://sdk.minepi.com/pi-sdk.js"></script>
// We use window.Pi directly for real integration.
const PiSDK = {
  init: async () => {
    if (window.Pi) {
      try {
        window.Pi.init({ version: "2.0", sandbox: true }); // Use sandbox: false for production
      } catch (e) {
        console.warn('Pi SDK init failed:', e);
      }
    } else {
      console.warn('Pi SDK not loaded. Ensure the script is included.');
    }
  },
  authenticate: async (scopes = ['username']) => {
    if (window.Pi) {
      try {
        const authResult = await window.Pi.authenticate(scopes, () => {}); // onIncompletePaymentFound callback can be customized if needed
        return authResult;
      } catch (e) {
        console.error('Pi Authentication failed:', e);
        throw e;
      }
    } else {
      throw new Error('Pi SDK not available. This app requires Pi Network environment.');
    }
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

// --- HELPER & STORAGE ---
const loadState = () => { try { return JSON.parse(localStorage.getItem('picoAppState_v5')); } catch { return null; } };
const saveState = (state) => { try { localStorage.setItem('picoAppState_v5', JSON.stringify(state)); } catch (e) { console.warn(e); } };

// --- TEXT CONTENT FOR LEGAL ---
const LEGAL_TEXTS = {
  privacy: (
    <div className="space-y-4">
      <p><strong>Last Updated: January 2025</strong></p>
      <p>Entrance PiCo ("we", "our") values your privacy. This Privacy Policy explains how we handle your data within the Pi Network ecosystem.</p>
      
      <h4 className="font-bold text-white">1. Data Collection</h4>
      <p>We collect basic user information provided by the Pi Network SDK upon authentication: your unique Pi User ID (UID) and your Username. We do not collect passwords or private keys.</p>
      
      <h4 className="font-bold text-white">2. Usage of Data</h4>
      <p>Your data is used solely to maintain your in-app account, track your mining progress, inventory, and social interactions within the app.</p>
      
      <h4 className="font-bold text-white">3. Data Sharing</h4>
      <p>We do not sell or share your personal data with third parties. All game data is stored locally or on secure cloud services (Firebase) strictly for game functionality.</p>
      
      <h4 className="font-bold text-white">4. Pi Network Compliance</h4>
      <p>This app complies with Pi Network Developer Terms. We strictly prohibit the use of bots or automated scripts.</p>
    </div>
  ),
  terms: (
    <div className="space-y-4">
      <p><strong>Last Updated: January 2025</strong></p>
      <p>By using Entrance PiCo, you agree to these Terms of Service.</p>
      
      <h4 className="font-bold text-white">1. Virtual Currency</h4>
      <p>"PiCo" tokens earned in this app are virtual points for entertainment purposes only. They currently have no monetary value and are not exchangeable for fiat currency.</p>
      
      <h4 className="font-bold text-white">2. Prohibited Conduct</h4>
      <p>You agree not to cheat, hack, or use automated software (bots) to mine. Violation will result in a permanent ban.</p>
      
      <h4 className="font-bold text-white">3. Disclaimer</h4>
      <p>The app is provided "as is" without warranties of any kind. We are not responsible for any data loss or service interruptions.</p>
      
      <h4 className="font-bold text-white">4. Pi Network</h4>
      <p>We are an independent project and not affiliated with the Pi Core Team, though we operate within their ecosystem guidelines.</p>
    </div>
  )
};

// --- COMPONENTS ---

// Legal Text Modal
const LegalModal = ({ title, content, onClose }) => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
    <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
        <h2 className="font-bold text-xl text-white flex items-center gap-2"><FileText size={20} className="text-blue-400"/> {title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
      </div>
      <div className="p-6 overflow-y-auto text-sm text-slate-300 space-y-4 leading-relaxed custom-scrollbar">
        {content}
      </div>
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl">
        <button onClick={onClose} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors">Close</button>
      </div>
    </div>
  </div>
);

const SettingsModal = ({ 
  onClose, t, language, setLanguage, userAvatar, username, referralCode, 
  triggerNotification, kycStatus, isKycProcessing, startKyc, transactions, 
  onOpenPrivacy, onOpenTerms 
}) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
    <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h2 className="font-bold text-xl text-white flex items-center gap-2"><Settings size={20} /> {t('settings')}</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X size={20}/></button>
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
        {/* User Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase">{t('profile')}</h3>
          <div className="flex gap-3 items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <div className="w-12 h-12 flex items-center justify-center text-2xl bg-indigo-600/20 rounded-full text-yellow-400 border border-indigo-500/30">{userAvatar}</div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase">{t('change_name')}</p>
              <p className="text-lg font-bold text-white flex items-center gap-2">{username} <CheckCircle2 size={16} className="text-green-500" /></p>
            </div>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg flex justify-between items-center border border-slate-700">
             <span className="text-slate-400 text-sm">Referral Code</span>
             <div className="flex items-center gap-2">
               <span className="text-indigo-400 font-mono font-bold">{referralCode}</span>
               <Copy size={14} className="text-slate-500 cursor-pointer hover:text-white" onClick={() => triggerNotification("Copied!")}/>
             </div>
          </div>
        </div>

        {/* KYC */}
        <div className="space-y-2 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
           <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase">{t('kyc_status')}</h3>
              <span className={`flex items-center gap-1 text-sm font-bold ${kycStatus==='verified'?'text-green-400':kycStatus==='pending'?'text-yellow-400':'text-slate-400'}`}>
                {isKycProcessing?<Loader2 size={18} className="animate-spin"/>:kycStatus==='verified'?<Check size={18}/>:kycStatus==='pending'?<Clock size={18}/>:<AlertCircle size={18}/>}
                {t(kycStatus === 'not_started' ? 'kyc_not_started' : kycStatus === 'pending' ? 'kyc_pending' : 'kyc_verified')}
              </span>
           </div>
           {kycStatus === 'not_started' && <button onClick={startKyc} disabled={isKycProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition">{t('kyc_start')}</button>}
        </div>

        {/* Legal Links */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase">{t('legal')}</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onOpenPrivacy} className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 flex items-center justify-center gap-2 transition-colors">
              <ShieldCheck size={14} /> {t('privacy')}
            </button>
            <button onClick={onOpenTerms} className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 flex items-center justify-center gap-2 transition-colors">
              <FileText size={14} /> {t('terms')}
            </button>
          </div>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase">{t('language')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(lang => (
              <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${language === lang.code ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                <span className="text-xl">{lang.flag}</span><span className="text-sm font-medium">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><History size={14} /> {t('transactions')}</h3>
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-2 max-h-40 overflow-y-auto space-y-2">
            {transactions.length === 0 ? <p className="text-center text-slate-500 text-xs py-4">No transactions yet.</p> : transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center text-xs p-2 rounded hover:bg-slate-800">
                  <div className="flex flex-col"><span className="font-medium text-slate-300">{t(tx.descKey)} {tx.item ? `(${tx.item})` : ''}</span><span className="text-slate-500 text-[10px]">{new Date(tx.date).toLocaleTimeString()}</span></div>
                  <span className={`font-mono font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(4)}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const NodeSimulator = ({ onStatusChange, isActive }) => {
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);
  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
  useEffect(() => {
    let interval;
    if (isActive) {
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: 'Initializing Stellar Consensus...', type: 'info' }]);
      interval = setInterval(() => {
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `Synced block #${Math.floor(Math.random()*1000000)+9000000}`, type: 'info' }].slice(-15));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-700 h-full flex flex-col shadow-2xl overflow-hidden font-mono">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2"><Server className="text-purple-500" /> Node Terminal</h2>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isActive ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}`}>{isActive ? 'SYNCED' : 'OFFLINE'}</div>
      </div>
      <div className="flex-1 bg-black/80 rounded-xl border border-slate-800 p-4 mb-4 overflow-y-auto text-xs space-y-2 custom-scrollbar">
        {logs.map((l, i) => (<div key={i} className="flex gap-2"><span className="text-slate-600">[{l.time}]</span><span className="text-slate-300">{l.msg}</span></div>))}
        <div ref={logsEndRef} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 text-center"><div className="text-slate-500 text-[10px]">PEERS</div><div className="text-xl text-blue-400 font-bold">{isActive?"8/8":"0"}</div></div>
        <button onClick={() => onStatusChange(!isActive)} className={`rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>{isActive ? <><Square size={16}/> STOP</> : <><Play size={16}/> START</>}</button>
      </div>
    </div>
  );
};

// --- MOBILE APP COMPONENT ---
const PicoApp = ({ isNodeRunning }) => {
  const saved = loadState();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(saved?.walletConnected || false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [username, setUsername] = useState(saved?.username || 'Guest');
  const [balance, setBalance] = useState(saved?.balance || 0);
  const [energy, setEnergy] = useState(saved?.energy ?? ENERGY_MAX);
  const [kycStatus, setKycStatus] = useState(saved?.kycStatus || 'not_started');
  const [language, setLanguage] = useState(saved?.language || 'hr');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [inventory, setInventory] = useState(saved?.inventory || []);
  const [transactions, setTransactions] = useState(saved?.transactions || []);
  const [activeLegal, setActiveLegal] = useState(null); // 'privacy' | 'terms' | null

  const t = (key) => TRANSLATIONS[language][key] || key;
  const triggerNotification = (msg) => { setNotification(msg); setTimeout(() => setNotification(null), 3000); };
  
  useEffect(() => { PiSDK.init(); }, []);
  useEffect(() => { saveState({ walletConnected, username, balance, energy, kycStatus, language, inventory, transactions }); }, [walletConnected, username, balance, energy, kycStatus, language, inventory, transactions]);
  useEffect(() => { const timer = setInterval(() => setEnergy(p => Math.min(p + ENERGY_REGEN_PER_SECOND, ENERGY_MAX)), 1000); return () => clearInterval(timer); }, []);

  const handleLogin = async () => {
    setIsAuthenticating(true);
    try {
      const auth = await PiSDK.authenticate(['username']);
      setUsername(auth.user.username || 'Guest');
      setWalletConnected(true);
      if (balance === 0) setBalance(1.0);
    } catch (e) {
      triggerNotification('Authentication failed. Please try again.');
      console.error(e);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleMine = () => {
    if (energy < 10) { triggerNotification(t('cost_energy')); return; }
    const rate = Number(((0.25 + (kycStatus === 'verified' ? KYC_MINING_BOOST : 0)) * (isNodeRunning ? NODE_MULTIPLIER : 1)).toFixed(2));
    setEnergy(p => p - 10);
    setBalance(p => p + rate);
    triggerNotification(`+${rate} PiCo`);
  };

  const buyItem = (item) => {
    if (balance < item.price) { triggerNotification(t('insufficient_funds')); return; }
    setBalance(p => p - item.price);
    if(item.id !== 2) setInventory(prev => [...prev, item]);
    if(item.id === 2) setEnergy(ENERGY_MAX);
    triggerNotification(`${t('item_bought')} ${item.name}`);
    setTransactions(prev => [{id: Date.now(), type: 'expense', amount: item.price, descKey: 'item_bought', date: new Date()}, ...prev]);
  };

  if (!walletConnected) {
    return (
      <div className="h-full bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
        <div onClick={handleLogin} className="relative z-10 group cursor-pointer animate-in fade-in zoom-in duration-500">
          <PicoLogo size={140} className="relative z-10 mx-auto transition-transform group-hover:scale-105" />
          <div className="mt-6 text-sm text-indigo-300 uppercase tracking-widest font-bold">{t('connect_wallet')}</div>
        </div>
        {isAuthenticating && <div className="text-indigo-400 text-xs animate-pulse mt-4">Authenticating...</div>}
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-900 text-white flex flex-col font-sans relative overflow-hidden">
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold border border-indigo-400 cursor-pointer" onClick={()=>setShowProfileModal(true)}>{username.charAt(0).toUpperCase()}</div>
          <div className="flex flex-col"><span className="text-[10px] text-slate-400 font-bold uppercase">{t('energy')}</span><div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{width: `${energy}%`}}></div></div></div>
        </div>
        <div className="bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 flex items-center gap-2"><Zap size={14} className="text-yellow-400 fill-yellow-400" /><span className="font-mono font-bold text-sm">{balance.toFixed(2)}</span></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {showProfileModal && <SettingsModal 
          onClose={()=>setShowProfileModal(false)} 
          t={t} 
          language={language} 
          setLanguage={setLanguage} 
          userAvatar="👤" 
          username={username} 
          referralCode="REF123" 
          triggerNotification={triggerNotification} 
          kycStatus={kycStatus} 
          startKyc={()=>{setKycStatus('pending'); setTimeout(()=>setKycStatus('verified'),2000)}} 
          transactions={transactions} 
          onOpenPrivacy={() => setActiveLegal('privacy')}
          onOpenTerms={() => setActiveLegal('terms')}
        />}
        
        {/* LEGAL MODALS */}
        {activeLegal === 'privacy' && <LegalModal title={t('privacy')} content={LEGAL_TEXTS.privacy} onClose={() => setActiveLegal(null)} />}
        {activeLegal === 'terms' && <LegalModal title={t('terms')} content={LEGAL_TEXTS.terms} onClose={() => setActiveLegal(null)} />}

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden text-center">
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <h2 className="text-slate-300 text-[10px] uppercase tracking-[0.2em]">{t('power')}</h2>
                <div className="text-4xl font-bold flex items-center gap-2"><Pickaxe size={28} className="text-yellow-400" /> {Number(((0.25+(kycStatus==='verified'?0.5:0))*(isNodeRunning?4:1)).toFixed(2))}/h</div>
                <button onClick={() => setActiveTab('mine')} className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl shadow-lg transition active:scale-95">{t('start_mining')}</button>
              </div>
            </div>
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex justify-between items-center cursor-pointer" onClick={() => setActiveTab('mine')}>
                <span className="flex items-center gap-2 font-bold"><Trophy className="text-yellow-500" size={18}/> {t('leaderboard')}</span>
                <ChevronRight size={18} className="text-slate-500"/>
            </div>
          </div>
        )}

        {activeTab === 'mine' && (
          <div className="flex flex-col items-center py-10 space-y-8 animate-in zoom-in-95">
            <button onClick={handleMine} className="relative group active:scale-90 transition-transform"><div className="absolute inset-0 bg-indigo-500 rounded-full blur-[60px] opacity-20"></div><PicoLogo size={200} /></button>
            <div className="text-center"><div className="text-3xl font-bold">+{Number(((0.25+(kycStatus==='verified'?0.5:0))*(isNodeRunning?4:1)).toFixed(2))}</div><div className="text-xs text-slate-400 uppercase tracking-widest">PiCo / Tap</div></div>
          </div>
        )}

        {activeTab === 'market' && (
           <div className="grid grid-cols-2 gap-3">
              {MARKET_ITEMS.map(i => (
                <div key={i.id} onClick={()=>buyItem(i)} className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center active:scale-95 transition-transform">
                   <div className="text-3xl mb-2">{i.icon}</div>
                   <div className="font-bold text-xs">{i.name}</div>
                   <div className="text-yellow-400 font-mono text-xs">{i.price} PiCo</div>
                </div>
              ))}
           </div>
        )}
        
        {activeTab === 'social' && <div className="text-center text-slate-500 mt-10"><Activity size={40} className="mx-auto mb-2 opacity-20"/>Coming Soon</div>}
      </main>

      <nav className="bg-slate-900/95 backdrop-blur border-t border-slate-800 p-2 flex justify-around pb-6 md:pb-2 z-10">
        {['dashboard', 'mine', 'social', 'market'].map(tab => (
          <button key={tab} onClick={()=>setActiveTab(tab)} className={`flex flex-col items-center gap-1 p-2 rounded-xl w-16 transition-all ${activeTab===tab ? 'text-indigo-400 -translate-y-1' : 'text-slate-500'}`}>
            {tab==='dashboard' && <PicoLogo size={22} className={activeTab===tab ? 'drop-shadow-lg' : 'grayscale opacity-50'}/>}
            {tab==='mine' && <Pickaxe size={22}/>}
            {tab==='social' && <Users size={22}/>}
            {tab==='market' && <ShoppingBag size={22}/>}
            <span className="text-[9px] font-bold uppercase tracking-wide">{t(tab === 'dashboard' ? 'home' : tab)}</span>
          </button>
        ))}
      </nav>
      {notification && <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-xl z-50 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 fade-in"><CheckCircle2 size={16}/> {notification}</div>}
    </div>
  );
};

// ==========================================
// ROOT COMPONENT (Responsive Split View)
// ==========================================
export default function PiCoEcosystem() {
  const [nodeActive, setNodeActive] = useState(false);
  const [view, setView] = useState('split');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => { const m = window.innerWidth < 768; setIsMobile(m); if(m) setView('mobile'); };
    checkMobile(); window.addEventListener('resize', checkMobile); return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-purple-500/30 overflow-hidden">
      <div className="hidden md:flex flex-col md:flex-row justify-between items-center p-6 border-b border-slate-800 gap-4 bg-slate-950">
         <div><h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">PiCo Ecosystem</h1><p className="text-slate-500 text-xs">Decentralized Mining & Social Hub</p></div>
         <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button onClick={() => setView('split')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'split' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>Split</button>
            <button onClick={() => setView('node')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'node' ? 'bg-purple-900/50 text-purple-200' : 'text-slate-500 hover:text-white'}`}>Node</button>
            <button onClick={() => setView('mobile')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'mobile' ? 'bg-indigo-900/50 text-indigo-200' : 'text-slate-500 hover:text-white'}`}>App</button>
         </div>
      </div>
      <div className="h-[calc(100vh-80px)] md:p-8 flex items-center justify-center">
         {isMobile ? <PicoApp isNodeRunning={false} /> : (
            <div className="w-full max-w-6xl h-[650px] relative">
               {view === 'split' && <div className="grid grid-cols-2 gap-8 h-full"><NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} /><div className="flex justify-center items-center bg-slate-900/30 rounded-3xl border border-slate-800/50"><div className="w-[320px] h-[640px] bg-black rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden ring-1 ring-white/10"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div><PicoApp isNodeRunning={nodeActive} /></div></div></div>}
               {view === 'node' && <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />}
               {view === 'mobile' && <div className="flex justify-center h-full items-center"><div className="w-[360px] h-[720px] bg-black rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden ring-1 ring-white/10"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl z-20"></div><PicoApp isNodeRunning={nodeActive} /></div></div>}
            </div>
         )}
      </div>
    </div>
  );
}