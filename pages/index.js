import React, { Component } from "react";
// import factory from "../ethereum/factory";
import { Segment, Header, Grid } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";

class Index extends Component {
    // static async getInitialProps() {}

    render() {
        return (
            <Layout>
                <Segment inverted color="green" textAlign="center">
                    <Header as="h1">DEVELOPER INTERFACE</Header>
                </Segment>
                <Grid columns="equal">
                    <Grid.Row>
                        <Grid.Column>
                            <Link route="/certifier">
                                <Segment
                                    inverted
                                    color="yellow"
                                    textAlign="center"
                                >
                                    <Header as="h2">Certifier Dashboard</Header>
                                </Segment>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment inverted color="blue" textAlign="center">
                                <Header as="h2">
                                    Regulatory Committe Dashboard
                                </Header>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Segment inverted color="red" textAlign="center">
                                <Header as="h2">Wholesaler Dashboard</Header>
                            </Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Segment inverted color="purple" textAlign="center">
                                <Header as="h2">Retailer Dashboard</Header>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default Index;
