import {Menu} from "antd";
import React from "react";
import Img from "../images";
import Op from '../op';
import {DragSource} from 'react-dnd';

class Component extends React.Component {
    render() {
        const {item, connectDragSource} = this.props;
        const image = Img[item.key];
        return connectDragSource(
            <div key={item.key}>
                <Menu.Item key={item.key}
                           className={"ant-menu-item draggable-item"}
                           {...Op.sourceFix}>
                    <img alt={item.text} src={image}/>
                    &nbsp;&nbsp;
                    {item.text}
                </Menu.Item>
            </div>
        );
    }
}

export default DragSource(
    Op.DragTypes.FormDesigner,
    Op.Form.sourceSpec,
    Op.Form.sourceConnect
)(Component);