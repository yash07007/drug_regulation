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
} from "semantic-ui-react";
import certifier from "../../ethereum/certifier";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import CertificateInventory from "./inventory/CertificateInventory";

class ProductCertification extends Component {
    state = {
        errorMessage: "",
        loading: false,
        name: "",
        productName: "",
        universalProductCode: "",
        productDescription: "",
        success: false,
    };

    loadName = async (event) => {
        const accounts = await web3.eth.getAccounts();
        const actor = await factory.methods.actors(accounts[0]).call();
        const name = actor.name;
        if (name) {
            this.setState({
                name: name,
            });
        } else {
            this.setState({
                errorMessage:
                    "Your address in not registered by any Regulatory Committe.",
            });
        }
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const {
            name,
            productName,
            productDescription,
            universalProductCode,
        } = this.state;
        this.setState({ loading: true, errorMessage: "" });
        try {
            const accounts = await web3.eth.getAccounts();
            await certifier.methods
                .registerRequest(
                    name,
                    productName,
                    universalProductCode,
                    productDescription
                )
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei("0.1", "ether"),
                });
            this.setState({ success: true });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
        this.setState({
            productName: "",
            universalProductCode: "",
            productDescription: "",
            loading: false,
        });
        setTimeout(() => {
            this.setState({ success: false });
        }, 4000);
    };

    render() {
        const {
            name,
            productName,
            productDescription,
            universalProductCode,
            errorMessage,
            loading,
            success,
        } = this.state;
        const { color } = this.props;
        return (
            <Tab.Pane style={{ borderColor: color, borderRadius: "5px" }}>
                <Grid columns="equal">
                    <Grid.Row>
                        <CertificateInventory color={color} />
                        <Grid.Column>
                            <Segment
                                style={{ borderColor: color }}
                                inverted
                                color={color}
                            >
                                <Header as="h3">
                                    Request Product Certification
                                </Header>
                            </Segment>
                            <Message icon hidden={!loading} info>
                                <Icon name="circle notched" loading />
                                <Message.Content>
                                    <Message.Header>
                                        Just a moment
                                    </Message.Header>
                                    We are registering your certificate.
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!success} success>
                                <Icon name="check square outline" />
                                <Message.Content>
                                    <Message.Header>Success</Message.Header>
                                    Your Product has been sucessfully registered
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!errorMessage} error>
                                <Icon name="warning sign" />
                                <Message.Content>
                                    <Message.Header>Error</Message.Header>
                                    {errorMessage}
                                </Message.Content>
                            </Message>
                            <Visibility fireOnMount onOnScreen={this.loadName}>
                                <Segment textAlign="left">
                                    <Form
                                        onSubmit={this.onSubmit}
                                        loading={loading}
                                        hidden={!!errorMessage}
                                    >
                                        <Form.Group widths="equal">
                                            <Form.Input
                                                fluid
                                                label="Name"
                                                placeholder="Name"
                                                readOnly
                                                value={name}
                                            />
                                            <Form.Input
                                                fluid
                                                label="Product Name"
                                                placeholder="Product Name"
                                                value={productName}
                                                onChange={(event) =>
                                                    this.setState({
                                                        productName:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Group>
                                        <Form.Input
                                            fluid
                                            label="Universal Product Code"
                                            placeholder="Universal Product Code"
                                            value={universalProductCode}
                                            onChange={(event) =>
                                                this.setState({
                                                    universalProductCode:
                                                        event.target.value,
                                                })
                                            }
                                        />
                                        <Form.Group widths="equal">
                                            <Form.TextArea
                                                label="Product Description"
                                                placeholder="Product Description"
                                                value={productDescription}
                                                onChange={(event) =>
                                                    this.setState({
                                                        productDescription:
                                                            event.target.value,
                                                    })
                                                }
                                            />
                                        </Form.Group>
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

export default ProductCertification;
