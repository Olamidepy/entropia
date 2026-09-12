# Decision Framework

The Decision Framework executes algorithmic mitigation strategies when the composite risk score crosses configured tolerance thresholds.

## Decision Lifecycle

1. **State Evaluation**: Pull current risk metrics and historical memory vector.
2. **Strategy Selection**: Match against defined deterministic resolution pathways.
3. **Execution Verification**: Apply mitigation (e.g. rate limit scaling, failover routing).
4. **Post-Mortem Logging**: Record action telemetry in Prisma PostgreSQL audit logs.
