import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExForm} from "ei";
import '../Cab.less';
import {Card} from "antd";

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Page4.Form")
    .to()
)
class Component extends React.PureComponent {

    render() {
        const {data = {}} = this.props;
        return (
            <Card className={"ops-card-form"} title={
                <span className={"ops-title"}>{data.modelName}</span>
            }>
                {(() => {
                    /*
                     * 配置处理
                     */
                    const {$inited = {}} = this.props;
                    const formAttrs = Ex.yoAmbient(this);
                    formAttrs.$inited = $inited;
                    formAttrs.config = {form: Ux.fromHoc(this, "form")};
                    return (
                        <div className={"form-step1"}>
                            <ExForm {...formAttrs} $height={"90px"}/>
                        </div>
                    )
                })()}
            </Card>
        )
    }
}

export default Component