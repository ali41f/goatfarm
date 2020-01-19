import React from 'react';

import './Contentbox.css';

const Contentbox = props => {
    return (
        <div className={`ali-contentbox ${props.className}`} style={props.style}>
            {props.children}
        </div>
    );
};

export default Contentbox;
