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
import Inventory from "./inventory/Inventory";

class RegisterWholesaler extends Component {
    state = {
        errorMessage: "",
        loading: false,
        name: "",
        walletAddress: "",
        contractAddress: "",
        contractOptions: [],
        success: false,
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const { name, walletAddress, contractAddress } = this.state;
        const supplyTrack = SupplyTrack(contractAddress);
        this.setState({ loading: true, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            await supplyTrack.methods
                .registerWholesaler(walletAddress, name)
                .send({
                    from: accounts[0],
                });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({
            name: "",
            walletAddress: "",
            contractAddress: "",
            loading: false,
        });
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    };

    loadContractAddresses = async () => {
        const accounts = await web3.eth.getAccounts();
        const contracts = await factory.methods
            .getDeployedContracts(accounts[0])
            .call();
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
        });
    };

    render() {
        const {
            name,
            walletAddress,
            contractAddress,
            contractOptions,
            loading,
            success,
            errorMessage,
        } = this.state;
        return (
            <Tab.Pane style={{ borderColor: "red", borderRadius: "5px" }}>
                <Grid columns="equal">
                    <Grid.Row>
                        <Inventory head="Contracts Summary" />
                        <Grid.Column>
                            <Segment
                                style={{ borderColor: "red" }}
                                inverted
                                color="red"
                            >
                                <Header as="h3">Register Wholesaler</Header>
                            </Segment>
                            <Message icon hidden={!loading} info>
                                <Icon name="circle notched" loading />
                                <Message.Content>
                                    <Message.Header>
                                        Just a moment
                                    </Message.Header>
                                    We are registering new Wholesaler to
                                    Blockchain.
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!success} success>
                                <Icon name="check square outline" />
                                <Message.Content>
                                    <Message.Header>Success</Message.Header>
                                    New Wholesaler is sucessfully registered
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
                                        loading={loading}
                                    >
                                        <Message
                                            error
                                            header="Error!"
                                            content={errorMessage}
                                        />
                                        <Form.Group widths="equal">
                                            <Form.Input
                                                fluid
                                                label="Name"
                                                placeholder="Name"
                                                value={name}
                                                onChange={(event) =>
                                                    this.setState({
                                                        name:
                                                            event.target.value,
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
                                        </Form.Group>
                                        <Form.Field
                                            label="Contract"
                                            control={Dropdown}
                                            fluid
                                            selection
                                            clearable
                                            options={contractOptions}
                                            placeholder="Select Contract"
                                            value={contractAddress}
                                            onChange={(e, { value }) =>
                                                this.setState({
                                                    contractAddress: value,
                                                })
                                            }
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

export default RegisterWholesaler;
