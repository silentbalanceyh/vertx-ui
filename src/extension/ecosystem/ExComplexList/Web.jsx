import {Tabs} from "antd";
import U from "underscore";
import React from "react";
import Page from './page';

import Yo from './yo';
import ExAction from '../ExAction/UI';

export default (reference, config = {}) => {
    const {items = [], ...rest} = config;
    const extraAttrs = Yo.yoExtraContent(reference, rest);
    return (
        <Tabs {...rest} tabBarExtraContent={
            (<ExAction {...extraAttrs}/>)
        }>
            {items.map((item, index) => {
                const {type, ...rest} = item;
                /*
                 * 禁用第一项处理
                 */
                const $item = Yo.yoTab(reference, {
                    items, index, item,
                });
                const fnRender = Page[type];
                return $item ? (
                    <Tabs.TabPane {...item}>
                        {U.isFunction(fnRender) ? fnRender(reference, rest) : (
                            <span className={"ex-error"}>`fnRender` Function not Found</span>
                        )}
                    </Tabs.TabPane>
                ) : false
            })}
        </Tabs>
    )
};