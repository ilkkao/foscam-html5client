import React, { Component } from 'react';
import { startLogin, logout } from '../actions/session';

import FlatButton from 'material-ui/lib/raised-button';
import AppBar from 'material-ui/lib/app-bar';

import Login from './login';
import Viewer from './viewer';

export default class Main extends Component {
    login(password) {
        this.props.dispatch(startLogin(password));
    }

    logout() {
        this.props.dispatch(logout());
    }

    render() {
        let Child;
        let LogoutButton = null;

        if (this.props.loggedIn) {
            Child = <Viewer logout={this.logout} secret={this.props.secret}/>;
            LogoutButton = <FlatButton onClick={this.logout.bind(this)} label="Logout" />;
        } else {
            Child = <Login login={this.login.bind(this)} failureReason={this.props.failureReason}/>;
        }

        return (
            <div className="main-container">
                <AppBar
                    title={<span>{settings.pageTitle}</span>}
                    showMenuIconButton={false}
                    iconElementRight={LogoutButton}
                />
                {Child}
            </div>
        );
    }
}
