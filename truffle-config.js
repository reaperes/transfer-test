module.exports = {
  contracts_directory: './src',
  contracts_build_directory: './build',
  compilers: {
    solc: {
      version: '^0.5.6',
      settings: {
        // ref: https://docs.klaytn.com/smart-contract/solidity-smart-contract-language#solidity-and-klaytn
        evmVersion: 'constantinople',
      }
    }
  }
};
