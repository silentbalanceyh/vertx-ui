import {Tooltip} from "antd";
import React from "react";
import {Item, ItemPanel} from "editor";

export default (reference) => {
    const {
        $event = {},
    } = reference.props;
    /* 调色盘配置 */
    const items = $event.dataItems();
    return (
        <ItemPanel {...$event.configItems()}>
            {items.map(each => (
                <Item {...each.item}>
                    <Tooltip title={each.text} placement={"leftTop"}>
                        <img alt={each.img.alt} {...each.img}/>
                        <label>{each.text}</label>
                    </Tooltip>
                </Item>
            ))}
        </ItemPanel>
    )
}