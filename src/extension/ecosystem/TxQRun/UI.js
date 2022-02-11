import React from 'react';
import Ux from "ux";
import Ex from "ex";
import Op from './Op';
import './Cab.less';
import TxFilter from '../TxQRunFilter/UI';
import ExForm from '../ExForm/UI';
import ExBpmn from '../ExBpmn/UI';
import ExListComplex from '../ExListComplex/UI';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxQRun")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.wf(this).yiQueue();
    }

    render() {
        return Ex.yoRender(this, () => {
            const wf = Ex.wf(this);
            const $config = wf.yoQueue();
            return (
                <div className={"ex-flow-queue"}>
                    {/* 流程图帮助 */}
                    {wf.Jsx.webHelp(ExForm, ExBpmn)}
                    {/* 搜索专用表单 */}
                    {wf.Jsx.webFilter(TxFilter)}
                    <ExListComplex {...wf.yoQueueList($config)}
                                   $op={Op.yoOp(this)}
                                   $plugins={wf.yoPlugins($config)}
                                   $renders={wf.JsxList}
                                   $executor={Op.yoExecutor(this)}
                                   config={$config}/>
                </div>
            )
        }, Ex.parserOfColor("TxQueue").control());
    }
}

export default Component