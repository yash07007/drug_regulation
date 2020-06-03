import React, { Component } from "react";
import { Tab, Visibility } from "semantic-ui-react";
import Layout from "../../components/Layout";
import NavHead from "../../components/NavHead";
import ProductCertification from "../../components/manufacturer/ProductCertification";
import BatchRegistration from "../../components/manufacturer/BatchRegistration";
import RegisterWholesaler from "../../components/manufacturer/RegisterWholesaler";
import RequestLogs from "../../components/manufacturer/logs/RequestLogs";
import InvoiceLogs from "../../components/manufacturer/logs/InvoiceLogs";

import web3 from "../../ethereum/web3";

class CertificateInventory extends Component {
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
        const { myAddress } = this.state;
        const panes = [
            {
                menuItem: "Batch Registration",
                render: () => <BatchRegistration color="red" />,
            },
            {
                menuItem: "Register Wholesaler",
                render: () => <RegisterWholesaler color="red" />,
            },
            {
                menuItem: "Product Certification",
                render: () => <ProductCertification color="red" />,
            },
            {
                menuItem: "Purchase Requests",
                render: () => <RequestLogs type="recieved" color="red" />,
            },
            {
                menuItem: "Invoices",
                render: () => <InvoiceLogs type="sent" color="red" />,
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
                            name="Manufacturer"
                            address={myAddress}
                            icon="factory"
                            color="red"
                        />
                    </Visibility>

                    <Tab
                        menu={{
                            color: "red",
                            secondary: true,
                            pointing: true,
                        }}
                        panes={panes}
                        style={{ marginTop: "20px" }}
                        // defaultActiveIndex={4}
                    />
                </center>
            </Layout>
        );
    }
}

export default CertificateInventory;
