# nTZS - Tanzania Shilling Stablecoin

<p align="center">
  <img src="admin-portal/public/images/neda-pay-logo.jpg" alt="nTZS Logo" width="120" height="120" style="border-radius: 16px;">
</p>

<p align="center">
  <strong>A fully-collateralized stablecoin pegged 1:1 to the Tanzanian Shilling (TSH)</strong>
</p>

<p align="center">
  <a href="https://sepolia.basescan.org/address/0x2bD2305bDB279a532620d76D0c352F35B48ef2C0">
    <img src="https://img.shields.io/badge/Base%20Sepolia-Verified-blue" alt="Base Sepolia">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT">
  </a>
  <img src="https://img.shields.io/badge/Solidity-0.8.22-purple" alt="Solidity">
</p>

---

## Overview

**nTZS (NTZS)** is a regulatory-compliant stablecoin designed to digitize the Tanzanian Shilling on the blockchain. Built on Base (Ethereum L2), it provides fast, low-cost transactions while maintaining full transparency and regulatory oversight.

### Key Features

- **1:1 TSH Peg**: Each nTZS token is backed by equivalent TSH reserves
- **ERC-20 Compatible**: Works with all Ethereum wallets and DeFi protocols
- **Gasless Approvals**: EIP-2612 Permit support for meta-transactions
- **Role-Based Access Control**: Granular permissions for minting, burning, pausing, and blacklisting
- **Pausable**: Emergency circuit breaker for security incidents
- **Blocklist**: Regulatory compliance through address blocking
- **Upgradeable**: UUPS proxy pattern for future improvements (UpgradeableNTZS)

---

## Smart Contracts

### Deployed Contracts (Base Sepolia Testnet)

| Contract | Address | Description |
|----------|---------|-------------|
| **SimpleNTZS** | [`0x2bD2305bDB279a532620d76D0c352F35B48ef2C0`](https://sepolia.basescan.org/address/0x2bD2305bDB279a532620d76D0c352F35B48ef2C0) | Main stablecoin token |
| **SimpleReserve** | `0x72Ff093CEA6035fa395c0910B006af2DC4D4E9F5` | Collateral management |
| **TestUSDC** | `0x4ecD2810a6A412fdc95B71c03767068C35D23fE3` | Test collateral token |
| **SimplePriceOracle** | `0xe4A05fca88C4F10fe6d844B75025E3415dFe6170` | Price feed oracle |
| **SimpleFeeManager** | `0x46358DA741d3456dBAEb02995979B2722C3b8722` | Fee management |
| **SimpleBatchPayment** | `0x9E1e03b06FB36364b3A6cbb6AbEC4f6f2B9C8DdC` | Batch transfers |
| **SimplePaymaster** | `0x7d9687c95831874926bbc9476844674D6B943464` | Gas sponsorship |
| **SimpleSmartWalletFactory** | `0x10dE41927cdD093dA160E562630e0efC19423869` | Account abstraction |

### Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        nTZS Ecosystem                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  SimpleNTZS  │    │ SimpleReserve│    │  PriceOracle │  │
│  │   (ERC-20)   │◄───│  (Collateral)│◄───│   (Prices)   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                               │
│         ▼                   ▼                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  FeeManager  │    │ BatchPayment │    │  Paymaster   │  │
│  │   (Fees)     │    │  (Batching)  │    │    (Gas)     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Token Specifications

| Property | Value |
|----------|-------|
| Name | Tanzania Shilling Stablecoin |
| Symbol | NTZS |
| Decimals | 2 (matches TSH currency) |
| Standard | ERC-20 + ERC-2612 (Permit) |
| Network | Base (Ethereum L2) |

### Access Control Roles

| Role | Description |
|------|-------------|
| `DEFAULT_ADMIN_ROLE` | Full administrative access |
| `MINTER_ROLE` | Can mint new tokens |
| `BURNER_ROLE` | Can burn tokens |
| `PAUSER_ROLE` | Can pause/unpause transfers |
| `BLACKLISTER_ROLE` | Can block/unblock addresses |
| `UPGRADER_ROLE` | Can upgrade contract (UpgradeableNTZS only) |

---

## Applications

### Admin Portal

A comprehensive management dashboard for nTZS administrators.

**Features:**
- Mint and burn nTZS tokens
- Manage user roles and permissions
- Monitor token supply and transactions
- KYC management
- Deposit and redemption processing

**Tech Stack:** React, TypeScript, Material-UI, ethers.js

### Regulatory Dashboard

A monitoring interface for central banks and financial regulators.

**Features:**
- Real-time token supply monitoring
- Reserve ratio tracking
- Transaction monitoring and analysis
- Compliance report generation
- Multi-role access (Central Bank, Partner Banks, Regulators)

**Tech Stack:** React, TypeScript, Material-UI, ethers.js

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MetaMask or compatible Web3 wallet
- Base Sepolia testnet ETH (for gas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/0xMgwan/TSHC-stablecoin.git
   cd TSHC-stablecoin
   ```

2. **Install contract dependencies**
   ```bash
   cd Contracts
   npm install
   ```

3. **Install admin portal dependencies**
   ```bash
   cd ../admin-portal
   npm install
   ```

4. **Install regulatory dashboard dependencies**
   ```bash
   cd ../regulatory-dashboard
   npm install
   ```

### Configuration

1. **Create environment file for contracts**
   ```bash
   cd Contracts
   cp .env.example .env
   ```

2. **Edit `.env` with your values**
   ```env
   PRIVATE_KEY=0x_your_private_key_here
   BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ETHERSCAN_API_KEY=your_basescan_api_key
   ```

### Compile & Deploy Contracts

```bash
cd Contracts

# Compile
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy_ntzs.js --network baseSepolia

# Verify on BaseScan
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### Run Applications

**Admin Portal:**
```bash
cd admin-portal
npm start
# Opens at http://localhost:3000
```

**Regulatory Dashboard:**
```bash
cd regulatory-dashboard
npm start
# Opens at http://localhost:3001
```

---

## Testing

```bash
cd Contracts

# Run all tests
npx hardhat test

# Run with gas reporting
REPORT_GAS=true npx hardhat test

# Run coverage
npx hardhat coverage
```

---

## Security

### Audit Status

⚠️ **This project is currently unaudited and deployed on testnet only.**

### Security Features

- **Role-Based Access Control**: All sensitive functions require specific roles
- **Pausable**: Emergency stop mechanism for all transfers
- **Blocklist**: Compliance-ready address blocking
- **Reentrancy Protection**: OpenZeppelin's secure patterns
- **Upgradeable**: UUPS pattern with upgrade authorization

### Responsible Disclosure

If you discover a security vulnerability, please email security@nedapay.com instead of creating a public issue.

---

## Roadmap

- [x] Core smart contracts (SimpleNTZS, UpgradeableNTZS)
- [x] Admin portal for token management
- [x] Regulatory dashboard for oversight
- [x] Base Sepolia testnet deployment
- [ ] Security audit
- [ ] Base mainnet deployment
- [ ] Mobile wallet integration
- [ ] Cross-chain bridge support
- [ ] Additional collateral types

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

- **Website**: [nedapay.xyz](https://nedapay.xyz)
- **Twitter**: [@NEDAPay_xyz](https://twitter.com/NEDAPay_xyz)
- **Email**: info@nedapay.com

---

<p align="center">
  <strong>Securing Tanzania's Digital Financial Future</strong>
</p>

