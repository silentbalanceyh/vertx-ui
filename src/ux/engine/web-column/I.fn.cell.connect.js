import Cmn from "./I.common";
import Abs from "../../abyss";
import T from '../../unity';
import WebUnit from '../web-unit';
import {Divider} from 'antd';
import React from 'react';

export default (reference, column) => {

    let attrs = Cmn.normalizeInit(column);
    /*
     * -2. 必须删除 $expr
     */
    attrs.reference = reference;
    return (text, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 在 render 周期执行该操作
         */
        const {$connect = []} = reference.state;
        const connect = $connect.filter(item => {
            const {config = {}} = item;
            return column.dataIndex === config.pos;
        });
        /*
         * 构造核心函数
         */
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
                    if ("divider" === item) {
                        // 由于在遍历过程中，所以 `key` 是必须的
                        return (
                            <Divider type={'vertical'} key={T.randomUUID()}/>
                        )
                    } else {
                        const {onClick, ...rest} = item;
                        if (Abs.isFunction(onClick)) {
                            const fnClick = onClick(item, record);
                            return WebUnit.aiAnchor(rest, fnClick, "LINK");
                        } else return false;
                    }
                })}
            </span>
        );
    }
}