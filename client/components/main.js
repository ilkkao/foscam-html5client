import React, { Component } from 'react';
import { startLogin, logout, getImage } from '../actions/session';

import FlatButton from 'material-ui/lib/flat-button';
import AppBar from 'material-ui/lib/app-bar';

import Login from './login';
import Viewer from './viewer';
import Spinner from './spinner';

export default class Main extends Component {
    login(password) {
        this.props.dispatch(startLogin(password));
    }

    logout() {
        this.props.dispatch(logout());
    }

    refresh() {
        this.props.dispatch(getImage());
    }

    render() {
        let props = this.props;

        let Child;
        let LogoutButton = null;

        if (props.loading) {
            Child = <Spinner />;
        } else if (props.loggedIn) {
            Child = <Viewer {...props} refresh={this.refresh.bind(this)} />;
            LogoutButton = <FlatButton onClick={this.logout.bind(this)} label="Logout" />;
        } else {
            Child = <Login login={this.login.bind(this)} failureReason={props.failureReason} />;
        }

        return (
            <div className="flex-container full-height">
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
