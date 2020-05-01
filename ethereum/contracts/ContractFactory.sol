pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;
import './SupplyTrack.sol';

contract QualityCertifier {
    function verifyRequest(address, string) public pure returns(uint) { }
}

contract ContractFactory {

    struct Request {
        string productName;
        string universalProductCode;
        string productDescription;
        uint perBatchQuantity;
        uint totalBatches;
        string[] batchIds;
        bool certificationStatus;
        string requestStatus;
        uint pricePerBatch;
    }

    struct Actor {
        string name;
        mapping(string => uint) productionLimits;
        mapping(string => bool) isCertified;
        bool presence;
    }


    address public committeeAddress;
    address public certifierAddress;
    address[] public deployedContracts;
    mapping(address => Request[]) public requestLog;
    mapping(address => Actor) public actors;
    QualityCertifier certifierInstance = QualityCertifier(certifierAddress);

    constructor(address _certifierAddress) public {
        committeeAddress = msg.sender;
        certifierAddress = _certifierAddress;
    }

    function getProductionLimit(address producerAddress, string universalProductCode) public view returns(uint) {
        require(msg.sender == committeeAddress, "Function only accessible to creator of this contract.");
        return actors[producerAddress].productionLimits[universalProductCode];
    }

    function registerActor(address id, string name) public {
        require(msg.sender == committeeAddress, "Function only accessible to creator of this contract.");
        Actor memory newActor = Actor({
            name: name,
            presence: true
        });
        actors[id] = newActor;
    }

    function processesRequest(
            string productName,
            string universalProductCode,
            string productDescription,
            uint perBatchQuantity,
            uint totalBatches,
            string[] batchIds,
            uint pricePerBatch
        ) public {

        address producerAddress = msg.sender;

        require(actors[producerAddress].presence, "Actor is not registered.");

        bool isCertified = actors[producerAddress].isCertified[universalProductCode];

        if(!isCertified) {
            actors[producerAddress].productionLimits[universalProductCode] = certifierInstance.verifyRequest(producerAddress, universalProductCode);
        }

        uint currentProductionLimit = actors[producerAddress].productionLimits[universalProductCode];
        uint requestedQuantity = perBatchQuantity*totalBatches;

        require(requestedQuantity <= currentProductionLimit, "Production limit exhausted");

        currentProductionLimit = currentProductionLimit - requestedQuantity;
        actors[producerAddress].productionLimits[universalProductCode] = currentProductionLimit;

        Request memory newRequest = Request({
            productName: productName,
            universalProductCode: universalProductCode,
            productDescription: productDescription,
            perBatchQuantity: perBatchQuantity,
            totalBatches: totalBatches,
            batchIds: batchIds,
            certificationStatus: isCertified,
            requestStatus: "Accepted",
            pricePerBatch: pricePerBatch
        });
        requestLog[producerAddress].push(newRequest);

        address newTrackAddress = new SupplyTrack(
            actors[producerAddress].name,
            producerAddress,
            productName,
            universalProductCode,
            productDescription,
            perBatchQuantity,
            totalBatches,
            pricePerBatch,
            batchIds
        );
        deployedContracts.push(newTrackAddress);

    }
}