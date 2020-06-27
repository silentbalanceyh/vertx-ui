import React from 'react';
import Ux from 'ux';
import {Button, Tooltip} from 'antd';
import FUNS from '../event';
import '../Cab.less';
/*
 * 按照状态设置按钮
 */
const OP = {
    NORMAL: [
        "edit"
    ]
};

const renderBar = (reference, config = {}, item, onClick) => {
    const {text, ...rest} = config;
    const attrs = Ux.clone(rest);
    if (text) {
        /* Confirm */
        return (
            <Tooltip title={text} key={item}>
                <Button {...attrs} onClick={onClick}/>
            </Tooltip>
        )
    } else {
        attrs.key = item;
        return (
            <Button {...attrs} onClick={onClick}/>
        )
    }
};
export default (reference) => {
    return ({
        dataIndex: "key",
        fixed: "left",
        width: 72,
        className: "api-op",
        render: (text, record = {}) => {
            const cab = Ux.sexCab(reference, "toolbar");
            let items = Ux.clone(OP['NORMAL']);
            return (
                <Button.Group className={"ux-group"} key={text}>
                    {items.map(item => {
                        let onClick = FUNS.op[item];
                        if (Ux.isFunction(onClick)) {
                            onClick = onClick(reference, record);
                        }
                        if (Ux.isFunction(onClick)) {
                            const config = cab[item];
                            return renderBar(reference, config, item, onClick);
                        } else return false;
                    })}
                </Button.Group>
            )
        }
    })
}