import React, { Component } from "react";
import {
    Header,
    Segment,
    Button,
    Tab,
    Message,
    Visibility,
    Table,
    Popup,
    Icon,
    Dimmer,
    Loader,
    Placeholder,
} from "semantic-ui-react";
import factory from "../../../ethereum/factory";
import web3 from "../../../ethereum/web3";
import SupplyTrack from "../../../ethereum/supplyTrack";

class Logs extends Component {
    state = {
        errorMessage: "",
        loading: false,
        processLoading: false,
        logs: {},
    };

    async onPay(contract, invoiceId, totalPrice, event) {
        this.setState({
            processLoading: true,
            errorMessage: "",
        });
        try {
            const accounts = await web3.eth.getAccounts();
            const supplyTrack = SupplyTrack(contract);
            await supplyTrack.methods
                .payAndFinalizeTransaction(invoiceId)
                .send({
                    from: accounts[0],
                    value: totalPrice,
                });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ processLoading: false });
        this.loadLogs();
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    }

    loadLogs = async () => {
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

        const type = this.props.type == "recieved" ? "recieved" : "sent";
        const typeOfObjectIds = type + "InvoiceIds";

        const logs = {};
        for (let i = 0; i < contracts.length; i++) {
            const supplyTrack = SupplyTrack(contracts[i]);
            const ids = await supplyTrack.methods
                .getIds(typeOfObjectIds)
                .call({ from: accounts[0] });
            const product = await supplyTrack.methods.product().call();
            let log = [];
            for (const id of ids) {
                const object = await supplyTrack.methods.invoiceLog(id).call();
                const actor = await supplyTrack.methods
                    .actors(object.benificiary)
                    .call({ from: accounts[0] });
                object.benificiaryName = actor.actorName;
                log.push(object);
            }
            logs[contracts[i]] = { log, product };
        }

        this.setState({
            logs: logs,
            loading: false,
        });
    };

    renderLogs() {
        const { Row, Cell, HeaderCell, Header, Body } = Table;
        const { logs, loading, processLoading } = this.state;
        const { type } = this.props;
        let renderedTables = [];
        for (const contract in logs) {
            let { log, product } = logs[contract];
            let { productName, universalProductCode, totalBatches } = product;
            let renderedRows = [];
            for (const object of log) {
                let {
                    invoiceId,
                    benificiary,
                    benificiaryName,
                    totalBatches,
                    totalPrice,
                    status,
                } = object;
                renderedRows.push(
                    <Row
                        // disabled={status != "Pending"}
                        positive={status == "Paid"}
                        // negative={status == "Rejected"}
                    >
                        <Cell>{invoiceId}</Cell>
                        <Cell>
                            <Popup
                                trigger={
                                    <Icon name="qrcode" size="large"></Icon>
                                }
                                content={benificiary}
                                position="right center"
                                inverted
                            />
                        </Cell>
                        <Cell>{benificiaryName}</Cell>
                        <Cell>{totalBatches}</Cell>
                        <Cell>{totalPrice}</Cell>
                        <Cell>{status}</Cell>
                        {type == "recieved" && (
                            <Cell>
                                <Button
                                    positive
                                    fluid
                                    loading={loading}
                                    disabled={
                                        status != "Pending" || processLoading
                                    }
                                    onClick={this.onPay.bind(
                                        this,
                                        contract,
                                        invoiceId,
                                        totalPrice
                                    )}
                                >
                                    Pay
                                </Button>
                            </Cell>
                        )}
                    </Row>
                );
            }

            if (renderedRows.length == 0) {
                renderedTables.push(
                    <Message>
                        <Message.Header>
                            You do not have unprocessed Invoices.
                        </Message.Header>
                    </Message>
                );
            } else {
                renderedTables.push(
                    <Table striped selectable celled textAlign="center">
                        <Header>
                            <Row>
                                <HeaderCell colSpan="3">
                                    <Popup
                                        trigger={
                                            <Header as="h3">{contract}</Header>
                                        }
                                        content="Contract Addresss"
                                        position="top center"
                                        inverted
                                    />
                                </HeaderCell>
                                <HeaderCell>
                                    <Popup
                                        trigger={
                                            <Header as="h3">
                                                {productName}
                                            </Header>
                                        }
                                        content="Product Name"
                                        position="top center"
                                        inverted
                                    />
                                </HeaderCell>
                                <HeaderCell>
                                    <Popup
                                        trigger={
                                            <Header as="h3">
                                                {universalProductCode}
                                            </Header>
                                        }
                                        content="Universal Product Code"
                                        position="top center"
                                        inverted
                                    />
                                </HeaderCell>
                                <HeaderCell colSpan="2">
                                    <Popup
                                        trigger={
                                            <Header as="h3">
                                                {totalBatches} Left
                                            </Header>
                                        }
                                        content="Quantity Left"
                                        position="top center"
                                        inverted
                                    />
                                </HeaderCell>
                            </Row>
                            <Row>
                                <HeaderCell>Invoice Id</HeaderCell>
                                <HeaderCell>Benificairy Address</HeaderCell>
                                <HeaderCell>Benificairy Name</HeaderCell>
                                <HeaderCell>Total Batchs</HeaderCell>
                                <HeaderCell>Total Price</HeaderCell>
                                <HeaderCell>Invoice Status</HeaderCell>
                                {type == "recieved" && (
                                    <HeaderCell>Pay</HeaderCell>
                                )}
                            </Row>
                        </Header>
                        <Body>{renderedRows}</Body>
                    </Table>
                );
            }
        }
        return renderedTables;
    }

    render() {
        const { loading, processLoading, success, errorMessage } = this.state;
        const { type, color } = this.props;
        return (
            <Tab.Pane style={{ borderColor: color, borderRadius: "3px" }}>
                <Visibility fireOnMount onOnScreen={this.loadLogs}>
                    <Segment
                        style={{ borderColor: color }}
                        inverted
                        color={color}
                    >
                        <Header as="h3">
                            {type[0].toUpperCase() + type.slice(1)} Invoices
                        </Header>
                    </Segment>
                    <Message icon hidden={!processLoading} info>
                        <Icon name="circle notched" loading />
                        <Message.Content>
                            <Message.Header>Just a moment</Message.Header>
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
                    <Segment style={{ overflow: "auto", maxHeight: 370 }}>
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
                            <div>
                                <Button fluid onClick={this.loadLogs} secondary>
                                    Refresh
                                </Button>
                                {this.renderLogs()}
                            </div>
                        )}
                    </Segment>
                </Visibility>
            </Tab.Pane>
        );
    }
}

export default Logs;
