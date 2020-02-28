import React, { useContext, useState } from 'react';
import { Nav, Icon } from 'rsuite';
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/auth-context';
import AddStockModal from '../../../stock/components/AddStockModal';
import AddInvestProfitModal from '../../../investprofit/components/AddInvestProfitModal';
import { Modal } from 'rsuite';


const NavLinks = props => {

    const auth = useContext(AuthContext);

    const [show, setShow] = useState(false);
    const [showIPmodal, setShowIPmodal] = useState(false);
    const [profitMode, setProfitMode] = useState(true); // if false it's investment mode

    const open = () => {
        setShow(true);
    }

    const close = () => {
        setShow(false);
    }

    const openIPmodal = (pMode) => {
        setShowIPmodal(true);
        setProfitMode(pMode);
    }

    const closeIPmodal = () => {
        setShowIPmodal(false);
    }

    return (
        <React.Fragment>
            <Nav activeKey={props.activeKey}>
                <Nav.Item eventKey="1" to="/" componentClass={Link} onClick={props.closeMenu} icon={<Icon icon="home" />}> Home</Nav.Item>
                <Nav.Item eventKey="2" onClick={() => { props.closeMenu(); open(); }}>Add Goat</Nav.Item>
                <Nav.Item eventKey="3" onClick={() => { props.closeMenu(); openIPmodal(true); }}>Add Profit</Nav.Item>
                <Nav.Item eventKey="4" onClick={() => { props.closeMenu(); openIPmodal(false); }}>Add Investment</Nav.Item>
                <Nav.Item eventKey="5" to="/goats" componentClass={Link} onClick={props.closeMenu} >Goats</Nav.Item>
                <Nav.Item eventKey="6" to="/investmentsprofits" componentClass={Link} onClick={props.closeMenu} >Investments and profits</Nav.Item>
            </Nav>

            <Nav pullRight>
                <Nav.Item onClick={auth.logout} icon={<Icon icon="cog" />}>Logout</Nav.Item>
            </Nav>
            <Modal show={show} onHide={close} >
                <AddStockModal close={close} />
            </Modal>
            <Modal show={showIPmodal} onHide={closeIPmodal} >
                <AddInvestProfitModal close={closeIPmodal} profitMode={profitMode} />
            </Modal>
        </React.Fragment>
    )


};

export default NavLinks;