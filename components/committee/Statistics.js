import React, { Component } from "react";
import {
    Header,
    Segment,
    Button,
    Form,
    Tab,
    Message,
    Icon,
    Grid,
} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import address from "../../addresses";

class Statistics extends Component {
    state = {};

    render() {
        const { Row, Column } = Grid;
        return (
            <Tab.Pane style={{ borderColor: "blue", borderRadius: "5px" }}>
                <Grid columns="equal">
                    <Row>
                        <Column>
                            <Segment
                                style={{ borderColor: "blue" }}
                                inverted
                                color="blue"
                            >
                                <Header as="h3">Statistics</Header>
                            </Segment>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <Header as="h2">Certifier Contract Address</Header>
                            <Segment inverted>{address.certifier}</Segment>
                        </Column>
                        <Column>
                            <Header as="h2">Factory Contract Address</Header>
                            <Segment inverted>{address.factory}</Segment>
                        </Column>
                    </Row>
                </Grid>
            </Tab.Pane>
        );
    }
}

export default Statistics;
