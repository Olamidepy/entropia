import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Entropia database seeding...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.action.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.filecoinRecord.deleteMany();
  await prisma.survivalScore.deleteMany();
  await prisma.riskEvent.deleteMany();
  await prisma.memory.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Default Operator User
  const user = await prisma.user.create({
    data: {
      email: "operator@entropia.network",
      name: "Lead System Architect",
      role: "admin",
    },
  });

  console.log(`Created user: ${user.email} (${user.id})`);

  // 2. Project 1: Stable High-Resilience Agent
  const p1 = await prisma.project.create({
    data: {
      name: "Synthetix Agent Alpha",
      slug: "synthetix-agent-alpha",
      description: "High-frequency autonomous execution vault with distributed Filecoin memory anchoring.",
      category: "agent_vault",
      status: "active",
      currentScore: 88.5,
      currentStatus: "healthy",
      primaryProvider: "f019283 (Glif EU-West)",
      userId: user.id,
    },
  });

  // Project 1 Signals
  await prisma.signal.createMany({
    data: [
      { projectId: p1.id, name: "runway_days", category: "resource", value: 124, unit: "days" },
      { projectId: p1.id, name: "balance_usd", category: "resource", value: 48500, unit: "usd" },
      { projectId: p1.id, name: "storage_usage_pct", category: "storage", value: 46.2, unit: "pct" },
      { projectId: p1.id, name: "storage_expiry_days", category: "storage", value: 165, unit: "days" },
      { projectId: p1.id, name: "retrieval_success_rate", category: "storage", value: 0.998, unit: "ratio" },
      { projectId: p1.id, name: "uptime_pct", category: "stability", value: 99.94, unit: "pct" },
      { projectId: p1.id, name: "recent_failure_count", category: "stability", value: 0, unit: "count" },
      { projectId: p1.id, name: "last_heartbeat_seconds_ago", category: "activity", value: 8, unit: "seconds" },
      { projectId: p1.id, name: "preservation_pin_count", category: "storage", value: 3, unit: "count" },
      { projectId: p1.id, name: "verified_replicas", category: "storage", value: 2, unit: "count" },
    ],
  });

  // Project 1 Filecoin Records
  await prisma.filecoinRecord.createMany({
    data: [
      {
        projectId: p1.id,
        dealId: "f019283-deal-884920",
        pieceCid: "baga6ea4seaqky7o4i6p45ffv3tqgoy6z77y2x6l",
        payloadCid: "bafybeic52iipbuxq567j24a5l6z5m23wky6j7b",
        provider: "f019283 (Glif EU-West)",
        sizeBytes: BigInt(1024 * 1024 * 512),
        storageStatus: "ACTIVE",
        replication: 2,
        dealStart: new Date(Date.now() - 30 * 86400000),
        dealEnd: new Date(Date.now() + 510 * 86400000),
        verified: true,
      },
      {
        projectId: p1.id,
        dealId: "f028472-deal-491024",
        pieceCid: "baga6ea4seaqmr9k34l8912pvv883x01llm7qwer",
        payloadCid: "bafybeifk3p40291kkmvllpw447812903mcvxbq",
        provider: "f028472 (PiKnik US-East)",
        sizeBytes: BigInt(1024 * 1024 * 512),
        storageStatus: "ACTIVE",
        replication: 2,
        dealStart: new Date(Date.now() - 25 * 86400000),
        dealEnd: new Date(Date.now() + 515 * 86400000),
        verified: true,
      },
    ],
  });

  // Project 1 Memories
  await prisma.memory.createMany({
    data: [
      {
        projectId: p1.id,
        type: "PRESERVATION_EVENT",
        title: "Dual-Region Filecoin Replication Confirmed",
        content: "Completed synchronized sealing across Glif (EU) and PiKnik (US) miners with zero latency drift.",
        severity: "INFO",
        tags: "filecoin,replication,genesis",
        timestamp: new Date(Date.now() - 10 * 86400000),
      },
      {
        projectId: p1.id,
        type: "TREND_SNAPSHOT",
        title: "Deterministic Survival Score Peak",
        content: "Achieved maximum score rating of 89.2 following 30 continuous days of zero retrieval faults.",
        severity: "INFO",
        tags: "survival,benchmark",
        timestamp: new Date(Date.now() - 3 * 86400000),
      },
    ],
  });

  // 3. Project 2: At-Risk Agent (Approaching Expiry & Runway Warning)
  const p2 = await prisma.project.create({
    data: {
      name: "Autonomous Oracle Swarm",
      slug: "autonomous-oracle-swarm",
      description: "Distributed consensus agents aggregating cross-chain feeds and neural cache.",
      category: "data_pipeline",
      status: "degraded",
      currentScore: 54.0,
      currentStatus: "at-risk",
      primaryProvider: "f019283 (Glif)",
      userId: user.id,
    },
  });

  await prisma.signal.createMany({
    data: [
      { projectId: p2.id, name: "runway_days", category: "resource", value: 24, unit: "days" },
      { projectId: p2.id, name: "balance_usd", category: "resource", value: 6200, unit: "usd" },
      { projectId: p2.id, name: "storage_usage_pct", category: "storage", value: 89.5, unit: "pct" },
      { projectId: p2.id, name: "storage_expiry_days", category: "storage", value: 12, unit: "days" },
      { projectId: p2.id, name: "retrieval_success_rate", category: "storage", value: 0.92, unit: "ratio" },
      { projectId: p2.id, name: "uptime_pct", category: "stability", value: 97.4, unit: "pct" },
      { projectId: p2.id, name: "recent_failure_count", category: "stability", value: 3, unit: "count" },
      { projectId: p2.id, name: "last_heartbeat_seconds_ago", category: "activity", value: 140, unit: "seconds" },
      { projectId: p2.id, name: "preservation_pin_count", category: "storage", value: 1, unit: "count" },
      { projectId: p2.id, name: "verified_replicas", category: "storage", value: 1, unit: "count" },
    ],
  });

  const r2 = await prisma.riskEvent.create({
    data: {
      projectId: p2.id,
      code: "STORAGE_EXPIRY_APPROACHING",
      title: "Storage Deal Approaching Expiry (12 Days Remaining)",
      description: "Primary Filecoin storage deal will expire in 12 days. Data continuity requires scheduled sector extension.",
      severity: "HIGH",
      status: "ACTIVE",
      evidence: JSON.stringify([{ metric: "storage_expiry_days", observedValue: 12, threshold: "<= 14" }]),
    },
  });

  const dec2 = await prisma.decision.create({
    data: {
      projectId: p2.id,
      riskEventId: r2.id,
      policyRule: "STORAGE_DEAL_RENEWAL_REQUIRED",
      recommendation: "RENEW_STORAGE_DEAL",
      reasoning: "Imminent storage expiry (12d) demands deal renewal to prevent deal state invalidation.",
      executionType: "REQUIRES_CONFIRMATION",
      status: "PROPOSED",
    },
  });

  const act2 = await prisma.action.create({
    data: {
      projectId: p2.id,
      decisionId: dec2.id,
      actionType: "RENEW_STORAGE_DEAL",
      title: "Renew Approaching Filecoin Storage Deal",
      description: "Extends active storage sector leases with existing storage providers before sector expiration occurs.",
      requiresConfirmation: true,
      status: "PENDING_CONFIRMATION",
      payload: JSON.stringify({ extensionEpochs: 180 }),
    },
  });

  await prisma.auditLog.create({
    data: {
      projectId: p2.id,
      decisionId: dec2.id,
      actionId: act2.id,
      actor: "SYSTEM",
      eventType: "CONFIRMATION_REQUESTED",
      details: JSON.stringify({
        actionType: "RENEW_STORAGE_DEAL",
        riskLevel: "HIGH",
        reason: "Storage deal approaching expiry (12 days remaining)",
      }),
    },
  });

  // 4. Project 3: Critical Project (Runway Depletion & Expiry Critical)
  const p3 = await prisma.project.create({
    data: {
      name: "Historical Chain Archive",
      slug: "historical-chain-archive",
      description: "Long-term historical telemetry and transactional record store.",
      category: "decentralized_archive",
      status: "critical",
      currentScore: 28.5,
      currentStatus: "critical",
      primaryProvider: "Unassigned",
      userId: user.id,
    },
  });

  await prisma.signal.createMany({
    data: [
      { projectId: p3.id, name: "runway_days", category: "resource", value: 4, unit: "days" },
      { projectId: p3.id, name: "balance_usd", category: "resource", value: 340, unit: "usd" },
      { projectId: p3.id, name: "storage_usage_pct", category: "storage", value: 96.8, unit: "pct" },
      { projectId: p3.id, name: "storage_expiry_days", category: "storage", value: 3, unit: "days" },
      { projectId: p3.id, name: "retrieval_success_rate", category: "storage", value: 0.76, unit: "ratio" },
      { projectId: p3.id, name: "uptime_pct", category: "stability", value: 91.2, unit: "pct" },
      { projectId: p3.id, name: "recent_failure_count", category: "stability", value: 7, unit: "count" },
      { projectId: p3.id, name: "last_heartbeat_seconds_ago", category: "activity", value: 7200, unit: "seconds" },
      { projectId: p3.id, name: "preservation_pin_count", category: "storage", value: 0, unit: "count" },
      { projectId: p3.id, name: "verified_replicas", category: "storage", value: 0, unit: "count" },
    ],
  });

  const r3 = await prisma.riskEvent.create({
    data: {
      projectId: p3.id,
      code: "STORAGE_EXPIRY_CRITICAL",
      title: "Critical Deal Expiration & Zero Backup",
      description: "Storage deal expires in 3 days with 0 redundant replicas. Immediate preservation required.",
      severity: "CRITICAL",
      status: "ACTIVE",
      evidence: JSON.stringify([
        { metric: "storage_expiry_days", observedValue: 3, threshold: "<= 5" },
        { metric: "preservation_pin_count", observedValue: 0, threshold: ">= 1" },
      ]),
    },
  });

  const dec3 = await prisma.decision.create({
    data: {
      projectId: p3.id,
      riskEventId: r3.id,
      policyRule: "CRITICAL_SURVIVAL_EMERGENCY_PRESERVATION",
      recommendation: "PRESERVE_TO_FILECOIN",
      reasoning: "CRITICAL risk detected with survival score < 30. Emergency Filecoin CAR sealing is mandatory.",
      executionType: "REQUIRES_CONFIRMATION",
      status: "PROPOSED",
    },
  });

  const act3 = await prisma.action.create({
    data: {
      projectId: p3.id,
      decisionId: dec3.id,
      actionType: "PRESERVE_TO_FILECOIN",
      title: "Create Sealed Filecoin Preservation Deal",
      description: "Packages active memory state and cryptographic hashes, submitting an immutable storage deal.",
      requiresConfirmation: true,
      status: "PENDING_CONFIRMATION",
      payload: JSON.stringify({ priority: "emergency", targetReplication: 3 }),
    },
  });

  await prisma.auditLog.create({
    data: {
      projectId: p3.id,
      decisionId: dec3.id,
      actionId: act3.id,
      actor: "SYSTEM",
      eventType: "CONFIRMATION_REQUESTED",
      details: JSON.stringify({
        actionType: "PRESERVE_TO_FILECOIN",
        riskLevel: "CRITICAL",
        reason: "Immediate preservation required: 3 days until terminal deal failure.",
      }),
    },
  });

  console.log("✅ Entropia database seeded successfully with 3 diverse projects, signals, risks, decisions, and audit logs!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
