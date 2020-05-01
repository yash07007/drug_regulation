const ContractFactory = artifacts.require("./ContractFactory");
const QualityCertifier = artifacts.require("./QualityCertifier");
// const SupplyTrack = artifacts.require("./SupplyTrack");

module.exports = function (deployer) {
    deployer
        .deploy(QualityCertifier)
        .then(() => {
            return deployer.deploy(ContractFactory, QualityCertifier.address);
        })
        .catch(function (error) {
            console.log(error);
        });
};
