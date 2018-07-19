import React from 'react'
import Op from "./Op";
import {Col, Input} from 'antd';
import {DropTarget} from "react-dnd";

const fnRender = (type) => {
    return <Input/>
};

class Component extends React.Component {
    render() {
        const {connectDropTarget, item} = this.props;
        const {target = {}} = this.props;
        // 计算颜色和效果
        const style = Op.calcCellStyle(this.props);
        // console.info(didDrop, config, dropResult, item.key);
        const type = target[item.key];
        return connectDropTarget(
            <div>
                <Col {...item} style={style}>
                    {type ? fnRender(type) : false}
                </Col>
            </div>
        )
    }
}

export default DropTarget(
    Op.DragTypes.FormDesigner,
    Op.targetSpec,
    Op.targetConnect
)(Component)