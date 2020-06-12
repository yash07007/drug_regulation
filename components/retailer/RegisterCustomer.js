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

class RegisterCustomer extends Component {
    state = {
        errorMessage: "",
        loading: false,
        customerName: "",
        universalProductCode: "",
        batchesBought: 0,
        success: false,
        contracts: [],
    };

    render() {
        const {
            customerName,
            universalProductCode,
            batchesBought,
            errorMessage,
            loading,
            success,
        } = this.state;
        const { color } = this.props;
        return (
            <Tab.Pane style={{ borderColor: color, borderRadius: "5px" }}>
                <Grid columns="equal">
                    <Grid.Row>
                        <Grid.Column>
                            <Segment
                                style={{ borderColor: color }}
                                inverted
                                color={color}
                            >
                                <Header as="h3">Register New Batch</Header>
                            </Segment>
                            <Message icon hidden={!loading} info>
                                <Icon name="circle notched" loading />
                                <Message.Content>
                                    <Message.Header>
                                        Just a moment
                                    </Message.Header>
                                    We are registering your batch.
                                </Message.Content>
                            </Message>
                            <Message icon hidden={!success} success>
                                <Icon name="check square outline" />
                                <Message.Content>
                                    <Message.Header>Success</Message.Header>
                                    Your batch has been sucessfully registered
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
                                    <Form.Group widths="equal">
                                        <Form.Input
                                            fluid
                                            label="Customer Name"
                                            placeholder="Customer Name"
                                            value={customerName}
                                            onChange={(event) =>
                                                this.setState({
                                                    customerName:
                                                        event.target.value,
                                                })
                                            }
                                        />
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
                                    </Form.Group>
                                    <Form.Group widths="equal">
                                        <Form.Input
                                            fluid
                                            type="number"
                                            label="Batches Bought"
                                            placeholder="Batches Bought"
                                            value={batchesBought}
                                            onChange={(event) =>
                                                this.setState({
                                                    batchesBought:
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
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Tab.Pane>
        );
    }
}

export default RegisterCustomer;
