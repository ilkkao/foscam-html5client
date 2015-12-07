import React, { Component } from 'react';
import moment from 'moment';

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
                <div id="snapshot" style={{backgroundImage: `url(${this.props.imageUrl})`}} className="snapshot flex-1 flex-container flex-center"></div>
                <Toolbar>
                    <ToolbarGroup key={0} float="left">
                        <div style={{fontFamily: 'Roboto', fontSize: 22, display: 'flex', flexDirection: 'row', marginTop: 15}}>
                            <div style={{paddingRight: 4, marginTop: -2}}>👁</div>
                            <div style={{paddingRight: 20, color: '#5C72EF'}}>{`${this.props.hits}`}</div>
                            <div style={{paddingRight: 4, marginTop: -2}}>🕐</div>
                            <div style={{color: '#5C72EF'}}>{moment(this.props.imageTs).format('HH:mm')}</div>
                        </div>
                    </ToolbarGroup>
                    <ToolbarGroup key={1} float="right">
                        <RaisedButton onTouchTap={this.props.refresh} style={{marginRight: 0}} label="" primary={true}>
                            <FontIcon className="material-icons">refresh</FontIcon>
                        </RaisedButton>
                    </ToolbarGroup>
                </Toolbar>
            </div>
        );
    }
}
