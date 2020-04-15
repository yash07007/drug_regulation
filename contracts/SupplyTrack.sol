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
    }

    struct Actor {
        string actorName;
        string actorType;
    }

    struct PruchaseRequest {
        uint reqId;
        address sender;
        uint batchQuantity;
        string status;
    }

    struct Invoice {
        uint invoiceId;
        address benificiary;
        uint totalBatches;
        uint totalPrice;
        string status;
    }

    modifier restricted(string actorType) {
        string memory error = string(abi.encodePacked("This function is restricted to ", actorType));
        require(encode(actors[msg.sender].actorType) == encode(actorType), error);
        _;
    }

    uint private counter = 0;
    address public producerAddress;
    Product public product;
    mapping(address => string[]) public inventory;
    mapping(address => Actor) public actors;

    mapping(uint => PruchaseRequest) public purchaseRequestLog;
    uint[] public m_recievedRequestIds;
    mapping(address => uint[]) public w_sentRequestIds;

    mapping(uint => Invoice) public invoiceLog;
    uint[] public m_sentInvoiceIds;
    mapping(address => uint[]) public w_recievedInvoiceIds;


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
                pricePerBatch:pricePerBatch
            });
            Actor memory newActor = Actor({
                actorName:producerName,
                actorType:"Manufaturer"
            });
            actors[_producerAddress] = newActor;
            producerAddress = _producerAddress;
            inventory[producerAddress] = batchIds;
    }

    // Contract Methods

    function getUniqueId() public returns(uint) {
        return ++counter;
    }

    function encode(string Str) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(Str));
    }

    // Manufaturer Methods

    function registerWholesaler(address wholesalerAddress, string wholesalerName) public restricted("Manufaturer") {
        Actor memory newActor = Actor({
            actorName:wholesalerName,
            actorType:"Wholesaler"
        });
        actors[wholesalerAddress] = newActor;
    }

    function handlePurchaseRequest(uint purReqId, string status) public restricted("Manufaturer") {

        purchaseRequestLog[purReqId].status = status;
        if(encode(status) == encode("Accepted")) {

            PruchaseRequest memory request = purchaseRequestLog[purReqId];

            if(request.batchQuantity > product.perBatchQuantity) {
                revert("Product demanded is more the present in the Inventory.");
            }
            else {

                uint id = getUniqueId();
                uint totalPrice = product.pricePerBatch * request.batchQuantity;
                Invoice memory newInvoice = Invoice({
                    invoiceId: id,
                    benificiary: msg.sender,
                    totalBatches:request.batchQuantity,
                    totalPrice:totalPrice,
                    status:"Pending"
                });
                m_sentInvoiceIds.push(newInvoice.invoiceId);
                invoiceLog[newInvoice.invoiceId] = newInvoice;
                w_recievedInvoiceIds[request.sender].push(newInvoice.invoiceId);
            }
        }
    }

    // Wholesaler Methods

    function requestToBuy(string universalProductCode, uint batchQuantity) public restricted("Wholesaler") {
        uint id = getUniqueId();
        string memory error = string(abi.encodePacked("This contract is for UPC ", universalProductCode));
        require(encode(product.universalProductCode) == encode(universalProductCode), error);
        PruchaseRequest memory newPruchaseRequest = PruchaseRequest({
            reqId:id,
            sender:msg.sender,
            batchQuantity:batchQuantity,
            status:"Pending"
        });
        w_sentRequestIds[msg.sender].push(newPruchaseRequest.reqId);
        purchaseRequestLog[newPruchaseRequest.reqId] = newPruchaseRequest;
        m_recievedRequestIds.push(newPruchaseRequest.reqId);
    }

    function payAndFinalizeTransaction(uint invoiceId) public payable restricted("Wholesaler") {
        Invoice memory invoice = invoiceLog[invoiceId];
        require(msg.value == invoice.totalPrice, "Did not exactly the amount of ether required");
        invoice.benificiary.transfer(msg.value);
        invoiceLog[invoiceId].status = "paid";
        for(uint i = 0; i < invoice.totalBatches; i++) {
            inventory[msg.sender].push(inventory[invoice.benificiary][inventory[invoice.benificiary].length - 1]);
            delete inventory[invoice.benificiary][inventory[invoice.benificiary].length - 1];
        }
        product.totalBatches = product.totalBatches - invoice.totalBatches;
    }
}