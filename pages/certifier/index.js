import React, { Component } from "react";
import certifier from "../../ethereum/certifier";
import { Header, Segment, Icon, Grid, GridRow } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { Link } from "../../routes";

class CertifierIndex extends Component {
    static async getInitialProps() {
        const manager = await certifier.methods.manager().call();
        const clients = await certifier.methods.getClients().call();
        let registry = {};
        for (let c = 0; c < clients.length; c++) {
            const certificate = await certifier.methods
                .registry(clients[c], 0)
                .call();
            registry[clients[c]] = certificate;
        }

        return { manager: manager, clients: clients, registry: registry };
    }

    render() {
        let clients = [];
        for (const [index, value] of this.props.clients.entries()) {
            const certificate = this.props.registry[value];
            clients.push(
                <Segment>
                    Producer Name: {certificate.producerAddress}
                    Product Name: {certificate.productName}
                    Universal Product Code: {certificate.universalProductCode}
                    Product Description: {certificate.productDescription}
                    Request Status: {certificate.requestStatus}
                    Production Limit: {certificate.productionLimit}
                </Segment>
            );
        }
        return (
            <Layout>
                <center>
                    <Segment compact>
                        <Header as="h2">
                            <Icon.Group size="large">
                                <Icon name="signup" />
                            </Icon.Group>
                            Certifier Interface
                        </Header>
                    </Segment>
                    <Grid columns="equal">
                        <Grid.Row>
                            <Grid.Column>
                                <Segment>{this.props.manager}</Segment>
                            </Grid.Column>
                            <Grid.Column>{clients}</Grid.Column>
                        </Grid.Row>
                    </Grid>
                </center>
            </Layout>
        );
    }
}

export default CertifierIndex;
