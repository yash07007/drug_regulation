import React, { Component } from "react";
import {
    Tab,
    Card,
    Button,
    Icon,
    Popup,
    Grid,
    Visibility,
    Input,
    Modal,
    Header,
    Form,
    Message,
    Placeholder,
    Dimmer,
    Loader,
    Segment,
} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import SupplyTrack from "../../ethereum/supplyTrack";
import Inventory from "../manufacturer/inventory/Inventory";
import web3 from "../../ethereum/web3";

class Catalouge extends Component {
    state = {
        loading: false,
        processLoading: false,
        errorMessage: "",
        cards: [],
        batchQuantity: 1,
    };

    async onPay(
        universalProductCode,
        batchQuantity,
        producerAddress,
        contractAddress,
        event
    ) {
        event.preventDefault();
        this.setState({
            processLoading: true,
            errorMessage: "",
        });
        try {
            const accounts = await web3.eth.getAccounts();
            const supplyTrack = SupplyTrack(contractAddress);
            await supplyTrack.methods
                .requestToBuy(
                    universalProductCode,
                    batchQuantity,
                    producerAddress
                )
                .send({
                    from: accounts[0],
                });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ batchQuantity: 1, processLoading: false });
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    }

    loadCards = async () => {
        this.setState({
            loading: true,
        });
        const accounts = await web3.eth.getAccounts();
        let clients = await factory.methods.getClients().call();
        clients = clients.filter((x, i, a) => a.indexOf(x) == i);
        let contracts = {};

        for (const clientAddress of clients) {
            const localContracts = await factory.methods
                .getDeployedContracts(clientAddress)
                .call();

            contracts[clientAddress] = localContracts;
        }

        let cards = [];
        for (const clientAddress in contracts) {
            for (const contractAddress of contracts[clientAddress]) {
                const supplyTrack = SupplyTrack(contractAddress);
                const actor = await supplyTrack.methods
                    .actors(accounts[0])
                    .call();

                if (actor.actorName) {
                    const product = await supplyTrack.methods.product().call();
                    const producer = await factory.methods
                        .actors(clientAddress)
                        .call();
                    product.producerName = producer.name;
                    product.producerAddress = clientAddress;
                    product.contractAddress = contractAddress;
                    cards.push(product);
                }
            }
        }
        this.setState({ cards: cards, loading: false });
    };

    renderCards() {
        const { cards, batchQuantity, processLoading } = this.state;
        const renderedCards = [];
        for (const card of cards) {
            const {
                productName,
                universalProductCode,
                perBatchQuantity,
                totalBatches,
                pricePerBatch,
                producerName,
                producerAddress,
                contractAddress,
            } = card;
            renderedCards.push(
                <Card fluid>
                    <Card.Content>
                        <Card.Header>
                            {productName} {universalProductCode}
                        </Card.Header>
                    </Card.Content>
                    <Card.Content>
                        <Card.Description textAlign="left">
                            <Grid columns="equal" textAlign="center">
                                <Grid.Row>
                                    <Grid.Column>
                                        <Popup
                                            content="per batch"
                                            trigger={
                                                <div>
                                                    <Icon name="ethereum" />
                                                    {pricePerBatch} Wei
                                                </div>
                                            }
                                            size="mini"
                                            position="bottom center"
                                            inverted
                                        />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Popup
                                            content={
                                                perBatchQuantity + " per unit"
                                            }
                                            trigger={
                                                <div>
                                                    <Icon name="box" />
                                                    {totalBatches} units left
                                                </div>
                                            }
                                            size="mini"
                                            position="bottom center"
                                            inverted
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column>
                                        <Popup
                                            content={
                                                "Contract Address: " +
                                                contractAddress
                                            }
                                            trigger={
                                                <span>
                                                    {"Sold by " + producerName}
                                                </span>
                                            }
                                            size="small"
                                            position="bottom center"
                                            inverted
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <Modal
                            as={Form}
                            trigger={
                                <Button
                                    positive
                                    fluid
                                    loading={processLoading}
                                    disabled={processLoading}
                                >
                                    Buy
                                </Button>
                            }
                            closeIcon
                            onSubmit={this.onPay.bind(
                                this,
                                universalProductCode,
                                batchQuantity,
                                producerAddress,
                                contractAddress
                            )}
                        >
                            <Header
                                icon="boxes"
                                content="How many batches you would like to buy?"
                            />
                            <Modal.Content>
                                <Form.Field>
                                    <label>Quantity</label>
                                    <Input
                                        label="batches"
                                        labelPosition="right"
                                        type="number"
                                        min={1}
                                        max={totalBatches}
                                        value={batchQuantity}
                                        onChange={(event) =>
                                            this.setState({
                                                batchQuantity:
                                                    event.target.value,
                                            })
                                        }
                                    />
                                </Form.Field>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button
                                    type="submit"
                                    positive
                                    loading={processLoading}
                                >
                                    <Icon name="checkmark" /> Submit
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Card.Content>
                </Card>
            );
        }
        return renderedCards;
    }

    render() {
        const { success, errorMessage, loading, processLoading } = this.state;
        const { color } = this.props;
        return (
            <Tab.Pane style={{ borderColor: color, borderRadius: "5px" }}>
                <Grid columns="equal">
                    <Grid.Row>
                        <Inventory head="Inventory" color={color} />
                        <Grid.Column>
                            <Segment
                                style={{ borderColor: color }}
                                inverted
                                color={color}
                            >
                                <Header as="h3">Market</Header>
                            </Segment>
                            <Message icon hidden={!processLoading} info>
                                <Icon name="circle notched" loading />
                                <Message.Content>
                                    <Message.Header>
                                        Just a moment
                                    </Message.Header>
                                    We are processing your request.
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!success} success>
                                <Icon name="check square outline" />
                                <Message.Content>
                                    <Message.Header>Success</Message.Header>
                                    Your request has been processed.
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!errorMessage} error>
                                <Icon name="warning sign" />
                                <Message.Content>
                                    <Message.Header>Error</Message.Header>
                                    {errorMessage}
                                </Message.Content>
                            </Message>
                            <Visibility fireOnMount onOnScreen={this.loadCards}>
                                <Segment
                                    style={{
                                        overflow: "auto",
                                        maxHeight: 370,
                                    }}
                                >
                                    <Dimmer active={loading} inverted>
                                        <Loader size="large">Loading</Loader>
                                    </Dimmer>
                                    {loading ? (
                                        <Placeholder fluid>
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
                                        <Card.Group itemsPerRow={2} centered>
                                            {this.renderCards()}
                                        </Card.Group>
                                    )}
                                </Segment>
                            </Visibility>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Tab.Pane>
        );
    }
}

export default Catalouge;
