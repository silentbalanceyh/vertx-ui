import React from 'react';
import Op from "./Op";
import {Col} from 'antd';
import {DropTarget} from "react-dnd";
import Render from './UI.Render';

class Component extends React.Component {
    render() {
        const {connectDropTarget, item} = this.props;
        const {columns, columnIndex} = this.props;
        const {target = {}} = this.props;
        // 计算颜色和效果
        const style = Op.calcCellStyle(this.props);
        // console.info(didDrop, config, dropResult, item.key);
        const type = target[item.key];
        const render = Render[type];
        return connectDropTarget(
            <div>
                <Col {...item} style={style}>
                    {type ? render(this.props['reference'], {
                        columns,
                        columnIndex
                    }) : false}
                </Col>
            </div>
        );
    }
}

export default DropTarget(
    Op.DragTypes.FormDesigner,
    Op.targetSpec,
    Op.targetConnect
)(Component);