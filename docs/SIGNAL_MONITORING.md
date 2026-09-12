# Signal Monitoring & Ingestion

Signal monitoring processes diverse, non-uniform telemetry inputs into standardized normalized metrics suitable for analytical consumption.

## Normalization Process

- **Min-Max Bounds**: Linear clamping to $[0.0, 1.0]$.
- **Outlier Smoothing**: Exponential moving average smoothing for noisy latency spikes.
- **Missing Telemetry Handling**: Zero-order hold with confidence score decay.
