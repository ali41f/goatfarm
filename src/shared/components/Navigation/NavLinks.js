import React from 'react';
import { Nav, Icon } from 'rsuite';

const NavLinks = props => {

    return (
        <React.Fragment>
            <Nav activeKey={props.activeKey}>
                <Nav.Item eventKey="1" icon={<Icon icon="home" />}> Home</Nav.Item>
                <Nav.Item eventKey="2">Add Items</Nav.Item>
                <Nav.Item eventKey="3">Products</Nav.Item>
            </Nav>
            <Nav pullRight>
                <Nav.Item icon={<Icon icon="cog" />}>Logout</Nav.Item>
            </Nav>
        </React.Fragment>
    )
};

export default NavLinks;