import React, { Component } from "react";
import {
    Header,
    Segment,
    Grid,
    Visibility,
    Placeholder,
    Loader,
    Dimmer,
    Button,
    Message,
    Table,
} from "semantic-ui-react";
import factory from "../../ethereum/factory";

class ManufactuerList extends Component {
    state = {
        inventory: {},
        loading: true,
    };

    loadList = async () => {
        this.setState({
            loading: true,
        });

        let clients = await factory.methods.getClients().call();
        clients = clients.filter((x, i, a) => a.indexOf(x) == i);
        let actors = {};
        for (const client of clients) {
            const actor = await factory.methods.actors(client).call();
            actors[client] = actor;
        }

        this.setState({
            actors: actors,
            loading: false,
        });
    };

    renderList() {
        const { Row, Cell, HeaderCell, Header, Body } = Table;
        const { actors } = this.state;
        let renderedRows = [];
        for (const actorAddress in actors) {
            const actor = actors[actorAddress];

            renderedRows.push(
                <Row>
                    <Cell>{actorAddress}</Cell>
                    <Cell>{actor.name}</Cell>
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
            <Table celled inverted striped textAlign="center">
                <Header>
                    <Row>
                        <HeaderCell>Actor Address</HeaderCell>
                        <HeaderCell>Actor Name</HeaderCell>
                    </Row>
                </Header>
                <Body>{renderedRows}</Body>
            </Table>
        );
        return renderedTable;
    }

    render() {
        const { loading } = this.state;
        const { color } = this.props;
        return (
            <Grid.Column>
                <Visibility fireOnMount onOnScreen={this.loadList}>
                    <Segment
                        style={{ borderColor: color }}
                        inverted
                        color={color}
                    >
                        <Header as="h3">Resgistered Manufacturers</Header>
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
                                <Button fluid onClick={this.loadList}>
                                    Refresh
                                </Button>
                                {this.renderList()}
                            </div>
                        )}
                    </Segment>
                </Visibility>
            </Grid.Column>
        );
    }
}

export default ManufactuerList;
