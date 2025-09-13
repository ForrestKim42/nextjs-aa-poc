# AA Gasless ERC-20 Transfer PoC

Account Abstraction (ERC-4337) Proof of Concept for gasless ERC-20 token transfers on Base Sepolia testnet.

## 🎯 What This Does

This PoC demonstrates:
1. **Smart Contract Compilation** using solc
2. **AA Contract Deployment** (SimpleAccount, Factory, Paymaster)
3. **Paymaster Funding** with minimal ETH for gas sponsorship
4. **Smart Account Creation** using CREATE2 for deterministic addresses
5. **Token Minting** to the smart account
6. **UserOperation Creation** for gasless token transfer
7. **Transaction Signing** and preparation for execution

## 📁 Project Structure

```
├── contracts/
│   ├── interfaces/          # ERC-4337 v0.7 interfaces from eth-infinitism
│   ├── SimpleAccount.sol    # Smart account implementation
│   ├── SimpleAccountFactory.sol # CREATE2 factory for accounts
│   ├── SimplePaymaster.sol  # Gas sponsorship paymaster
│   └── TestERC20.sol       # Test token with free minting
├── scripts/
│   └── poc.js              # Main PoC script
├── .env                    # Configuration
└── package.json
```

## 🚀 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env` file contains:
- **Developer wallet** for funding transactions
- **Base Sepolia RPC** endpoint
- **EntryPoint v0.7** address: `0x0000000071727De22E5E9d8BAf0edAc6f37da032`
- **Gas configuration** (optimized for testnet)

### 3. Fund Developer Wallet
Add Base Sepolia ETH to the developer wallet address:
- **Alchemy Faucet**: https://www.alchemy.com/faucets/base-sepolia
- **Base Docs Faucets**: https://docs.base.org/docs/tools/faucets

**Developer Address**: `0xe94f85b6c2F6601f43b9E3C0377E75AeED3101C0` (from generated private key)

### 4. Run the PoC
```bash
npm start
# or
node scripts/poc.js
```

## 💰 Gas Cost Optimization

### Estimated Costs (Base Sepolia)
- Gas Price: ~0.001 Gwei (거의 무료!)
- Contract Deployments: ~0.000003 ETH (모든 컨트랙트)
- Paymaster Deposit: 0.0001 ETH
- **Total per test: ~0.0001 ETH (0.1 milliETH)**

### Features
- **Minimal Deposits**: Only 0.0001 ETH paymaster deposit
- **Optimized Gas Limits**: Carefully tuned for testnet
- **Clean State**: Fresh deployment each run for consistent testing

## 🔧 Technical Details

### ERC-4337 v0.7 Compatibility
- Uses `PackedUserOperation` structure
- Implements proper `validateUserOp` interface
- Compatible with Base Sepolia EntryPoint

### Smart Contracts
- **SimpleAccount**: Minimal AA account with ECDSA signature validation
- **SimpleAccountFactory**: CREATE2 factory for deterministic addresses
- **SimplePaymaster**: Sponsors all operations (test-only, no validation)
- **TestERC20**: Standard ERC-20 with public minting

### UserOperation Flow
1. Generate user keypair
2. Predict smart account address (CREATE2)
3. Create UserOperation with:
   - `initCode`: Account creation if needed
   - `callData`: Token transfer execution
   - `paymasterAndData`: Paymaster address for sponsorship
4. Sign with user private key
5. Ready for EntryPoint execution

## ⚠️ Important Notes

- **Test Environment Only**: Uses simple paymaster with no validation
- **Fresh Deploy**: Each run deploys new contracts for clean testing
- **Minimal Security**: Focused on functionality over production security
- **Gas Estimation**: Actual costs may vary based on network conditions

## 🔍 Next Steps

To complete the integration:
1. Implement actual EntryPoint.handleOps() call
2. Add proper error handling for failed operations
3. Implement nonce management
4. Add transaction result verification
5. Optimize gas limits based on actual usage

## 📚 References

- [ERC-4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [eth-infinitism/account-abstraction](https://github.com/eth-infinitism/account-abstraction)
- [Base Sepolia Network](https://docs.base.org/docs/network-information)
- [Viem Documentation](https://viem.sh/)