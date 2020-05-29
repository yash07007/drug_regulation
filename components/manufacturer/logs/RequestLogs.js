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
import { Router } from "../../../routes";

class RequestLogs extends Component {
    state = {
        errorMessage: "",
        loading: false,
        processLoading: false,
        logs: {},
    };

    async processRequest(contract, reqId, status, event) {
        this.setState({
            processLoading: true,
            errorMessage: "",
        });
        try {
            const accounts = await web3.eth.getAccounts();
            const supplyTrack = SupplyTrack(contract);
            await supplyTrack.methods
                .handlePurchaseRequest(reqId, status)
                .send({
                    from: accounts[0],
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
        const contracts = await factory.methods
            .getDeployedContracts(accounts[0])
            .call();

        const type = this.props.type == "recieved" ? "recieved" : "sent";
        const typeOfObjectIds = type + "RequestIds";

        const logs = {};
        for (let i = 0; i < contracts.length; i++) {
            const supplyTrack = SupplyTrack(contracts[i]);
            const ids = await supplyTrack.methods
                .getIds(typeOfObjectIds)
                .call({ from: accounts[0] });
            const product = await supplyTrack.methods.product().call();
            let log = [];
            for (const id of ids) {
                const object = await supplyTrack.methods
                    .purchaseRequestLog(id)
                    .call();
                const actor = await supplyTrack.methods
                    .actors(object.sender)
                    .call();
                object.senderName = actor.actorName;
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
                    reqId,
                    sender,
                    senderName,
                    batchQuantity,
                    status,
                } = object;
                renderedRows.push(
                    <Row
                        disabled={status != "Pending"}
                        positive={status == "Accepted"}
                        negative={status == "Rejected"}
                    >
                        <Cell>{reqId}</Cell>
                        <Cell>
                            <Popup
                                trigger={
                                    <Icon name="qrcode" size="large"></Icon>
                                }
                                content={sender}
                                position="right center"
                                inverted
                            />
                        </Cell>
                        <Cell>{senderName}</Cell>
                        <Cell>{batchQuantity}</Cell>
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
                                    onClick={this.processRequest.bind(
                                        this,
                                        contract,
                                        reqId,
                                        "Accepted"
                                    )}
                                >
                                    Approve
                                </Button>
                            </Cell>
                        )}
                        {type == "recieved" && (
                            <Cell>
                                <Button
                                    negative
                                    fluid
                                    loading={loading}
                                    disabled={
                                        status != "Pending" || processLoading
                                    }
                                    onClick={this.processRequest.bind(
                                        this,
                                        contract,
                                        reqId,
                                        "Rejected"
                                    )}
                                >
                                    Reject
                                </Button>
                            </Cell>
                        )}
                    </Row>
                );
            }
            const hideTable = renderedRows.length == 0 ? true : false;
            renderedTables.push(
                <Table
                    striped
                    selectable
                    celled
                    textAlign="center"
                    hidden={hideTable}
                >
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
                                        <Header as="h3">{productName}</Header>
                                    }
                                    content="Universal Product Code"
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
                            <HeaderCell colSpan={type == "recieved" ? 2 : 1}>
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
                            <HeaderCell>Request Id</HeaderCell>
                            <HeaderCell>Sender Address</HeaderCell>
                            <HeaderCell>Sender Name</HeaderCell>
                            <HeaderCell>Batch Quantity</HeaderCell>
                            <HeaderCell>Request Status</HeaderCell>
                            {type == "recieved" && (
                                <HeaderCell>Approve</HeaderCell>
                            )}
                            {type == "recieved" && (
                                <HeaderCell>Reject</HeaderCell>
                            )}
                        </Row>
                    </Header>
                    <Body>{renderedRows}</Body>
                </Table>
            );
        }

        if (renderedTables.length == 0) {
            renderedTables.push(
                <Message>
                    <Message.Header>
                        You do not have unprocessed Requests.
                    </Message.Header>
                </Message>
            );
        }

        return renderedTables;
    }

    render() {
        const { loading, processLoading, success, errorMessage } = this.state;
        const { type } = this.props;
        return (
            <Tab.Pane style={{ borderColor: "red", borderRadius: "3px" }}>
                <Visibility fireOnMount onOnScreen={this.loadLogs}>
                    <Segment
                        style={{ borderColor: "red" }}
                        inverted
                        color="red"
                    >
                        <Header as="h3">
                            {type[0].toUpperCase() + type.slice(1)} Pruchase
                            Requests
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

export default RequestLogs;
