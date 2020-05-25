/*
 * 命令按钮基本操作
 */
import React from 'react';
import {Collapse, Menu} from "antd";
import Img from './images';

export default (reference) => {
    const {$palette = {}} = reference.state;
    return (
        <Collapse activeKey={["op-palette"]} className={"designer-control"}>
            <Collapse.Panel key={"op-palette"}
                            showArrow={false}
                            header={$palette.title}>
                <Menu className={"web-items"}>
                    {$palette.items.map(item => {
                        const image = Img[item.key];
                        return (
                            <Menu.Item key={item.key}>
                                <img alt={item.text} src={image}/>
                                &nbsp;&nbsp;
                                {item.text}
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </Collapse.Panel>
        </Collapse>
    );
}