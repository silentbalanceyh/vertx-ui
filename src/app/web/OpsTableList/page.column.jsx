import React from 'react';
import Ux from 'ux';
import {Icon} from 'antd';
import FUNS from './Op';
/*
 * 按照状态设置按钮
 */
const OP = ["lnkEdit"];

const renderLink = (reference, config = {}, item, onClick) => {
    const {text, icon, ...rest} = config;
    const attrs = Ux.clone(rest);
        attrs.key = item;
        attrs.onClick = onClick;
        return (
            <a href={""} {...attrs}>
                {icon ? <Icon type={icon}/> : false}
                {text}
            </a>
        )
};
const pageColumn = (reference) => {
    return ({
        dataIndex: "id",
        fixed: "right",
        title: "操作",
        width: 72,
        render: (text, record = {}) => {
            const cab = Ux.sexCab(reference, "toolbar");
            let item = Ux.clone(OP);
            let onClick = FUNS[item];
            if (Ux.isFunction(onClick)) {
                onClick = onClick(reference, record);
            }
            if (Ux.isFunction(onClick)) {
                const config = cab[item];
                return renderLink(reference, config, item, onClick);
            } else return false;

        }
    })
}

export default {
    pageColumn,
}