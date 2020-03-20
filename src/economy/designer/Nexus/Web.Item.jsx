import {Tooltip} from "antd";
import React from "react";
import {Item, ItemPanel} from "editor";

export default (reference) => {
    const {
        items = [],
        config = {},
    } = reference.props;

    return (
        <ItemPanel className={"box"} style={{
            maxHeight: config.maxHeight ? config.maxHeight : 600
        }}>
            {items.map(each => {
                return (
                    <Item {...each.item}>
                        <Tooltip title={each.text} placement={"leftTop"}>
                            <img alt={each.img.alt} {...each.img}/>
                            <label>{each.text}</label>
                        </Tooltip>
                    </Item>
                )
            })}
        </ItemPanel>
    )
}