# API Reference Guide

This document details the REST API endpoints exposed by Entropia.

## Intelligence & Analysis

### `POST /api/intelligence`
Synthesizes qualitative AI analysis on current deterministic metrics.

#### Request Body
```json
{
  "projectId": "proj_123"
}
```

#### Response Body
```json
{
  "analysis": "Operational runway remains stable...",
  "recommendedAction": "ARCHIVE_STATE",
  "confidence": 0.94,
  "calculatedAt": "2026-09-12T16:00:00.000Z"
}
```

## Projects

### `GET /api/projects`
Returns a list of all monitored projects and their real-time survival status.

### `POST /api/projects`
Creates and registers a new monitored autonomous project.
