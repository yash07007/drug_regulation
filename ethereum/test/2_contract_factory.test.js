const ContractFactory = artifacts.require("../contracts/ContractFactory.sol");
const QualityCertifier = artifacts.require("../contracts/QualityCertifier.sol");
// const SupplyTrack = artifacts.require("../contracts/SupplyTrack.sol");

const assert = require("chai").assert;

contract("ContractFactory", function (accounts) {
    const regulatoryCommitte = accounts[1];
    const certifier = accounts[2];
    const manufacturer = accounts[3];
    const wholesaler = accounts[4];
    const retailer = accounts[5];
    const fake_manufacturer = accounts[6];

    beforeEach(async () => {
        // Creating contract instance for certifier and passing it's address to factory instance.
        this.qualityCertifier = await QualityCertifier.new({ from: certifier });
        this.contractFactory = await ContractFactory.new(
            this.qualityCertifier.address,
            { from: regulatoryCommitte }
        );

        // Regiestering certification resquest to certifier instance.
        const _productName = "Blue";
        const _universalProductCode = "B001";
        const _productDescription = "Drug";

        const _producerAddress = manufacturer;
        const _requestStatus = "Accepted";
        const _productionLimit = 1000;
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

        const _certificateNo =
            returnCertificateEvent.args.certificateNo.words[0];

        // Approving certification request.
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

    describe("constructer():", async () => {
        it("marks caller's address as committe address.", async () => {
            const committeeAddress = await this.contractFactory.committeeAddress(
                {
                    from: regulatoryCommitte,
                }
            );
            assert.equal(
                committeeAddress,
                regulatoryCommitte,
                "regulatory committe's address is not same as contract creator's address."
            );
        });
        it("marks callers's address as certifier's address.", async () => {
            const certifierContractAddress = await this.contractFactory.certifierAddress(
                {
                    from: regulatoryCommitte,
                }
            );
            assert.equal(
                certifierContractAddress,
                this.qualityCertifier.address,
                "certifier's address is not as expected."
            );
        });
    });

    describe("registerActor(): ", async () => {
        it("registers manufacturer as expected.", async () => {
            const _manufacturerAddress = manufacturer;
            const _manufacturerName = "TakeHome";

            await this.contractFactory.registerActor(
                _manufacturerAddress,
                _manufacturerName,
                {
                    from: regulatoryCommitte,
                }
            );

            const actualManufacturer = await this.contractFactory.actors(
                _manufacturerAddress,
                {
                    from: regulatoryCommitte,
                }
            );
            assert.equal(
                actualManufacturer["name"],
                _manufacturerName,
                "manufacturer names does not match while registering the actor."
            );
        });
    });

    describe("processesRequest(): ", async () => {
        const _manufacturerAddress = manufacturer;
        const _manufacturerName = "TakeHome";
        const _productName = "Blue";
        const _universalProductCode = "B001";
        const _productDescription = "Drug";
        const _perBatchQuantity = 20;
        const _totalBatches = 5;
        const _batchIds = ["A", "B", "C", "D", "E"];
        const _pricePerBatch = 101;

        beforeEach(async () => {
            await this.contractFactory.registerActor(
                _manufacturerAddress,
                _manufacturerName,
                {
                    from: regulatoryCommitte,
                }
            );
        });

        it("only allows only registered manufacturer to access this function.", async () => {
            try {
                await this.contractFactory.processesRequest(
                    _productName,
                    _universalProductCode,
                    _productDescription,
                    _perBatchQuantity,
                    _totalBatches,
                    _batchIds,
                    _pricePerBatch,
                    {
                        from: fake_manufacturer,
                    }
                );
                assert(false);
            } catch (err) {
                try {
                    await this.contractFactory.processesRequest(
                        _productName,
                        _universalProductCode,
                        _productDescription,
                        _perBatchQuantity,
                        _totalBatches,
                        _batchIds,
                        _pricePerBatch,
                        {
                            from: manufacturer,
                        }
                    );
                    assert(true);
                } catch (error) {
                    console.log(error);
                    assert(false);
                }
            }
        });

        it("product is marked certified and assigned production limit by certifier contract instance", async () => {
            const { logs } = await this.contractFactory.processesRequest(
                _productName,
                _universalProductCode,
                _productDescription,
                _perBatchQuantity,
                _totalBatches,
                _batchIds,
                _pricePerBatch,
                {
                    from: manufacturer,
                }
            );
            const ActorDataUpdatedEvent = logs.find(
                (e) => e.event === "actorDataUpdated"
            );
            const result = ActorDataUpdatedEvent.args;
            const actor = await this.contractFactory.actors(manufacturer, {
                from: regulatoryCommitte,
            });
            assert.equal(
                result._name,
                actor.name,
                "Name of actor does not match."
            );
            assert.equal(
                result._universalProductCode,
                _universalProductCode,
                "Universal Product Code does not match."
            );
            assert.equal(
                result._isCertified,
                true,
                'Certificate not marked "true" as expected.'
            );
            assert.equal(
                result._productionLimit.words[0],
                1000,
                'Production limit not set "1000" as expected.'
            );
        });

        it("only creates contract if requested amount of product is less than certified production limit", async () => {
            //Allowed production limit = 1000
            const _perBatchQuantity = 500;
            const _totalBatches = 3;
            const _batchIds = ["X", "Y", "Z"];
            try {
                await this.contractFactory.processesRequest(
                    _productName,
                    _universalProductCode,
                    _productDescription,
                    _perBatchQuantity,
                    _totalBatches,
                    _batchIds,
                    _pricePerBatch,
                    {
                        from: manufacturer,
                    }
                );
                assert(
                    false,
                    "function is creating crontract for quantitiy more than certified production limit."
                );
            } catch (err) {
                assert(true);
            }
        });

        it("deducts the requested amount from orignal production limit.", async () => {
            await this.contractFactory.processesRequest(
                _productName,
                _universalProductCode,
                _productDescription,
                _perBatchQuantity,
                _totalBatches,
                _batchIds,
                _pricePerBatch,
                {
                    from: manufacturer,
                }
            );

            const productionLimit = await this.contractFactory.getProductionLimit(
                manufacturer,
                _universalProductCode,
                {
                    from: regulatoryCommitte,
                }
            );

            // certified prod limit: 1000; 5 batches of 20: 5*20 = 100 i.e 1000 - 100 = 900
            assert.equal(
                productionLimit,
                900,
                "requested amount not subtracted from production limit as expected."
            );
        });

        it("logs the request in the system.", async () => {
            await this.contractFactory.processesRequest(
                _productName,
                _universalProductCode,
                _productDescription,
                _perBatchQuantity,
                _totalBatches,
                _batchIds,
                _pricePerBatch,
                {
                    from: manufacturer,
                }
            );

            const request = await this.contractFactory.requestLog(
                manufacturer,
                0, //index of request
                {
                    from: regulatoryCommitte,
                }
            );

            assert.equal(
                request.productName,
                _productName,
                "Product name not logged as expected."
            );
            assert.equal(
                request.universalProductCode,
                _universalProductCode,
                "Universal product code not logged as expected."
            );
            assert.equal(
                request.productDescription,
                _productDescription,
                "Product description not logged as expected."
            );
            assert.equal(
                request.perBatchQuantity.words[0],
                _perBatchQuantity,
                "Per batch quantity not logged as expected."
            );
            assert.equal(
                request.totalBatches.words[0],
                _totalBatches,
                "Total no. of batches not logged as expected."
            );
            // assert.equal(request.batchIds,,"");
            assert.equal(
                request.certificationStatus,
                true,
                "Certification status not logged as expected."
            );
            assert.equal(
                request.requestStatus,
                "Accepted",
                "Request status not logged as expected."
            );
            assert.equal(
                request.pricePerBatch.words[0],
                _pricePerBatch,
                "Price per batch not logged as expected."
            );
        });

        it("deploys a new product contract", async () => {
            await this.contractFactory.processesRequest(
                _productName,
                _universalProductCode,
                _productDescription,
                _perBatchQuantity,
                _totalBatches,
                _batchIds,
                _pricePerBatch,
                {
                    from: manufacturer,
                }
            );
            const freshContractAddress = await this.contractFactory.deployedContracts(
                0, //index of contract address
                {
                    from: regulatoryCommitte,
                }
            );
            assert.exists(
                freshContractAddress,
                "Fresh addresss does not exists."
            );
        });
    });
});
