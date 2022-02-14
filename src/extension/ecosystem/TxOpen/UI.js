import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from "../ExForm/UI";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxOpen")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Ex.wf(this).yiForm({}, true)
            .then(Ux.ready).then(Ux.pipe(this));
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

                            $op={wf.Act}       // 专用Op
                    />
                </div>
            )
        }, Ex.parserOfColor("TxOpen").form())
    }
}

export default Component