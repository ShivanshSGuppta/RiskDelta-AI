<p align="center">
  <img src="docs/assets/riskdelta-banner.png" alt="RiskDelta AI Banner" width="100%" />
</p>

<h1 align="center">RiskDelta AI</h1>

<p align="center">
  Autonomous Risk Intelligence Control Plane for AI Systems, Agents & Copilots
</p>

<p align="center">
  <img src="https://img.shields.io/badge/runtime-control--plane-black?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/policy-engine-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/risk-scoring-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/tracevault-purple?style=for-the-badge"/>
</p>

<p align="center">
  <a href="#-quick-start">🚀 Get Started</a> •
  <a href="#-architecture">⚙️ Architecture</a> •
  <a href="#-demo">🎥 Demo</a> •
  <a href="#-use-cases">🎯 Use Cases</a>
</p>

---

## ⚡ What is RiskDelta?

RiskDelta is an **autonomous runtime control plane for AI systems**.

As AI shifts from **answering → acting**, risk shifts from **content → execution**.

RiskDelta sits between:
- Users  
- Models  
- Agents  
- External tools  

…and enforces:

- Policy decisions  
- Risk scoring per response  
- Deterministic guardrails  
- Human approvals  
- Full audit trails  

> **Think: Stripe for AI Risk Infrastructure**

---

## 🚨 Problem

AI systems today:
- hallucinate  
- leak sensitive data  
- execute unsafe actions  
- lack auditability  

Most existing tools focus on **prompt filtering**.

But real risk happens at the **runtime execution layer**.

---

## ✅ Solution

RiskDelta provides:

- Runtime-level enforcement  
- Response-level risk scoring  
- Fail-closed deterministic guardrails  
- Evidence-backed outputs  
- Full traceability via TraceVault  

---

## ⚙️ Architecture

<p align="center">
  <img src="docs/assets/riskdelta-architecture.png" width="90%" />
</p>

### Core Runtime Flow

1. Ingest runtime events  
2. Normalize traces and sessions  
3. Score risk  
4. Evaluate policy  
5. Execute runtime enforcement  
6. Store evidence (TraceVault)  

---

## 🧠 Core Components

| Component | Description |
|----------|------------|
| Policy Engine | Deterministic rule evaluation |
| Risk Scoring Engine | Scores every response |
| PromptShield | Input validation layer |
| DataGuard | Sensitive data protection |
| AgentFence | Agent action control |
| ModelSwitch | Dynamic model routing |
| SentinelX | Final verdict engine |
| TraceVault | Full audit trail storage |

---

## 🎯 Use Cases

- AI copilots in production  
- Autonomous agents with tool access  
- Enterprise LLM applications  
- Internal AI platforms  

### Example

User asks an agent:

> “Delete inactive users from database”

RiskDelta:
- assigns risk score → **HIGH**  
- evaluates policy → **REQUIRES APPROVAL**  
- blocks execution → until approved  

- 🧪 Flow: Runtime → Risk Score → Policy → Action  
---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+  
- pnpm 10+  
- Docker  

### Run locally

```bash
git clone https://github.com/your-username/riskdelta
cd riskdelta

cp .env.example .env

docker compose up -d

pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed

pnpm dev
