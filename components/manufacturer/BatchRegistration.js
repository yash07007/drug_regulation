import React, { Component } from "react";
import {
    Header,
    Segment,
    Button,
    Form,
    Tab,
    Message,
    Icon,
    Label,
    Divider,
    Grid,
} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import Inventory from "./inventory/Inventory";
import { Router } from "../../routes";

function pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

class BatchRegistration extends Component {
    state = {
        errorMessage: "",
        loading: false,
        productName: "",
        universalProductCode: "",
        productDescription: "",
        perBatchQuantity: 0,
        totalBatches: 0,
        pricePerBatch: 0,
        batchIds: [],
        success: false,
        contracts: [],
        inventoyHead: "Inventory",
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const {
            productName,
            productDescription,
            universalProductCode,
            perBatchQuantity,
            totalBatches,
            pricePerBatch,
            batchIds,
        } = this.state;
        this.setState({ loading: true, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .processesRequest(
                    productName,
                    universalProductCode,
                    productDescription,
                    perBatchQuantity,
                    totalBatches,
                    batchIds,
                    pricePerBatch
                )
                .send({
                    from: accounts[0],
                });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({
            productName: "",
            universalProductCode: "",
            productDescription: "",
            perBatchQuantity: 0,
            totalBatches: 0,
            pricePerBatch: 0,
            batchIds: [],
            loading: false,
            inventoyHead: "Inventory",
        });
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    };

    generateBatches = (event) => {
        this.setState({
            totalBatches: event.target.value,
        });
        let batchIds = [];
        let lotId = Math.round(100 + Math.random() * 100).toString();
        for (let i = 0; i < event.target.value; i++) {
            let id = "B-" + lotId + "-" + pad(i + 1, 2);
            batchIds.push(id);
        }
        this.setState({
            batchIds: batchIds,
        });
    };

    renderLabels() {
        let renderedLabels = [];
        for (let i = 0; i < this.state.batchIds.length; i++) {
            if (i != 0 && i % 6 == 0) {
                renderedLabels.push(<Divider />);
            }
            renderedLabels.push(
                <Label color="red">{this.state.batchIds[i]}</Label>
            );
        }
        return renderedLabels;
    }

    render() {
        const {
            productName,
            productDescription,
            universalProductCode,
            perBatchQuantity,
            totalBatches,
            pricePerBatch,
            errorMessage,
            loading,
            success,
        } = this.state;
        return (
            <Tab.Pane style={{ borderColor: "red", borderRadius: "5px" }}>
                <Grid columns="equal">
                    <Grid.Row>
                        <Inventory head={this.state.inventoyHead} />
                        <Grid.Column>
                            <Segment
                                style={{ borderColor: "red" }}
                                inverted
                                color="red"
                            >
                                <Header as="h3">Register New Batch</Header>
                            </Segment>
                            <Message icon hidden={!loading} info>
                                <Icon name="circle notched" loading />
                                <Message.Content>
                                    <Message.Header>
                                        Just a moment
                                    </Message.Header>
                                    We are registering your batch.
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!success} success>
                                <Icon name="check square outline" />
                                <Message.Content>
                                    <Message.Header>Success</Message.Header>
                                    Your batch has been sucessfully registered
                                </Message.Content>
                            </Message>
                            <Segment textAlign="left">
                                <Form
                                    onSubmit={this.onSubmit}
                                    error={!!errorMessage}
                                    loading={loading}
                                >
                                    <Message
                                        error
                                        header="Error!"
                                        content={errorMessage}
                                    />
                                    <Form.Group widths="equal">
                                        <Form.Input
                                            fluid
                                            label="Product Name"
                                            placeholder="Product Name"
                                            value={productName}
                                            onChange={(event) =>
                                                this.setState({
                                                    productName:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <Form.Input
                                            fluid
                                            label="Universal Product Code"
                                            placeholder="Universal Product Code"
                                            value={universalProductCode}
                                            onChange={(event) =>
                                                this.setState({
                                                    universalProductCode:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group widths="equal">
                                        <Form.TextArea
                                            label="Product Description"
                                            placeholder="Product Description"
                                            value={productDescription}
                                            onChange={(event) =>
                                                this.setState({
                                                    productDescription:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Form.Group>
                                    <Form.Group widths="equal">
                                        <Form.Input
                                            fluid
                                            type="number"
                                            label="Per Batch Quantity"
                                            placeholder="Per Batch Quantity"
                                            value={perBatchQuantity}
                                            onChange={(event) =>
                                                this.setState({
                                                    perBatchQuantity:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <Form.Input
                                            fluid
                                            type="number"
                                            label="Total Batches"
                                            placeholder="Total Batches"
                                            value={totalBatches}
                                            onChange={this.generateBatches}
                                        />
                                        <Form.Input
                                            fluid
                                            type="number"
                                            label="Price Per Batch"
                                            placeholder="Price Per Batch"
                                            value={pricePerBatch}
                                            onChange={(event) =>
                                                this.setState({
                                                    pricePerBatch:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                    </Form.Group>
                                    <Segment>
                                        <Label color="red" attached="top left">
                                            BatchIds
                                        </Label>
                                        {this.renderLabels()}
                                    </Segment>
                                    <Button type="submit" fluid primary>
                                        Submit
                                    </Button>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Tab.Pane>
        );
    }
}

export default BatchRegistration;
