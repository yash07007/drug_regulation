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
import ActorList from "./ActorList";
import web3 from "../../ethereum/web3";

class RegisterManufacturer extends Component {
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
        const { name, walletAddress } = this.state;
        this.setState({ loading: true, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.registerActor(walletAddress, name).send({
                from: accounts[0],
            });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({
            name: "",
            walletAddress: "",
            loading: false,
        });
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    };

    render() {
        const {
            name,
            walletAddress,
            loading,
            success,
            errorMessage,
        } = this.state;
        return (
            <Tab.Pane style={{ borderColor: "blue", borderRadius: "5px" }}>
                <Grid columns="equal">
                    <Grid.Row>
                        <ActorList
                            color="blue"
                            head="Registered Manufacturers"
                        />
                        <Grid.Column>
                            <Segment
                                style={{ borderColor: "blue" }}
                                inverted
                                color="blue"
                            >
                                <Header as="h3">Register Manufacturer</Header>
                            </Segment>
                            <Message icon hidden={!loading} info>
                                <Icon name="circle notched" loading />
                                <Message.Content>
                                    <Message.Header>
                                        Just a moment
                                    </Message.Header>
                                    We are registering new Manufacturer to
                                    Blockchain.
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!success} success>
                                <Icon name="check square outline" />
                                <Message.Content>
                                    <Message.Header>Success</Message.Header>
                                    New Manufacturer is sucessfully registered
                                </Message.Content>
                            </Message>
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
                                    <Button type="submit" fluid primary>
                                        Submit
                                    </Button>
                                </Form>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Tab.Pane>
        );
    }
}

export default RegisterManufacturer;
