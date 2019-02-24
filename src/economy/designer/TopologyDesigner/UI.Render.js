import React from 'react';
import {Command, Item, ItemPanel, Toolbar} from 'gg-editor';
import {Card, Divider, Tooltip} from 'antd';

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
                    return (
                        <Command key={toolbar.key} name={toolbar.command}>
                            <Tooltip title={toolbar.text}
                                     placement={"bottom"}
                                     overlayClassName={"tooltip"}>
                                <i className={`iconfont ${toolbar.className}`}/>
                            </Tooltip>
                        </Command>
                    );
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
                    <Item {...item}/>
                ))}
            </Card>
        </ItemPanel>
    );
};
export default {
    renderTool,
    renderItemPanel
};