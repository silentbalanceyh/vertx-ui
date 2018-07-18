import React from 'react'
import {List} from 'antd';
import {DragSource} from 'react-dnd'

function collect(connect, monitor) {
    return {
        isDragging: monitor.isDragging(),
        connectDragSource: connect.dragSource()
    }
}

class Component extends React.Component {
    render() {
        const {text, connectDragSource} = this.props;
        return connectDragSource(
            <div>
                <List.Item>
                    {text}
                </List.Item>
            </div>
        )
    }
}

export default DragSource("FormDesigner", {
    beginDrag: () => ({})
}, collect)(Component);