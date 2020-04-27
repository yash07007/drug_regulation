pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;
import './SupplyTrack.sol';

contract QualityCheck {
    function verifyRequest(address producerAddress, string universalProductCode) public pure returns(uint) { }
}

contract ContractFactory {

    struct Request {
        string productName;
        string universalProductCode;
        string productDescription;
        uint perBatchQuantity;
        uint totalBatches;
        string[] batchIds;
        address qualityCertification;
        string requestStatus;
        uint pricePerBatch;
    }

    // requestStatuses = { Accepted, Rejected }

    struct Actor {
        string name;
        mapping(string => uint) productionLimits;
        bool presence;
    }


    address public committeeAddress;
    address[] public deployedContracts;
    mapping(address => Request[]) public requestLog;
    mapping(address => Actor) public actors;
    QualityCheck Q;

    constructor() public {
        committeeAddress = msg.sender;
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
            address qualityCertification,
            uint pricePerBatch
        ) public {

        // producerAddress = msg.sender;

        require(actors[msg.sender].presence, "Actor is not registered.");

        uint checkpoint = actors[msg.sender].productionLimits[universalProductCode];

        if(checkpoint > 0) { }
        else {
            Q = QualityCheck(qualityCertification);
            actors[msg.sender].productionLimits[universalProductCode] = Q.verifyRequest(msg.sender, universalProductCode);
        }

        uint currentLimit = actors[msg.sender].productionLimits[universalProductCode];
        uint producedQuantity = perBatchQuantity*totalBatches;
        require(producedQuantity <= currentLimit, "Production limit exhausted");
        currentLimit = currentLimit - producedQuantity;
        actors[msg.sender].productionLimits[universalProductCode] = currentLimit;

        Request memory newRequest = Request({
            productName: productName,
            universalProductCode: universalProductCode,
            productDescription: productDescription,
            perBatchQuantity: perBatchQuantity,
            totalBatches: totalBatches,
            batchIds: batchIds,
            qualityCertification: qualityCertification,
            requestStatus: "Accepted",
            pricePerBatch: pricePerBatch
        });
        requestLog[msg.sender].push(newRequest);

        address newTrackAddress = new SupplyTrack(
            actors[msg.sender].name,
            msg.sender,
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