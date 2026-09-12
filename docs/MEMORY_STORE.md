# Memory Store Architecture

The Memory Store provides short-term volatile cache and long-term vector indexing for historical survival decisions.

## Data Retention Policies

- **Volatile Signals**: Retained in active memory for sliding 60-minute window.
- **Hourly Aggregations**: Persisted to PostgreSQL via Prisma `TelemetryAggregate` model.
- **Historical Snapshots**: Cryptographically sealed and backed up to Filecoin storage deals.
