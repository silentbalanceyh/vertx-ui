import React from 'react'
import Ux from 'ux'
import {PageCard} from 'web';
import Op from './Op'

import FormBasic from './UI.Form.Basic';
import FormSource from './UI.Form.Source';
import InitData from './UI.Panel.Init';

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .state({
        $_data: {}
    })
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        // 数据初始化
        Op.initData(this);
    }

    render() {
        const {$data = {}, $activeKey = "keyBasic", $initData = []} = this.state;
        const attrs = {
            ...this.props,
            reference: this,
            $inited: $data,
        };
        // 处理启用禁用标签
        const tabs = Op.initTab(this);
        return (
            <PageCard reference={this}>
                {Ux.auiTab(this)
                    .disabled(tabs, true)           // 禁用Tab页
                    .mount("activeKey", $activeKey) // 激活Tab页
                    .onChange(Op.initTabChange(this))
                    .to(
                        <FormBasic {...attrs}/>,
                        <FormSource {...attrs}/>,
                        <InitData {...attrs} $inited={$initData}/>
                    )}
            </PageCard>
        )
    }
}

export default Component