import React from 'react';
import { Table, Button, IconButton } from 'rsuite';
import Contentbox from '../../shared/components/UIElements/Contentbox';
import { AuthContext } from '../../shared/context/auth-context';
import ActionCell from '../components/ActionCellModal';
import DateCell from '../components/DateCell';

const { Column, HeaderCell, Cell } = Table;

class InvestProfitList extends React.Component {
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
        //console.log('invesprofitlist componentdidmount');
        const { userId } = this.context;
        this.setState({ isLoading: true });
        fetch(process.env.REACT_APP_BACKEND_URL + '/investprofit/user/' + userId)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                this.setState({ ...this.state, data: data.investprofits });
                console.log(this.state.data);
            });
        this.setState({ isLoading: false });

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
        console.log('investprofitlist update');
        const { userId } = this.context;
        this.setState({ isLoading: true });
        fetch(process.env.REACT_APP_BACKEND_URL + '/investprofit/user/' + userId)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                this.setState({ ...this.state, data: data.investprofits });
            });
        this.setState({ isLoading: false });
    }

    render() {

        const { shouldRefresh, refresh } = this.context;
        if (shouldRefresh) {
            //console.log("should refresh: " + shouldRefresh);
            refresh(false);
            //console.log('freshed freshed')
            this.getUpdatedData();
        }
        return (
            <Contentbox>
                <div>
                    <Button onClick={this.getUpdatedData} appearance="ghost">Reload Data</Button>
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

                    <Column width={250} sortable resizable>
                        <HeaderCell>Description</HeaderCell>
                        <Cell dataKey="description" />
                    </Column>

                    <Column width={80} sortable resizable>
                        <HeaderCell>Value</HeaderCell>
                        <Cell dataKey="value" />
                    </Column>

                    <Column width={120} sortable resizable>
                        <HeaderCell>Date</HeaderCell>
                        <DateCell dataKey="dateInvestProfit" />
                    </Column>

                    <Column width={80} fixed="right">
                        <HeaderCell>Action</HeaderCell>
                        <ActionCell dataKey={'_id'} updateDataTable={this.getUpdatedData} />
                    </Column>
                </Table>
            </Contentbox>
        );
    }
}

export default InvestProfitList;