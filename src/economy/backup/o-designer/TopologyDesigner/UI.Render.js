import React from 'react';
import {Command, Item, ItemPanel, Toolbar} from 'gg-editor';
import {Card, Divider, Tooltip} from 'antd';
import Ux from 'ux';
import RdrDetail from './UI.Detail';

const _renderCommand = (item) => {
    Ux.dgDebug(item, "「工具栏」原生命令");
    return (
        <Command key={item.key} name={item.command}>
            <Tooltip title={item.text}
                     placement={"bottom"}
                     overlayClassName={"tooltip"}>
                <i className={`iconfont ${item.className}`}/>
            </Tooltip>
        </Command>
    );
};
const renderTool = (reference) => {
    const {$toolbars = []} = reference.state;
    return (
        <Toolbar className={"toolbar"}>
            {$toolbars.map(toolbar => {
                if (toolbar.divider) {
                    return (
                        <Divider key={toolbar.key} type={"vertical"}/>
                    );
                } else {
                    return _renderCommand(toolbar);
                }
            })}
        </Toolbar>
    );
};
const renderItemPanel = (reference) => {
    const {$items = []} = reference.props;
    return (
        <ItemPanel className={"item-panel"}>
            <Card bordered={false}>
                {$items.map(item => (
                    <div key={item.key} className={"item-range"}>
                        <Item {...item}/>
                        <label>{item.model.label}</label>
                    </div>
                ))}
            </Card>
        </ItemPanel>
    );
};
export default {
    renderTool,
    renderItemPanel,
    ...RdrDetail
};