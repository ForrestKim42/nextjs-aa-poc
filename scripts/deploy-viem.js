import { createPublicClient, createWalletClient, http, parseEther, parseGwei } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';
import fs from 'fs';

// Load compiled artifacts
const testTokenArtifact = JSON.parse(fs.readFileSync('artifacts/contracts/TestToken.sol/TestToken.json'));
const myAccountFactoryArtifact = JSON.parse(fs.readFileSync('artifacts/contracts/MyAccountFactory.sol/MyAccountFactory.json'));
const myPaymasterArtifact = JSON.parse(fs.readFileSync('artifacts/contracts/MyPaymaster.sol/MyPaymaster.json'));

const config = {
    rpcUrl: 'https://sepolia.base.org',
    privateKey: process.env.DEVELOPER_PRIVATE_KEY || '0xc30c3607b10cec2359fc4175faba4823d176ca425472ee0854dd44e4201f4f52',
    entryPointAddress: '0x4337084d9e255ff0702461cf8895ce9e3b5ff108'
};

const account = privateKeyToAccount(config.privateKey);

const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl)
});

const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl),
    account
});

let currentNonce;

async function deployContract(name, bytecode, abi, args = []) {
    console.log(`\n📦 Deploying ${name}...`);

    // Initialize nonce on first call
    if (currentNonce === undefined) {
        currentNonce = await publicClient.getTransactionCount({
            address: account.address,
            blockTag: 'pending'
        });
    }

    const hash = await walletClient.deployContract({
        abi,
        bytecode: bytecode.bytecode || bytecode,
        args,
        nonce: currentNonce,
        maxFeePerGas: parseGwei('0.002'),
        maxPriorityFeePerGas: parseGwei('0.001')
    });

    currentNonce++; // Increment for next transaction

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`✅ ${name} deployed to:`, receipt.contractAddress);

    return receipt.contractAddress;
}

async function main() {
    console.log('🚀 Deploying contracts with account:', account.address);

    const balance = await publicClient.getBalance({ address: account.address });
    console.log('💰 Account balance:', parseEther(balance.toString()));

    // Deploy TestToken
    const testTokenAddress = await deployContract(
        'TestToken',
        testTokenArtifact.bytecode,
        testTokenArtifact.abi
    );

    // Deploy MyAccountFactory
    const factoryAddress = await deployContract(
        'MyAccountFactory',
        myAccountFactoryArtifact.bytecode,
        myAccountFactoryArtifact.abi,
        [config.entryPointAddress]
    );

    // Skip MyPaymaster deployment for now
    const paymasterAddress = null;

    // Save deployment data
    const deploymentData = {
        contracts: {
            TestToken: testTokenAddress,
            MyAccountFactory: factoryAddress,
            EntryPoint: config.entryPointAddress
        },
        deployer: account.address
    };

    fs.writeFileSync(
        'deployment-data.json',
        JSON.stringify(deploymentData, null, 2)
    );

    console.log('\n✅ Deployment complete! Data saved to deployment-data.json');
}

main().catch(console.error);