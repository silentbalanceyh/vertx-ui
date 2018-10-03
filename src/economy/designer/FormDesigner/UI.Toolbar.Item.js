import React from 'react';
import './Cab.less';
import {Icon, List} from 'antd';
import {DragSource} from 'react-dnd';
import Op from './Op';

class Component extends React.Component {
    render() {
        const {text, icon, connectDragSource, isDragging} = this.props;
        return connectDragSource(
            <div className={isDragging ? `web-dragging-item` : `web-drag-item`}>
                <List.Item>
                    {icon ? <Icon type={icon}/> : false}
                    &nbsp;&nbsp;
                    {text}
                </List.Item>
            </div>
        );
    }
}

export default DragSource(
    Op.DragTypes.FormDesigner,
    Op.sourceSpec,
    Op.sourceConnect
)(Component);