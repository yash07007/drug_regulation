import React, { Component } from "react";
// import factory from "../ethereum/factory";
import { Segment, Header, Grid, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";
import address from "../addresses";

class Index extends Component {
    // static async getInitialProps() {}

    render() {
        return (
            <Layout>
                <center>
                    <Segment compact>
                        <Header as="h2">
                            <Icon.Group size="large">
                                <Icon name="computer" />
                            </Icon.Group>
                            Developer Interface
                        </Header>
                    </Segment>
                </center>
                <Header as="h2">Dashboards</Header>
                <Grid columns="equal" style={{ marginTop: "10px" }}>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route="/certifier">
                                <a>
                                    <Segment
                                        inverted
                                        color="yellow"
                                        textAlign="center"
                                    >
                                        <Header as="h2" icon>
                                            <Icon name="signup" />
                                            Certifier
                                        </Header>
                                    </Segment>
                                </a>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link route="/">
                                <a>
                                    <Segment
                                        inverted
                                        color="blue"
                                        textAlign="center"
                                    >
                                        <Header as="h2" icon>
                                            <Icon name="users" />
                                            Committee
                                        </Header>
                                    </Segment>
                                </a>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link route="/">
                                <a>
                                    <Segment
                                        inverted
                                        color="red"
                                        textAlign="center"
                                    >
                                        <Header as="h2" icon>
                                            <Icon name="factory" />
                                            Manufacturer
                                        </Header>
                                    </Segment>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route="/">
                                <a>
                                    <Segment
                                        inverted
                                        color="brown"
                                        textAlign="center"
                                    >
                                        <Header as="h2" icon>
                                            <Icon name="boxes" />
                                            Wholesaler
                                        </Header>
                                    </Segment>
                                </a>
                            </Link>
                        </Grid.Column>
                        <Grid.Column>
                            <Link route="/">
                                <a>
                                    <Segment
                                        inverted
                                        color="purple"
                                        textAlign="center"
                                    >
                                        <Header as="h2" icon>
                                            <Icon name="shop" />
                                            Retailer
                                        </Header>
                                    </Segment>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as="h2">Certifier Contract Address</Header>
                            <Segment inverted>{address.certifier}</Segment>
                        </Grid.Column>
                        <Grid.Column>
                            <Header as="h2">Factory Contract Address</Header>
                            <Segment inverted>{address.factory}</Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default Index;
