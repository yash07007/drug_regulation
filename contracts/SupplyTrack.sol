pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract SupplyTrack {

    struct Product {
        string productName;
        string universalProductCode;
        string productDescription;
        uint perBatchQuantity;
        uint totalBatches;
        uint pricePerBatch;
        string[] batchIds;
    }

    struct Actor {
        string actorName;
        string actorType;
    }

    struct PruchaseRequest {
        uint reqId;
        string universalProductCode;
        uint batchQuantity;
        string status;
    }

    // struct Invoice {
    //     string productName;
    //     string universalProductCode;
    //     uint pricePerBatch;
    //     uint totalBatches;
    //     uint batchIds;
    //     uint totalPrice;
    // }

    modifier restricted(string actorType) {
        string memory error = string(abi.encodePacked("This function is restricted to ", actorType));
        require(keccak256(abi.encodePacked(actors[msg.sender].actorType)) == keccak256(abi.encodePacked(actorType)), error);
        _;
    }

    uint private counter = 0;
    address public producerAddress;
    Product public product;
    mapping(address => Actor) public actors;
    mapping(uint => PruchaseRequest) public m_recievedRequestLog;
    uint[] public m_recievedRequestIds;
    mapping(uint => PruchaseRequest) public w_sentRequestLog;
    mapping(address => uint[]) public w_sentRequestIds;

    constructor(
        string producerName,
        address _producerAddress,
        string productName,
        string universalProductCode,
        string productDescription,
        uint perBatchQuantity,
        uint totalBatches,
        uint pricePerBatch,
        string[] batchIds) public {
            product = Product({
                productName:productName,
                universalProductCode:universalProductCode,
                productDescription:productDescription,
                perBatchQuantity:perBatchQuantity,
                totalBatches:totalBatches,
                pricePerBatch:pricePerBatch,
                batchIds:batchIds
            });
            Actor memory newActor = Actor({
                actorName:producerName,
                actorType:"Manufaturer"
            });
            actors[_producerAddress] = newActor;
            producerAddress = _producerAddress;
    }

    // Contract Methods

    function getUniqueId() public returns(uint) {
        return ++counter;
    }

    // Manufaturer Methods

    function registerWholesaler(address wholesalerAddress, string wholesalerName) public restricted("Manufaturer") {
        Actor memory newActor = Actor({
            actorName:wholesalerName,
            actorType:"Wholesaler"
        });
        actors[wholesalerAddress] = newActor;
    }

    // function handlePurchaseRequest(uint purReqNo, ) public restricted("Manufaturer") {
    //     PruchaseRequest memory request = m_requestLog[purReqNo];

    // }

    // Wholesaler Methods

    function requestToBuy(string universalProductCode, uint batchQuantity) public restricted("Wholesaler") {
        uint id = this.getUniqueId();
        PruchaseRequest memory newPruchaseRequest = PruchaseRequest({
            reqId:id,
            universalProductCode:universalProductCode,
            batchQuantity:batchQuantity,
            status:"Pending"
        });
        w_sentRequestIds[msg.sender].push(newPruchaseRequest.reqId);
        w_sentRequestLog[newPruchaseRequest.reqId] = newPruchaseRequest;
        m_recievedRequestLog[newPruchaseRequest.reqId] = newPruchaseRequest;
        m_recievedRequestIds.push(newPruchaseRequest.reqId);
    }
}