import React, { Component } from "react";
import { Segment, Header, Grid, Icon, GridColumn } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";
import address from "../addresses";

class Index extends Component {
    render() {
        return (
            <Layout>
                <Grid columns="equal" style={{ marginTop: "10px" }}>
                    <Grid.Row>
                        <Grid.Column width={5}>
                            <Segment compact>
                                <Header as="h2">
                                    <Icon.Group>
                                        <Icon name="computer" />
                                    </Icon.Group>
                                    Developer Interface
                                </Header>
                            </Segment>
                        </Grid.Column>
                        {/* <Grid.Column width={11}>
                            <Segment>
                                <Header as="h2">
                                    <Icon.Group>
                                        <Icon name="key" />
                                    </Icon.Group>
                                </Header>
                            </Segment>
                        </Grid.Column> */}
                    </Grid.Row>
                    <Header as="h2">Dashboards</Header>
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
                            <Link route="/committee">
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
                            <Link route="/manufacturer">
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
                            <Link route="/wholesaler">
                                <a>
                                    <Segment
                                        inverted
                                        color="green"
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
