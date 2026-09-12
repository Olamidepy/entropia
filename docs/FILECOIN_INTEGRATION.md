# Filecoin & IPFS Storage Architecture

Entropia integrates with Filecoin and IPFS to achieve decentralized, tamper-evident auditability for all autonomous intelligence decisions.

## Storage Deal Workflow

1. Serialize snapshot payload into canonical JSON.
2. Compute cryptographic CID (Content Identifier) using SHA-256 multihash.
3. Submit payload to storage provider gateway.
4. Record receipt CID and storage proof on the audit ledger.
