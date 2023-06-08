import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";

const UCA_NAME = "TxOpen";
@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Ex.wf(this).yiForm({}, true, require('./Cab'));
    }

    render() {

        return Ex.yoRender(this, () => {
            const {$workflow = {}} = this.state;
            // 表单配置
            const wf = Ex.wf(this, $workflow.task);
            const form = wf.yoFormOpen($workflow);
            return (
                <div className={"ex-flow-page"}>
                    <ExForm {...form} $height={"300px"}

                            rxClose={wf.rxClose}                     // 关闭函数

                            $complex={wf.JsxComplex}

                            $renders={wf.JsxForm}              // 自定义表单字段渲染

                            $plugins={wf.yoPlugins($workflow)}

                            $op={wf.Act}       // 专用Op
                    />
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).form())
    }
}

export default Component