import web3 from "./web3";
import supplyTrack from "./build/contracts/SupplyTrack.json";

export default (address) => {
    return new web3.eth.Contract(supplyTrack.abi, address);
};
