import {Tabs} from "antd";
import React from "react";
import Page from './Web.Page';
import Ex from 'ex';
import ExAction from '../ExAction/UI';
import Ux from 'ux';

export default (reference, config = {}) => {
    const {items = [], ...rest} = config;
    return (
        <Tabs {...rest} tabBarExtraContent={Ex.ylTabExtra(reference, rest, ExAction)}>
            {items.map((item, index) => {
                const {type, ...rest} = item;
                /*
                 * 禁用第一项处理
                 */
                const $item = Ex.yoTabPage(reference, {
                    items, index, item,
                });
                const fnRender = Page[type];
                return $item ? (
                    <Tabs.TabPane {...item}>
                        {Ux.isFunction(fnRender) ? fnRender(reference, rest) : (
                            <span className={"ex-error"}>`fnRender` Function not Found</span>
                        )}
                    </Tabs.TabPane>
                ) : false
            })}
        </Tabs>
    )
};