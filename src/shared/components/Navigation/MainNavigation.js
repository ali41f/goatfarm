import React, { useState } from 'react';
import './MainNavigation.css';
import NavLinks from './NavLinks';
import { Navbar, Sidenav } from 'rsuite';
import { slide as SidebarMenu } from 'react-burger-menu';


const styles = {
    width: '100%',
    display: 'inline-table',
    marginRight: 0
};

const SidenavInstance = ({ onSelect, activeKey, ...props }) => {

    const menuCloseHandler = () => {
        let element = document.getElementsByClassName("bm-overlay")[0];
        element.click();
    }

    return (
        <div style={styles}>
            <Sidenav {...props}>
                <Sidenav.Body>
                    <NavLinks closeMenu={menuCloseHandler} activeKey={activeKey} />
                </Sidenav.Body>
            </Sidenav>
        </div>
    );
};


const NavBarInstance = ({ onSelect, activeKey, ...props }) => {
    const menuCloseHandler = () => { }
    return (
        <Navbar {...props}>
            <Navbar.Body>
                <NavLinks activeKey={activeKey} closeMenu={menuCloseHandler} />
            </Navbar.Body>
        </Navbar>
    );
};


const MainNavigation = props => {

    const [activeKey, setActiveKey] = useState(1);


    const handleSelect = (eventKey) => {
        setActiveKey({
            activeKey: eventKey
        });
    }


    return (
        <React.Fragment>

            <SidebarMenu>
                <div className="nav-wrapper">
                    <SidenavInstance appearance="default" activeKey={activeKey} onSelect={handleSelect} />
                </div>
            </SidebarMenu>

            <div className="nav-wrapper">
                <NavBarInstance className="desktopMenu" appearance="default" activeKey={activeKey} onSelect={handleSelect} />
            </div>


        </React.Fragment>
    );
}

export default MainNavigation;