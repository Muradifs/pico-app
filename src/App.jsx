import React, { useState, useEffect } from 'react';
import { 
  Pickaxe, ShoppingBag, Users, Heart, Send, Zap, Trophy,
  CheckCircle2, Settings, History, BarChart3, X,
  ShieldCheck, Copy, LogIn, AlertCircle, Clock, Check, Activity, Loader2,
  Wallet, Globe
} from 'lucide-react';

// --- CONFIGURATION ---
const ENERGY_MAX = 100;
const ENERGY_REGEN_PER_SECOND = 1 / 14.4; 
const DAILY_BONUS = 1.0;
const REFERRAL_BONUS = 5.0;
const KYC_BONUS = 10.0;
const KYC_MINING_BOOST = 0.5;
const MAX_SUPPLY = 100000000;

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  en: {
    welcome: "Welcome",
    mine: "Mine",
    social: "Social",
    market: "Market",
    home: "Home",
    connect_wallet: "Login with Pi",
    click_enter: "Click to Enter",
    energy: "Energy",
    balance: "Balance",
    start_mining: "Start Mining Session",
    tap_mine: "Tap to Mine",
    cost_energy: "Cost: 10 Energy / Click",
    invite_friends: "Referral Team",
    invite_desc: "Build your Security Circle.",
    buy: "Buy",
    tip: "Tip",
    like: "Like",
    post_placeholder: "What's happening in Pi Network?",
    items: "items",
    miner_level: "Pioneer Level",
    power: "Mining Rate",
    active_quests: "Checklist",
    claim: "Claim",
    leaderboard: "Leaderboard",
    top_miners: "Top Pioneers",
    transactions: "History",
    settings: "Settings",
    profile: "Pi Profile",
    language: "Language",
    change_name: "Verified Name",
    save: "Save",
    mined: "Mined",
    bought: "Bought",
    reward: "Reward",
    sent_tip: "Sent Tip",
    total_supply: "Total Supply",
    circulating: "Network Share",
    my_inventory: "Assets",
    insufficient_funds: "Insufficient funds!",
    wallet_connected: "Authenticated with Pi Network!",
    quest_completed: "Quest Completed!",
    post_published: "Post published!",
    item_bought: "You bought",
    tip_sent: "You sent a tip",
    pi_login_desc: "Authenticate with your Pi Account to access the ecosystem.",
    kyc_status: "KYC Status",
    kyc_not_started: "Not Started",
    kyc_pending: "Pending Review",
    kyc_verified: "Verified ✅",
    kyc_start: "Start KYC Verification",
    kyc_simulating: "Verifying documents...",
    kyc_completed: "KYC Verified! +10 PiCo",
    mining_boost_kyc: "KYC Boost",
    enter_referral: "Referral Code (Optional)",
    referral_bonus: "Referral Bonus",
    not_pi_browser: "Please open this app in the Pi Browser."
  },
  hr: {
    welcome: "Dobrodošli",
    mine: "Rudari",
    social: "Društvo",
    market: "Trgovina",
    home: "Dom",
    connect_wallet: "Prijava putem Pi-a",
    click_enter: "Klikni za Ulaz",
    energy: "Energija",
    balance: "Stanje",
    start_mining: "Započni Rudarenje",
    tap_mine: "Dodirni za Rudarenje",
    cost_energy: "Cijena: 10 Energije / Klik",
    invite_friends: "Referalni Tim",
    invite_desc: "Izgradi svoj Krug Sigurnosti.",
    buy: "Kupi",
    tip: "Napojnica",
    like: "Sviđa mi se",
    post_placeholder: "Što se događa u Pi mreži?",
    items: "predmeta",
    miner_level: "Pioneer Razina",
    power: "Stopa Rudarenja",
    active_quests: "Lista Zadataka",
    claim: "Preuzmi",
    leaderboard: "Ljestvica",
    top_miners: "Najbolji Pioniri",
    transactions: "Povijest",
    settings: "Postavke",
    profile: "Pi Profil",
    language: "Jezik",
    change_name: "Verificirano Ime",
    save: "Spremi",
    mined: "Izrudareno",
    bought: "Kupljeno",
    reward: "Nagrada",
    sent_tip: "Poslana napojnica",
    total_supply: "Ukupna Zaliha",
    circulating: "Udio Mreže",
    my_inventory: "Imovina",
    insufficient_funds: "Nedovoljno sredstava!",
    wallet_connected: "Autentificirano putem Pi Mreže!",
    quest_completed: "Zadatak Rješen!",
    post_published: "Objava uspješna!",
    item_bought: "Kupili ste",
    tip_sent: "Poslali ste napojnicu",
    pi_login_desc: "Prijavite se svojim Pi Računom za pristup ekosustavu.",
    kyc_status: "KYC Status",
    kyc_not_started: "Nije započeto",
    kyc_pending: "Na pregledu",
    kyc_verified: "Verificirano ✅",
    kyc_start: "Započni KYC Verifikaciju",
    kyc_simulating: "Provjeravam dokumente...",
    kyc_completed: "KYC Verificiran! +10 PiCo",
    mining_boost_kyc: "KYC Boost",
    enter_referral: "Referral Kod (Opcionalno)",
    referral_bonus: "Referral Bonus",
    not_pi_browser: "Molimo otvorite ovu aplikaciju u Pi Browseru."
  },
  // ... (Ostali jezici ostaju isti)
  fr: { welcome: "Bienvenue", mine: "Miner", social: "Social", market: "Marché", home: "Accueil", connect_wallet: "Connexion avec Pi", click_enter: "Cliquer pour Entrer", energy: "Énergie", balance: "Solde", start_mining: "Démarrer le Minage", tap_mine: "Appuyez pour Miner", cost_energy: "Coût: 10 Énergie / Clic", invite_friends: "Équipe de Parrainage", invite_desc: "Construisez votre Cercle de Sécurité.", buy: "Acheter", tip: "Pourboire", like: "J'aime", post_placeholder: "Quoi de neuf sur Pi Network ?", items: "objets", miner_level: "Niveau Pionnier", power: "Taux de Minage", active_quests: "Check-list", claim: "Réclamer", leaderboard: "Classement", top_miners: "Meilleurs Pionniers", transactions: "Historique", settings: "Paramètres", profile: "Profil Pi", language: "Langue", change_name: "Nom Vérifié", save: "Sauvegarder", mined: "Miné", bought: "Acheté", reward: "Récompense", sent_tip: "Pourboire envoyé", total_supply: "Offre Totale", circulating: "Part du Réseau", my_inventory: "Actifs", insufficient_funds: "Fonds insuffisants!", wallet_connected: "Authentifié avec Pi Network !", quest_completed: "Quête Terminée !", post_published: "Post publié !", item_bought: "Vous avez acheté", tip_sent: "Vous avez envoyé un pourboire", pi_login_desc: "Authentifiez-vous avec votre compte Pi.", kyc_status: "Statut KYC", kyc_not_started: "Non commencé", kyc_pending: "En attente", kyc_verified: "Vérifié ✅", kyc_start: "Démarrer KYC", kyc_simulating: "Vérification...", kyc_completed: "KYC Vérifié!", mining_boost_kyc: "Boost KYC", enter_referral: "Code de Parrainage", referral_bonus: "Bonus Parrainage", not_pi_browser: "Veuillez ouvrir dans Pi Browser." },
  de: { welcome: "Willkommen", mine: "Minen", social: "Sozial", market: "Markt", home: "Start", connect_wallet: "Mit Pi Anmelden", click_enter: "Klicken zum Betreten", energy: "Energie", balance: "Guthaben", start_mining: "Mining Starten", tap_mine: "Tippen zum Minen", cost_energy: "Kosten: 10 Energie / Klick", invite_friends: "Referral Team", invite_desc: "Baue deinen Sicherheitskreis auf.", buy: "Kaufen", tip: "Trinkgeld", like: "Gefällt mir", post_placeholder: "Was passiert im Pi Network?", items: "Gegenstände", miner_level: "Pioneer Level", power: "Mining Rate", active_quests: "Checkliste", claim: "Beanspruchen", leaderboard: "Bestenliste", top_miners: "Top Pioniere", transactions: "Verlauf", settings: "Einstellungen", profile: "Pi Profil", language: "Sprache", change_name: "Verifizierter Name", save: "Speichern", mined: "Gemint", bought: "Gekauft", reward: "Belohnung", sent_tip: "Trinkgeld gesendet", total_supply: "Gesamtangebot", circulating: "Netzwerkanteil", my_inventory: "Vermögen", insufficient_funds: "Unzureichendes Guthaben!", wallet_connected: "Authentifiziert mit Pi Network!", quest_completed: "Quest Abgeschlossen!", post_published: "Post veröffentlicht!", item_bought: "Du hast gekauft", tip_sent: "Du hast Trinkgeld gesendet", pi_login_desc: "Authentifiziere dich mit deinem Pi Account.", kyc_status: "KYC Status", kyc_not_started: "Nicht gestartet", kyc_pending: "Ausstehend", kyc_verified: "Verifiziert ✅", kyc_start: "KYC Starten", kyc_simulating: "Überprüfung...", kyc_completed: "KYC Verifiziert!", mining_boost_kyc: "KYC Boost", enter_referral: "Empfehlungscode", referral_bonus: "Empfehlungsbonus", not_pi_browser: "Bitte im Pi Browser öffnen." }
};

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hr', label: 'Hrvatski', flag: '🇭🇷' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

// --- LOGO COMPONENT ---
const PicoLogo = ({ size = 40, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} drop-shadow-2xl`}>
    <circle cx="60" cy="60" r="58" fill="url(#logoGradient)" stroke="url(#goldGradient)" strokeWidth="3" />
    <circle cx="60" cy="60" r="48" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
    <path d="M35 45 H85" stroke="white" strokeWidth="10" strokeLinecap="round" />
    <path d="M45 45 V80" stroke="white" strokeWidth="10" strokeLinecap="round" />
    <path d="M75 45 V80" stroke="white" strokeWidth="10" strokeLinecap="round" />
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
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
  </svg>
);

// --- HELPERS ---
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

// --- DATA ---
const MARKET_ITEMS = [
  { id: 1, name: 'Titanium Pickaxe', price: 15.0, icon: '⛏️', desc: '+0.1 Mining Power' },
  { id: 2, name: 'Energy Drink', price: 5.0, icon: '⚡', desc: 'Full Energy Restore' },
  { id: 3, name: 'Lucky Charm', price: 25.0, icon: '🍀', desc: '2x Critical Chance' },
];

const INITIAL_POSTS = [
  { id: 101, user: 'CryptoKing', avatar: '🦁', content: 'KYC Verified finally! Mining speed is insane now! 🚀', likes: 45, tips: 5.5 },
  { id: 102, user: 'Ana_HR', avatar: '👩', content: 'Sviđa mi se novi dizajn. PiCo to the moon!', likes: 23, tips: 1.2 },
];

const QUESTS_DATA = [
  { id: 1, title: "Daily Login", reward: DAILY_BONUS, completed: false },
  { id: 2, title: "Invite a Friend", reward: 2.0, completed: false },
];

const LEADERBOARD_DATA = [
  { id: 1, name: "PiWhale_99", balance: 15430.2, avatar: "🐋" },
  { id: 2, name: "CoreTeamFan", balance: 8201.5, avatar: "⚡" },
  { id: 3, name: "Validator_1", balance: 4890.1, avatar: "✅" },
  { id: 4, name: "Pioneer_X", balance: 1950.4, avatar: "🚀" },
];

// --- STORAGE HELPER ---
const loadState = () => {
  try {
    const saved = localStorage.getItem('picoAppState_v3');
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

const saveState = (state) => {
  try {
    localStorage.setItem('picoAppState_v3', JSON.stringify(state));
  } catch (e) { console.warn('Save failed', e); }
};

// --- COMPONENTS ---

const SettingsModal = ({ 
  onClose, t, language, setLanguage, userAvatar, username, referralCode, 
  triggerNotification, kycStatus, isKycProcessing, startKyc, transactions, KYC_MINING_BOOST 
}) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h2 className="font-bold text-xl text-white flex items-center gap-2"><Settings size={20} /> {t('settings')}</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400"><X size={20}/></button>
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto">
        {/* User Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase">{t('profile')}</h3>
          <div className="flex gap-3 items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
            <div className="w-12 h-12 flex items-center justify-center text-2xl bg-indigo-600/20 rounded-full text-yellow-400 border border-indigo-500/30">
              {userAvatar}
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500 uppercase">{t('change_name')}</p>
              <p className="text-lg font-bold text-white flex items-center gap-2">
                {username} <CheckCircle2 size={16} className="text-green-500" />
              </p>
            </div>
          </div>
          {/* Referral */}
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
              <span className={`flex items-center gap-1 text-sm font-bold ${getKycColor(kycStatus)}`}>
                {getKycIcon(kycStatus, isKycProcessing)}
                {t(kycStatus === 'not_started' ? 'kyc_not_started' : kycStatus === 'pending' ? 'kyc_pending' : 'kyc_verified')}
              </span>
           </div>
           {kycStatus === 'not_started' && (
             <button onClick={startKyc} disabled={isKycProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition">
               {t('kyc_start')}
             </button>
           )}
           {kycStatus === 'verified' && <p className="text-xs text-green-400 bg-green-400/10 p-2 rounded text-center">Mining Boost Active (+{KYC_MINING_BOOST})</p>}
        </div>

        {/* Language */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-500 uppercase">{t('language')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${language === lang.code ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm font-medium">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2"><History size={14} /> {t('transactions')}</h3>
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-2 max-h-40 overflow-y-auto space-y-2">
            {transactions.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-4">No transactions yet.</p>
            ) : (
              transactions.map(tx => (
                <div key={tx.id} className="flex justify-between items-center text-xs p-2 rounded hover:bg-slate-800">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-300">{t(tx.descKey)} {tx.item ? `(${tx.item})` : ''}</span>
                    <span className="text-slate-500 text-[10px]">{tx.date.toLocaleTimeString()}</span>
                  </div>
                  <span className={`font-mono font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(4)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Nav Button Component
const NavButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all w-16 ${active ? 'text-indigo-400 transform -translate-y-1' : 'text-slate-500 hover:text-slate-300'}`}>
    <div className={active ? 'scale-110 transition-transform' : ''}>{icon}</div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const savedState = loadState();

  // STATE
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false); // Reset to false to force SDK check
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isPiBrowser, setIsPiBrowser] = useState(false);
  
  // User Data
  const [username, setUsername] = useState(savedState?.username || 'Guest');
  const [userAvatar, setUserAvatar] = useState(savedState?.userAvatar || '👤');
  const [referralCode, setReferralCode] = useState(savedState?.referralCode || '');
  const [referralInput, setReferralInput] = useState('');
  
  // Economy
  const [balance, setBalance] = useState(savedState?.balance || 0);
  const [energy, setEnergy] = useState(savedState?.energy ?? ENERGY_MAX);
  const [baseMiningPower, setBaseMiningPower] = useState(savedState?.baseMiningPower || 0.25);
  const [inventory, setInventory] = useState(savedState?.inventory || []);
  const [transactions, setTransactions] = useState(savedState?.transactions || []);
  const [quests, setQuests] = useState(savedState?.quests || QUESTS_DATA);

  // Stats
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globalMined, setGlobalMined] = useState(42851900.2341);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // KYC
  const [kycStatus, setKycStatus] = useState(savedState?.kycStatus || 'not_started');
  const [isKycProcessing, setIsKycProcessing] = useState(false);

  // UI
  const [language, setLanguage] = useState(savedState?.language || 'hr');
  const [showNotification, setShowNotification] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState('');

  const t = (key) => TRANSLATIONS[language][key] || key;

  // --- CALCULATED VALUES ---
  const effectiveMiningPower = Number((
    baseMiningPower + 
    (kycStatus === 'verified' ? KYC_MINING_BOOST : 0)
  ).toFixed(2));

  // --- EFFECTS ---
  useEffect(() => {
    // Check if running inside Pi Browser
    if (window.Pi) {
      setIsPiBrowser(true);
      try {
        window.Pi.init({ version: "2.0", sandbox: true }); // Running in SANDBOX (Testnet)
      } catch (e) {
        console.error("Pi Init Error:", e);
      }
    } else {
      setIsPiBrowser(false);
    }
  }, []);

  useEffect(() => {
    saveState({
      walletConnected, username, userAvatar, referralCode,
      balance, energy, baseMiningPower, inventory, transactions,
      kycStatus, language, quests
    });
  }, [walletConnected, username, userAvatar, referralCode, balance, energy, baseMiningPower, inventory, transactions, kycStatus, language, quests]);

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prev => Math.min(prev + ENERGY_REGEN_PER_SECOND, ENERGY_MAX));
      setCurrentTime(new Date());
      setGlobalMined(prev => prev + (Math.random() * 2));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- ACTIONS ---
  const triggerNotification = (msg) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const addTransaction = (type, amount, descKey, item = null) => {
    const newTx = {
      id: Date.now(),
      type, amount, descKey, item, date: new Date()
    };
    setTransactions(prev => [newTx, ...prev].slice(0, 50));
  };

  // ROBUST AUTHENTICATION WITH TIMEOUT FALLBACK
  const connectWallet = async () => {
    setIsAuthenticating(true);

    try {
      let userConfig = { username: "Guest", uid: "guest" };

      if (isPiBrowser) {
        try {
          const scopes = ['username', 'payments'];
          const onIncompletePaymentFound = (payment) => {
            console.log("Incomplete payment found", payment);
          };

          // Race condition: Pi Auth vs 5s Timeout
          const authResult = await Promise.race([
            window.Pi.authenticate(scopes, onIncompletePaymentFound),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
          ]);
          
          userConfig = authResult.user;
        } catch (e) {
          console.warn("Pi Auth failed or timed out. Switching to Demo Mode.", e);
          triggerNotification("Entering Demo Mode (Auth Issue)");
          // Fallback data
          userConfig = { username: "Test_Pioneer", uid: "test_123" };
        }
      } else {
        // Not in Pi Browser - Demo Mode
        triggerNotification("Desktop Detected. Demo Mode Active.");
        userConfig = { username: "Desktop_User", uid: "desktop_123" };
        await new Promise(r => setTimeout(r, 1000));
      }

      // Login Success Logic
      setUsername(userConfig.username);
      setUserAvatar('🥧');
      setWalletConnected(true);

      if (!referralCode) {
        setReferralCode("REF" + Math.random().toString(36).substr(2, 6).toUpperCase());
      }

      if (balance === 0) {
        let initialAmount = 1.0;
        if (referralInput && referralInput.length > 3) {
           initialAmount += REFERRAL_BONUS;
           triggerNotification(`${t('referral_bonus')} +${REFERRAL_BONUS} PiCo!`);
        }
        setBalance(initialAmount);
        addTransaction('income', initialAmount, 'wallet_connected');
      } else {
        triggerNotification(t('wallet_connected'));
      }

    } catch (err) {
      console.error("Critical Login Error", err);
      triggerNotification("Login Failed. Try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const startKyc = async () => {
    if (kycStatus !== 'not_started') return;
    setIsKycProcessing(true);
    triggerNotification(t('kyc_simulating'));
    setKycStatus('pending');
    
    setTimeout(() => {
        setKycStatus('verified');
        setIsKycProcessing(false);
        setBalance(prev => prev + KYC_BONUS);
        addTransaction('income', KYC_BONUS, 'kyc_completed');
        triggerNotification(t('kyc_completed'));
    }, 3000);
  };

  const handleMine = () => {
    if (energy < 10) {
      triggerNotification(t('cost_energy'));
      return;
    }
    setEnergy(prev => prev - 10);
    
    const hasCrit = inventory.some(i => i.id === 3) && Math.random() > 0.8;
    const minedAmount = Number((effectiveMiningPower * (hasCrit ? 2 : 1)).toFixed(4));
    
    setBalance(prev => prev + minedAmount);
    addTransaction('income', minedAmount, 'mined');
    triggerNotification(`${t('mined')} ${minedAmount} PiCo${hasCrit ? ' 🔥 CRIT!' : ''}`);
  };

  const buyItem = (item) => {
    if (balance < item.price) {
      triggerNotification(t('insufficient_funds'));
      return;
    }
    setBalance(prev => prev - item.price);
    
    if (item.id === 1) setBaseMiningPower(prev => prev + 0.1); 
    if (item.id === 2) setEnergy(ENERGY_MAX);
    if (item.id !== 2) setInventory(prev => [...prev, item]);

    addTransaction('expense', item.price, 'item_bought', item.name);
    triggerNotification(`${t('item_bought')} ${item.name}`);
  };

  const handlePost = () => {
    if (!newPostContent.trim()) return;
    const newPost = {
      id: posts.length + 1,
      user: username,
      avatar: userAvatar,
      content: newPostContent,
      likes: 0,
      tips: 0
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    triggerNotification(t('post_published'));
  };

  const claimQuest = (questId) => {
    setQuests(quests.map(q => {
      if (q.id === questId && !q.completed) {
        setBalance(prev => prev + q.reward);
        addTransaction('income', q.reward, 'quest_completed');
        triggerNotification(`${t('quest_completed')} +${q.reward} PiCo`);
        return { ...q, completed: true };
      }
      return q;
    }));
  };

  // --- MAIN RENDER ---
  if (!walletConnected) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-between p-6 relative overflow-hidden">
        {/* Top Info: Clock & Language */}
        <div className="w-full flex justify-between items-start z-20">
          <div className="text-left">
            <h2 className="text-2xl font-bold font-mono text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </h2>
            <p className="text-sm text-slate-400">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
          <button onClick={() => setLanguage(language === 'en' ? 'hr' : 'en')} className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
             <span>{LANGUAGES.find(l => l.code === language).flag}</span>
             <span className="text-xs font-bold uppercase">{language}</span>
          </button>
        </div>

        {/* Center: Interactive Logo */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-10 z-10 w-full max-w-md">
          <div onClick={connectWallet} className="group cursor-pointer relative flex flex-col items-center gap-6">
            <div className="relative inline-block animate-bounce-slow transition-transform transform group-hover:scale-105 duration-300">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse rounded-full group-hover:opacity-40 transition-opacity"></div>
              <PicoLogo size={160} className="relative mx-auto" />
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                 <span className="text-blue-300 text-sm font-medium tracking-widest uppercase">{t('connect_wallet')}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-center mt-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
                Entrance PiCo
              </h1>
              <p className="text-slate-400 text-lg">{t('pi_login_desc')}</p>
            </div>
          </div>
          
          <div className="w-full max-w-xs space-y-2">
            {!isPiBrowser && (
              <div className="bg-red-500/20 border border-red-500/50 p-2 rounded text-center text-xs text-red-200 mb-2">
                Not detected in Pi Browser. Login will use Demo Mode.
              </div>
            )}
            <input
                type="text"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                placeholder={t('enter_referral')}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-center text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {isAuthenticating && <div className="text-center text-xs text-indigo-400 animate-pulse">Authenticating...</div>}
          </div>
        </div>

        {/* Bottom Info: Live Stats */}
        <div className="w-full max-w-md z-10 space-y-4">
          <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl">
             <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                  <Globe size={12} /> {t('circulating')}
                </span>
                <span className="text-indigo-400 font-mono text-xs">{(globalMined / MAX_SUPPLY * 100).toFixed(6)}%</span>
             </div>
             <div className="text-2xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
                {globalMined.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                <span className="text-xs text-slate-500 font-sans font-normal self-end mb-1">PICO</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN UI
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-24 md:pb-0">
      
      {showProfileModal && <SettingsModal 
        onClose={() => setShowProfileModal(false)}
        t={t}
        language={language}
        setLanguage={setLanguage}
        userAvatar={userAvatar}
        username={username}
        referralCode={referralCode}
        triggerNotification={triggerNotification}
        kycStatus={kycStatus}
        isKycProcessing={isKycProcessing}
        startKyc={startKyc}
        transactions={transactions}
        KYC_MINING_BOOST={KYC_MINING_BOOST}
      />}

      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
            <Zap className="text-indigo-400 fill-indigo-400/20" size={18} />
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{t('energy')}</span>
             <div className="w-24 h-2 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: `${energy}%` }}></div>
             </div>
          </div>
        </div>

        <div onClick={() => setShowProfileModal(true)} className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 transition-colors py-1.5 px-3 rounded-full border border-slate-700 cursor-pointer">
           <div className="text-right">
              <div className="text-white font-bold font-mono leading-none">{balance.toFixed(2)}</div>
              <div className="text-[9px] text-indigo-400 font-bold uppercase">PiCo</div>
           </div>
           <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm border border-indigo-400">
             {userAvatar}
           </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-6 relative overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute top-[-20%] right-[-20%] opacity-10"><PicoLogo size={200} /></div>
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                 <div className="space-y-1">
                   <h2 className="text-slate-300 text-sm uppercase tracking-widest">{t('mining_power')}</h2>
                   <div className="text-4xl font-bold text-white flex items-center justify-center gap-2">
                     <Pickaxe size={32} className="text-yellow-400" />
                     {effectiveMiningPower} <span className="text-sm text-slate-400 font-normal">/h</span>
                   </div>
                 </div>
                 
                 <div className="flex gap-2">
                    {kycStatus === 'verified' && (
                      <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded border border-green-500/30 flex items-center gap-1">
                        <ShieldCheck size={12}/> KYC Active
                      </span>
                    )}
                    <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-500/30">
                       Level 1
                    </span>
                 </div>

                 <button onClick={() => setActiveTab('mine')} className="w-full bg-white text-indigo-900 font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-50 transition active:scale-95">
                   {t('mine')}
                 </button>
              </div>
            </div>

            {/* LEADERBOARD */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <button 
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
              >
                 <div className="flex items-center gap-3">
                   <div className="bg-yellow-500/20 p-2 rounded-full"><BarChart3 className="text-yellow-400" size={20} /></div>
                   <h3 className="font-bold text-white">{t('leaderboard')}</h3>
                 </div>
                 <ChevronRight className={`text-slate-500 transition-transform ${showLeaderboard ? 'rotate-90' : ''}`} />
              </button>
              
              {showLeaderboard && (
                <div className="border-t border-slate-700">
                  {[...LEADERBOARD_DATA, {id: 99, name: username, balance: balance, avatar: userAvatar}]
                    .sort((a,b) => b.balance - a.balance)
                    .map((user, index) => (
                    <div key={user.id} className={`flex items-center justify-between p-3 ${user.id === 99 ? 'bg-indigo-900/30' : 'hover:bg-slate-700/30'}`}>
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center font-bold text-sm ${index < 3 ? 'text-yellow-400' : 'text-slate-500'}`}>#{index + 1}</span>
                        <span className="text-lg">{user.avatar}</span>
                        <span className={`text-sm ${user.id === 99 ? 'font-bold text-white' : 'text-slate-300'}`}>{user.name}</span>
                      </div>
                      <span className="font-mono text-sm text-slate-400">{user.balance.toFixed(2)} P</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quests */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
              <h3 className="font-bold text-white flex items-center gap-2 mb-4">
                <Trophy className="text-yellow-500" size={18} /> {t('quests')}
              </h3>
              <div className="space-y-3">
                {quests.map(quest => (
                  <div key={quest.id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                    <div>
                      <p className="font-medium text-sm text-slate-200">{quest.title}</p>
                      <span className="text-xs text-yellow-500 font-mono">+{quest.reward} PiCo</span>
                    </div>
                    {quest.completed ? (
                      <CheckCircle2 className="text-green-500" size={20} />
                    ) : (
                      <button onClick={() => claimQuest(quest.id)} className="bg-indigo-600 hover:bg-indigo-500 text-xs text-white py-1.5 px-3 rounded-lg font-bold transition">
                        {t('claim')}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MINING TAB */}
        {activeTab === 'mine' && (
          <div className="flex flex-col items-center justify-center space-y-10 py-8">
             <div className="relative group cursor-pointer" onClick={handleMine}>
               <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
               <div className="relative transform transition-transform active:scale-90 duration-100">
                  <PicoLogo size={240} className={energy < 10 ? 'grayscale opacity-50' : ''} />
                  {energy >= 10 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-10"></div>
                    </div>
                  )}
               </div>
             </div>

             <div className="text-center space-y-2">
               <div className="inline-block bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
                 <span className="text-slate-400 text-sm">{t('energy')}: </span>
                 <span className={energy < 10 ? 'text-red-400 font-bold' : 'text-indigo-400 font-bold'}>{Math.floor(energy)}/100</span>
               </div>
             </div>
          </div>
        )}

        {/* MARKET TAB */}
        {activeTab === 'market' && (
          <div className="grid grid-cols-2 gap-4">
             {MARKET_ITEMS.map(item => (
               <div key={item.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col items-center text-center hover:border-indigo-500/50 transition-colors">
                 <div className="w-14 h-14 bg-slate-700/50 rounded-full flex items-center justify-center text-3xl mb-3">
                   {item.icon}
                 </div>
                 <h3 className="font-bold text-sm text-white mb-1">{item.name}</h3>
                 <p className="text-xs text-slate-400 mb-4 h-8 leading-tight">{item.desc}</p>
                 <button 
                   onClick={() => buyItem(item)}
                   className="w-full bg-slate-700 hover:bg-white hover:text-slate-900 text-white text-xs font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-1"
                 >
                   <span>{t('buy')}</span>
                   <span className="text-yellow-400 group-hover:text-slate-900">{item.price}</span>
                 </button>
               </div>
             ))}
          </div>
        )}

        {/* SOCIAL TAB */}
        {activeTab === 'social' && (
           <div className="space-y-4">
             {/* New Post */}
             <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
               <div className="flex gap-3">
                 <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center border border-indigo-500">{userAvatar}</div>
                 <input 
                   value={newPostContent}
                   onChange={(e) => setNewPostContent(e.target.value)}
                   placeholder={t('post_placeholder')}
                   className="bg-transparent flex-1 text-sm text-white placeholder-slate-500 outline-none"
                 />
                 <button onClick={handlePost} className="text-indigo-400 hover:text-white transition">
                   <Send size={20} />
                 </button>
               </div>
             </div>

             {/* Feed */}
             <div className="space-y-4 pb-20">
               {posts.map(post => (
                 <div key={post.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                    <div className="flex justify-between items-start mb-2">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-lg">{post.avatar}</div>
                          <div>
                             <h4 className="font-bold text-sm text-white">{post.user}</h4>
                             <span className="text-[10px] text-slate-500">2h ago</span>
                          </div>
                       </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-4 pl-13">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                       <button className="flex items-center gap-1 hover:text-pink-500 transition"><Heart size={14}/> {post.likes}</button>
                       <button className="flex items-center gap-1 hover:text-yellow-400 transition"><Trophy size={14}/> {post.tips}</button>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        )}

      </main>

      {/* NAVIGATION */}
      <nav className="fixed bottom-0 w-full bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 flex justify-around items-center p-2 pb-6 md:pb-2 z-30">
        <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<PicoLogo size={24} />} label={t('home')} />
        <NavButton active={activeTab === 'mine'} onClick={() => setActiveTab('mine')} icon={<Pickaxe size={24} />} label={t('mine')} />
        <NavButton active={activeTab === 'social'} onClick={() => setActiveTab('social')} icon={<Users size={24} />} label={t('social')} />
        <NavButton active={activeTab === 'market'} onClick={() => setActiveTab('market')} icon={<ShoppingBag size={24} />} label={t('market')} />
      </nav>

      {/* NOTIFICATION TOAST */}
      {showNotification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-2xl z-50 animate-in slide-in-from-top-5 fade-in duration-300 flex items-center gap-2">
          <CheckCircle2 size={18} />
          <span className="text-sm font-bold">{showNotification}</span>
        </div>
      )}

    </div>
  );
}