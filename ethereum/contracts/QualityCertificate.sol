pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

contract QualityCheck {

    struct Certificate {
        address producerAddress;
        string productName;
        string universalProductCode;
        string productDescription;
        string requestStatus;
        uint productionLimit;
    }

    address public manager;
    address[] public clients;
    mapping(address => Certificate[]) registry;

    constructor() public {
        manager = msg.sender;
    }

    function getCertificate(address producerAddress, uint cerificateNo) public view returns(address, string, string, string, string, uint) {
        require(msg.sender == manager, "Function only accessible to creator of this contract.");
        Certificate memory C = registry[producerAddress][cerificateNo];
        return (
            C.producerAddress,
            C.productName,
            C.universalProductCode,
            C.productDescription,
            C.requestStatus,
            C.productionLimit
        );
    }

    function registerRequest(string productName, string universalProductCode, string productDescription) public payable returns(uint) {
        require(msg.value == 0.1 ether, "Payment of exactly 0.1 ether is needed to complete this transaction.");
        Certificate memory newCertificate = Certificate({
            producerAddress: msg.sender,
            productName: productName,
            universalProductCode: universalProductCode,
            productDescription: productDescription,
            requestStatus: "Pending",
            productionLimit: 0
        });

        registry[msg.sender].push(newCertificate);
        clients.push(msg.sender);
        return (registry[msg.sender].length - 1);
    }

    function processRequest(address producerAddress, uint certificateNo, string requestStatus, uint productionLimit) public {
        require(msg.sender == manager, "Function only accessible to creator of this contract.");
        registry[producerAddress][certificateNo].requestStatus = requestStatus;
        registry[producerAddress][certificateNo].productionLimit = productionLimit;
    }

    function verifyRequest(address producerAddress, string universalProductCode) public view returns(uint) {

        bool certificatePresence = false;
        uint certificateNo;
        Certificate[] memory certificates;

        certificates = registry[producerAddress];
        for(uint i = 0; i < certificates.length; i++) {
            if(keccak256(abi.encodePacked(certificates[i].universalProductCode)) == keccak256(abi.encodePacked(universalProductCode))) {
               certificatePresence = true;
               certificateNo = i;
               break;
            }
        }

        if(certificatePresence) {
            return registry[producerAddress][certificateNo].productionLimit;
        } else {
            return 0;
        }

    }
}