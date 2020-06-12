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
    Visibility,
    Dropdown,
} from "semantic-ui-react";
import factory from "../../ethereum/factory";
import SupplyTrack from "../../ethereum/supplyTrack";
import web3 from "../../ethereum/web3";
import ActorList from "../committee/ActorList";

class RegisterRetailer extends Component {
    state = {
        errorMessage: "",
        loading: false,
        processLoading: false,
        name: "",
        walletAddress: "",
        // contractAddresses: "",
        contractOptions: [],
        success: false,
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const { name, walletAddress, value } = this.state;
        this.setState({ processLoading: true, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            for (const contractAddress of value) {
                const supplyTrack = SupplyTrack(contractAddress);
                await supplyTrack.methods
                    .registerRetailer(walletAddress, name)
                    .send({
                        from: accounts[0],
                    });
            }
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({
            name: "",
            walletAddress: "",
            // contractAddresses: "",
            processLoading: false,
        });
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    };

    handleDropdownChange = (e, { value }) => this.setState({ value });

    loadContractAddresses = async () => {
        this.setState({
            loading: true,
        });
        const accounts = await web3.eth.getAccounts();
        let clients = await factory.methods.getClients().call();
        clients = clients.filter((x, i, a) => a.indexOf(x) == i);
        let contracts = [];

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
                    contracts.push(contractAddress);
                }
            }
        }

        const contractOptions = [];
        for (const contract of contracts) {
            contractOptions.push({
                key: contract,
                text: contract,
                value: contract,
            });
        }
        this.setState({
            contractOptions: contractOptions,
            loading: false,
        });
    };

    render() {
        const {
            name,
            walletAddress,
            value,
            contractOptions,
            loading,
            processLoading,
            success,
            errorMessage,
        } = this.state;
        const { color } = this.props;
        return (
            <Tab.Pane style={{ borderColor: color, borderRadius: "5px" }}>
                <Grid columns="equal">
                    <Grid.Row>
                        <ActorList color={color} head="Registered Retailers" />
                        <Grid.Column>
                            <Segment
                                style={{ borderColor: color }}
                                inverted
                                color={color}
                            >
                                <Header as="h3">Register Retailer</Header>
                            </Segment>
                            <Message icon hidden={!processLoading} info>
                                <Icon name="circle notched" loading />
                                <Message.Content>
                                    <Message.Header>
                                        Just a moment
                                    </Message.Header>
                                    We are registering new Retailer to
                                    Blockchain.
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!success} success>
                                <Icon name="check square outline" />
                                <Message.Content>
                                    <Message.Header>Success</Message.Header>
                                    New Retailer is sucessfully registered
                                </Message.Content>
                            </Message>
                            <Visibility
                                fireOnMount
                                onOnScreen={this.loadContractAddresses}
                            >
                                <Segment textAlign="left">
                                    <Form
                                        onSubmit={this.onSubmit}
                                        error={!!errorMessage}
                                        loading={processLoading}
                                    >
                                        <Message
                                            error
                                            header="Error!"
                                            content={errorMessage}
                                        />
                                        <Form.Input
                                            fluid
                                            label="Name"
                                            placeholder="Name"
                                            value={name}
                                            onChange={(event) =>
                                                this.setState({
                                                    name: event.target.value,
                                                })
                                            }
                                        />
                                        <Form.Input
                                            fluid
                                            label="Wallet Address"
                                            placeholder="Wallet Address"
                                            value={walletAddress}
                                            onChange={(event) =>
                                                this.setState({
                                                    walletAddress:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <Form.Field
                                            label="Contract"
                                            control={Dropdown}
                                            fluid
                                            multiple
                                            onChange={this.handleDropdownChange}
                                            selection
                                            clearable
                                            options={contractOptions}
                                            placeholder="Select Contract"
                                            value={value}
                                        />
                                        <Button type="submit" fluid primary>
                                            Submit
                                        </Button>
                                    </Form>
                                </Segment>
                            </Visibility>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Tab.Pane>
        );
    }
}

export default RegisterRetailer;
