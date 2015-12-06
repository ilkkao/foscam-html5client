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
                    <ToolbarGroup key={0} float="left">
                        <div style={{fontFamily: 'Roboto', fontSize: 17, display: 'flex', flexDirection: 'row', marginTop: 20}}>
                            <div style={{paddingRight: 5, marginTop: -4}}>👁</div>
                            <div style={{paddingRight: 15, color: '#5C72EF'}}>{`${this.props.hits}`}</div>
                            <div style={{paddingRight: 5}}>Time:</div>
                            <div>{`12:23`}</div>
                        </div>
                    </ToolbarGroup>
                    <ToolbarGroup key={1} float="right">
                        <RaisedButton style={{marginRight: 0}} label="" primary={true}>
                            <FontIcon className="material-icons">refresh</FontIcon>
                        </RaisedButton>
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
}
