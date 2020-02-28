import React, { useState, useEffect, useContext } from 'react';
import { Timeline, Icon, FlexboxGrid, Col } from 'rsuite';
import Moment from 'react-moment';
import { AuthContext } from './context/auth-context';
import Contentbox from './components/UIElements/Contentbox'

import './Allinfo.css'

const Allinfo = (props) => {

    const auth = useContext(AuthContext);

    const [data, setData] = useState({})
    const [statsData, setStatsData] = useState({
        stockValue: 0,
        investmentValue: 0,
        profitValue: 0
    })

    if (auth.shouldRefresh) {
        auth.refresh(false);
        console.log('freshed freshed')
        fetch(process.env.REACT_APP_BACKEND_URL + '/allinfo/user/' + auth.userId)
            .then(response => response.json())
            .then(data => {
                console.log('refreshed data')
                const renamedDatainfo = renameObjectKeys(data.allinfo)
                const sortedDateinfo = renamedDatainfo.sort((a, b) => new Date(a.datePurchase).getTime() - new Date(b.datePurchase).getTime())
                setStatsData({
                    stockValue: 0,
                    investmentValue: 0,
                    profitValue: 0
                })
                setData(sortedDateinfo);
                calculateStats(sortedDateinfo);
            });
    }
    /*
        let stockValue = 0
        let investmentValue = 0
        let totalProfit = 0
    */
    const renameObjectKeys = (datainfo) => {
        let datainfoNew = [];
        let i = 0;
        datainfo.map((d) => {
            datainfoNew.push(d)
            if (d.dateInvestProfit) {
                datainfoNew[i].datePurchase = d.dateInvestProfit
                //console.log(datainfoNew[i].datePurchase)
            }
            i++
        });
        //console.log(datainfoNew)
        return datainfoNew
    }

    useEffect(() => {
        fetch(process.env.REACT_APP_BACKEND_URL + '/allinfo/user/' + auth.userId)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                const renamedDatainfo = renameObjectKeys(data.allinfo)
                const sortedDateinfo = renamedDatainfo.sort((a, b) => new Date(a.datePurchase).getTime() - new Date(b.datePurchase).getTime())
                setData(sortedDateinfo);
                calculateStats(sortedDateinfo);
            });
    }, []);

    const calculateStats = (sortedDateinfo) => {
        sortedDateinfo.map((item, index) => {
            if (item.dateInvestProfit && item.value > 0) {
                setStatsData((prevState) => ({
                    ...prevState,
                    profitValue: prevState.profitValue - (-item.value)
                }))
            } else if (item.dateInvestProfit && item.value <= 0) {
                setStatsData((prevState) => ({
                    ...prevState,
                    investmentValue: prevState.investmentValue + (-item.value)
                }))
            } else if (item.name) {
                setStatsData((prevState) => ({
                    ...prevState,
                    stockValue: prevState.stockValue + item.value
                }))
            }

        })
    }

    const renderTimelineItem = (item, index) => {
        //console.log("here");
        if (item.dateInvestProfit && item.value > 0) {
            return (
                <Timeline.Item key={index} dot=
                    {<Icon size="2x" icon="plus" size="2x" style={{ background: '#15b215', color: '#fff' }} />}>
                    <p><strong>Profit Date:</strong> <Moment format="DD-MM-YYYY">{item.datePurchase}</Moment></p>
                    <p>{item.description}</p>
                    <p>Profit: Rs. {item.value}</p>
                </Timeline.Item>
            )
        } else if (item.dateInvestProfit && item.value <= 0) {
            //investmentValue = investmentValue - (-item.value)
            return (
                <Timeline.Item key={index} dot=
                    {<Icon size="2x" icon="minus" size="2x" style={{ background: 'rgb(188, 112, 34)', color: '#fff' }} />}>
                    <p><strong>Investment Date:</strong> <Moment format="DD-MM-YYYY">{item.datePurchase}</Moment></p>
                    <p>{item.description}</p>
                    <p>Investment: Rs. {-item.value}</p>
                </Timeline.Item>
            )
        } else if (item.name) {
            //stockValue = stockValue + item.value
            return (<Timeline.Item key={index} dot=
                {<Icon icon="google" size="2x" style={{ background: 'rgb(34, 117, 188)', color: '#fff' }} />}>
                <p><strong>Goat purchased:</strong> <Moment format="DD-MM-YYYY">{item.datePurchase}</Moment></p>
                <p>{item.name}</p>
                <p>Price: Rs. {item.value}</p>
            </Timeline.Item>
            )
        }

    }


    return (
        <Contentbox><br />
            <div className="show-grid">
                <FlexboxGrid justify="space-around">
                    <FlexboxGrid.Item className="statBox" componentClass={Col} colspan={24} xs={6}>
                        GOAT VALUE<br /> {statsData.stockValue}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="statBox" componentClass={Col} colspan={24} xs={6}>
                        INVESTMENT<br /> {statsData.investmentValue}
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item className="statBox" componentClass={Col} colspan={24} xs={6}>
                        PROFIT<br /> {statsData.profitValue - statsData.investmentValue - statsData.stockValue}
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            </div>
            <br />
            <Timeline className="custom-timeline">
                {
                    data.length ? data.map((item, index) => {
                        return renderTimelineItem(item, index)
                    }) : null

                }
            </Timeline>

        </Contentbox>
    );
};

export default Allinfo;