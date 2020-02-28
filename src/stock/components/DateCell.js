import React from 'react';
import { Table } from 'rsuite';
import Moment from 'react-moment';
import 'moment-timezone';

const { Cell } = Table;

const DateCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props}>
        <Moment format="DD-MM-YYYY">{rowData[dataKey]}</Moment>
        {
            //Date.parse(rowData[dataKey])
        }
    </Cell>
);

export default DateCell;