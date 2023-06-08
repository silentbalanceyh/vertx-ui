import __Zn from './zero.uca.dependency';
import __JSX from './column.__.fn.jsx.segment';
import __NORM from './column.__.fn.norm.text';
import __AI_LINK from '../autonomy.fn.ai.unit.link';
import {Divider} from "antd";
import React from 'react';

const WebUnit = {
    ...__AI_LINK,
}
const Cmn = {
    ...__JSX,
    ...__NORM,
}
export default {
    CONNECT: (reference, column) => {
        let attrs = Cmn.normInit(column);
        attrs.reference = reference;
        return (text, record) => {
            attrs = __Zn.clone(attrs);
            const {$connect = []} = reference.state;
            const connect = $connect.filter(item => {
                const {config = {}} = item;
                return column.dataIndex === config.pos;
            });
            const normalized = [];
            connect.forEach((item, index) => {
                if (0 < index) {
                    normalized.push("divider");
                }
                normalized.push(item);
            })
            return (
                <span>
                {normalized.map((item) => {
                    if ("divider" === item) {                                   // 由于在遍历过程中，所以 `key` 是必须的
                        return (
                            <Divider type={'vertical'} key={__Zn.randomUUID()}/>
                        )
                    } else {
                        const {onClick, ...rest} = item;
                        if (__Zn.isFunction(onClick)) {
                            const fnClick = onClick(item, record);
                            return WebUnit.aiAnchor(rest, fnClick, "LINK");
                        } else return false;
                    }
                })}
                </span>
            );
        }
    },
}