import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server *OR* the user is not running metamask
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || process.env.RPC_URL;
  if (!rpcUrl) {
    throw new Error(
      "RPC URL not configured. Set NEXT_PUBLIC_RPC_URL (or RPC_URL) to your JSON-RPC endpoint."
    );
  }
  const provider = new Web3.providers.HttpProvider(rpcUrl);
  web3 = new Web3(provider);
}

export default web3;
