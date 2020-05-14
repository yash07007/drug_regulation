import React, { Component } from "react";
import { Header } from "semantic-ui-react";
import Layout from "../../components/Layout";
import { Link } from "../../routes";

class CertifierIndex extends Component {
    render() {
        return (
            <Layout>
                <Header as="h1">Certifier Dashboard</Header>
            </Layout>
        );
    }
}

export default CertifierIndex;
