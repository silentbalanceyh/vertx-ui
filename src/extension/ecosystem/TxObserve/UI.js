import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxObserve")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.wf(this).yiForm({}, false)
            .then(Ux.ready).then(Ux.pipe(this));
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$workflow = {}} = this.state;

            const wf = Ex.wf(this, $workflow.task);
            // 表单配置
            const form = wf.yoFormObserve($workflow);
            form.$edition = wf.yoAcl(form.config);

            // 图配置和数据提取
            return (
                <div className={"ex-flow-page"}>
                    <ExForm {...form} $height={"300px"}

                            rxClose={wf.rxClose}                     // 关闭函数

                            $renders={wf.JsxForm}              // 自定义表单字段渲染

                            $plugins={wf.yoPlugins($workflow)}

                            $op={wf.Act}       // 专用Op
                    />
                </div>
            )
        }, Ex.parserOfColor("TxObserve").form())
    }
}

export default Component