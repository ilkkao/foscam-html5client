import React, { Component } from 'react';

import CircularProgress from 'material-ui/lib/circular-progress';

export default class Spinner extends Component {
    render() {
        return (
            <div className="flex-container flex-1 flex-center">
                <CircularProgress mode="indeterminate" size={1.5} />
            </div>
        );
    }
}

export default Spinner;
