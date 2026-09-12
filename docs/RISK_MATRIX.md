# Risk Scoring Matrix

Entropia maps multi-dimensional threat telemetry into a standardized risk matrix to drive deterministic, automated safeguards.

## Severity Levels

| Level | Score Range | Description | Automated Action |
| ----- | ----------- | ----------- | ---------------- |
| **LOW** | `0.0 - 0.25` | Normal operational variance | Passive monitoring, background logging |
| **MODERATE** | `0.26 - 0.55` | Elevated resource drain or non-fatal errors | Adaptive throttling, cache refresh |
| **HIGH** | `0.56 - 0.80` | Threat to system survival or state consistency | Circuit breaking, state checkpointing |
| **CRITICAL** | `0.81 - 1.00` | Imminent process termination or catastrophic drift | Emergency state freeze, Filecoin backup |

## Evaluation Rules

Rules are defined declaratively in `lib/risk/risk.rules.ts` and evaluated sequentially in ascending order of latency.
