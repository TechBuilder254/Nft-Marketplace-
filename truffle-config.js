require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY,
          `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        ),
      network_id: 11155111,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 3000000,  // Lower gas limit to reduce costs
      gasPrice: 20000000000, // 20 Gwei to optimize gas usage
    },
  },

  compilers: {
    solc: {
      version: "0.8.20",
      settings: {
        optimizer: { enabled: true, runs: 200 },
      },
    },
  },
};
