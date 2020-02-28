import React, { useEffect, useCallback, useState } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './user/pages/Login';
import Register from './user/pages/Register';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext, initialState, reducer } from './shared/context/auth-context';
import StockList from './stock/pages/StockList';
import InvestProfitList from './investprofit/pages/InvestProfitList';
import Allinfo from './shared/Allinfo';

import 'rsuite/lib/styles/index.less';
import './App.css';

const App = () => {

    let routes = null;

    const [state, dispatch] = React.useReducer(reducer, initialState);

    const login = useCallback((uid, token) => {
        console.log("userid: " + uid);
        dispatch({
            type: "LOGIN",
            payload: {
                userId: uid,
                token: token
            }
        });
    }, []);

    const logout = useCallback(() => {
        dispatch({
            type: "LOGOUT"
        });
    }, []);

    const refresh = useCallback((r) => {
        console.log('refreshed');
        dispatch({
            type: "REFRESH",
            payload: {
                refreshVal: r
            }
        });
    }, []);


    useEffect(() => {
        const storedUserId = localStorage.getItem('userls');
        const storedToken = localStorage.getItem('tokenls');
        if (storedToken && storedUserId) {
            login(storedUserId, storedToken);
        }
    }, [login]);

    //const [refresh, setRefresh] = useState(false)

    if (state.token) {
        routes = (
            <Router>
                <MainNavigation />
                <Switch>
                    <Route path="/investmentsprofits" >
                        <InvestProfitList />
                    </Route>
                    <Route path="/goats">
                        <StockList />
                    </Route>
                    <Route path="/" exact>
                        <Allinfo />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </Router>
        );
    } else {
        routes = (
            <Router>
                <Switch>
                    <Route path="/registerzb" exact>
                        <Register />
                    </Route>
                    <Route path="/" exact>
                        <Login />
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </Router>
        );
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn: state.isAuthenticated, token: state.token, userId: state.userId, login, logout, refresh, shouldRefresh: state.refresh }} >
            {routes}
        </AuthContext.Provider>
    );
}

export default App;
