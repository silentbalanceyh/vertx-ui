import {Menu} from "antd";
import React from "react";
import Img from "../images";
import Op from '../op';
import {DragSource} from 'react-dnd';
import Ux from 'ux';

const future = () => {
    return Ux.immutable(["aiDatumCascade", "aiDialogEditor"])
}

class Component extends React.Component {
    render() {
        const {item, connectDragSource} = this.props;
        const image = Img[item.key];
        const $future = future();
        if ($future.contains(item.key)) {
            return (
                <div key={item.key}>
                    <Menu.Item key={item.key}
                               disabled
                               className={"ant-menu-item draggable-item draggable-item-disabled"}
                               onItemHover={event => Ux.prevent(event)}
                               onClick={event => Ux.prevent(event)}>
                        <img alt={item.text} src={image}/>
                        &nbsp;&nbsp;
                        {item.text}
                    </Menu.Item>
                </div>
            )
        } else {
            return connectDragSource(
                <div key={item.key}>
                    <Menu.Item key={item.key}
                               className={"ant-menu-item draggable-item"}
                               onItemHover={event => Ux.prevent(event)}
                               onClick={event => Ux.prevent(event)}>
                        <img alt={item.text} src={image}/>
                        &nbsp;&nbsp;
                        {item.text}
                    </Menu.Item>
                </div>
            );
        }
    }
}

export default DragSource(
    Op.DragTypes.FormDesigner,
    Op.Form.sourceSpec,
    Op.Form.sourceConnect
)(Component);