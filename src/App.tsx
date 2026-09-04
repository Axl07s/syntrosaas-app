import { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, Zap, CreditCard, 
  Building2, Copy, Plus, Trash2, Check, RefreshCw
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
  const [activeTab, setActiveTab] = useState<'overview' | 'workspaces' | 'keys' | 'pricing' | 'team'>('overview');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('annual');
  const [activeWorkspace, setActiveWorkspace] = useState<string>('Acme Global HQ');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      
      {/* Top Portfolio Integration Bar */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-2.5 flex items-center justify-between z-40 sticky top-0 backdrop-blur-md">
        <button
          onClick={() => window.location.href = "https://portfolio-axel-nine.vercel.app"}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Portafolio Maestro</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-zinc-400">Zero-Trust Supabase RLS &bull; Stripe Webhooks Active</span>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <header className="border-b border-zinc-800/80 px-6 py-4 bg-zinc-950/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg text-lg">
              S
            </div>
            <div>
              <span className="font-extrabold text-lg text-white">SyntroSaaS</span>
              <span className="text-[10px] font-mono ml-2 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Next.js 15 Multi-Tenant
              </span>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-2xl border border-zinc-800 text-xs font-medium">
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
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

        </div>
      </header>

      {/* App Body Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 sm:p-8 space-y-8">
        
        {/* Workspace Quick Switcher Banner */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <span className="text-zinc-400">Organización Activa:</span>
            <span className="font-bold text-white font-mono bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800">
              {activeWorkspace}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Cambiar Workspace:</span>
            {['Acme Global HQ', 'Stripe LatAm', 'Dev Sandbox'].map(ws => (
              <button
                key={ws}
                onClick={() => setActiveWorkspace(ws)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                  activeWorkspace === ws
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
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
                { label: 'Ingestión API Mensual', value: '1,420,890', sub: 'Quota: 2M llamadas (71%)', icon: Zap },
                { label: 'Tiempo de Respuesta p99', value: '42ms', sub: 'Edge Cache Global', icon: RefreshCw },
                { label: 'Seguridad RLS', value: '100% Zero-Trust', sub: 'Supabase Row Level Security', icon: ShieldCheck },
                { label: 'MRR Facturado', value: '$12,480 USD', sub: 'Stripe Billing Live', icon: CreditCard },
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
                  Límites de Cuota y Recursos
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
                      <span>Miembros con Asiento Activo</span>
                      <span className="font-mono text-white">3 / 10 Asientos (30%)</span>
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
                  Gobernanza de Datos Aislados (Multi-Tenant)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cada consulta a la base de datos se filtra automáticamente a nivel de motor SQL mediante Supabase Row-Level Security:
                </p>
                <div className="p-4 rounded-xl bg-zinc-950 font-mono text-[11px] text-zinc-300 border border-zinc-800/80 overflow-x-auto">
                  <code>CREATE POLICY tenant_isolation_policy ON telemetry_events<br />
                  FOR ALL TO authenticated<br />
                  USING (workspace_id = auth.jwt() -&gt;&gt; 'workspace_id');</code>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Aislamiento Criptográfico Verificado en Producción</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: WORKSPACES */}
        {activeTab === 'workspaces' && (
          <div className="space-y-6 animate-fadeIn max-w-4xl">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Estructura Multi-Tenant</h2>
              <p className="text-xs text-zinc-400 mt-1">Gestione las organizaciones vinculadas a su cuenta principal.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Acme Global HQ', plan: 'Plan Enterprise', members: 18, region: 'us-east-1 (N. Virginia)' },
                { name: 'Stripe LatAm', plan: 'Plan Scale Pro', members: 6, region: 'sa-east-1 (São Paulo)' },
                { name: 'Dev Sandbox', plan: 'Plan Developer', members: 2, region: 'eu-central-1 (Frankfurt)' },
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
                        Activo
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{ws.name}</h4>
                    <span className="text-xs text-zinc-400">{ws.plan}</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-800 text-[11px] font-mono text-zinc-500 space-y-1">
                    <div>{ws.members} Usuarios con Acceso</div>
                    <div>Región: {ws.region}</div>
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
                <h2 className="text-2xl font-bold text-white tracking-tight">API Keys & Tokens de Servicio</h2>
                <p className="text-xs text-zinc-400 mt-1">Claves criptográficas para conectar SDKs, microservicios y workers externos.</p>
              </div>
              <button
                onClick={() => setShowKeyModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Generar Nueva API Key</span>
              </button>
            </div>

            {/* Keys Table */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 font-mono uppercase">
                  <tr>
                    <th className="p-4">Identificador</th>
                    <th className="p-4">Token Secreto</th>
                    <th className="p-4">Alcance (Scope)</th>
                    <th className="p-4">Creada</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acción</th>
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
                            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            title="Copiar token"
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
                            className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                            title="Revocar clave"
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
                  <h3 className="text-lg font-bold text-white">Crear Nueva Clave de API</h3>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Nombre / Identificador</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Background Worker Node #3"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Alcance de Permisos (Scope)</label>
                    <select
                      value={newKeyScope}
                      onChange={(e) => setNewKeyScope(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="read:write">read:write (Acceso Completo)</option>
                      <option value="ingest:telemetry">ingest:telemetry (Solo Envío)</option>
                      <option value="billing:manage">billing:manage (Gestión Stripe)</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowKeyModal(false)}
                      className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                    >
                      Generar Token
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
              <h2 className="text-3xl font-bold tracking-tight text-white">Planes & Suscripción Stripe</h2>
              <p className="text-xs sm:text-sm text-zinc-400">Infraestructura multi-inquilino con cobros recurrentes automatizados.</p>
              
              {/* Billing Cycle Toggle */}
              <div className="inline-flex items-center gap-2 p-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    billingPeriod === 'monthly' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setBillingPeriod('annual')}
                  className={`px-4 py-1.5 rounded-full transition-all ${
                    billingPeriod === 'annual' ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Anual (20% Descuento)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 'starter',
                  name: 'Starter Developer',
                  price: billingPeriod === 'annual' ? 39 : 49,
                  desc: 'Ideal para MVPs y validación rápida de productos SaaS.',
                  features: ['Hasta 3 miembros de equipo', '250,000 llamadas API / mes', 'Soporte vía Discord & Docs', 'Aislamiento RLS en PostgreSQL'],
                },
                {
                  id: 'scale',
                  name: 'Growth Scale Pro',
                  price: billingPeriod === 'annual' ? 99 : 129,
                  desc: 'Para empresas en aceleración que requieren alta concurrencia.',
                  badge: 'Más Popular',
                  features: ['Hasta 15 miembros de equipo', '2,000,000 llamadas API / mes', 'SLA 99.9% de Disponibilidad', 'Soporte Prioritario 24/7', 'Webhooks Stripe ilimitados'],
                },
                {
                  id: 'enterprise',
                  name: 'Enterprise Dedicated',
                  price: billingPeriod === 'annual' ? 249 : 299,
                  desc: 'Instancia dedicada con auditoría SOC2 y soporte telefónico.',
                  features: ['Miembros y asientos ilimitados', 'Volumen de Ingesta a Medida', 'DB Postgres Dedicada', 'Auditoría de Logs de Acceso', 'SLA 99.99% con Penalidad'],
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
                      ${plan.price} <span className="text-xs font-normal text-zinc-500">USD/mes</span>
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
                    onClick={() => alert(`Simulación: Redirigiendo a Stripe Checkout para ${plan.name} (${billingPeriod})...`)}
                    className={`w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      plan.badge
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                    }`}
                  >
                    Suscribirse con Stripe
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
                <h2 className="text-2xl font-bold text-white tracking-tight">Control de Acceso Basado en Roles (RBAC)</h2>
                <p className="text-xs text-zinc-400 mt-1">Administre los miembros y permisos específicos de {activeWorkspace}.</p>
              </div>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInviteMember} className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Invitar Colaborador (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="nuevo.ingeniero@empresa.com"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="w-full sm:w-44">
                <label className="block text-xs font-mono text-zinc-400 mb-1">Rol Asignado</label>
                <select
                  value={newInviteRole}
                  onChange={(e) => setNewInviteRole(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Developer">Developer</option>
                  <option value="Viewer">Viewer (Solo lectura)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
              >
                Enviar Invitación
              </button>
            </form>

            {inviteSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Invitación enviada y credenciales de acceso emitidas exitosamente.</span>
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

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-black py-8 px-6 text-xs text-zinc-500 text-center font-mono">
        SyntroSaaS Engine &bull; Next.js 15 &bull; Supabase Auth &bull; Stripe Webhooks &bull; Zero-Trust Multi-Tenancy
      </footer>

    </div>
  );
}
