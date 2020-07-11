import React from 'react';
import {Tabs} from 'antd';
import Abs from '../../abyss';

export default (reference, children = {}) => {
    const {$tabs = {}} = reference.state ?
        reference.state : {};
    const {items = [], ...rest} = $tabs;
    return (
        <Tabs {...rest}>
            {items.map(item => {
                const fnRender = children[item.key];
                return (
                    <Tabs.TabPane {...item}>
                        {Abs.isFunction(fnRender) ? fnRender(item) :
                            `对不起，children 函数丢失：${item.key}`}
                    </Tabs.TabPane>
                )
            })}
        </Tabs>
    )
}