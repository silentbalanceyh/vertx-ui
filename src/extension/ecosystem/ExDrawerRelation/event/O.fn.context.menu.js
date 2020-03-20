import {Icon, Menu} from 'antd';
import React from 'react';
import '../Cab.less';
import onNodeRemove from './O.fn.node.remove';
import onEdgeRemove from './O.fn.edge.remove';
import Ux from 'ux';

export default (reference) => {
    const context = Ux.fromHoc(reference, "context");
    return ({
        node: (item, position, hide) => {
            const {x: left, y: top, graph} = position;
            return (
                <div style={{position: 'absolute', top, left}} className={"ex-drawer-context"}>
                    <Menu mode="vertical" selectable={false} onClick={onNodeRemove(reference, {
                        item, graph
                    }, hide)}>
                        <Menu.Item><Icon type={'delete'}/>{context['node-delete']}</Menu.Item>
                    </Menu>
                </div>
            );
        },
        edge: (item, position, hide) => {
            const {x: left, y: top, graph} = position;

            return (
                <div style={{position: 'absolute', top, left}} className={"ex-drawer-context"}>
                    <Menu mode="vertical" selectable={false} onClick={onEdgeRemove(reference, {
                        item, graph
                    }, hide)}>
                        <Menu.Item><Icon type={'delete'}/>{context['edge-delete']}</Menu.Item>
                    </Menu>
                </div>
            );
        }
    })
}