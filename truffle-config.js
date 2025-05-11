module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.13",    // Specify the compiler version
      settings: {           // Optional settings
        optimizer: {
          enabled: true,    // Enable optimization
          runs: 200         // Number of optimization runs
        },
        evmVersion: "istanbul" // Optional: specify the EVM version
      }
    }
  }
};
