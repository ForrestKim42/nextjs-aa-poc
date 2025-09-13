/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    baseSepolia: {
      type: "http",
      url: "https://sepolia.base.org",
      accounts: [process.env.DEVELOPER_PRIVATE_KEY || "0xc30c3607b10cec2359fc4175faba4823d176ca425472ee0854dd44e4201f4f52"],
      chainId: 84532
    }
  }
};