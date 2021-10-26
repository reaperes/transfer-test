const Caver = require('caver-js');
const transferTestContractMeta = require('./build/TransferTest.json');
const iERC20ContractMeta = require('./build/IERC20.json');

const klaytnApiNode = process.env.KLAYTN_API_NODE;
const klaytnApiAccessKey = process.env.KLAYTN_API_ACCESS_KEY;
const klaytnApiSecretKey = process.env.KLAYTN_API_SECRET_KEY;
const klaytnChainId = 8217;

const testAddress = process.env.KLAYTN_TEST_ACCOUNT_PUBLIC_ADDRESS;
const testPrivateKey = process.env.KLAYTN_TEST_ACCOUNT_PRIVATE_KEY;

async function test() {
  const option = {
    headers: [
      {
        name: 'Authorization',
        value: `Basic ${Buffer.from(`${klaytnApiAccessKey}:${klaytnApiSecretKey}`).toString('base64')}`,
      },
      { name: 'x-chain-id', value: klaytnChainId },
    ],
  }

  const contractAddress = '0x5f293fa5CEf4d0321A844696d6594F3B89E72DdE';
  const kxrpAddress = '0x9eaeFb09fe4aABFbE6b1ca316a3c36aFC83A393F';
  const otherUserAddress = '0x1466b03b38c17e31fDd304B20c3Adb126E4eDE0c';

  const caver = new Caver(new Caver.providers.HttpProvider(klaytnApiNode, option))
  const deployerKeyring = caver.wallet.keyring.create(testAddress, testPrivateKey);
  caver.wallet.add(deployerKeyring);

  try {
    const amount = 5;

    console.log(`userAddress: ${testAddress}`);

    const kxrpContract = caver.contract.create(iERC20ContractMeta.abi, kxrpAddress);

    // success
    //const approveRes = await kxrpContract.send({
    //  from: testAddress,
    //  gas: 10_0000,
    //}, 'approve', contractAddress, amount);
    //console.log(approveRes);

    const kip7 = new caver.kct.kip7(kxrpAddress);
    kip7.options.from = testAddress;
    await kip7.approve(contractAddress, amount);

    const approveRes = await kxrpContract.send({
      from: testAddress,
      gas: 10_0000,
    }, 'approve', contractAddress, amount);
    console.log(approveRes);

    // result: 5
    const allowanceRes = await kxrpContract.call('allowance', testAddress, contractAddress);
    console.log(allowanceRes);

    // revert execution error 1
    const transferTestContract = caver.contract.create(transferTestContractMeta.abi, contractAddress);
    const res = await transferTestContract.send({
      from: testAddress,
      gas: 500000,
    }, 'test', contractAddress, kxrpAddress, amount);
    console.log(res);

    // revert execution error 2
    const res2 = await transferTestContract.send({
      from: testAddress,
      gas: 500000,
    }, 'test', otherUserAddress, kxrpAddress, amount);
    console.log(res2);

    // revert execution error 3
    const res3 = await transferTestContract.methods.test(otherUserAddress, kxrpAddress, amount).send({
      from: testAddress,
      gas: 50_0000,
    });
    console.log(res3);

  } catch (e) {
    console.error(e);
  }
}

test().then();
