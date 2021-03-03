import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {ExForm} from 'ei';
import {Card, Spin} from "antd";
import Op from './Op';

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuInit(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const card = Ux.fromHoc(this, "card");
            const {$loading = false, __dialog} = this.state;
            return (
                <Spin spinning={$loading}>
                    <Card className={"ops-card-form"} title={
                        <span className={"ops-title"}>{card.text}</span>
                    } extra={(() => {
                        const {$extra = []} = this.state;
                        const {$inited = {}} = this.props;
                        return Ux.opExtra($extra, Op.rxExtra(this), {
                            disabled: Ux.isEmpty($inited)
                        });
                    })()}>
                        {__dialog.render()}
                        {(() => {
                            // 根据类型读取不同的表单
                            const formAttrs = Ex.yoAmbient(this);
                            const {$inited = {}, $refresh} = this.props;
                            formAttrs.$inited = $inited;
                            formAttrs.$refresh = $refresh;
                            formAttrs.config = {form: Ux.fromHoc(this, "form")};
                            return (<ExForm {...formAttrs} $height={"160px"}/>)
                        })()}
                    </Card>
                </Spin>
            )
        }, Ex.parserOfColor("OpsViewSource").define())
    }
}

export default Component