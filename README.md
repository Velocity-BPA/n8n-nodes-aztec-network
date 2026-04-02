# n8n-nodes-aztec-network

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for integrating with the Aztec Network, providing access to 6 core resources. This node enables seamless interaction with Aztec's privacy-focused blockchain infrastructure, supporting transaction management, account operations, block exploration, smart contract interactions, note handling, and zero-knowledge proof operations.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Privacy](https://img.shields.io/badge/Privacy-Aztec-purple)
![Blockchain](https://img.shields.io/badge/Blockchain-ZK--Rollup-green)
![Zero Knowledge](https://img.shields.io/badge/ZK-Proofs-orange)

## Features

- **Private Transactions** - Execute and monitor privacy-preserving transactions on Aztec Network
- **Account Management** - Create, query, and manage Aztec accounts with full privacy controls
- **Block Operations** - Retrieve block data, headers, and transaction history from the network
- **Smart Contract Integration** - Deploy, call, and interact with Aztec smart contracts
- **Note Handling** - Create, retrieve, and manage encrypted notes within the Aztec ecosystem
- **Zero-Knowledge Proofs** - Generate, verify, and manage ZK proofs for privacy operations
- **Real-time Monitoring** - Track transaction status and network events with live updates
- **Privacy Controls** - Full support for Aztec's privacy features and viewing key management

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-aztec-network`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-aztec-network
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-aztec-network.git
cd n8n-nodes-aztec-network
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-aztec-network
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Aztec Network API access key | Yes |
| Network | Target network (mainnet, testnet, devnet) | Yes |
| Endpoint URL | Custom RPC endpoint (optional) | No |
| Viewing Key | Private viewing key for encrypted data access | No |

## Resources & Operations

### 1. Transaction

| Operation | Description |
|-----------|-------------|
| Create | Submit a new private transaction to the Aztec Network |
| Get | Retrieve transaction details by hash or ID |
| List | Query multiple transactions with filtering options |
| Get Status | Check the current status of a transaction |
| Get Receipt | Fetch transaction receipt and execution details |
| Simulate | Simulate transaction execution without broadcasting |

### 2. Account

| Operation | Description |
|-----------|-------------|
| Create | Generate a new Aztec account with private keys |
| Get | Retrieve account information and balance details |
| Get Balance | Query account balance for specific assets |
| Get Nonce | Fetch the current account nonce |
| List Transactions | Get transaction history for an account |
| Register | Register an account on the Aztec Network |

### 3. Block

| Operation | Description |
|-----------|-------------|
| Get | Retrieve block data by number or hash |
| Get Latest | Fetch the most recent block information |
| Get Header | Get block header without full transaction data |
| List | Query multiple blocks with range parameters |
| Get Transactions | Retrieve all transactions within a specific block |

### 4. Contract

| Operation | Description |
|-----------|-------------|
| Deploy | Deploy a new smart contract to Aztec Network |
| Call | Execute a read-only contract function call |
| Send | Execute a state-changing contract function |
| Get | Retrieve contract information and metadata |
| Get Code | Fetch contract bytecode and ABI |
| List Events | Query contract events with filtering |

### 5. Note

| Operation | Description |
|-----------|-------------|
| Create | Generate a new encrypted note |
| Get | Retrieve note data by identifier |
| List | Query notes with filtering and pagination |
| Decrypt | Decrypt note contents using viewing key |
| Nullify | Mark a note as spent/nullified |
| Get Commitment | Retrieve note commitment hash |

### 6. Proof

| Operation | Description |
|-----------|-------------|
| Generate | Create a zero-knowledge proof for operations |
| Verify | Verify the validity of a ZK proof |
| Get | Retrieve proof data and metadata |
| List | Query proofs with filtering options |
| Get Circuit | Fetch proof circuit information |

## Usage Examples

```javascript
// Submit a private transaction
const transaction = await $node["Aztec Network"].json({
  resource: "transaction",
  operation: "create",
  to: "0x1234567890abcdef1234567890abcdef12345678",
  amount: "100000000000000000000",
  asset: "0xabcdef1234567890abcdef1234567890abcdef12",
  private: true
});
```

```javascript
// Query account balance
const balance = await $node["Aztec Network"].json({
  resource: "account", 
  operation: "getBalance",
  address: "0x9876543210fedcba9876543210fedcba98765432",
  assetId: "0xabcdef1234567890abcdef1234567890abcdef12"
});
```

```javascript
// Deploy a smart contract
const contract = await $node["Aztec Network"].json({
  resource: "contract",
  operation: "deploy",
  bytecode: "0x608060405234801561001057600080fd5b50...",
  constructorArgs: ["initial_value", 42],
  salt: "0x1234567890abcdef"
});
```

```javascript
// Generate and verify a ZK proof
const proof = await $node["Aztec Network"].json({
  resource: "proof",
  operation: "generate",
  circuit: "private_transfer",
  inputs: {
    amount: "1000000000000000000",
    recipient: "0xabcdef...",
    nullifier: "0x123456..."
  }
});
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid API Key | Authentication failed with provided credentials | Verify API key is correct and has proper permissions |
| Network Unreachable | Unable to connect to Aztec Network | Check network connectivity and endpoint configuration |
| Insufficient Balance | Account lacks funds for transaction | Ensure account has sufficient balance for operation |
| Invalid Proof | Zero-knowledge proof verification failed | Regenerate proof with correct parameters and inputs |
| Contract Not Found | Smart contract address does not exist | Verify contract address and ensure it's deployed |
| Note Decryption Failed | Unable to decrypt note with provided key | Check viewing key permissions and note ownership |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-aztec-network/issues)
- **Aztec Documentation**: [docs.aztec.network](https://docs.aztec.network)
- **Developer Resources**: [aztec.network/developers](https://aztec.network/developers)