import React from 'react'
import {DropTarget} from 'react-dnd'

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

class Component extends React.Component {
    render() {
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div>Hello</div>
        )
    }
}

export default DropTarget("FormDesiger", {}, collect)(Component);