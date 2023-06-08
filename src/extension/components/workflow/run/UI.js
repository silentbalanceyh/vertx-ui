import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {TxObserve, TxPage} from "ei";

class Component extends React.PureComponent {
    componentDidMount() {
        const {$router} = this.props;
        const key = $router._("_tid");
        if (key) {
            Ux.ajaxGet("/api/up/flow/:key", {key}).then($inited => {
                const state = {};
                state.$inited = $inited;

                Ux.of(this).in(state).ready().done();
                //state.$ready = true;
                //this.?etState(state);
            })
        } else {
            console.warn("无法读取 `_tid`，参数缺失！");
        }
    }

    render() {
        return Ex.yoRender(this, () => {
            const inherit = Ex.yoAmbient(this);
            const {$inited = {}} = this.state;
            inherit.$showTask = true;       // 显示任务名称
            inherit.rxInit = ((response = {}) => {
                const state = {};
                state.$inited = Ux.clone($inited);
                if (response.history) {
                    state.$inited.history = response.history;
                }
                Ux.of(this).in(state).done();
            })
            return (
                <TxPage {...inherit} $inited={$inited}>
                    <TxObserve/>
                </TxPage>
            )
        }, Ex.parserOfColor("TxRun").page())
    }
}

export default Component