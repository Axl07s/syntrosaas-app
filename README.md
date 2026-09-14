<div align="center">
  <img src="https://syntrosaas-app.vercel.app/projects/syntrosaas_01.png" alt="SyntroSaaS Architecture" width="100%" />

  # SyntroSaaS (B2B Boilerplate)
  **Production-grade Multi-Tenant SaaS Engine built with Next.js 15 & Supabase**

  [![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](https://stripe.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
</div>

<br/>

SyntroSaaS is a high-performance, multi-tenant B2B boilerplate designed to reduce Go-To-Market time from months to under 2 weeks. It provides a highly secure, zero-trust foundation with strict data isolation, asynchronous billing reconciliation, and scalable team management.

## 🚀 Business Impact & Metrics
- **Time-to-Market:** Reduces core infrastructure development by ~120 hours.
- **Performance:** 99/100 Core Web Vitals (Lighthouse) via React Server Components.
- **Security:** Complete data isolation using Supabase Row-Level Security (RLS) policies.

## 🏗️ Core Architecture & Features

### 1. Multi-Tenant Workspace Isolation
- **Row-Level Security (RLS):** Database-level security ensuring users can only read/write data within their authorized workspace (tenant).
- **Role-Based Access Control (RBAC):** Granular permissions (Owner, Admin, Member) enforced at the database and UI levels.
- **Team Management:** Secure, token-based asynchronous team invite system.

### 2. Zero-Trust Authentication
- **Supabase Auth:** Passwordless Magic Links and Google OAuth integration.
- **Middleware Protection:** Edge middleware to protect protected routes and prevent unauthenticated flashes.
- **Session Management:** Secure HttpOnly cookie handling for server-side authentication rendering.

### 3. Automated Revenue Pipeline (Stripe)
- **Tiered Subscriptions:** Starter, Professional, and Enterprise pricing tiers.
- **Async Webhooks:** Serverless endpoints to handle Stripe webhooks, ensuring local database reconciliation (upgrades, downgrades, cancellations).
- **Customer Portal:** Native Stripe Customer Portal integration for self-service billing management.

### 4. API & Developer Experience
- **API Key Management:** Cryptographic generation and rotation of API keys per workspace.
- **Usage Tracking:** Rate limiting and telemetry tracking to enforce subscription quotas.
- **Type Safety:** 100% end-to-end type safety with TypeScript and Supabase GenTypes.

## 💻 Tech Stack
- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Payments:** [Stripe](https://stripe.com/)
- **Language:** TypeScript

## ⚙️ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Axl07s/syntrosaas-app.git
cd syntrosaas-app
npm install
```

### 2. Environment Variables
Create a `.env.local` file with the following keys:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup (Supabase)
Run the provided SQL migrations in your Supabase SQL Editor to generate the schema, RLS policies, and triggers:
```bash
# Apply migrations located in /supabase/migrations
supabase db push
```

### 4. Run Development Server
```bash
npm run dev
```

---

> **Architectural Note:** This system is built prioritizing edge-rendering performance and strict database-level security over client-side validation. All critical mutations (Invites, Billing, Roles) are protected via Server Actions and Postgres constraints.

<div align="center">
  <i>Engineered for production by <a href="https://github.com/Axl07s">Axel Molineros</a>.</i>
</div>

