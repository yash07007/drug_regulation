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
    Popup,
} from "semantic-ui-react";
import Layout from "../../components/Layout";
// import { Link } from "../../routes";

class CertifierIndex extends Component {
    static async getInitialProps() {
        const manager = await certifier.methods.manager().call();
        let clients = await certifier.methods.getClients().call();
        clients = clients.filter((x, i, a) => a.indexOf(x) == i);
        let certificates = [];
        for (let c = 0; c < clients.length; c++) {
            const certificateIds = await certifier.methods
                .getRegistry(clients[c])
                .call();
            for (let j = 0; j < certificateIds.length; j++) {
                const certificate = await certifier.methods
                    .certificates(certificateIds[j])
                    .call();
                certificates.push(certificate);
            }
        }

        return {
            manager: manager,
            clients: clients,
            certificates: certificates,
        };
    }

    state = { open: false };
    show = () => () => this.setState({ open: true });
    close = () => this.setState({ open: false });

    render() {
        const { open } = this.state;
        let renderedCertificates = [];
        for (let i = 0; i < this.props.certificates.length; i++) {
            const certificate = this.props.certificates[i];
            console.log(certificate.producerAddress);

            renderedCertificates.push(
                <Table.Row>
                    {/* <Table.Cell textAlign="center">
                        <Icon
                            name="key"
                            onClick={this.show()}
                            size="large"
                        ></Icon>
                        <Modal size="tiny" open={open} onClose={this.close}>
                            <Modal.Content>
                                <center>{certificate.producerAddress}</center>
                            </Modal.Content>
                        </Modal>
                    </Table.Cell> */}
                    <Table.Cell>{certificate.producerName}</Table.Cell>
                    <Table.Cell>{certificate.productName}</Table.Cell>
                    <Table.Cell>{certificate.universalProductCode}</Table.Cell>
                    <Table.Cell>{certificate.productDescription}</Table.Cell>
                    <Table.Cell>
                        {certificate.requestStatus ? "Accepted" : "Pending"}
                    </Table.Cell>
                    <Table.Cell>{certificate.productionLimit}</Table.Cell>
                    <Table.Cell positive>
                        <Button positive>Approve</Button>
                    </Table.Cell>
                    <Table.Cell negative>
                        <Button negative>Reject</Button>
                    </Table.Cell>
                </Table.Row>
            );
        }
        return (
            <Layout>
                <center>
                    <Grid columns="equal" style={{ marginTop: "10px" }}>
                        <Grid.Row>
                            <Grid.Column>
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
                            <Grid.Column>
                                <Segment
                                    compact
                                    style={{ borderColor: "blue" }}
                                    floated="right"
                                >
                                    <Popup
                                        content={this.props.manager}
                                        on="click"
                                        basic
                                        trigger={<Icon name="key" />}
                                        inverted
                                    />
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
                                    <Header as="h3">
                                        Certificate Approval Requests
                                    </Header>
                                </Segment>
                                <Table
                                    style={{ borderColor: "blue" }}
                                    striped
                                    selectable
                                    celled
                                    attached="bottom"
                                >
                                    <Table.Header>
                                        <Table.Row>
                                            {/* <Table.HeaderCell>
                                                Producer Address
                                            </Table.HeaderCell> */}
                                            <Table.HeaderCell>
                                                Producer Name
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Product Name
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Universal Product Code
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Product Description
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Request Status
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Production Limit
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Approve
                                            </Table.HeaderCell>
                                            <Table.HeaderCell>
                                                Reject
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {renderedCertificates}
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </center>
            </Layout>
        );
    }
}

export default CertifierIndex;
