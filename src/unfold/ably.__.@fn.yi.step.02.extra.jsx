import Ux from 'ux';
import React from 'react';
import {Tooltip} from 'antd';
import __Zn from './zero.module.dependency';

export default async (reference, menuData = [], config = {}) => {
    // Promise for Build extra
    const dataSource = __Zn.a4MenuWeb(menuData, Ux.Env.MENU_TYPE.EXTRA);
    return (props) => dataSource.map(item => {
        const {data = {}} = item;
        const {metadata = {}} = data;
        if (metadata.confirm) {
            return (
                <Tooltip title={item.label} key={item.key}>
                    {item.icon}
                </Tooltip>
            )
        } else {
            return item.icon;
        }
    });
}