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
                state.$ready = true;
                this.setState(state);
            })
        } else {
            console.warn("无法读取 `_tid`，参数缺失！");
        }
    }

    render() {
        return Ex.yoRender(this, () => {
            const inherit = Ex.yoAmbient(this);
            const {$inited = {}} = this.state;
            return (
                <TxPage {...inherit} $inited={$inited}>
                    <TxObserve/>
                </TxPage>
            )
        }, Ex.parserOfColor("TxRun").page())
    }
}

export default Component