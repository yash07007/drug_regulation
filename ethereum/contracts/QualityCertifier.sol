pragma solidity ^0.4.26;
pragma experimental ABIEncoderV2;

contract QualityCertifier {

    struct Certificate {
        address producerAddress;
        string producerName;
        string productName;
        string universalProductCode;
        string productDescription;
        string requestStatus;
        uint productionLimit;
    }

    uint private counter;
    address public manager;
    address[] public clients;
    mapping(uint => Certificate) public certificates;
    mapping(address => uint[]) private registry;
    mapping(address => uint) public certificateCount;

    constructor() public {
        manager = msg.sender;
    }

    function getUniqueId() private returns(uint) {
        return ++counter;
    }

    function encode(string Str) private pure returns(bytes32) {
        return keccak256(abi.encodePacked(Str));
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
            requestStatus: "Pending",
            productionLimit: 0
        });

        uint id = getUniqueId();
        registry[msg.sender].push(id);
        certificates[id] = newCertificate;
        certificateCount[msg.sender] += 1;
        clients.push(msg.sender);
    }

    function processRequest(uint certificateId, string requestStatus, uint productionLimit) public {
        require(msg.sender == manager, "Function only accessible to creator of this contract.");
        certificates[certificateId].requestStatus = requestStatus;
        certificates[certificateId].productionLimit = productionLimit;
    }

    function verifyRequest(address producerAddress, string universalProductCode) public view returns(uint) {

        bool certificatePresence = false;
        uint certificateId;
        uint[] memory certificateIds;

        certificateIds = getRegistry(producerAddress);
        for(uint i = 0; i < certificateIds.length; i++) {
            if(encode(certificates[certificateIds[i]].universalProductCode) == encode(universalProductCode)) {
               certificatePresence = true;
               certificateId = certificateIds[i];
               break;
            }
        }

        if(certificatePresence && encode(certificates[certificateId].requestStatus) == encode("Accepted")) {
            return certificates[certificateId].productionLimit;
        } else {
            return 0;
        }

    }
}