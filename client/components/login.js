import React, { Component } from 'react';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';

export default class Login extends Component {
    construction() {
        this.state = { password: '' };
    }

    handleChange(event) {
        this.setState({ password: event.target.value });
    }

    handleLogin() {
        this.props.login(this.state.password);
    }

    render() {
        return (
            <div className="login-container">
                <TextField
                    hintText={settings.passwordLabel}
                    floatingLabelText={settings.passwordLabel}
                    type="password"
                    onChange={this.handleChange.bind(this)}
                />
                <RaisedButton
                    style={{marginTop: 30}}
                    label={settings.loginLabel}
                    primary={true}
                    onClick={this.handleLogin.bind(this)}
                />
                {this.props.failureReason}
            </div>
        );
    }
}
