import React, { Component } from "react";
import certifier from "../../ethereum/certifier";
import {
    Header,
    Segment,
    Icon,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Message,
    Popup,
    Dimmer,
    Loader,
    Placeholder,
    Visibility,
    Tab,
} from "semantic-ui-react";
import web3 from "../../ethereum/web3";

class ProcessCertificates extends Component {
    state = {
        productionLimit: 0,
        errorMessage: "",
        loading: false,
        processLoading: false,
        success: false,
        certificates: {},
    };

    async onApprove(id, event) {
        event.preventDefault();
        this.setState({
            processLoading: true,
            errorMessage: "",
        });
        try {
            const accounts = await web3.eth.getAccounts();
            await certifier.methods
                .processRequest(id, "Accepted", this.state.productionLimit)
                .send({
                    from: accounts[0],
                });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ productionLimit: 0, processLoading: false });
        this.loadCertificates();
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    }

    async onReject(id, event) {
        event.preventDefault();
        this.setState({
            processLoading: true,
            errorMessage: "",
        });
        try {
            const accounts = await web3.eth.getAccounts();
            await certifier.methods.processRequest(id, "Rejected", 0).send({
                from: accounts[0],
            });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ productionLimit: 0, processLoading: false });
        this.loadCertificates();
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    }

    async loadCertificates() {
        this.setState({ loading: true, errorMessage: "" });
        try {
            let clients = await certifier.methods.getClients().call();
            clients = clients.filter((x, i, a) => a.indexOf(x) == i);
            let certificates = {};
            for (const client of clients) {
                const certificateIds = await certifier.methods
                    .getRegistry(client)
                    .call();
                for (const id of certificateIds) {
                    const certificate = await certifier.methods
                        .certificates(id)
                        .call();
                    certificates[id] = certificate;
                }
            }
            this.setState({ certificates: certificates });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({ loading: false });
    }

    renderCertificates() {
        const { Row, Cell, HeaderCell, Body } = Table;
        const { loading, certificates, processLoading } = this.state;
        let renderedRows = [];
        for (const id in certificates) {
            let {
                producerAddress,
                producerName,
                productName,
                universalProductCode,
                productDescription,
                requestStatus,
                productionLimit,
            } = certificates[id];
            renderedRows.push(
                <Row
                    disabled={requestStatus != "Pending"}
                    positive={requestStatus == "Accepted"}
                    negative={requestStatus == "Rejected"}
                >
                    <Cell>{id}</Cell>
                    <Cell textAlign="center">
                        <Popup
                            trigger={<Icon name="qrcode" size="large"></Icon>}
                            content={producerAddress}
                            position="right center"
                            inverted
                        />
                    </Cell>
                    <Cell>{producerName}</Cell>
                    <Cell>{productName}</Cell>
                    <Cell>{universalProductCode}</Cell>
                    <Cell>{productDescription}</Cell>
                    <Cell>{requestStatus}</Cell>
                    <Cell>{productionLimit}</Cell>
                    <Cell>
                        <Modal
                            as={Form}
                            trigger={
                                <Button
                                    positive
                                    loading={loading}
                                    disabled={
                                        requestStatus != "Pending" ||
                                        processLoading
                                    }
                                >
                                    Approve
                                </Button>
                            }
                            closeIcon
                            onSubmit={this.onApprove.bind(this, id)}
                        >
                            <Header
                                icon="boxes"
                                content={
                                    "Assign Production Limit for Certificate Id " +
                                    id
                                }
                            />
                            <Modal.Content>
                                <Form.Field>
                                    <label>Production Limit</label>
                                    <Input
                                        label="items"
                                        labelPosition="right"
                                        value={this.state.productionLimit}
                                        onChange={(event) =>
                                            this.setState({
                                                productionLimit:
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
                                    loading={loading}
                                >
                                    <Icon name="checkmark" /> Submit
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Cell>
                    <Cell>
                        <Button
                            negative
                            onClick={this.onReject.bind(this, id)}
                            loading={loading}
                            disabled={
                                requestStatus != "Pending" || processLoading
                            }
                        >
                            Reject
                        </Button>
                    </Cell>
                </Row>
            );
        }
        return (
            <Table striped selectable celled textAlign="center">
                <Table.Header>
                    <Row>
                        <HeaderCell>Cert. Id</HeaderCell>
                        <HeaderCell>Producer Addr.</HeaderCell>
                        <HeaderCell>Producer Name</HeaderCell>
                        <HeaderCell>Product Name</HeaderCell>
                        <HeaderCell>UPC</HeaderCell>
                        <HeaderCell>Product Desc.</HeaderCell>
                        <HeaderCell>Req. Status</HeaderCell>
                        <HeaderCell>Production Limit</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Reject</HeaderCell>
                    </Row>
                </Table.Header>
                <Body>{renderedRows}</Body>
            </Table>
        );
    }

    render() {
        const { success, errorMessage, loading, processLoading } = this.state;
        return (
            <Tab.Pane style={{ borderColor: "yellow", borderRadius: "3px" }}>
                <Visibility
                    fireOnMount
                    onOnScreen={this.loadCertificates.bind(this)}
                >
                    <Segment
                        style={{ borderColor: "yellow" }}
                        inverted
                        color="yellow"
                    >
                        <Header as="h3">Certificates</Header>
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
                            <div>
                                <Button
                                    fluid
                                    secondary
                                    onClick={this.loadCertificates.bind(this)}
                                >
                                    Refresh
                                </Button>
                                {this.renderCertificates()}
                            </div>
                        )}
                    </Segment>
                </Visibility>
            </Tab.Pane>
        );
    }
}

export default ProcessCertificates;
