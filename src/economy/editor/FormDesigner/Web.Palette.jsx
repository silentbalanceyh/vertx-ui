/*
 * 命令按钮基本操作
 */
import React from 'react';
import {Collapse, Menu} from "antd";
import Img from './images';
import Ux from 'ux';
import {useDrag as DragSource} from 'react-dnd';

const toDraggableItem = (reference, item) => {
    const [collected, drag] = DragSource({
        item: {id: item.key, type: "DRAG-ITEM", data: item}
    });
    const image = Img[item.key];
    return (
        <div ref={drag} key={item.key}>
            <Menu.Item key={item.key}>
                <img alt={item.text} src={image}/>
                &nbsp;&nbsp;
                {item.text}
            </Menu.Item>
        </div>
    );
}

export default (reference) => {
    const {$palette = []} = reference.state;
    const {$height = 120} = reference.props;
    return (
        <Collapse activeKey={["pageBasic", "pageAdv"]}
                  className={"designer-control"}>
            {$palette.map(palette => (
                <Collapse.Panel key={palette.key}
                                showArrow={false}
                                header={palette.title}>
                    <Menu className={"web-items"}
                          style={{
                              height: Ux.toHeight($height)
                          }}>
                        {palette.items.map(item => toDraggableItem(reference, item))}
                    </Menu>
                </Collapse.Panel>
            ))}
        </Collapse>
    );
}