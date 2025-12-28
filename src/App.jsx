import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Server, Shield, Zap, Activity, Globe, Lock, Cpu, Play, Square,
  Pickaxe, ShoppingBag, Users, Heart, Send, Trophy, CheckCircle2, 
  Settings, History, BarChart3, X, ShieldCheck, Copy, LogIn, AlertCircle, 
  Clock, Check, Loader2, Wallet, Map, PieChart, Info, Smartphone, Monitor, ChevronRight
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  increment,
  onSnapshot, 
  collection
} from 'firebase/firestore';

// ==========================================
// 1. GLOBALNA KONFIGURACIJA & BACKEND SETUP
// ==========================================
const ENERGY_MAX = 100;
const ENERGY_REGEN_PER_SECOND = 0.5; 
const DAILY_BONUS = 1.0;
const REFERRAL_BONUS = 5.0;
const KYC_BONUS = 10.0;
const KYC_MINING_BOOST = 0.5;
const NODE_MULTIPLIER = 4.0;
const MAX_SUPPLY = 100000000;

// --- FIREBASE INIT ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// FIX: Sanitize appId to ensure valid Firestore path (remove slashes)
const appIdRaw = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const appId = appIdRaw.replace(/[^a-zA-Z0-9_-]/g, '_');

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    welcome: "Welcome", mine: "Mine", social: "Social", market: "Market", home: "Home", connect_wallet: "Click Logo to Enter", energy: "Energy", balance: "Balance", start_mining: "Start Mining Session", tap_mine: "Tap to Mine", cost_energy: "Cost: 10 Energy / Click", invite_friends: "Referral Team", buy: "Buy", tip: "Tip", like: "Like", post_placeholder: "What's happening in Pi Network?", items: "items", miner_level: "Pioneer Level", power: "Mining Rate", active_quests: "Checklist", claim: "Claim", leaderboard: "Leaderboard", top_miners: "Top Pioneers", transactions: "History", settings: "Settings", profile: "Pi Profile", language: "Language", change_name: "Verified Name", save: "Save", mined: "Mined", bought: "Bought", reward: "Reward", sent_tip: "Sent Tip", total_supply: "Total Supply", circulating: "Network Share", my_inventory: "Assets", insufficient_funds: "Insufficient funds!", wallet_connected: "Authenticated!", quest_completed: "Quest Completed!", post_published: "Post published!", item_bought: "You bought", tip_sent: "You sent a tip", pi_login_desc: "Authenticate to access the ecosystem.", kyc_status: "KYC Status", kyc_not_started: "Not Started", kyc_pending: "Pending Review", kyc_verified: "Verified ✅", kyc_start: "Start KYC Verification", kyc_simulating: "Verifying...", kyc_completed: "KYC Verified! +10 PiCo", mining_boost_kyc: "KYC Boost", enter_referral: "Referral Code", referral_bonus: "Referral Bonus", node_active: "Node Active"
  },
  hr: {
    welcome: "Dobrodošli", mine: "Rudari", social: "Društvo", market: "Trgovina", home: "Dom", connect_wallet: "Klikni Logo za Ulaz", energy: "Energija", balance: "Stanje", start_mining: "Započni Rudarenje", tap_mine: "Dodirni za Rudarenje", cost_energy: "Cijena: 10 Energije / Klik", invite_friends: "Referalni Tim", buy: "Kupi", tip: "Napojnica", like: "Sviđa mi se", post_placeholder: "Što se događa u Pi mreži?", items: "predmeta", miner_level: "Pioneer Razina", power: "Stopa Rudarenja", active_quests: "Lista Zadataka", claim: "Preuzmi", leaderboard: "Ljestvica", top_miners: "Najbolji Pioniri", transactions: "Povijest", settings: "Postavke", profile: "Pi Profil", language: "Jezik", change_name: "Verificirano Ime", save: "Spremi", mined: "Izrudareno", bought: "Kupljeno", reward: "Nagrada", sent_tip: "Poslana napojnica", total_supply: "Ukupna Zaliha", circulating: "Udio Mreže", my_inventory: "Imovina", insufficient_funds: "Nedovoljno sredstava!", wallet_connected: "Autentificirano!", quest_completed: "Zadatak Rješen!", post_published: "Objava uspješna!", item_bought: "Kupili ste", tip_sent: "Poslali ste napojnicu", pi_login_desc: "Prijavite se za pristup ekosustavu.", kyc_status: "KYC Status", kyc_not_started: "Nije započeto", kyc_pending: "Na pregledu", kyc_verified: "Verificirano ✅", kyc_start: "Započni KYC", kyc_simulating: "Provjeravam...", kyc_completed: "KYC Verificiran! +10 PiCo", mining_boost_kyc: "KYC Boost", enter_referral: "Referral Kod", referral_bonus: "Referral Bonus", node_active: "Čvor Aktivan"
  }
};

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const MARKET_ITEMS = [
  { id: 1, name: 'Titanium Pickaxe', price: 15.0, icon: '⛏️', desc: '+0.1 Mining Power' },
  { id: 2, name: 'Energy Drink', price: 5.0, icon: '⚡', desc: 'Full Energy Restore' },
  { id: 3, name: 'Lucky Charm', price: 25.0, icon: '🍀', desc: '2x Critical Chance' },
];

const QUESTS_DATA = [
  { id: 1, title: "Daily Login", reward: DAILY_BONUS, completed: false },
  { id: 2, title: "Invite a Friend", reward: 2.0, completed: false },
];

const LEADERBOARD_DATA = [
  { id: 1, name: "PiWhale_99", balance: 15430.2, avatar: "🐋" },
  { id: 2, name: "CoreTeamFan", balance: 8201.5, avatar: "⚡" },
  { id: 3, name: "Validator_1", balance: 4890.1, avatar: "✅" },
];

// ==========================================
// 2. HELPER FUNKCIJE & KOMPONENTE
// ==========================================
const getKycColor = (status) => {
  if (status === 'verified') return 'text-green-400';
  if (status === 'pending') return 'text-yellow-400';
  return 'text-slate-400';
};

const getKycIcon = (status, isProcessing) => {
  if (isProcessing) return <Loader2 size={18} className="animate-spin" />;
  if (status === 'verified') return <Check size={18} />;
  if (status === 'pending') return <Clock size={18} />;
  return <AlertCircle size={18} />;
};

const PicoLogo = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`${className} drop-shadow-2xl`}>
    <circle cx="60" cy="60" r="58" fill="url(#logoGradient)" stroke="url(#goldGradient)" strokeWidth="3" />
    <path d="M35 45 H85 M45 45 V80 M75 45 V80" stroke="white" strokeWidth="8" strokeLinecap="round" />
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

const SettingsModal = ({ onClose, t, language, setLanguage, userAvatar, username, referralCode, triggerNotification, kycStatus, isKycProcessing, startKyc, transactions }) => {
  // Helper to safely format date whether it's a Firestore Timestamp, Date object, or string
  const formatTime = (dateVal) => {
    if (!dateVal) return '';
    try {
      if (dateVal.toDate) return dateVal.toDate().toLocaleTimeString();
      return new Date(dateVal).toLocaleTimeString();
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="font-bold text-xl text-white flex items-center gap-2"><Settings size={20} /> {t('settings')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X size={20}/></button>
        </div>
        <div className="p-4 space-y-6 overflow-y-auto">
          <div className="flex gap-3 items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
             <div className="w-12 h-12 flex items-center justify-center text-2xl bg-indigo-600/20 rounded-full text-yellow-400 border border-indigo-500/30">{userAvatar}</div>
             <div className="flex-1">
               <p className="text-xs text-slate-500 uppercase">{t('profile')}</p>
               <p className="text-lg font-bold text-white flex items-center gap-2">{username} <CheckCircle2 size={16} className="text-green-500" /></p>
             </div>
          </div>
          
          {/* KYC Section */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
             <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase">{t('kyc_status')}</h3>
                <span className={`flex items-center gap-1 text-sm font-bold ${getKycColor(kycStatus)}`}>
                  {getKycIcon(kycStatus, isKycProcessing)} {t(kycStatus === 'not_started' ? 'kyc_not_started' : kycStatus === 'pending' ? 'kyc_pending' : 'kyc_verified')}
                </span>
             </div>
             {kycStatus === 'not_started' && (
               <button onClick={startKyc} disabled={isKycProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition">{t('kyc_start')}</button>
             )}
          </div>

          {/* Language */}
          <div className="grid grid-cols-2 gap-2">
             {LANGUAGES.map(lang => (
               <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${language === lang.code ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                 <span className="text-xl">{lang.flag}</span><span className="text-sm font-medium">{lang.label}</span>
               </button>
             ))}
          </div>

          {/* Transactions */}
          <div className="space-y-2">
             <h3 className="text-xs font-bold text-slate-500 uppercase">{t('transactions')}</h3>
             <div className="bg-slate-900 rounded-xl border border-slate-700 p-2 max-h-40 overflow-y-auto space-y-2">
               {transactions && transactions.length > 0 ? transactions.map(tx => (
                 <div key={tx.id} className="flex justify-between items-center text-xs p-2 rounded hover:bg-slate-800">
                   <span className="font-medium text-slate-300">{t(tx.descKey)}</span>
                   <div className="text-right">
                     <span className={`font-mono font-bold block ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(2)}</span>
                     <span className="text-[9px] text-slate-500">{formatTime(tx.date)}</span>
                   </div>
                 </div>
               )) : <div className="text-slate-500 text-center py-2">No transactions</div>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. NODE SIMULATOR (Lijeva strana)
// ==========================================
const NodeSimulator = ({ onStatusChange, isActive }) => {
  const [blockHeight, setBlockHeight] = useState(2850000);
  const [dockerStatus, setDockerStatus] = useState('STOPPED'); 
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);
  const consensusInterval = useRef(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);
  useEffect(() => {
    if (isActive && dockerStatus === 'STOPPED') toggleNode();
    return () => clearInterval(consensusInterval.current);
  }, [isActive]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { time: timestamp, msg: message, type }].slice(-20));
  };

  const toggleNode = () => {
    if (isActive) {
      if(dockerStatus === 'STOPPED') {
        setDockerStatus('STARTING');
        addLog('Initializing Pi Node (Docker Container)...', 'info');
        setTimeout(() => {
          setDockerStatus('RUNNING');
          addLog('Docker container started.', 'success');
          addLog('SCP (Stellar Consensus Protocol) Active.', 'success');
          
          consensusInterval.current = setInterval(() => {
            setBlockHeight(prev => {
              const newHeight = prev + 1;
              if (newHeight % 5 === 0) addLog(`SCP Consensus: Block #${newHeight.toLocaleString()}`, 'success');
              return newHeight;
            });
          }, 3000);
        }, 2000);
      }
    } else {
      setDockerStatus('STOPPED');
      clearInterval(consensusInterval.current);
      addLog('Node Service Stopped.', 'warning');
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 p-6 rounded-xl border border-slate-700 h-full flex flex-col font-mono shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white"><Server className="text-purple-500" /> Node Terminal</h2>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isActive ? 'bg-green-900/30 text-green-400 border-green-600' : 'bg-red-900/30 text-red-400 border-red-600'}`}>{isActive ? 'SYNCED' : 'OFFLINE'}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
           <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Block Height</div>
           <div className="text-2xl text-blue-400 font-bold">#{blockHeight.toLocaleString()}</div>
        </div>
        <button onClick={() => onStatusChange(!isActive)} className={`p-4 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${isActive ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {isActive ? <><Square size={18}/> STOP NODE</> : <><Play size={18}/> START NODE</>}
        </button>
      </div>
      <div className="flex-1 bg-black rounded-lg border border-slate-700 p-3 overflow-hidden flex flex-col text-xs shadow-inner">
         <div className="overflow-y-auto flex-1 space-y-1.5 custom-scrollbar">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2 font-mono"><span className="text-slate-600">[{log.time}]</span><span className={log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-slate-300'}>{log.msg}</span></div>
            ))}
            <div ref={logsEndRef} />
         </div>
      </div>
      <div className="mt-4 text-center text-xs text-slate-500">Running Node provides a <b>x{NODE_MULTIPLIER}</b> boost to the mobile app.</div>
    </div>
  );
};

// ==========================================
// 4. PICO APP (Desna strana - Integrirana)
// ==========================================
const PicoApp = ({ isNodeRunning }) => {
  // --- AUTH STATE ---
  const [firebaseUser, setFirebaseUser] = useState(null);
  
  // --- APP STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const userAvatar = '👤'; // Define simple avatar for now
  
  // Data State
  const [userData, setUserData] = useState({
    username: 'Guest',
    balance: 0,
    energy: ENERGY_MAX,
    baseMiningPower: 0.25,
    inventory: [],
    transactions: [],
    quests: QUESTS_DATA,
    kycStatus: 'not_started',
    referralCode: ''
  });

  // UI State
  const [language, setLanguage] = useState('hr');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotification, setShowNotification] = useState(null);
  const [posts, setPosts] = useState([{id:1, user:'PiCoreTeam', avatar:'π', content:'Welcome to the new ecosystem!', likes:999, tips:50}]);
  const [newPostContent, setNewPostContent] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const t = (key) => TRANSLATIONS[language][key] || key;

  // --- LOGIC ---
  const effectiveMiningPower = Number((
    (userData.baseMiningPower + (userData.kycStatus === 'verified' ? KYC_MINING_BOOST : 0)) * (isNodeRunning ? NODE_MULTIPLIER : 1)
  ).toFixed(2));

  // --- FIREBASE AUTH & SYNC ---
  useEffect(() => {
    // 1. Auth Init
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();

    // 2. Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // 3. Realtime Data Sync
  useEffect(() => {
    if (!firebaseUser) return;
    
    // Using sanitized appId
    const userDocRef = doc(db, 'artifacts', appId, 'users', firebaseUser.uid, 'data', 'profile');
    
    const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(prev => ({ ...prev, ...data }));
        setWalletConnected(true); // Auto-login if data exists
      }
    });

    return () => unsubscribeSnapshot();
  }, [firebaseUser]);

  // 4. Energy Regen (Local + Sync)
  useEffect(() => {
    if(!walletConnected) return;
    const timer = setInterval(() => {
        if(userData.energy < ENERGY_MAX) {
            const newEnergy = Math.min(userData.energy + ENERGY_REGEN_PER_SECOND, ENERGY_MAX);
            setUserData(prev => ({...prev, energy: newEnergy}));
        }
    }, 1000);
    return () => clearInterval(timer);
  }, [walletConnected, userData.energy]);


  // --- ACTIONS ---
  const triggerNotification = (msg) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const connectWallet = async () => {
    if(!firebaseUser) return;
    setIsAuthenticating(true);
    
    // Simulate Pi SDK delay
    setTimeout(async () => {
        // Mock Pi Username
        const piUsername = "PiUser_" + Math.floor(Math.random()*1000);
        const newUserData = {
            username: piUsername,
            balance: 1.0, // Welcome bonus
            energy: ENERGY_MAX,
            baseMiningPower: 0.25,
            kycStatus: 'not_started',
            referralCode: 'REF' + Math.floor(Math.random()*10000),
            transactions: [] // Ensure transactions array exists
        };

        // Create initial doc in Firestore
        const userDocRef = doc(db, 'artifacts', appId, 'users', firebaseUser.uid, 'data', 'profile');
        
        // Check if exists first to not overwrite
        const docSnap = await getDoc(userDocRef);
        if(!docSnap.exists()) {
            await setDoc(userDocRef, newUserData);
            triggerNotification("Welcome Bonus: +1.0 PiCo");
        }
        
        setWalletConnected(true);
        setIsAuthenticating(false);
    }, 1500);
  };

  const updateRemoteState = async (updates) => {
      if(!firebaseUser) return;
      const userDocRef = doc(db, 'artifacts', appId, 'users', firebaseUser.uid, 'data', 'profile');
      await updateDoc(userDocRef, updates);
  };

  const handleMine = async () => {
    if (userData.energy < 10) { triggerNotification(t('cost_energy')); return; }
    
    const mined = effectiveMiningPower;
    const newBalance = userData.balance + mined;
    const newEnergy = userData.energy - 10;

    // Optimistic Update
    setUserData(prev => ({...prev, balance: newBalance, energy: newEnergy}));
    triggerNotification(`+${mined.toFixed(2)} PiCo`);

    // Sync to DB
    await updateRemoteState({
        balance: increment(mined),
        energy: newEnergy
    });
  };

  const buyItem = async (item) => {
      if(userData.balance >= item.price) {
          const newBalance = userData.balance - item.price;
          setUserData(prev => ({...prev, balance: newBalance})); // Optimistic
          triggerNotification("Bought " + item.name);
          
          let updates = { balance: newBalance };
          if(item.id === 2) updates.energy = ENERGY_MAX;
          
          // Log transaction
          const newTx = {
              id: Date.now(),
              type: 'expense',
              amount: item.price,
              descKey: 'item_bought',
              date: new Date() // Will be saved as Timestamp in Firestore
          };
          updates.transactions = arrayUnion(newTx);
          
          await updateRemoteState(updates);
      } else {
          triggerNotification(t('insufficient_funds'));
      }
  };

  const startKyc = async () => {
      setUserData(prev => ({...prev, kycStatus: 'pending'}));
      triggerNotification(t('kyc_simulating'));
      
      // Simulate backend process
      setTimeout(async () => {
          await updateRemoteState({
              kycStatus: 'verified',
              balance: increment(KYC_BONUS)
          });
          triggerNotification(t('kyc_completed'));
      }, 3000);
  };

  // --- RENDER LOGIN ---
  if (!walletConnected) {
    return (
      <div className="h-full bg-slate-900 text-white flex flex-col items-center justify-between p-6 relative overflow-hidden">
        <div className="z-10 mt-10 text-center space-y-6">
           <div onClick={connectWallet} className="cursor-pointer group relative">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 animate-pulse rounded-full group-hover:opacity-50 transition-opacity"></div>
              <PicoLogo size={140} className="relative z-10" />
              <div className="mt-4 text-sm text-indigo-300 uppercase tracking-widest animate-bounce">{t('click_enter')}</div>
           </div>
           <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">PiCo Network</h1>
              <p className="text-slate-400 text-sm mt-2">{t('pi_login_desc')}</p>
           </div>
        </div>
        {isAuthenticating && <div className="z-10 flex items-center gap-2 text-indigo-400"><Loader2 className="animate-spin"/> Authenticating...</div>}
      </div>
    );
  }

  // --- RENDER MAIN APP ---
  return (
    <div className="h-full bg-slate-900 text-white flex flex-col font-sans relative overflow-hidden">
      
      {/* MODALS */}
      {showProfileModal && <SettingsModal onClose={() => setShowProfileModal(false)} t={t} language={language} setLanguage={setLanguage} userAvatar={userAvatar} username={userData.username} referralCode={userData.referralCode} triggerNotification={triggerNotification} kycStatus={userData.kycStatus} startKyc={startKyc} transactions={userData.transactions} />}
      {showNotification && <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-indigo-600 px-4 py-2 rounded-full shadow-lg z-50 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2"><CheckCircle2 size={16}/> {showNotification}</div>}

      {/* HEADER */}
      <header className="bg-slate-900/95 backdrop-blur border-b border-slate-800 p-4 flex justify-between items-center z-20">
         <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700" onClick={() => setShowProfileModal(true)}>{userAvatar}</div>
            <div className="flex flex-col">
               <span className="text-xs text-slate-400 font-bold">{t('energy')}</span>
               <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{width: `${userData.energy}%`}}></div></div>
            </div>
         </div>
         <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2">
            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="font-mono font-bold">{userData.balance.toFixed(2)}</span>
         </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
         
         {activeTab === 'dashboard' && (
            <div className="space-y-6">
               {/* MINING CARD */}
               <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10"><PicoLogo size={200}/></div>
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                     <div>
                        <h2 className="text-slate-300 text-xs uppercase tracking-widest">{t('power')}</h2>
                        <div className="text-4xl font-bold flex items-center justify-center gap-2"><Pickaxe size={28} className="text-yellow-400"/> {effectiveMiningPower}/h</div>
                     </div>
                     <button onClick={() => setActiveTab('mine')} className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-indigo-50 transition active:scale-95 w-full">{t('mine')}</button>
                  </div>
               </div>

               {/* NODE STATUS WIDGET */}
               <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${isNodeRunning ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="flex items-center gap-3">
                     <Server size={24} className={isNodeRunning ? "text-green-400" : "text-slate-500"} />
                     <div>
                        <div className="font-bold text-sm text-white">Node Connection</div>
                        <div className="text-xs text-slate-400">{isNodeRunning ? "Active (x4.0 Boost)" : "Inactive"}</div>
                     </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${isNodeRunning ? 'bg-green-400 animate-pulse' : 'bg-slate-600'}`}></div>
               </div>

               {/* LEADERBOARD WIDGET */}
               <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                  <div onClick={() => setShowLeaderboard(!showLeaderboard)} className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-750">
                     <h3 className="font-bold flex items-center gap-2"><Trophy size={16} className="text-yellow-400"/> {t('leaderboard')}</h3>
                     <ChevronRight size={16} className={`transition-transform ${showLeaderboard ? 'rotate-90' : ''}`}/>
                  </div>
                  {showLeaderboard && (
                     <div className="border-t border-slate-700">
                        {LEADERBOARD_DATA.map((u,i) => (
                           <div key={i} className="p-3 flex justify-between items-center text-sm border-b border-slate-700/50 last:border-0">
                              <div className="flex items-center gap-3"><span className="text-slate-500">#{i+1}</span> <span>{u.avatar} {u.name}</span></div>
                              <span className="font-mono text-indigo-300">{u.balance.toFixed(0)}</span>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         )}

         {activeTab === 'mine' && (
            <div className="flex flex-col items-center py-10 space-y-8">
               <button onClick={handleMine} className="relative group active:scale-95 transition-transform">
                  <div className="absolute inset-0 bg-indigo-500 blur-[50px] opacity-20 group-hover:opacity-40 rounded-full transition-opacity"></div>
                  <PicoLogo size={220} />
               </button>
               <div className="text-center">
                  <div className="text-3xl font-bold text-white">+{effectiveMiningPower}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">PiCo / Tap</div>
               </div>
            </div>
         )}

         {activeTab === 'market' && (
            <div className="grid grid-cols-2 gap-3">
               {MARKET_ITEMS.map(item => (
                  <div key={item.id} onClick={() => buyItem(item)} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex flex-col items-center text-center hover:border-indigo-500 cursor-pointer transition-colors">
                     <div className="text-3xl mb-2">{item.icon}</div>
                     <div className="font-bold text-xs mb-1">{item.name}</div>
                     <div className="text-yellow-400 font-mono text-xs font-bold">{item.price} PiCo</div>
                  </div>
               ))}
            </div>
         )}

         {activeTab === 'social' && (
            <div className="space-y-4">
               <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center">{userAvatar}</div>
                  <input value={newPostContent} onChange={(e)=>setNewPostContent(e.target.value)} placeholder={t('post_placeholder')} className="bg-transparent flex-1 text-sm outline-none placeholder-slate-500"/>
                  <button onClick={()=>{if(newPostContent){setPosts([{id:Date.now(), user:userData.username, avatar:userAvatar, content:newPostContent, likes:0, tips:0}, ...posts]); setNewPostContent('');}}}><Send size={16} className="text-indigo-400"/></button>
               </div>
               {posts.map(post => (
                  <div key={post.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
                     <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">{post.avatar}</div>
                        <div><div className="font-bold text-sm">{post.user}</div><div className="text-[10px] text-slate-500">Just now</div></div>
                     </div>
                     <p className="text-sm text-slate-300 pl-11">{post.content}</p>
                     <div className="flex gap-4 pl-11 text-xs font-bold text-slate-500"><span className="flex items-center gap-1"><Heart size={12}/> {post.likes}</span><span className="flex items-center gap-1"><Trophy size={12}/> {post.tips}</span></div>
                  </div>
               ))}
            </div>
         )}

      </main>

      {/* BOTTOM NAV */}
      <nav className="bg-slate-900/95 backdrop-blur border-t border-slate-800 p-2 flex justify-around pb-6 md:pb-2">
         <NavButton active={activeTab==='dashboard'} onClick={()=>setActiveTab('dashboard')} icon={<PicoLogo size={22}/>} label={t('home')}/>
         <NavButton active={activeTab==='mine'} onClick={()=>setActiveTab('mine')} icon={<Pickaxe size={22}/>} label={t('mine')}/>
         <NavButton active={activeTab==='social'} onClick={()=>setActiveTab('social')} icon={<Users size={22}/>} label={t('social')}/>
         <NavButton active={activeTab==='market'} onClick={()=>setActiveTab('market')} icon={<ShoppingBag size={22}/>} label={t('market')}/>
      </nav>
    </div>
  );
};

const NavButton = ({active, onClick, icon, label}) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${active ? 'text-indigo-400 -translate-y-1' : 'text-slate-500'}`}>
     <div className={active ? 'scale-110 drop-shadow-lg' : ''}>{icon}</div>
     <span className="text-[9px] font-bold uppercase tracking-wide">{label}</span>
  </button>
);

// ==========================================
// 5. ROOT COMPONENT (Split View Container)
// ==========================================
export default function PiCoEcosystem() {
  const [nodeActive, setNodeActive] = useState(false);
  const [view, setView] = useState('split'); 

  return (
    <div className="min-h-screen bg-black text-slate-200 p-4 md:p-8 font-sans selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto h-[850px] md:h-[700px] flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-center pb-4 border-b border-slate-800 gap-4">
           <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">PiCo Ecosystem</h1>
              <p className="text-slate-500 text-sm">Integrated Node Consensus & Mobile Application</p>
           </div>
           <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button onClick={() => setView('split')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'split' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>Split View</button>
              <button onClick={() => setView('node')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'node' ? 'bg-purple-900/50 text-purple-200 border border-purple-500/30' : 'text-slate-500 hover:text-white'}`}>Node Only</button>
              <button onClick={() => setView('mobile')} className={`px-4 py-2 text-xs font-bold rounded transition-colors ${view === 'mobile' ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-500/30' : 'text-slate-500 hover:text-white'}`}>App Only</button>
           </div>
        </div>

        <div className="flex-1 relative">
           {view === 'split' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />
                <div className="flex justify-center items-center bg-slate-900/50 rounded-2xl border border-slate-800 p-4">
                   <div className="w-[360px] h-[720px] bg-black rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-xl z-20"></div>
                      <PicoApp isNodeRunning={nodeActive} />
                   </div>
                </div>
             </div>
           )}
           {view === 'node' && <NodeSimulator isActive={nodeActive} onStatusChange={setNodeActive} />}
           {view === 'mobile' && (
              <div className="flex justify-center h-full">
                 <div className="w-[375px] h-full bg-black rounded-[2.5rem] shadow-2xl border-[8px] border-slate-800 relative overflow-hidden">
                     <PicoApp isNodeRunning={nodeActive} />
                 </div>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}