import React from 'react';
import {ContextMenu} from 'editor';
import {Icon, Menu} from "antd";

const jsxContext = (gEvent, nodes = []) => (item, position, hide) => {
    const {x: left, y: top} = position;
    return (
        <div style={{position: 'absolute', top, left}} className={"editor-context"}>
            <Menu mode="vertical" selectable={false} onClick={(event) => {
                const params = {
                    hide: () => hide(event),
                    model: item.getModel()
                };
                /* 绑定后直接执行 */
                gEvent.generate(event.key, false)(params);
            }}>
                {nodes.map(item => (
                    <Menu.Item key={item.command}><Icon type={item.icon}/>{item.text}</Menu.Item>
                ))}
            </Menu>
        </div>
    );
};

export default (reference) => {
    const {$event} = reference.props;
    const context = $event.configContext();
    const {nodes = [], edges = []} = context;
    return (
        <div>
            {0 < nodes.length ? (
                <ContextMenu renderContent={jsxContext($event, nodes)} type={"node"}/>
            ) : false}
            {0 < edges.length ? (
                <ContextMenu renderContent={jsxContext($event, edges)} type={"edge"}/>
            ) : false}
        </div>
    );
}