import web3 from "./web3";
import address from "../addresses";
import factory from "./build/contracts/ContractFactory.json";

var instance = new web3.eth.Contract(factory.abi, address.factory);

export default instance;
