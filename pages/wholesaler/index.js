import React, { Component } from "react";
import { Visibility, Tab, Message, Icon } from "semantic-ui-react";
import Layout from "../../components/Layout";
import InvoiceLogs from "../../components/manufacturer/logs/InvoiceLogs";
import RequestLogs from "../../components/manufacturer/logs/RequestLogs";
import Catalouge from "../../components/wholesaler/Catalouge";
import RegisterRetailer from "../../components/wholesaler/RegisterRetailer";
import web3 from "../../ethereum/web3";
import NavHead from "../../components/NavHead";

class WholesalerIndex extends Component {
    state = {
        errorMessage: "",
        loading: false,
        myAddress: "",
    };

    async loadMyAddress() {
        const accounts = await web3.eth.getAccounts();
        const myAccount = accounts[0];
        this.setState({ myAddress: myAccount });
    }

    render() {
        const { myAddress, errorMessage } = this.state;
        const panes = [
            {
                menuItem: "Market",
                render: () => <Catalouge color="green" />,
            },
            {
                menuItem: "Register Retailer",
                render: () => <RegisterRetailer color="green" />,
            },
            {
                menuItem: "Sent Purchase Requests",
                render: () => <RequestLogs type="sent" color="green" />,
            },
            {
                menuItem: "Recieved Invoices",
                render: () => <InvoiceLogs type="recieved" color="green" />,
            },
            {
                menuItem: "Recieved Purchase Requests",
                render: () => <RequestLogs type="recieved" color="green" />,
            },
            {
                menuItem: "Sent Invoices",
                render: () => <InvoiceLogs type="sent" color="green" />,
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
                            name="Wholesaler"
                            address={myAddress}
                            icon="boxes"
                            color="green"
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
                            color: "green",
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

export default WholesalerIndex;
