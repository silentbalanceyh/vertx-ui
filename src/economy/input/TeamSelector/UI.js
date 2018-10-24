import React from 'react';
import Op from './Op';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Op.initState(this);
    }

    render() {
        console.info(this.props);
        return (
            <div>Team</div>
        );
    }
}

export default Component;