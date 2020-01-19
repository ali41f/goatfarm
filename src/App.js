import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import Login from './user/pages/Login';
import Register from './user/pages/Register';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext, initialState, reducer } from './shared/context/auth-context';

import 'rsuite/lib/styles/index.less';



const App = () => {

    const [state, dispatch] = React.useReducer(reducer, initialState);

    return (
        <AuthContext.Provider
            value={{
                state,
                dispatch
            }}
        >
            <Router>
                <MainNavigation />
                <Switch>
                    <Route path="/" exact>
                        frontpage
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Redirect to="/" />
                </Switch>

            </Router>
        </AuthContext.Provider>
    );
}

export default App;
