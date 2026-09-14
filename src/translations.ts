export type Language = 'en' | 'es';

export const translations = {
  en: {
    appTitle: 'SyntroSaaS',
    badge: 'Next.js 15 Multi-Tenant',
    landingBtn: 'Landing Page',
    consoleBtn: 'SaaS Console',
    signIn: 'Sign In (Supabase)',
    tabs: {
      overview: 'Overview',
      workspaces: 'Organizations',
      keys: 'API Keys',
      pricing: 'Plans & Stripe',
      team: 'Team (RBAC)'
    },
    hero: {
      badge: 'Next.js 15 App Router • Supabase Auth • Stripe Checkout',
      title1: 'Launch Your SaaS to Production',
      title2: 'in days, not weeks.',
      desc: 'Enterprise full stack boilerplate with scalable architecture: secure authentication by Supabase, data isolation via PostgreSQL Row-Level Security, and automated subscription monetization with Stripe.',
      startTrial: 'Start Free Trial',
      exploreConsole: 'Explore Live Console'
    },
    dashboard: {
      activeOrg: 'Active Organization:',
      switchOrg: 'Workspace:',
      monthlyIngest: 'Monthly API Ingestion',
      quota: 'Quota: 2M requests (71%)',
      p99Latency: 'p99 Response Latency',
      edgeCache: 'Global Edge Cache',
      rlsSecurity: 'RLS Security',
      zeroTrust: 'Supabase Row Level Security',
      billedMrr: 'Billed MRR',
      stripeLive: 'Stripe Billing Live'
    }
  },
  es: {
    appTitle: 'SyntroSaaS',
    badge: 'Next.js 15 Multi-Tenant',
    landingBtn: 'Landing Page',
    consoleBtn: 'Consola SaaS',
    signIn: 'Iniciar Sesión',
    tabs: {
      overview: 'Resumen',
      workspaces: 'Organizaciones',
      keys: 'API Keys',
      pricing: 'Planes & Stripe',
      team: 'Equipo (RBAC)'
    },
    hero: {
      badge: 'Next.js 15 App Router • Supabase Auth • Stripe Checkout',
      title1: 'Lanza tu SaaS a Producción',
      title2: 'en días, no en semanas.',
      desc: 'Plantilla empresarial full-stack con arquitectura escalable: autenticación segura con Supabase, aislamiento de datos vía PostgreSQL Row-Level Security y monetización automatizada con Stripe.',
      startTrial: 'Comenzar Prueba Gratis',
      exploreConsole: 'Explorar Consola en Vivo'
    },
    dashboard: {
      activeOrg: 'Organización Activa:',
      switchOrg: 'Workspace:',
      monthlyIngest: 'Ingestión API Mensual',
      quota: 'Cupo: 2M peticiones (71%)',
      p99Latency: 'Latencia p99 de Respuesta',
      edgeCache: 'Caché Global en el Edge',
      rlsSecurity: 'Seguridad RLS',
      zeroTrust: 'Row Level Security en Supabase',
      billedMrr: 'MRR Facturado',
      stripeLive: 'Facturación Stripe Activa'
    }
  }
};
