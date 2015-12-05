import React, { Component } from 'react';

export default class Viewer extends Component {
    render() {
        return (
            <div>
                <img src={`/snapshot.png?secret=${this.props.secret}`} />
            </div>
        );
    }
}
