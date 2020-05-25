import React, { Component } from "react";
import certifier from "../../ethereum/certifier";
import {
    Header,
    Segment,
    Icon,
    Grid,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Message,
    Popup,
} from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class CertifierIndex extends Component {
    static async getInitialProps() {
        const manager = await certifier.methods.manager().call();
        let clients = await certifier.methods.getClients().call();
        clients = clients.filter((x, i, a) => a.indexOf(x) == i);
        let certificates = [];
        let ids = [];
        for (let c = 0; c < clients.length; c++) {
            const certificateIds = await certifier.methods
                .getRegistry(clients[c])
                .call();
            for (let j = 0; j < certificateIds.length; j++) {
                const certificate = await certifier.methods
                    .certificates(certificateIds[j])
                    .call();
                ids.push(certificateIds[j]);
                certificates.push(certificate);
            }
        }

        return {
            manager: manager,
            clients: clients,
            certificates: certificates,
            certificateIds: ids,
        };
    }

    state = {
        productionLimit: 0,
        errorMessage: "",
        loading: false,
        certificateId: 0,
    };

    async onApprove(event) {
        event.preventDefault();
        this.binding.setState({ loading: true, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            await certifier.methods
                .processRequest(
                    this.binding.props.certificateIds[this.index],
                    "Accepted",
                    this.binding.state.productionLimit
                )
                .send({
                    from: accounts[0],
                });
            Router.pushRoute("/certifier");
        } catch (error) {
            this.binding.setState({ errorMessage: error.message });
        }
        this.binding.setState({ loading: false });
    }

    async onReject(event) {
        event.preventDefault();
        this.binding.setState({ loading: true, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            await certifier.methods
                .processRequest(
                    this.binding.props.certificateIds[this.index],
                    "Rejected",
                    0
                )
                .send({
                    from: accounts[0],
                });
            Router.pushRoute("/certifier");
        } catch (error) {
            this.binding.setState({ errorMessage: error.message });
        }
        this.binding.setState({ loading: false });
    }

    renderTable() {
        let renderedRows = [];
        for (let i = 0; i < this.props.certificates.length; i++) {
            const certificate = this.props.certificates[i];
            renderedRows.push(
                <Table.Row
                    disabled={
                        this.props.certificates[i].requestStatus != "Pending"
                    }
                    positive={
                        this.props.certificates[i].requestStatus == "Accepted"
                    }
                    negative={
                        this.props.certificates[i].requestStatus == "Rejected"
                    }
                >
                    <Table.Cell textAlign="center">
                        <Popup
                            wide
                            trigger={<Icon name="qrcode" size="large"></Icon>}
                            on="click"
                        >
                            <Grid divided columns="equal">
                                <Grid.Column>
                                    <Popup
                                        trigger={
                                            <Button
                                                color="black"
                                                content="Cert. Id"
                                                fluid
                                            />
                                        }
                                        content={this.props.certificateIds[i]}
                                        position="top center"
                                        size="tiny"
                                        inverted
                                    />
                                </Grid.Column>
                                <Grid.Column>
                                    <Popup
                                        trigger={
                                            <Button
                                                color="blue"
                                                content="Address"
                                                fluid
                                            />
                                        }
                                        content={certificate.producerAddress}
                                        position="top center"
                                        size="tiny"
                                        inverted
                                    />
                                </Grid.Column>
                            </Grid>
                        </Popup>
                    </Table.Cell>
                    <Table.Cell>{certificate.producerName}</Table.Cell>
                    <Table.Cell>{certificate.productName}</Table.Cell>
                    <Table.Cell>{certificate.universalProductCode}</Table.Cell>
                    <Table.Cell>{certificate.productDescription}</Table.Cell>
                    <Table.Cell>{certificate.requestStatus}</Table.Cell>
                    <Table.Cell>{certificate.productionLimit}</Table.Cell>
                    <Table.Cell>
                        <Modal
                            as={Form}
                            trigger={
                                <Button
                                    positive
                                    loading={this.state.loading}
                                    disabled={
                                        this.props.certificates[i]
                                            .requestStatus != "Pending"
                                    }
                                >
                                    Approve
                                </Button>
                            }
                            closeIcon
                            onSubmit={this.onApprove}
                            error={!!this.state.errorMessage}
                            index={i}
                            binding={this}
                        >
                            <Header
                                icon="boxes"
                                content={
                                    "Assign Production Limit for Certificate Id " +
                                    this.props.certificateIds[i]
                                }
                            />
                            <Modal.Content>
                                <Message
                                    error
                                    header="Error!"
                                    content={this.state.errorMessage}
                                />
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
                                    loading={this.state.loading}
                                >
                                    <Icon name="checkmark" /> Submit
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Table.Cell>
                    <Table.Cell>
                        <Button
                            negative
                            onClick={this.onReject}
                            loading={this.state.loading}
                            error={!!this.state.errorMessage}
                            index={i}
                            binding={this}
                            disabled={
                                this.props.certificates[i].requestStatus !=
                                "Pending"
                            }
                        >
                            Reject
                        </Button>
                    </Table.Cell>
                </Table.Row>
            );
        }
        return (
            <Table
                style={{ borderColor: "blue" }}
                striped
                selectable
                celled
                attached="bottom"
            >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Producer Name</Table.HeaderCell>
                        <Table.HeaderCell>Product Name</Table.HeaderCell>
                        <Table.HeaderCell>
                            Universal Product Code
                        </Table.HeaderCell>
                        <Table.HeaderCell>Product Description</Table.HeaderCell>
                        <Table.HeaderCell>Request Status</Table.HeaderCell>
                        <Table.HeaderCell>Production Limit</Table.HeaderCell>
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Reject</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>{renderedRows}</Table.Body>
            </Table>
        );
    }

    render() {
        return (
            <Layout>
                <center>
                    <Grid columns="equal" style={{ marginTop: "10px" }}>
                        <Grid.Row>
                            <Grid.Column width={6}>
                                <Segment
                                    compact
                                    style={{ borderColor: "blue" }}
                                    floated="left"
                                >
                                    <Header as="h2">
                                        <Icon.Group>
                                            <Icon name="signup" />
                                        </Icon.Group>
                                        Certifier Interface
                                    </Header>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Segment
                                    style={{ borderColor: "blue" }}
                                    floated="right"
                                    compact
                                >
                                    <Header as="h4">
                                        <Icon name="qrcode" />
                                        {this.props.manager}
                                    </Header>
                                </Segment>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Segment
                                    style={{ borderColor: "blue" }}
                                    inverted
                                    color="blue"
                                    attached="top"
                                >
                                    <Header as="h3">Certificates</Header>
                                </Segment>
                                {this.renderTable()}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </center>
            </Layout>
        );
    }
}

export default CertifierIndex;
