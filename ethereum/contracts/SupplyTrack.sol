pragma solidity ^0.4.26;
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

    struct Customer {
        string customerId;
        string name;
        string[] batchesBought;
    }

    mapping(string => bool) checker;
    mapping(uint => string) actorTypeMap;

    modifier restricted(uint8[2] actorTypes) {

        actorTypeMap[0] = "";
        actorTypeMap[1] = "Manufacturer";
        actorTypeMap[2] = "Wholesaler";
        actorTypeMap[3] = "Retailer";

        string memory error = "This function is restricted to [ ";
        for(uint i = 0; i < actorTypes.length; i++) {
            checker[actorTypeMap[actorTypes[i]]] = true;
            checker[""] = false;
            if(i == actorTypes.length-1) {
                error = string(abi.encodePacked(error, actorTypeMap[actorTypes[i]]));
            }
            else {
                error = string(abi.encodePacked(error, actorTypeMap[actorTypes[i]], ", "));
            }
        }
        error = string(abi.encodePacked(error, " ]"));
        require(checker[actors[msg.sender].actorType], error);
        _;
    }

    uint private counter = 0;
    Product public product;
    mapping(address => string[]) private inventory;
    address[] private wholesalers;
    address[] private retailers;
    mapping(address => Actor) public actors;

    mapping(uint => PruchaseRequest) public purchaseRequestLog;
    mapping(address => uint[]) private recievedRequestIds;
    mapping(address => uint[]) private sentRequestIds;

    mapping(uint => Invoice) public invoiceLog;
    mapping(address => uint[]) private sentInvoiceIds;
    mapping(address => uint[]) private recievedInvoiceIds;

    mapping(string => uint) productEndpoint;
    mapping(uint => Customer) public customerRegistry;

    constructor(
        string producerName,
        address producerAddress,
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
                actorType:"Manufacturer"
            });
            actors[producerAddress] = newActor;
            inventory[producerAddress] = batchIds;
    }

    // Getter Methods

    function getIds(string fun) public view returns(uint[]) {
        if(encode("sentRequestIds") == encode(fun)) {
            return sentRequestIds[msg.sender];
        }
        if(encode("recievedRequestIds") == encode(fun)) {
            return recievedRequestIds[msg.sender];
        }
        if(encode("sentInvoiceIds") == encode(fun)) {
            return sentInvoiceIds[msg.sender];
        }
        if(encode("recievedInvoiceIds") == encode(fun)) {
            return recievedInvoiceIds[msg.sender];
        }
    }

    function getInventory(address _address) public view returns(string[]) {
        return inventory[_address];
    }

    function getProductEndpoint(string batchId) public view returns(uint){
        return productEndpoint[batchId];
    }

    function getActors(string actorType) public view returns(address[]){
        if(encode("wholesalers") == encode(actorType)) {
            return wholesalers;
        }
        if(encode("retailers") == encode(actorType)) {
            return retailers;
        }
    }

    // Contract Methods

    function getUniqueId() private returns(uint) {
        return ++counter;
    }

    function encode(string Str) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(Str));
    }

    // Actor Methods

    function registerWholesaler(address wholesalerAddress, string wholesalerName) public restricted([1, 0]) {
        Actor memory newActor = Actor({
            actorName:wholesalerName,
            actorType:"Wholesaler"
        });
        actors[wholesalerAddress] = newActor;
        wholesalers.push(wholesalerAddress);
    }

    function registerRetailer(address retailerAddress, string retailerName) public restricted([2, 0]) {
        Actor memory newActor = Actor({
            actorName:retailerName,
            actorType:"Retailer"
        });
        actors[retailerAddress] = newActor;
        retailers.push(retailerAddress);
    }

    function requestToBuy(string universalProductCode, uint batchQuantity, address sellerAddress) public restricted([2, 3]) {
        uint id = getUniqueId();
        string memory error = string(abi.encodePacked("This contract is for UPC ", universalProductCode));
        require(encode(product.universalProductCode) == encode(universalProductCode), error);
        PruchaseRequest memory newPruchaseRequest = PruchaseRequest({
            reqId:id,
            sender:msg.sender,
            batchQuantity:batchQuantity,
            status:"Pending"
        });
        sentRequestIds[msg.sender].push(newPruchaseRequest.reqId);
        purchaseRequestLog[newPruchaseRequest.reqId] = newPruchaseRequest;
        recievedRequestIds[sellerAddress].push(newPruchaseRequest.reqId);
    }

    function handlePurchaseRequest(uint purReqId, string status) public restricted([1, 2]) {

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
                sentInvoiceIds[msg.sender].push(newInvoice.invoiceId);
                invoiceLog[newInvoice.invoiceId] = newInvoice;
                recievedInvoiceIds[request.sender].push(newInvoice.invoiceId);
            }
        }
    }

    function payAndFinalizeTransaction(uint invoiceId) public payable restricted([2, 3]) {
        Invoice memory invoice = invoiceLog[invoiceId];
        require(msg.value == invoice.totalPrice, "Did not exactly the amount of ether required");
        invoice.benificiary.transfer(msg.value);
        invoiceLog[invoiceId].status = "Paid";
        for(uint i = 0; i < invoice.totalBatches; i++) {
            inventory[msg.sender].push(inventory[invoice.benificiary][inventory[invoice.benificiary].length - 1]);
            delete inventory[invoice.benificiary][inventory[invoice.benificiary].length - 1];
            inventory[invoice.benificiary].length--;
        }
        product.totalBatches = product.totalBatches - invoice.totalBatches;
    }

    function logCustomer(string name, string customerId, uint batchesNeeded) public restricted([3, 0]) {

        address retailer = msg.sender;
        uint id = getUniqueId();
        string[] storage allotedBatches;

        //BUYING CONDITION CHECKING

        require(inventory[retailer].length >= batchesNeeded, "Not enough Stock");

        for(uint i = 0; i < batchesNeeded; i++) {
            allotedBatches.push(inventory[retailer][inventory[retailer].length - 1]);
            productEndpoint[inventory[retailer][inventory[retailer].length - 1]] = id;
            delete inventory[retailer][inventory[retailer].length - 1];
            inventory[retailer].length--;
        }

        Customer memory newCustomer = Customer({
            customerId:customerId,
            name:name,
            batchesBought:allotedBatches
        });

        customerRegistry[id] = newCustomer;
    }
}