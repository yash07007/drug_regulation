import React, { Component } from "react";
import {
    Header,
    Segment,
    Label,
    Grid,
    Visibility,
    List,
    Placeholder,
    Loader,
    Dimmer,
    Button,
    Message,
} from "semantic-ui-react";
import factory from "../../../ethereum/factory";
import SupplyTrack from "../../../ethereum/supplyTrack";
import web3 from "../../../ethereum/web3";

class Inventory extends Component {
    state = {
        inventory: {},
        loading: true,
    };

    loadInventory = async () => {
        this.setState({
            loading: true,
        });
        const accounts = await web3.eth.getAccounts();
        let clients = await factory.methods.getClients().call();
        clients = clients.filter((x, i, a) => a.indexOf(x) == i);
        const isManufacturer = clients.indexOf(accounts[0]) >= 0 ? true : false;
        let contracts = [];

        if (isManufacturer) {
            let localContracts = await factory.methods
                .getDeployedContracts(accounts[0])
                .call();
            for (const contract of localContracts) {
                contracts.push(contract);
            }
        } else {
            for (const clientAddress of clients) {
                let localContracts = await factory.methods
                    .getDeployedContracts(clientAddress)
                    .call();
                for (const contractAddress of localContracts) {
                    const supplyTrack = SupplyTrack(contractAddress);
                    const actor = await supplyTrack.methods
                        .actors(accounts[0])
                        .call();

                    if (actor.actorName) {
                        contracts.push(contractAddress);
                    }
                }
            }
        }

        const inventory = {};
        for (let i = 0; i < contracts.length; i++) {
            const supplyTrack = SupplyTrack(contracts[i]);
            const trackProduct = await supplyTrack.methods.product().call();
            const trackInventory = await supplyTrack.methods
                .getInventory()
                .call({ from: accounts[0] });
            inventory[contracts[i]] = { trackInventory, trackProduct };
        }

        this.setState({
            inventory: inventory,
            loading: false,
        });
    };

    renderInventory() {
        const { color } = this.props;
        let renderedInventory = [];
        for (const contractAddress in this.state.inventory) {
            const { trackInventory, trackProduct } = this.state.inventory[
                contractAddress
            ];
            let locallyRenderedInventory = [];
            let locallyRenderedInventoryLabels = [];
            for (const batchId in trackInventory) {
                locallyRenderedInventoryLabels.push(
                    <List.Item>
                        <strong>{trackInventory[batchId]}</strong>
                    </List.Item>
                );
            }
            locallyRenderedInventory.push(
                <Grid columns="equal">
                    <Grid.Row>
                        <Grid.Column style={{ paddingTop: "10px" }}>
                            <Label color={color} horizontal attached="top">
                                Contract Address
                            </Label>
                            <Header as="h4">{contractAddress}</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: "-15px" }}>
                        <Grid.Column style={{ paddingTop: "35px" }}>
                            <Label
                                color={color}
                                basic
                                horizontal
                                attached="top"
                            >
                                Name
                            </Label>
                            {trackProduct.productName}
                        </Grid.Column>
                        <Grid.Column style={{ paddingTop: "35px" }}>
                            <Label
                                color={color}
                                basic
                                horizontal
                                attached="top"
                            >
                                UPC
                            </Label>
                            {trackProduct.universalProductCode}
                        </Grid.Column>
                        <Grid.Column style={{ paddingTop: "35px" }}>
                            <Label
                                color={color}
                                basic
                                horizontal
                                attached="top"
                            >
                                Description
                            </Label>
                            {trackProduct.productDescription}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: "-15px" }}>
                        <Grid.Column style={{ paddingTop: "35px" }}>
                            <Label
                                color={color}
                                basic
                                horizontal
                                attached="top"
                            >
                                Per Batch Quantity
                            </Label>
                            {trackProduct.perBatchQuantity}
                        </Grid.Column>
                        <Grid.Column style={{ paddingTop: "35px" }}>
                            <Label
                                color={color}
                                basic
                                horizontal
                                attached="top"
                            >
                                Batches Remaining
                            </Label>
                            {trackProduct.totalBatches}
                        </Grid.Column>
                        <Grid.Column style={{ paddingTop: "35px" }}>
                            <Label
                                color={color}
                                basic
                                horizontal
                                attached="top"
                            >
                                Price Per Batch
                            </Label>
                            {trackProduct.pricePerBatch}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: "-15px" }}>
                        <Grid.Column style={{ paddingTop: "10px" }}>
                            <Label
                                color={color}
                                basic
                                horizontal
                                attached="top"
                            >
                                Batch Ids
                            </Label>
                            <List divided horizontal>
                                {locallyRenderedInventoryLabels}
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
            renderedInventory.push(
                <Segment
                    style={{
                        borderColor: color,
                        paddingTop: "0px",
                    }}
                >
                    {locallyRenderedInventory}
                </Segment>
            );
        }
        if (renderedInventory.length == 0) {
            renderedInventory.push(
                <Message>
                    <Message.Header>Inventory is Empty.</Message.Header>
                </Message>
            );
        }
        return renderedInventory;
    }

    render() {
        const { loading } = this.state;
        const { color, head } = this.props;
        return (
            <Grid.Column>
                <Visibility fireOnMount onOnScreen={this.loadInventory}>
                    <Segment
                        style={{ borderColor: color }}
                        inverted
                        color={color}
                    >
                        <Header as="h3">{head}</Header>
                    </Segment>
                    <Segment style={{ overflow: "auto", maxHeight: 370 }}>
                        <Dimmer active={loading} inverted>
                            <Loader size="large">Loading</Loader>
                        </Dimmer>
                        {loading ? (
                            <Placeholder>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                                <Placeholder.Paragraph>
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                    <Placeholder.Line />
                                </Placeholder.Paragraph>
                            </Placeholder>
                        ) : (
                            <div>
                                <Button fluid onClick={this.loadInventory}>
                                    Refresh
                                </Button>
                                {this.renderInventory()}
                            </div>
                        )}
                    </Segment>
                </Visibility>
            </Grid.Column>
        );
    }
}

export default Inventory;
