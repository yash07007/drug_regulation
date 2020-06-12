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
import ActorList from "../committee/ActorList";

class RegisterWholesaler extends Component {
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
                    .registerWholesaler(walletAddress, name)
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
        this.setState({ loading: false });
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
                        <ActorList
                            color={color}
                            head="Registered Wholesalers"
                        />
                        <Grid.Column>
                            <Segment
                                style={{ borderColor: color }}
                                inverted
                                color={color}
                            >
                                <Header as="h3">Register Wholesaler</Header>
                            </Segment>
                            <Message icon hidden={!processLoading} info>
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

export default RegisterWholesaler;
