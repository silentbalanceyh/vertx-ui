/*
 * 命令按钮基本操作
 */
import React from 'react';
import {Collapse} from "antd";

export default (reference) => {
    const {$palette = {}} = reference.state;
    return (
        <Collapse activeKey={["op-palette"]} className={"designer-control"}>
            <Collapse.Panel key={"op-palette"}
                            showArrow={false}
                            header={$palette.title}>

            </Collapse.Panel>
        </Collapse>
    );
}