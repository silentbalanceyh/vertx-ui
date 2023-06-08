import {Menu} from "antd";
import React from "react";
import Img from "../images";
import __Zn from '../zero.uca.dependency';

const future = () => {
    return __Zn.immutable(["aiDatumCascade", "aiDialogEditor"])
}

class Component extends React.Component {
    render() {
        const {item, $dndDrag} = this.props;
        const image = Img[item.key];
        const $future = future();
        if ($future.contains(item.key)) {
            return (
                <div key={item.key}>
                    <Menu.Item key={item.key}
                               disabled
                               className={"ant-menu-item draggable-item draggable-item-disabled"}
                               onItemHover={event => __Zn.prevent(event)}
                               onClick={event => __Zn.prevent(event)}>
                        <img alt={item.text} src={image}/>
                        &nbsp;&nbsp;
                        {item.text}
                    </Menu.Item>
                </div>
            )
        } else {
            return (
                <div key={item.key} ref={$dndDrag}>
                    <Menu.Item key={item.key}
                               className={"ant-menu-item draggable-item"}
                               onItemHover={event => __Zn.prevent(event)}
                               onClick={event => __Zn.prevent(event)}>
                        <img alt={item.text} src={image}/>
                        &nbsp;&nbsp;
                        {item.text}
                    </Menu.Item>
                </div>
            );
        }
    }
}

export default Component;