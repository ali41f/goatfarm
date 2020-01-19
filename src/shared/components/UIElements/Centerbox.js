import React from 'react';

import './Centerbox.css';

const Centerbox = props => {
    return (
        <div className={`ali-centerbox ${props.className}`} style={props.style}>
            {props.children}
        </div>
    );
};

export default Centerbox;
