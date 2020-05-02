// const ContractFactory = artifacts.require("../contracts/ContractFactory.sol");
const QualityCertifier = artifacts.require("../contracts/QualityCertifier.sol");
// const SupplyTrack = artifacts.require("../contracts/SupplyTrack.sol");

const assert = require("chai").assert;

contract("QualityCertifier", function (accounts) {
    const regulatoryCommitte = accounts[1];
    const certifier = accounts[2];
    const manufacturer = accounts[3];
    // const wholesaler = accounts[4];
    // const retailer = accounts[5];

    beforeEach(async () => {
        this.qualityCertifier = await QualityCertifier.new({ from: certifier });
    });

    describe("constructer():", async () => {
        it("marks caller as campaign manager.", async () => {
            const certifierAddress = await this.qualityCertifier.manager({
                from: certifier,
            });
            assert.equal(
                certifierAddress,
                certifier,
                "manager address in not same as contract creator."
            );
        });
    });

    describe("registerRequest(): ", async () => {
        beforeEach(async () => {
            const _productName = "Blue Drug";
            const _universalProductCode = "B001";
            const _productDescription = "Drug that does something";

            const { logs } = await this.qualityCertifier.registerRequest(
                _productName,
                _universalProductCode,
                _productDescription,
                {
                    from: manufacturer,
                    value: web3.utils.toWei("0.1", "ether"),
                }
            );

            const returnCertificateEvent = logs.find(
                (e) => e.event === "returnCertificateNo"
            );

            this.certificateNo =
                returnCertificateEvent.args.certificateNo.words[0];

            assert.exists(
                this.certificateNo,
                "does not return a certificateNo."
            );
        });

        it("accepts only correct amount of ether.", async () => {
            try {
                await this.qualityCertifier.registerRequest(
                    _productName,
                    _universalProductCode,
                    _productDescription,
                    {
                        from: manufacturer,
                        value: web3.utils.toWei("0.2", "ether"),
                    }
                );
                assert(false);
            } catch (err) {
                assert(err);
            }
        });

        it("logs the request in registry", async () => {
            const certificate = await this.qualityCertifier.registry(
                manufacturer,
                this.certificateNo
            );

            assert.exists(certificate, "certificate does not exists.");
            assert.equal(
                manufacturer,
                certificate.producerAddress,
                "Incorrect producer address."
            );
            assert.equal(
                "Blue Drug",
                certificate.productName,
                "Incorrect product name."
            );
            assert.equal(
                "B001",
                certificate.universalProductCode,
                "Incorrect universal product code."
            );
            assert.equal(
                "Drug that does something",
                certificate.productDescription,
                "Incorrect product description."
            );
            assert.equal(
                "Pending",
                certificate.requestStatus,
                'Request status not set to "Pending".'
            );
            assert.equal(
                0,
                certificate.productionLimit,
                "Production limit not initialized to 0."
            );
        });

        it("logs client's address.", async () => {
            const clients = await this.qualityCertifier.getClients();
            let isPresent = false;
            for (let index = 0; index < clients.length; index++) {
                if (manufacturer == clients[index]) {
                    isPresent = true;
                }
            }
            assert(isPresent, "manufacturer not present in client list.");
        });
    });
    describe("processRequest():", async () => {
        beforeEach(async () => {
            const _productName = "Blue Drug";
            const _universalProductCode = "B001";
            const _productDescription = "Drug that does something";

            const { logs } = await this.qualityCertifier.registerRequest(
                _productName,
                _universalProductCode,
                _productDescription,
                {
                    from: manufacturer,
                    value: web3.utils.toWei("0.1", "ether"),
                }
            );

            const returnCertificateEvent = logs.find(
                (e) => e.event === "returnCertificateNo"
            );

            this.certificateNo =
                returnCertificateEvent.args.certificateNo.words[0];

            assert.exists(
                this.certificateNo,
                "does not return a certificateNo."
            );

            const _producerAddress = manufacturer;
            const _certificateNo = this.certificateNo;
            const _requestStatus = "Accepted";
            const _productionLimit = 1000;

            await this.qualityCertifier.processRequest(
                _producerAddress,
                _certificateNo,
                _requestStatus,
                _productionLimit,
                {
                    from: certifier,
                }
            );
        });

        it("only gives access to manager.", async () => {
            try {
                await this.qualityCertifier.processRequest(
                    _producerAddress,
                    _certificateNo,
                    _requestStatus,
                    _productionLimit,
                    {
                        from: manufacturer,
                    }
                );
                assert(false);
            } catch (err) {
                assert(err);
            }
        });

        it('assigns "Accepted" status and production limit.', async () => {
            const certificate = await this.qualityCertifier.registry(
                manufacturer,
                this.certificateNo
            );

            assert.equal(
                "Accepted",
                certificate.requestStatus,
                'Request status not set to "Accepted".'
            );
            assert.equal(
                1000,
                certificate.productionLimit,
                "Production limit not set to specified value."
            );
        });
    });
    describe("verifyRequest():", async () => {
        it("returns a correct production limit", async () => {
            const _productName = "Blue Drug";
            const _universalProductCode = "B001";
            const _productDescription = "Drug that does something";

            const { logs } = await this.qualityCertifier.registerRequest(
                _productName,
                _universalProductCode,
                _productDescription,
                {
                    from: manufacturer,
                    value: web3.utils.toWei("0.1", "ether"),
                }
            );

            const returnCertificateEvent = logs.find(
                (e) => e.event === "returnCertificateNo"
            );

            const certificateNo =
                returnCertificateEvent.args.certificateNo.words[0];

            assert.exists(certificateNo, "does not return a certificateNo.");

            const _producerAddress = manufacturer;
            const _certificateNo = certificateNo;
            const _requestStatus = "Accepted";
            const _productionLimit = 1000;

            await this.qualityCertifier.processRequest(
                _producerAddress,
                _certificateNo,
                _requestStatus,
                _productionLimit,
                {
                    from: certifier,
                }
            );

            const productionLimit = await this.qualityCertifier.verifyRequest(
                _producerAddress,
                _universalProductCode,
                {
                    from: regulatoryCommitte,
                }
            );

            assert.exists(
                productionLimit,
                "Producation limit does not exists."
            );
            assert.equal(
                _productionLimit,
                productionLimit,
                "Production limits does not match."
            );
        });
    });
});
