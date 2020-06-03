import React, { Component } from "react";
import factory from "../../ethereum/factory";
import { Visibility, Tab, Message, Icon } from "semantic-ui-react";
import Layout from "../../components/Layout";
import RegisterManufacturer from "../../components/committee/RegisterManufacturer";
import Statistics from "../../components/committee/Statistics";
import web3 from "../../ethereum/web3";
import NavHead from "../../components/NavHead";

class CertifierIndex extends Component {
    state = {
        errorMessage: "",
        loading: false,
        myAddress: "",
    };

    async loadMyAddress() {
        const accounts = await web3.eth.getAccounts();
        const myAccount = accounts[0];
        const committeeAddress = await factory.methods
            .committeeAddress()
            .call();

        if (myAccount != committeeAddress) {
            this.setState({
                errorMessage: "You are not authorized to committee interface",
            });
        }
        this.setState({ myAddress: myAccount });
    }

    render() {
        const { myAddress, errorMessage } = this.state;
        const panes = [
            {
                menuItem: "Statistics",
                render: () => <Statistics />,
            },
            {
                menuItem: "Register Manufacturer",
                render: () => <RegisterManufacturer />,
            },
            {
                menuItem: "Deployed Contracts",
                render: () => <h1>Deployed Contracts</h1>,
            },
        ];
        return (
            <Layout>
                <center>
                    <Visibility
                        fireOnMount
                        onOnScreen={this.loadMyAddress.bind(this)}
                    >
                        <NavHead
                            name="Committee"
                            address={myAddress}
                            icon="users"
                            color="blue"
                        />
                    </Visibility>
                    <Message icon hidden={!errorMessage} error>
                        <Icon name="warning sign" />
                        <Message.Content>
                            <Message.Header>Error</Message.Header>
                            {errorMessage}
                        </Message.Content>
                    </Message>
                    <Tab
                        menu={{
                            color: "blue",
                            secondary: true,
                            pointing: true,
                        }}
                        hidden={!!errorMessage}
                        panes={panes}
                        style={{ marginTop: "20px" }}
                    />
                </center>
            </Layout>
        );
    }
}

export default CertifierIndex;
