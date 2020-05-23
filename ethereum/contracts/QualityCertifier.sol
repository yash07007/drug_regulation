pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract QualityCertifier {

    struct Certificate {
        address producerAddress;
        string producerName;
        string productName;
        string universalProductCode;
        string productDescription;
        bool requestStatus;
        uint productionLimit;
    }

    uint private counter;
    address public manager;
    address[] public clients;
    mapping(uint => Certificate) public certificates;
    mapping(address => uint[]) public registry;
    mapping(address => uint) public certificateCount;

    constructor() public {
        manager = msg.sender;
    }

    function getUniqueId() private returns(uint) {
        return ++counter;
    }

    function getClients() public view returns(address[]) {
        return clients;
    }

    function getRegistry(address manufacturerAddress) public view returns(uint[]) {
        return registry[manufacturerAddress];
    }

    function registerRequest(string name, string productName, string universalProductCode, string productDescription) public payable {
        require(msg.value == 0.1 ether, "Payment of exactly 0.1 ether is needed to complete this transaction.");
        Certificate memory newCertificate = Certificate({
            producerAddress: msg.sender,
            producerName: name,
            productName: productName,
            universalProductCode: universalProductCode,
            productDescription: productDescription,
            requestStatus: false,
            productionLimit: 0
        });

        uint id = getUniqueId();
        registry[msg.sender].push(id);
        certificates[id] = newCertificate;
        certificateCount[msg.sender] += 1;
        clients.push(msg.sender);
    }

    function processRequest(uint certificateId, bool requestStatus, uint productionLimit) public {
        require(msg.sender == manager, "Function only accessible to creator of this contract.");
        certificates[certificateId].requestStatus = requestStatus;
        certificates[certificateId].productionLimit = productionLimit;
    }

    function verifyRequest(address producerAddress, string universalProductCode) public view returns(uint) {

        bool certificatePresence = false;
        uint certificateId;
        uint[] memory certificateIds;

        certificateIds = registry[producerAddress];
        for(uint i = 0; i < certificateIds.length; i++) {
            if(keccak256(abi.encodePacked(certificates[i].universalProductCode)) == keccak256(abi.encodePacked(universalProductCode))) {
               certificatePresence = true;
               certificateId = i;
               break;
            }
        }

        if(certificatePresence && certificates[certificateId].requestStatus) {
            return certificates[certificateId].productionLimit;
        } else {
            return 0;
        }

    }
}