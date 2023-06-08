import React from 'react';
import Op from './Op';
import {List} from "antd";
import Jsx from './Web';

import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';
import Sk from "skin";
import "./Cab.norm.scss";
const UCA_NAME = "UserLeader";
/*
 * 按 部门/组 筛选经理
 * 1）内部选人使用 UserSelector
 * 2）穿透调用 rxSelected 方法，UserSelector 回调使用
 */
@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Op.componentInit(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$rows = []} = this.state;
            const attrs = Sk.mixUca(UCA_NAME);
            const WebField = __Zn.V4InputGroup;
            return (
                <WebField {...attrs}>
                    <List dataSource={$rows}
                          renderItem={(item) => Jsx.renderItem(this, item)}/>
                </WebField>
            )
        }, {name: UCA_NAME, logger: true})
    }
}

export default Component