import React, { Component } from 'react';

import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

export default class Viewer extends Component {
    render() {
        return (
            <div className="flex-container black flex-1">
                <div style={{backgroundImage: `url(/api/snapshot.png?secret=${this.props.secret})`}} className="snapshot flex-1 flex-container flex-center"></div>
                <Toolbar>
                <ToolbarTitle text={`👁 ${this.props.hits} 13:23`} />
                <ToolbarSeparator/>
                <RaisedButton style={{width: 40, minWidth: 40}} label="" primary={true}>
                <FontIcon className="material-icons">refresh</FontIcon>
                </RaisedButton>
                </Toolbar>
            </div>
        );
    }
}
