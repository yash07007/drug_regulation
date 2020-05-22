import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && window.web3 !== "undefined") {
    web3 = new Web3(window.web3.currentProvider);
} else {
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/2d54a1eb7e2c445dbf3f49f3bdca6e46"
    );
    web3 = new Web3(provider);
}

export default web3;
