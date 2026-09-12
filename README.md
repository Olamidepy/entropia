# ENTROPIA - AI Survival Intelligence Platform

[![CI](https://github.com/Olamidepy/entropia/actions/workflows/ci.yml/badge.svg)](https://github.com/Olamidepy/entropia/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

> **"An AI Agent that Decides What to Remember to Survive."**

Entropia is a production-quality autonomous survival intelligence platform designed to monitor digital projects, autonomous AI agent vaults, storage conditions, resource runway, and environmental risk signals.

By marrying a **strict deterministic mathematical scoring engine** with an **autonomous qualitative AI reasoning agent**, Entropia monitors system health and automatically orchestrates decentralized preservation on the **Filecoin network** through transparent confirmation safety gates and immutable audit logging.

[Architecture](docs/ARCHITECTURE.md) • [Survival Engine](docs/SURVIVAL_ENGINE.md) • [Risk Matrix](docs/RISK_MATRIX.md) • [Deployment](docs/DEPLOYMENT.md) • [API Guide](docs/API.md)

---

##  Core Architectural Principle: Deterministic Math vs. AI Reasoning

A foundational principle of Entropia is the strict separation between mathematical calculation and language model reasoning:

```
┌────────────────────────────────────────────────────────┐
│                   DETERMINISTIC LAYER                  │
│  - Resource Health (0-100)                             │
│  - Storage Health (0-100)                              │
│  - Historical Stability (0-100)                        │
│  - Risk Exposure (0-100)                               │
│  - System Activity (0-100)                             │
│  - Preservation Readiness (0-100)                      │
│                    ↓ Weighted Formula                  │
│       DETERMINISTIC SURVIVAL SCORE (0–100)             │
│                    ↓ Hard Thresholds                   │
│             DETERMINISTIC RISK RULES                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Immutable Metrics & Active Risks
                           ▼
┌────────────────────────────────────────────────────────┐
│                   AI REASONING LAYER                   │
│  - Never invents or modifies numerical scores          │
│  - Ingests persistent contextual memory                │
│  - Synthesizes qualitative threat analysis             │
│  - Formulates structured reasoning                     │
│  - Recommends validated actions from Action Registry   │
└──────────────────────────┬─────────────────────────────┘
                           │ Validated Action Recommendation
                           ▼
┌────────────────────────────────────────────────────────┐
│                DECISION & SAFETY POLICY                │
│  - Evaluates action against safety policies            │
│  - Enforces MANDATORY human confirmation for sensitive │
│    operations (capital spend, state pruning, deals)    │
│  - Displays 4-Part Dialog (WHAT WILL HAPPEN, WHY IT IS │
│    RECOMMENDED, RISK LEVEL, EXPECTED OUTCOME)          │
└──────────────────────────┬─────────────────────────────┘
                           │ Explicit Confirmation
                           ▼
┌────────────────────────────────────────────────────────┐
│              FILECOIN PRESERVATION ENGINE              │
│  - CAR File Serialization                              │
│  - Cryptographic PieceCID & PayloadCID Generation      │
│  - Multi-miner geo-redundancy (Glif, PiKnik, Lotus)    │
│  - Immutable Audit Log Record                          │
└────────────────────────────────────────────────────────┘
```

---

##  Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15+ App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion |
| **Design System** | Pure white background (`#FFFFFF`), Charcoal typography, Electric Orange (`#FF6B00`) |
| **Backend** | Next.js Route Handlers, Server Actions, Zod Schema Validation |
| **Database** | Prisma ORM with SQLite (zero-config local) & PostgreSQL (production / Docker) |
| **AI Layer** | OpenAI GPT-4o with structured JSON schemas + offline heuristic engine fallback |
| **Storage & Web3** | Modular Filecoin `StorageProvider` adapter (Glif RPC, PiKnik, Lotus, Mock) |
| **Testing** | Vitest unit test suite covering survival, risk, and decision engines |

---

##  Project Structure

```
entropia/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx               # High-fidelity landing page matching Hero Design
│   │   ├── layout.tsx             # Marketing header and footer
│   │   └── about/page.tsx         # Architectural manifesto
│   ├── (auth)/
│   │   ├── sign-in/page.tsx       # Operator authentication portal
│   │   └── sign-up/page.tsx       # Node registration
│   ├── dashboard/
│   │   ├── page.tsx               # Main survival overview & score console
│   │   ├── layout.tsx             # Responsive dashboard layout
│   │   ├── projects/page.tsx      # Monitored targets directory
│   │   ├── intelligence/page.tsx  # Deep-dive AI reasoning center
│   │   ├── memory/page.tsx        # Persistent historical memory graph
│   │   ├── decisions/page.tsx     # Deterministic policy rules
│   │   ├── actions/page.tsx       # Confirmation queue & immutable audit log
│   │   └── settings/page.tsx      # Filecoin & cluster settings
│   ├── api/
│   │   ├── health/route.ts        # System status API
│   │   ├── projects/route.ts      # Projects CRUD & telemetry
│   │   ├── intelligence/route.ts  # Deterministic score + AI agent trigger
│   │   ├── memory/route.ts        # getRelevantMemory query & write
│   │   ├── decisions/route.ts     # Policy evaluations
│   │   ├── actions/route.ts       # Action registry & execution
│   │   └── filecoin/route.ts      # Filecoin deal lifecycle
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── marketing/                 # Hero (with 3D asset), Navigation, Features, Simulator, Footer
│   ├── layout/                    # Sidebar, Header, Dashboard Shell, Mobile Navigation
│   ├── dashboard/                 # Survival Score Card, Risk Overview, Agent Insight, Preservation
│   ├── decisions/                 # 4-Part Confirmation Modal
│   └── shared/                    # Loading, Empty, and Error states
├── lib/
│   ├── survival/                  # Deterministic Survival Engine & weights
│   ├── risk/                      # Deterministic Risk Engine & rules
│   ├── memory/                    # Persistent Memory Service & context analysis
│   ├── ai/                        # OpenAI client, prompt builder, Zod schemas, reasoning agent
│   ├── decisions/                 # Deterministic Policy Engine
│   ├── actions/                   # Action Service & Confirmation Policy
│   ├── filecoin/                  # Modular StorageProvider interface & Glif/Mock adapters
│   └── db/                        # Singleton Prisma Client
├── prisma/
│   ├── schema.prisma              # 10 comprehensive models with relations
│   └── seed.ts                    # Realistic demo data (3 projects with varied risk profiles)
├── public/images/
│   ├── entropia-logo.png          # Entropia official logo
│   └── entropia-3d.png            # 3D orange glass fins brand asset
└── tests/unit/
    ├── survival.engine.test.ts    # Scoring bounds, factor weights, and edge cases
    ├── risk.engine.test.ts        # Risk thresholds, severity grading, and evidence
    └── decision.engine.test.ts    # Policy matrix and confirmation rules
```

---

##  Quickstart & Local Setup

The project is pre-configured to run with **zero external dependencies** out of the box.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/entropia.git
cd entropia
npm install
```

### 2. Configure Environment Variables
Copy the template `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Default settings use local SQLite `file:./dev.db` and the built-in heuristic reasoning agent, requiring no API keys to run!)*

### 3. Initialize Database & Seed Demo Data
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser:
- **Landing Page**: [http://localhost:3000](http://localhost:3000) (Matches `Hero Design.png` with interactive simulator)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

##  Running Automated Tests

Entropia ships with a comprehensive Vitest test suite validating all deterministic math, risk rules, and confirmation policies:

```bash
npm test
# or:
npx vitest run
```

---

##  Deterministic Survival Formula

The survival score is deterministically calculated and strictly bounded `[0, 100]`:

$$\text{SurvivalScore} = \sum (\text{CategoryScore}_i \times \text{Weight}_i)$$

| Factor | Weight | Evaluation Criteria |
| :--- | :--- | :--- |
| **Resource Health** | `0.25` | Financial & compute runway days remaining |
| **Storage Health** | `0.20` | Deal expiration epoch, sector faults, retrieval success rate |
| **Historical Stability** | `0.15` | Operational uptime, recent fault events, anomaly frequency |
| **Risk Exposure** | `0.20` | Count and severity of active tripped safety thresholds |
| **System Activity** | `0.10` | Heartbeat freshness, telemetry cadence |
| **Preservation Readiness** | `0.10` | Active Filecoin pinned deals, multi-region replication factor |

---

##  User Confirmation & Safety Dialog

Sensitive actions (such as `PRESERVE_TO_FILECOIN`, `RENEW_STORAGE_DEAL`, or `COMPRESS_MEMORY_INDEX`) require explicit operator confirmation before execution.

The confirmation modal strictly presents four explicit parameters:
1. **WHAT WILL HAPPEN**: Step-by-step programmatic action details.
2. **WHY IT IS RECOMMENDED**: Deterministic risk rule or metric trigger.
3. **RISK LEVEL**: `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`.
4. **EXPECTED OUTCOME**: Projected impact on survival score and state durability.

Every action confirmed or rejected generates an immutable entry in the `AuditLog` table.

---

## 💾 Filecoin Modular Provider Architecture

Entropia decouples application business logic from specific storage networks via the `StorageProvider` interface:

```typescript
export interface StorageProvider {
  name: string;
  store(data: Uint8Array | string, options?: StoreOptions): Promise<StorageResult>;
  retrieve(cid: string): Promise<RetrievalResult>;
  getStatus(dealId: string): Promise<DealStatusResult>;
  monitor(dealIds: string[]): Promise<DealStatusResult[]>;
  preserve(payload: PreservationPayload): Promise<PreservationReceipt>;
}
```

Implementations include:
- **`MockFilecoinProvider`**: Instant local demo provider generating real CID formats (`bafy...`, `baga...`) and simulating deal lifecycle.
- **`GlifRpcProvider`**: Connects to Filecoin Glif JSON-RPC node.
- **`LotusProvider`**: Native Lotus node JSON-RPC adapter.

---

##  Future Roadmap

- [ ] Autonomous ERC-4337 smart account funding for automated deal renewal payments.
- [ ] Cross-chain Filecoin IPC (InterPlanetary Consensus) subnets for localized telemetry indexing.
- [ ] Zero-Knowledge proof verification for encrypted memory state CAR files.
- [ ] Hardware enclave (TEEs) attestation for autonomous operator nodes.

---

##  License
MIT License. Built for the autonomous agent and decentralized storage ecosystem.
