import React from 'react';
import {Alert, Empty, Space, Tabs, Tag} from "antd";
import Op from './UI.Op';
import Ux from 'ux';

// eslint-disable-next-line import/no-anonymous-default-export
export default (reference, qrMessage = {}) => {
    const {message = []} = qrMessage;
    const {$locked = {}, $combine = {}} = reference.state;
    const {tab = {}} = $combine.info ? $combine.info : {};
    // v4
    const [topUnlock, ...msgUnlock] = message;
    const [topLock, ...msgLock] = $locked.message;
    const $items = [{
        key: "tabOk",
        label: (
            <span>
                {Ux.v4Icon("unlock")}
                {tab.ok}
            </span>
        ),
        children: 0 < msgUnlock.length ? (msgUnlock.map(each => {
            const attrs = {
                key: each.key,
                message: each.text,
                closable: true,
                onClose: Op.rxDelete(reference, each)
            }
            return (<Alert {...attrs}/>)
        })) : (<Empty/>)
    }, {
        key: "tabLocked",
        label: (
            <span>
                {Ux.v4Icon("lock")}
                {tab.locked}
            </span>
        ),
        disabled: 0 === msgLock.length,
        children: msgLock.map(each => {
            const attrs = {
                key: each.key,
                type: "warning",
                message: each.text,
            };
            return (<Alert {...attrs}/>)
        })
    }];
    const {$activeKey = "tabOk"} = reference.state;
    const attrTab = {};
    attrTab.activeKey = $activeKey;
    attrTab.tabBarExtraContent = (() => {
        if ("tabOk" === $activeKey) {
            // 非锁定条件
            return (
                <Space>
                    {topUnlock.unlock}：<Tag color={"#f56c52"}>{topUnlock.value}</Tag>
                </Space>
            )
        } else {
            // 锁定类
            return (
                <Space>
                    {topLock.lock}：<Tag color={"#efcc20"}>{topLock.value}</Tag>
                </Space>
            )
        }
    })();
    attrTab.size = "small";
    attrTab.items = $items;
    attrTab.onTabClick = Op.rxActive(reference);
    return (
        <div className={"notice"}>
            <Tabs {...attrTab}/>
        </div>
    );
}