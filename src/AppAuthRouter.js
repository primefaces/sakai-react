import React, { Component } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';

import Crud from './pages/Crud';
import User from './pages/User';
import Applicant from './pages/Applicant';
import JobVacancy from './pages/JobVacancy';

import EmptyPage from './pages/EmptyPage';
import Documentation from './components/Documentation';



class AuthRouter extends Component {
    render() {
        return (
            <div className="layout-main">
                <Switch>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/crud" component={Crud} />

                    <Route path="/user" component={User} />
                    <Route path="/applicant" component={Applicant} />
                    <Route path="/jobvacancy" component={JobVacancy} />

                    <Route path="/empty" component={EmptyPage} />
                    <Route path="/documentation" component={Documentation} />

                    <Route path="/login" exact render={() => <Redirect to="/" />} />
                    <Redirect to="/" />
                </Switch>
            </div>
        )
    }
}

export default AuthRouter