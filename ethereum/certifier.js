import web3 from "./web3";
import address from "../addresses";
import certifier from "./build/contracts/QualityCertifier.json";

var instance = new web3.eth.Contract(certifier.abi, address.certifier);

export default instance;
