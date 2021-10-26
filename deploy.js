const Caver = require('caver-js');
const transferTestContractMeta = require('./build/TransferTest.json');

const klaytnApiNode = process.env.KLAYTN_API_NODE;
const klaytnApiAccessKey = process.env.KLAYTN_API_ACCESS_KEY;
const klaytnApiSecretKey = process.env.KLAYTN_API_SECRET_KEY;
const klaytnChainId = 8217;

const testAddress = process.env.KLAYTN_TEST_ACCOUNT_PUBLIC_ADDRESS;
const testPrivateKey = process.env.KLAYTN_TEST_ACCOUNT_PRIVATE_KEY;

async function deploy() {
  const option = {
    headers: [
      {
        name: 'Authorization',
        value: `Basic ${Buffer.from(`${klaytnApiAccessKey}:${klaytnApiSecretKey}`).toString('base64')}`,
      },
      { name: 'x-chain-id', value: klaytnChainId },
    ],
  }

  const caver = new Caver(new Caver.providers.HttpProvider(klaytnApiNode, option))

  const deployerKeyring = caver.wallet.keyring.create(testAddress, testPrivateKey);
  caver.wallet.add(deployerKeyring);

  let contract = caver.contract.create(transferTestContractMeta.abi)
  contract = await contract.deploy({
      from: deployerKeyring.address,
      gas: 400_0000,
    }, transferTestContractMeta.bytecode, testAddress,
  );
  console.log(`The address of deployed smart contract: ${contract.options.address}`);
}

deploy().then();
