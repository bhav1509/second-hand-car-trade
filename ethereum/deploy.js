require("dotenv").config({ path: ".env.local" });

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const transaction = require("./build/transaction.json");

const mnemonic = process.env.DEPLOY_MNEMONIC;
const rpcUrl = process.env.DEPLOY_RPC_URL;

if (!mnemonic || !rpcUrl) {
  throw new Error(
    "Please set DEPLOY_MNEMONIC and DEPLOY_RPC_URL env vars before deploying."
  );
}

const provider = new HDWalletProvider(mnemonic, rpcUrl);
provider.engine._pollingInterval = 15000;
if (provider.engine._blockTracker) {
  provider.engine._blockTracker._pollingInterval = 15000;
}
const web3 = new Web3(provider);

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);
    const balances = await Promise.all(
      accounts.map((account) => web3.eth.getBalance(account))
    );
    console.log(
      "Balances (ETH):",
      balances.map((balance) => web3.utils.fromWei(balance, "ether"))
    );

    const result = await new web3.eth.Contract(transaction.abi)
      .deploy({ data: transaction.evm.bytecode.object })
      .send({ gas: "1800000", from: accounts[0] });

    console.log("Contract deployed to", result.options.address);
    provider.engine.stop();
  } catch (error) {
    console.error(error);
  }
};
deploy();
