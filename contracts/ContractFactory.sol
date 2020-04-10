pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

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
    }
    
    // requestStatuses = { Accepted, Rejected }
    
    struct Actor {
        string name;
        mapping(string => uint) productionLimits;
        bool presence;
    }

    
    address public committeeAddress;
    address[] public deployedContracts;
    mapping(address => Request[]) requestLog; 
    mapping(address => Actor) public actors;
    QualityCheck Q;
    
    constructor() public {
        committeeAddress = msg.sender;
    }
    
    function getProductionLimit(address producerAddress, string universalProductCode) public view returns(uint) {
        require(msg.sender == committeeAddress, "Function only accessible to creator of this contract.");
        returns actors[producerAddress].productionLimits[universalProductCode]
    }
    
    function getRequest(address producerAddress, uint requestNo) public view returns(string, string, string, uint, uint, string[], address, string) {
        require(msg.sender == committeeAddress, "Function only accessible to creator of this contract.");
        Request memory R = requestLog[producerAddress][requestNo];
        return (
            R.productName,
            R.universalProductCode,
            R.productDescription,
            R.perBatchQuantity,
            R.totalBatches,
            R.batchIds,
            R.qualityCertification,
            R.requestStatus
        );
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
            address qualityCertification
        ) public {
            
        require(actors[msg.sender].presence, "Actor is not registered.");
        
        uint checkpoint = actors[msg.sender].productionLimits[universalProductCode];
        
        if(checkpoint > 0) { }
        else {
            Q = QualityCheck(qualityCertification);
            uint productionLimit = Q.verifyRequest(msg.sender, universalProductCode);
            actors[msg.sender].productionLimits[universalProductCode] = productionLimit;
        }
        
        uint currentLimit = actors[msg.sender].productionLimits[universalProductCode];
        uint producedQuantity = perBatchQuantity*totalBatches;
        require( producedQuantity <= currentLimit, "Production limit exhausted");
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
            requestStatus: "Accepted"
        });
        requestLog[msg.sender].push(newRequest);
        
        //Instanciate
    }
}