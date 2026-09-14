import { useState } from 'react';
import { 
  CheckCircle2, ShieldCheck, Zap, CreditCard, 
  Building2, Copy, Plus, Trash2, Check, RefreshCw,
  Lock, Mail, Key, Sparkles, ArrowRight, X, Loader2, Eye, EyeOff, LayoutDashboard, Globe, ChevronRight
} from 'lucide-react';

interface ApiKeyItem {
  id: string;
  name: string;
  key: string;
  scope: string;
  created: string;
  status: 'Active' | 'Revoked';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Developer' | 'Viewer';
  avatar: string;
}

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<'overview' | 'workspaces' | 'keys' | 'pricing' | 'team'>('overview');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [activeWorkspace, setActiveWorkspace] = useState<string>('Acme Global HQ');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Supabase Auth State
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState<string>('demo@acmecloud.com');
  const [authPassword, setAuthPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Stripe Checkout Modal State
  const [showStripeModal, setShowStripeModal] = useState<boolean>(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<{ name: string; price: number } | null>(null);
  const [isProcessingStripe, setIsProcessingStripe] = useState<boolean>(false);
  const [stripeSuccess, setStripeSuccess] = useState<boolean>(false);

  // Dynamic API Keys State
  const [keysList, setKeysList] = useState<ApiKeyItem[]>([
    { id: '1', name: 'Production Ingest Node', key: 'syn_live_9f81a842b0c399a', scope: 'ingest:telemetry', created: 'Sep 2026', status: 'Active' },
    { id: '2', name: 'Stripe Billing Webhook Gateway', key: 'syn_live_33b8a101f99c27d', scope: 'billing:manage', created: 'Aug 2026', status: 'Active' },
    { id: '3', name: 'Vector Query Read-Only', key: 'syn_live_e55c091d7462a88', scope: 'rag:read', created: 'Jul 2026', status: 'Active' },
  ]);

  // Dynamic Team Members State
  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'Axel Molineros', email: 'axel@syntrosaas.io', role: 'Owner', avatar: 'AM' },
    { id: '2', name: 'Sofia Valdivieso', email: 'sofia.v@syntrosaas.io', role: 'Admin', avatar: 'SV' },
    { id: '3', name: 'Carlos Mendez', email: 'carlos.m@partner.io', role: 'Developer', avatar: 'CM' },
  ]);

  // New Invite State
  const [newInviteEmail, setNewInviteEmail] = useState<string>('');
  const [newInviteRole, setNewInviteRole] = useState<'Admin' | 'Developer' | 'Viewer'>('Developer');
  const [inviteSuccess, setInviteSuccess] = useState<boolean>(false);

  // New Key Modal / Generation State
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [newKeyScope, setNewKeyScope] = useState<string>('read:write');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;
    const randomHash = Math.random().toString(36).substring(2, 15);
    const newKey: ApiKeyItem = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `syn_live_${randomHash}`,
      scope: newKeyScope,
      created: 'Just now',
      status: 'Active',
    };
    setKeysList([newKey, ...keysList]);
    setNewKeyName('');
    setShowKeyModal(false);
  };

  const handleRevokeKey = (id: string) => {
    setKeysList(keysList.map(k => k.id === id ? { ...k, status: 'Revoked' } : k));
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInviteEmail) return;
    const namePart = newInviteEmail.split('@')[0];
    const initials = namePart.substring(0, 2).toUpperCase();
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: newInviteEmail,
      role: newInviteRole,
      avatar: initials,
    };
    setTeam([...team, newMember]);
    setNewInviteEmail('');
    setInviteSuccess(true);
    setTimeout(() => setInviteSuccess(false), 3000);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthSuccessMsg(null);
    await new Promise(r => setTimeout(r, 1000));
    setIsAuthenticating(false);
    setIsAuthenticated(true);
    setAuthSuccessMsg(
      authMode === 'signin' 
        ? 'JWT issued successfully. Supabase Auth session active with RLS policies.' 
        : 'Account created. Confirmation email dispatched.'
    );
    setTimeout(() => {
      setShowAuthModal(false);
      setAuthSuccessMsg(null);
      setCurrentView('dashboard');
    }, 800);
  };

  const handleOpenStripeModal = (planName: string, price: number) => {
    setSelectedPlanForCheckout({ name: planName, price });
    setShowStripeModal(true);
    setStripeSuccess(false);
  };

  const handleStripeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingStripe(true);
    await new Promise(r => setTimeout(r, 1400));
    setIsProcessingStripe(false);
    setStripeSuccess(true);
    setTimeout(() => {
      setShowStripeModal(false);
      setStripeSuccess(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Main App Navigation Bar (Clean & Independent Product Identity) */}
      <header className="border-b border-zinc-800/80 px-4 sm:px-6 py-3 bg-zinc-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md text-base">
              S
            </div>
            <div>
              <span className="font-extrabold text-base text-white tracking-tight">SyntroSaaS</span>
              <span className="text-[10px] font-mono ml-2 px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hidden sm:inline">
                Next.js 15 Multi-Tenant
              </span>
            </div>
          </div>

          {/* Nav Tabs & Views */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                currentView === 'landing'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Landing Page</span>
              <span className="sm:hidden">Landing</span>
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                currentView === 'dashboard'
                  ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">SaaS Console</span>
              <span className="sm:hidden">Console</span>
            </button>

            {/* Desktop Dashboard Navigation */}
            {currentView === 'dashboard' && (
              <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-medium ml-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'workspaces', label: 'Organizations' },
                  { id: 'keys', label: 'API Keys' },
                  { id: 'pricing', label: 'Plans & Stripe' },
                  { id: 'team', label: 'Team (RBAC)' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            )}

            {/* Supabase Auth State Trigger */}
            <div className="border-l border-zinc-800 pl-2 flex items-center gap-1.5">
              {isAuthenticated ? (
                <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white font-semibold text-[11px]">{authEmail.split('@')[0]}</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-sm flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Lock className="w-3 h-3" />
                  <span className="hidden sm:inline">Sign In (Supabase)</span>
                  <span className="sm:hidden">Sign In</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Mobile Dashboard Sub-Navigation Tabs */}
        {currentView === 'dashboard' && (
          <div className="lg:hidden mt-2.5 pt-2.5 border-t border-zinc-800/60 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Resumen' },
              { id: 'workspaces', label: 'Organizaciones' },
              { id: 'keys', label: 'API Keys' },
              { id: 'pricing', label: 'Planes & Stripe' },
              { id: 'team', label: 'Equipo (RBAC)' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* App Body Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 py-4 sm:p-8 space-y-6 sm:space-y-8">
        
        {/* VIEW 1: HERO & PRODUCT LANDING PAGE (Glassmorphism & High-Converting) */}
        {currentView === 'landing' && (
          <div className="space-y-16 animate-fadeIn">
            {/* Hero Section */}
            <section className="relative pt-6 pb-12 text-center max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono font-medium backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next.js 15 App Router &bull; Supabase Auth &bull; Stripe Checkout</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Launch Your SaaS to Production <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                  in days, not weeks.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Enterprise full stack boilerplate with scalable architecture: secure authentication by Supabase, data isolation via PostgreSQL Row-Level Security, and automated subscription monetization with Stripe.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-8 py-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>Explore Live Console</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>PostgreSQL RLS Zero-Trust</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Stripe Webhooks Ready</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Next.js 15 App Router</span>
                </div>
              </div>
            </section>

            {/* Feature Bento Grid (Glassmorphism) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 hover:border-zinc-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Supabase Auth & RLS</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Robust authentication supporting Email, Magic Links, and OAuth. Tenant-level isolation via kernel-level PostgreSQL Row-Level Security policies.
                </p>
                <div className="pt-2 text-xs font-mono text-indigo-300 flex items-center gap-1">
                  <span>Zero Data Leaks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 hover:border-zinc-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Stripe Monetization</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monthly and annual subscriptions, self-serve customer billing portal, and automated webhook handlers to synchronize quotas and access in real-time.
                </p>
                <div className="pt-2 text-xs font-mono text-purple-300 flex items-center gap-1">
                  <span>Built-in Checkout</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4 hover:border-zinc-700 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Quota Management Dashboard</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Interactive dashboard with live telemetry, multi-tenant organization switching, API key provisioning, and team role-based access control (RBAC).
                </p>
                <div className="pt-2 text-xs font-mono text-emerald-300 flex items-center gap-1">
                  <span>Production Ready</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </section>

            {/* Quick Demo Preview Banner */}
            <section className="p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-zinc-900/60 to-purple-950/40 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold text-white">Ready to test the platform?</h3>
                <p className="text-xs text-zinc-400">
                  Explore the interactive console, simulate a Stripe payment, or sign in with Supabase.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setShowAuthModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-all cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: FULL STACK SAAS DASHBOARD (Organizaciones, Telemetría, Stripe & RBAC) */}
        {currentView === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Workspace Quick Switcher Banner */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-zinc-400">Active Organization:</span>
                <span className="font-bold text-white font-mono bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
                  {activeWorkspace}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-zinc-500 w-full sm:w-auto text-[11px]">Workspace:</span>
                {['Acme Global HQ', 'Stripe LatAm', 'Dev Sandbox'].map(ws => (
                  <button
                    key={ws}
                    onClick={() => setActiveWorkspace(ws)}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono transition-all whitespace-nowrap ${
                      activeWorkspace === ws
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white'
                    }`}
                  >
                    {ws}
                  </button>
                ))}
              </div>
            </div>

        {/* TAB 1: OVERVIEW & TELEMETRY */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Monthly API Ingestion', value: '1,420,890', sub: 'Quota: 2M requests (71%)', icon: Zap },
                { label: 'p99 Response Latency', value: '42ms', sub: 'Global Edge Cache', icon: RefreshCw },
                { label: 'RLS Security', value: '100% Zero-Trust', sub: 'Supabase Row Level Security', icon: ShieldCheck },
                { label: 'Billed MRR', value: '$12,480 USD', sub: 'Stripe Billing Live', icon: CreditCard },
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-2">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span className="text-xs font-mono uppercase">{stat.label}</span>
                    <stat.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
                    {stat.value}
                  </div>
                  <span className="text-xs text-zinc-500 font-mono block">{stat.sub}</span>
                </div>
              ))}
            </div>

            {/* Quota Progress & Architecture Map */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left: Usage Gauges */}
              <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800 space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  Resource & Quota Limits
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1.5">
                      <span>API Ingest (Edge Gateway)</span>
                      <span className="font-mono text-white">1.42M / 2.0M (71%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[71%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1.5">
                      <span>PostgreSQL DB Storage</span>
                      <span className="font-mono text-white">4.8 GB / 10.0 GB (48%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[48%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-zinc-400 mb-1.5">
                      <span>Active Team Seats</span>
                      <span className="font-mono text-white">3 / 10 Seats (30%)</span>
                    </div>
                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[30%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Security & RLS Breakdown */}
              <div className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Isolated Tenant Governance (Multi-Tenant)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Every query is strictly filtered at the SQL database engine level via Supabase Row-Level Security policies:
                </p>
                <div className="p-4 rounded-xl bg-zinc-950 font-mono text-[11px] text-zinc-300 border border-zinc-800/80 overflow-x-auto">
                  <code>CREATE POLICY tenant_isolation_policy ON telemetry_events<br />
                  FOR ALL TO authenticated<br />
                  USING (workspace_id = auth.jwt() -&gt;&gt; 'workspace_id');</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cryptographic Tenant Isolation Active</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: WORKSPACES */}
        {activeTab === 'workspaces' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Multi-Tenant Workspaces</h2>
              <p className="text-xs text-zinc-400 mt-1">Manage all organizations and workspaces linked to your account.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Acme Global HQ', plan: 'Enterprise Plan', members: 18, region: 'us-east-1 (N. Virginia)' },
                { name: 'Stripe LatAm', plan: 'Scale Pro Plan', members: 6, region: 'sa-east-1 (São Paulo)' },
                { name: 'Dev Sandbox', plan: 'Developer Plan', members: 2, region: 'eu-central-1 (Frankfurt)' },
              ].map((ws, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border-2 transition-all cursor-pointer space-y-4 ${
                    activeWorkspace === ws.name
                      ? 'border-indigo-500 bg-indigo-500/10 shadow-lg'
                      : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                  }`}
                  onClick={() => setActiveWorkspace(ws.name)}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center font-mono font-bold text-indigo-400">
                      {ws.name.substring(0, 2).toUpperCase()}
                    </div>
                    {activeWorkspace === ws.name && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        Active
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{ws.name}</h4>
                    <span className="text-xs text-zinc-400">{ws.plan}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 space-y-1">
                    <div>{ws.members} Active Members</div>
                    <div>Region: {ws.region}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: API KEYS & TOKENS */}
        {activeTab === 'keys' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">API Keys & Service Tokens</h2>
                <p className="text-xs text-zinc-400 mt-1">Cryptographic keys to connect SDKs, microservices, and background workers.</p>
              </div>
              <button
                onClick={() => setShowKeyModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New API Key</span>
              </button>
            </div>

            {/* Keys Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 font-mono uppercase">
                  <tr>
                    <th className="p-4">Identifier</th>
                    <th className="p-4">Secret Token</th>
                    <th className="p-4">Scope</th>
                    <th className="p-4">Created</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {keysList.map((k) => (
                    <tr key={k.id} className="hover:bg-zinc-900/50">
                      <td className="p-4 font-semibold text-white">{k.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="text-zinc-300 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800">
                            {k.key}
                          </code>
                          <button
                            onClick={() => handleCopyKey(k.id, k.key)}
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy token"
                          >
                            {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400">{k.scope}</td>
                      <td className="p-4 text-zinc-500">{k.created}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          k.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {k.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {k.status === 'Active' && (
                          <button
                            onClick={() => handleRevokeKey(k.id)}
                            className="text-rose-400 hover:text-rose-300 transition-colors p-1 cursor-pointer"
                            title="Revoke key"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal: Generate Key */}
            {showKeyModal && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <form onSubmit={handleCreateKey} className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">Generate New API Key</h3>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Name / Identifier</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Production Ingest Worker #3"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Access Scope</label>
                    <select
                      value={newKeyScope}
                      onChange={(e) => setNewKeyScope(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="read:write">read:write (Full Access)</option>
                      <option value="ingest:telemetry">ingest:telemetry (Write-Only)</option>
                      <option value="billing:manage">billing:manage (Stripe Management)</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowKeyModal(false)}
                      className="px-4 py-2 text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Generate Key
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PRICING & STRIPE BILLING */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-white">Plans & Stripe Subscriptions</h2>
              <p className="text-xs sm:text-sm text-zinc-400">Multi-tenant infrastructure with automated recurring billing and webhooks.</p>
              
              {/* Billing Cycle Toggle */}
              <div className="inline-flex items-center gap-2 p-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    billingPeriod === 'monthly' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                    billingPeriod === 'annual' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Annual (20% Off)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 'starter',
                  name: 'Starter Developer',
                  price: billingPeriod === 'annual' ? 39 : 49,
                  desc: 'Ideal for MVPs and rapid SaaS product validation.',
                  features: ['Up to 3 team members', '250,000 API calls / mo', 'Discord & Docs Support', 'PostgreSQL RLS Isolation'],
                },
                {
                  id: 'scale',
                  name: 'Growth Scale Pro',
                  price: billingPeriod === 'annual' ? 99 : 129,
                  desc: 'For scaling startups requiring high concurrency and priority support.',
                  badge: 'Most Popular',
                  features: ['Up to 15 team members', '2,000,000 API calls / mo', '99.9% Uptime SLA', '24/7 Priority Support', 'Unlimited Stripe Webhooks'],
                },
                {
                  id: 'enterprise',
                  name: 'Enterprise Dedicated',
                  price: billingPeriod === 'annual' ? 249 : 299,
                  desc: 'Dedicated instance with SOC2 audit trails and direct support.',
                  features: ['Unlimited team seats', 'Custom ingest quotas', 'Dedicated Postgres DB', 'Full Access Audit Logs', '99.99% Financial SLA'],
                },
              ].map((plan) => (
                <div
                  key={plan.id}
                  className={`p-8 rounded-3xl border flex flex-col justify-between space-y-6 ${
                    plan.badge 
                      ? 'border-indigo-500 bg-zinc-900/60 shadow-xl shadow-indigo-500/10'
                      : 'border-zinc-800 bg-zinc-900/30'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      {plan.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold font-mono text-white">
                      ${plan.price} <span className="text-xs font-normal text-zinc-500">USD/mo</span>
                    </div>
                    <p className="text-xs text-zinc-400">{plan.desc}</p>
                    <ul className="space-y-2 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
                      {plan.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenStripeModal(plan.name, plan.price)}
                    className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      plan.badge
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    Subscribe with Stripe
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TEAM & RBAC */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Role-Based Access Control (RBAC)</h2>
                <p className="text-xs text-zinc-400 mt-1">Manage team members and granular permissions for {activeWorkspace}.</p>
              </div>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInviteMember} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Invite Team Member (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="new.engineer@company.com"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="w-full sm:w-44">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Assigned Role</label>
                <select
                  value={newInviteRole}
                  onChange={(e) => setNewInviteRole(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Viewer">Viewer (Read-Only)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Send Invite
              </button>
            </form>

            {inviteSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Invitation sent and access credentials issued successfully.</span>
              </div>
            )}

            {/* Members List */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden divide-y divide-zinc-800">
              {team.map((m) => (
                <div key={m.id} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-900/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 font-bold font-mono flex items-center justify-center text-xs">
                      {m.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-[11px] font-mono text-zinc-500">{m.email}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md font-mono text-[10px] ${
                    m.role === 'Owner' 
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      : m.role === 'Admin'
                      ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                  }`}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>

          </div>
        )}
        </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-8 px-6 text-xs text-zinc-500 text-center font-mono">
        SyntroSaaS Engine &bull; Next.js 15 &bull; Supabase Auth &bull; Stripe Webhooks &bull; Zero-Trust Multi-Tenancy
      </footer>

      {/* MODAL 1: SUPABASE AUTH (Login & Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Supabase GoTrue Engine &bull; RLS Guard</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                {authMode === 'signin' ? 'Sign In to SyntroSaaS' : 'Create Developer Account'}
              </h3>
              <p className="text-xs text-zinc-400">
                {authMode === 'signin'
                  ? 'Multi-tenant secure access via cryptographically signed JWT tokens.'
                  : 'Register your organization and launch your backend in minutes.'}
              </p>
            </div>

            {/* Social / OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuthEmail('github.developer@supabase.io');
                  handleAuthSubmit({ preventDefault: () => {} } as any);
                }}
                className="py-2.5 px-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>GitHub OAuth</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthEmail('google.admin@supabase.io');
                  handleAuthSubmit({ preventDefault: () => {} } as any);
                }}
                className="py-2.5 px-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-xs font-semibold text-zinc-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Google OAuth</span>
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-[10px] font-mono text-zinc-500 uppercase">Or with credentials</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Business Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Secure Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{authSuccessMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying JWT with Supabase...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{authMode === 'signin' ? 'Sign In' : 'Complete Registration'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-zinc-400">
              {authMode === 'signin' ? (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="text-indigo-400 hover:underline font-semibold cursor-pointer"
                  >
                    Create one now
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signin')}
                    className="text-indigo-400 hover:underline font-semibold cursor-pointer"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: STRIPE OFFICIAL CHECKOUT MODAL */}
      {showStripeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header modal estilo Stripe */}
            <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  stripe
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                  TEST MODE
                </span>
              </div>
              <button
                onClick={() => !isProcessingStripe && setShowStripeModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStripeSubmit} className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">SaaS Subscription</span>
                <div className="flex items-baseline justify-between mt-1">
                  <h3 className="text-xl font-bold text-white">
                    {selectedPlanForCheckout?.name || 'Growth Scale Pro'}
                  </h3>
                  <span className="text-2xl font-black text-white">
                    ${selectedPlanForCheckout?.price || 99}.00 USD
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Recurring monthly billing &bull; Cancel anytime</p>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={authEmail}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Card Information</label>
                  <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>•••• •••• •••• 4242</span>
                    <span className="text-slate-400">12 / 28</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    disabled
                    value="SyntroSaaS Enterprise Ltd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isProcessingStripe || stripeSuccess}
                  className={`w-full py-3.5 rounded-xl font-semibold text-xs tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    stripeSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#635BFF] hover:bg-[#5851ea] text-white shadow-indigo-600/30'
                  }`}
                >
                  {isProcessingStripe ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing payment via Stripe Webhook...</span>
                    </>
                  ) : stripeSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Subscription Activated Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ${selectedPlanForCheckout?.price || 99}.00 USD with Stripe</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[10px] text-center text-slate-400 font-mono pt-1">
                256-bit SSL encryption certified by Stripe &bull; Production webhooks
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
