import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExListComplex from '../ExListComplex/UI';
import ExForm from "../ExForm/UI";
import ExBpmn from "../ExBpmn/UI";
import TxFilter from "../TxQDoneFilter/UI";
import Op from "./Op";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxQDone")
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

                                   $renders={wf.JsxList}

                                   $executor={Op.yoExecutor(this)}

                                   config={$config}/>
                </div>
            )
        }, Ex.parserOfColor("TxDone").control());
    }
}

export default Component