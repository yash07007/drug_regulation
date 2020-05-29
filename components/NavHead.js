import React, { Component } from "react";
import { Grid, Segment, Header, Icon } from "semantic-ui-react";

class NavHead extends Component {
    render() {
        const { Row, Column } = Grid;
        const { name, address, icon, color } = this.props;
        return (
            <Grid columns="equal" style={{ marginTop: "10px" }}>
                <Row>
                    <Column width={6}>
                        <Segment
                            compact
                            style={{ borderColor: color }}
                            floated="left"
                        >
                            <Header as="h2">
                                <Icon.Group>
                                    <Icon name={icon} />
                                </Icon.Group>
                                {name} Interface
                            </Header>
                        </Segment>
                    </Column>
                    <Column width={10}>
                        <Segment
                            style={{ borderColor: color }}
                            floated="right"
                            compact
                        >
                            <Header as="h4">
                                <Icon name="qrcode" />
                                {address}
                            </Header>
                        </Segment>
                    </Column>
                </Row>
            </Grid>
        );
    }
}

export default NavHead;
