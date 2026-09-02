import { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Zap, Key, CreditCard, ChevronRight } from 'lucide-react';



export function App() {
  const [isDemoAuthenticated, setIsDemoAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'dashboard' | 'keys' | 'pricing'>('overview');
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'scale'>('pro');
  const [keysList, setKeysList] = useState([
    { name: 'Production Worker Node', key: 'sk_live_9f81a...', scope: 'read:write', created: '2024-08-15', status: 'Active' },
    { name: 'Stripe Webhook Gateway', key: 'sk_live_33b8a...', scope: 'billing:manage', created: '2024-08-10', status: 'Active' },
  ]);

  if (!isDemoAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col items-center justify-center relative overflow-hidden font-sans p-4">
        {/* Background Grid & Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="z-10 w-full max-w-sm p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg mb-4 text-xl">
              S
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">SyntroSaaS</h1>
            <p className="text-zinc-400 text-xs mt-2 text-center font-mono">Enterprise Auth & Governance</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center">
              <ShieldCheck className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
              <h3 className="text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">Entorno de Demostración</h3>
              <p className="text-[10px] leading-relaxed text-indigo-200/70 font-mono">
                Para proteger la integridad de los datos, el acceso público se realiza mediante un sandbox con datos sintéticos (Modo Demo Automático).
              </p>
            </div>

            <button
              onClick={() => setIsDemoAuthenticated(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-current" />
              Iniciar Demo Automático
            </button>

            <button disabled className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-medium bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed">
              <Key className="w-3.5 h-3.5" />
              Single Sign-On (SSO) Bloqueado
            </button>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => window.location.href = "https://portfolio-axel-nine.vercel.app"}
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Volver al Portafolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col animate-fadeIn font-sans">
      
      {/* Return Bar */}
      <div className="bg-gradient-to-r from-red-950 via-zinc-950 to-zinc-950 border-b border-red-500/30 px-4 py-2.5 flex items-center justify-between z-40 sticky top-0 backdrop-blur-md">
        <button
          onClick={() => window.location.href = "https://portfolio-axel-nine.vercel.app"}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-600 hover:bg-red-500 text-white shadow-glow-red transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Portafolio Maestro</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">
            ● Supabase Auth & Stripe RLS Active
          </span>
        </div>
      </div>

      {/* App Navbar */}
      <header className="border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg">
            S
          </div>
          <span className="font-extrabold text-lg text-white">SyntroSaaS</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Next.js 15 App Router
          </span>
        </div>

        <nav className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-2xl border border-zinc-800 text-xs">
          {(['overview', 'dashboard', 'keys', 'pricing'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl font-medium capitalize transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {activeTab === 'overview' && (
          <div className="space-y-12 animate-fadeIn">
            <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
              <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Production-Ready Next.js 15 Boilerplate
              </span>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                Stop rebuilding <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  auth, payments & dashboards
                </span>
              </h1>
              <p className="text-sm text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Ship your software product in days with pre-configured Supabase PostgreSQL Row-Level Security, Stripe billing subscriptions, and multi-tenant organizations.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center gap-2 text-xs transition-all"
                >
                  <span>Explorar Dashboard en Vivo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Zero-Trust Supabase RLS</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Strict tenant isolation enforced at the database level with PostgreSQL policies.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Stripe Tiered Webhooks</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Monthly & yearly subscriptions with customer billing portal and auto seat management.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Next.js 15 App Router</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  React 19 Server Components, streaming suspense, and 99/100 Lighthouse performance.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-bold text-white">Organization Plan & Quotas</h2>
                <p className="text-xs text-zinc-400 font-mono">Tenant ID: org_syntro_alpha9</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPlan(prev => (prev === 'pro' ? 'scale' : 'pro'))}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md"
                >
                  Upgrade to {selectedPlan === 'pro' ? 'Scale ($199/mo)' : 'Pro ($79/mo)'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-mono">Monthly API Calls</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">64,120</span>
                  <span className="text-xs text-indigo-400 font-mono font-bold">64.1%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[64%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-mono">Active Team Seats</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">8 / 10</span>
                  <span className="text-xs text-purple-400 font-mono font-bold">80%</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[80%]" />
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs text-zinc-400 font-mono">Encrypted S3 Storage</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">42.8 GB</span>
                  <span className="text-xs text-emerald-400 font-mono font-bold">Tier OK</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[42%]" />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-xl font-bold text-white">Production API Keys & Scoped Tokens</h2>
                <p className="text-xs text-zinc-400">Generate and revoke scoped credentials for SDK integration.</p>
              </div>
              <button
                onClick={() => {
                  const newKey = `sk_live_${Math.random().toString(36).substring(2, 10)}`;
                  setKeysList(prev => [...prev, {
                    name: `Integration Key ${prev.length + 1}`,
                    key: `${newKey.substring(0, 10)}...`,
                    scope: 'read:write',
                    created: 'Just now',
                    status: 'Active',
                  }]);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Create Scoped Key</span>
              </button>
            </div>

            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400">
                  <tr>
                    <th className="p-3.5">Key Name & Hash</th>
                    <th className="p-3.5">Permission Scope</th>
                    <th className="p-3.5">Created</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {keysList.map((k, i) => (
                    <tr key={i} className="hover:bg-zinc-900/40">
                      <td className="p-3.5 font-bold text-white">
                        {k.name}
                        <span className="text-[10px] text-zinc-500 block font-normal">{k.key}</span>
                      </td>
                      <td className="p-3.5 text-indigo-300">{k.scope}</td>
                      <td className="p-3.5 text-zinc-400">{k.created}</td>
                      <td className="p-3.5 text-emerald-400 font-bold">{k.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto py-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">Transparent SaaS Pricing</h2>
              <p className="text-xs text-zinc-400">Built-in Stripe billing with instant customer portal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Starter</span>
                <div className="text-3xl font-extrabold text-white">$29<span className="text-xs font-normal text-zinc-400">/mo</span></div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 10,000 API calls</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 2 Team seats</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Community support</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-zinc-950 border border-indigo-500/60 space-y-4 relative shadow-xl">
                <span className="text-xs font-mono font-bold text-indigo-300 uppercase">Pro (Popular)</span>
                <div className="text-3xl font-extrabold text-white">$79<span className="text-xs font-normal text-zinc-400">/mo</span></div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> 100,000 API calls</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> 10 Team seats</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Priority webhooks</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Enterprise</span>
                <div className="text-3xl font-extrabold text-white">$199<span className="text-xs font-normal text-zinc-400">/mo</span></div>
                <ul className="space-y-2 text-xs text-zinc-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Unlimited API calls</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Unlimited seats</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Custom SLA & Support</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </main>

    </div>
  );
};

export default App;
