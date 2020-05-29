import React, { Component } from "react";
import {
    Header,
    Segment,
    Visibility,
    Placeholder,
    Dimmer,
    Loader,
    Grid,
    Table,
    Button,
    Message,
} from "semantic-ui-react";
import certifier from "../../../ethereum/certifier";
import web3 from "../../../ethereum/web3";

class CertificateInventory extends Component {
    state = {
        loading: false,
        certificates: {},
    };

    loadCertificates = async () => {
        this.setState({
            loading: true,
        });
        const accounts = await web3.eth.getAccounts();
        const certificatesIds = await certifier.methods
            .getRegistry(accounts[0])
            .call();

        let certificates = {};
        for (const id of certificatesIds) {
            const certificate = await certifier.methods.certificates(id).call();
            certificates[id] = certificate;
        }

        this.setState({
            certificates: certificates,
            loading: false,
        });
    };

    renderCertificates() {
        const { Row, Cell, HeaderCell, Header, Body } = Table;
        const { certificates } = this.state;
        let renderedRows = [];
        for (const id in certificates) {
            let certificate = certificates[id];
            renderedRows.push(
                <Row>
                    <Cell>{id}</Cell>
                    <Cell>{certificate.productName}</Cell>
                    <Cell>{certificate.universalProductCode}</Cell>
                    <Cell>{certificate.requestStatus}</Cell>
                    <Cell>{certificate.productionLimit}</Cell>
                </Row>
            );
        }
        let renderedTable = !renderedRows.length ? (
            <Message>
                <Message.Header>
                    You do not have any certificates.
                </Message.Header>
            </Message>
        ) : (
            <Table celled inverted striped>
                <Header>
                    <Row>
                        <HeaderCell>Id</HeaderCell>
                        <HeaderCell>Name</HeaderCell>
                        <HeaderCell>UPC</HeaderCell>
                        <HeaderCell>Req. Status</HeaderCell>
                        <HeaderCell>Prod. Limit</HeaderCell>
                    </Row>
                </Header>
                <Body>{renderedRows}</Body>
            </Table>
        );
        return renderedTable;
    }

    render() {
        const { loading } = this.state;
        return (
            <Grid.Column>
                <Visibility fireOnMount onOnScreen={this.loadCertificates}>
                    <Segment
                        style={{ borderColor: "red" }}
                        inverted
                        color="red"
                    >
                        <Header as="h3">Certificate Inventory</Header>
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
                                <Button
                                    secondary
                                    fluid
                                    onClick={this.loadCertificates}
                                >
                                    Refresh
                                </Button>
                                {this.renderCertificates()}
                            </div>
                        )}
                    </Segment>
                </Visibility>
            </Grid.Column>
        );
    }
}

export default CertificateInventory;
