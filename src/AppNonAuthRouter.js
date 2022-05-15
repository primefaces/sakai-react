import React, { Component, Fragment } from "react";
import { Route, Redirect, Switch } from 'react-router-dom'
import Login from "./pages/login/Index";

class AuthNonRouter extends Component {
    render() {
        return (
            <Fragment>
                <Switch>
                    <Route path="/login" exact component={Login} />
                    <Route path="*" render={() => <Redirect to="/login" />} />
                </Switch>
            </Fragment>
        )
    }
}

export default AuthNonRouter