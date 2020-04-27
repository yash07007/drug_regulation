const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractPaths = [
    path.resolve(__dirname, "contracts", "ContractFactory.sol"),
    path.resolve(__dirname, "contracts", "QualityCertificate.sol"),
    path.resolve(__dirname, "contracts", "SupplyTrack.sol"),
];

const sources = [];
for (let i = 0; i < contractPaths.length; i++) {
    sources.push(fs.readFileSync(contractPaths[i], "utf8"));
}

const input = {
    sources: {
        "ContractFactory.sol": sources[0],
        "QualityCertificate.sol": sources[1],
        "SupplyTrack.sol": sources[2],
    },
};

const output = solc.compile(input, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(/:/g, "_") + ".json"),
        output[contract]
    );
}
