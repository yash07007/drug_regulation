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
    Popup,
} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import SupplyTrack from "../../ethereum/supplyTrack";
import web3 from "../../ethereum/web3";

class ActorList extends Component {
    state = {
        actors: [],
        context: "",
        loading: true,
    };

    loadList = async () => {
        this.setState({
            loading: true,
        });

        const accounts = await web3.eth.getAccounts();
        let clients = await factory.methods.getClients().call();
        clients = clients.filter((x, i, a) => a.indexOf(x) == i);

        const committeAddress = await factory.methods.committeeAddress().call();
        const isCommittee = accounts[0] == committeAddress ? true : false;
        const isManufacturer = clients.indexOf(accounts[0]) >= 0 ? true : false;

        let actors = [];
        if (isCommittee) {
            this.setState({ context: "committee" });
            for (const clientAddress of clients) {
                const actor = await factory.methods
                    .actors(clientAddress)
                    .call();
                actors.push({
                    contractAddress: "",
                    actorAddress: clientAddress,
                    actorName: actor.name,
                });
            }
        } else if (isManufacturer) {
            this.setState({ context: "manufacturer" });
            let contracts = await factory.methods
                .getDeployedContracts(accounts[0])
                .call();
            for (const contractAddress of contracts) {
                const supplyTrack = SupplyTrack(contractAddress);
                const wholesalers = await supplyTrack.methods
                    .getActors("wholesalers")
                    .call();
                for (const wholesalerAddress of wholesalers) {
                    const actor = await supplyTrack.methods
                        .actors(wholesalerAddress)
                        .call();
                    actors.push({
                        contractAddress: contractAddress,
                        actorAddress: wholesalerAddress,
                        actorName: actor.actorName,
                    });
                }
            }
        } else {
            this.setState({ context: "wholesaler" });
            for (const clientAddress of clients) {
                let localContracts = await factory.methods
                    .getDeployedContracts(clientAddress)
                    .call();
                for (const contractAddress of localContracts) {
                    const supplyTrack = SupplyTrack(contractAddress);
                    const actor = await supplyTrack.methods
                        .actors(accounts[0])
                        .call();

                    if (actor.actorName) {
                        const retailers = await supplyTrack.methods
                            .getActors("retailers")
                            .call();
                        for (const retailersAddress of retailers) {
                            const actor = await supplyTrack.methods
                                .actors(retailersAddress)
                                .call();
                            actors.push({
                                contractAddress: contractAddress,
                                actorAddress: retailersAddress,
                                actorName: actor.actorName,
                            });
                        }
                    }
                }
            }
        }

        this.setState({
            actors: actors,
            loading: false,
        });
    };

    renderList() {
        const { Row, Cell, HeaderCell, Header, Body } = Table;
        const { actors, context } = this.state;
        let renderedRows = [];
        for (const actor of actors) {
            renderedRows.push(
                <Row>
                    <Cell hidden={context == "committee"}>
                        <Popup
                            content={actor.contractAddress}
                            trigger={
                                <span>
                                    {actor.contractAddress.slice(0, 15)}....
                                </span>
                            }
                            position="top center"
                            basic
                        />
                    </Cell>
                    <Cell>
                        <Popup
                            content={actor.actorAddress}
                            trigger={
                                <span>
                                    {actor.actorAddress.slice(0, 15)}....
                                </span>
                            }
                            position="top center"
                            basic
                        />
                    </Cell>
                    <Cell>{actor.actorName}</Cell>
                </Row>
            );
        }
        let renderedTable = !renderedRows.length ? (
            <Message>
                <Message.Header>
                    You dont have any registered{" "}
                    {this.state.context == "committee"
                        ? "Manufactuers"
                        : this.state.context == "manufactueres"
                        ? "Wholesalers"
                        : "Retailers"}
                    .
                </Message.Header>
            </Message>
        ) : (
            <Table celled inverted striped textAlign="center">
                <Header>
                    <Row>
                        <HeaderCell hidden={context == "committee"}>
                            Contract Address
                        </HeaderCell>
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
        const { color, head } = this.props;
        return (
            <Grid.Column>
                <Visibility fireOnMount onOnScreen={this.loadList}>
                    <Segment
                        style={{ borderColor: color }}
                        inverted
                        color={color}
                    >
                        <Header as="h3">{head}</Header>
                    </Segment>
                    <Segment style={{ overflow: "auto", maxHeight: 370 }}>
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

export default ActorList;
