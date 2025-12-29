import web3 from "./web3";
import Transaction from "./build/transaction.json";

const instance = new web3.eth.Contract(
  Transaction.abi,
  "0xE7215D1C905F1eE54d49dDA6aaAd68af31d44351"
);

export default instance;
