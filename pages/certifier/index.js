import React, { Component } from "react";
import certifier from "../../ethereum/certifier";
import { Visibility, Tab, Message, Icon } from "semantic-ui-react";
import Layout from "../../components/Layout";
import ProcessCertificates from "../../components/certifier/ProcessCertificates";
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
        const certifirAccount = await certifier.methods.manager().call();

        if (myAccount != certifirAccount) {
            this.setState({
                errorMessage: "You are not authorized to certifer interface",
            });
        }
        this.setState({ myAddress: myAccount });
    }

    render() {
        const { myAddress, errorMessage } = this.state;
        const panes = [
            {
                menuItem: "Process Certificates",
                render: () => <ProcessCertificates />,
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
                            name="Certifier"
                            address={myAddress}
                            icon="signup"
                            color="yellow"
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
                            color: "yellow",
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
