import React from 'react';
import { Table, Button, IconButton } from 'rsuite';
import Contentbox from '../../shared/components/UIElements/Contentbox';
import { AuthContext } from '../../shared/context/auth-context';
import ActionCell from '../components/ActionCellModal';
import DateCell from '../components/DateCell';

const { Column, HeaderCell, Cell } = Table;

class StockList extends React.Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            addColumn: false,
            data: [],
            isLoading: false,
        };
        this.handleSortColumn = this.handleSortColumn.bind(this);
    }

    componentDidMount() {
        console.log('stocklist componentdidmount');
        const { userId } = this.context;
        this.setState({ isLoading: true });
        fetch(process.env.REACT_APP_BACKEND_URL + '/stock/user/' + userId)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                this.setState({ ...this.state, data: data.stocks });
                console.log(this.state.data);
            });
        this.setState({ isLoading: false });

    }

    reload() {
        this.componentDidMount()
    }


    getData() {
        const { data, sortColumn, sortType } = this.state;

        if (sortColumn && sortType) {
            return data.sort((a, b) => {
                let x = a[sortColumn];
                let y = b[sortColumn];
                if (typeof x === 'string') {
                    x = x.charCodeAt();
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt();
                }
                if (sortType === 'asc') {
                    return x - y;
                } else {
                    return y - x;
                }
            });
        }
        return data;
    }

    handleSortColumn(sortColumn, sortType) {
        this.setState({
            loading: true
        });

        setTimeout(() => {
            this.setState({
                sortColumn,
                sortType,
                loading: false
            });
        }, 500);
    }

    getUpdatedData = () => {
        console.log('stocklist update');
        const { userId } = this.context;
        this.setState({ isLoading: true });
        fetch(process.env.REACT_APP_BACKEND_URL + '/stock/user/' + userId)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({ data: data.stocks })
            });
        this.setState({ isLoading: false });
    }





    render() {
        return (
            <Contentbox>
                <div>
                    <Button onClick={this.getUpdatedData} appearance="ghost">Refresh Data</Button>
                </div>
                <Table
                    height={420}
                    autoHeight
                    affixHeader
                    data={this.getData()}
                    //data={this.state.data}
                    sortColumn={this.state.sortColumn}
                    sortType={this.state.sortType}
                    onSortColumn={this.handleSortColumn}
                    loading={this.state.loading}
                    onRowClick={data => {
                        //console.log(data);
                    }}
                >
                    <Column width={70} align="center" fixed sortable>
                        <HeaderCell>Id</HeaderCell>
                        <Cell dataKey="sid" />
                    </Column>

                    <Column width={200} sortable resizable>
                        <HeaderCell>Name</HeaderCell>
                        <Cell dataKey="name" />
                    </Column>

                    <Column width={170} sortable resizable>
                        <HeaderCell>(Rs) Value</HeaderCell>
                        <Cell dataKey="value" />
                    </Column>

                    <Column width={150} sortable resizable>
                        <HeaderCell>Status</HeaderCell>
                        <Cell dataKey="gender" />
                    </Column>

                    <Column width={150} sortable resizable>
                        <HeaderCell>Date</HeaderCell>
                        <DateCell dataKey="datePurchase" />
                    </Column>

                    <Column width={80} fixed="right">
                        <HeaderCell>Action</HeaderCell>
                        <ActionCell dataKey={'id'} updateDataTable={this.getUpdatedData} />
                    </Column>
                </Table>
            </Contentbox>
        );
    }
}

export default StockList;