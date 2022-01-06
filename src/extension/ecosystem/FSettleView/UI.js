import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from '../ExForm/UI';
import ExTab from '../ExTab/UI';
import FDebtForm from "../FDebtForm/UI";
import FRefundForm from "../FRefundForm/UI";
import FSettleItems from '../FSettleItems/UI';
import FPaymentList from '../FPaymentList/UI';

const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    reference.setState(state);
}

const renderView = (reference, data = {}) => {
    const inherit = Ex.yoAmbient(reference);
    if ("Debt" === data.linked) {
        inherit.$inited = data.record;
        return (
            <div>
                <FDebtForm {...inherit}/>
                <FPaymentList {...inherit} data={data.payment}/>
            </div>
        )
    } else if ("Refund" === data.linked) {
        inherit.$inited = data.record;
        return (
            <div>
                <FRefundForm {...inherit}/>
                <FPaymentList {...inherit} data={data.payment}/>
            </div>
        )
    } else {
        return (
            <FPaymentList {...inherit} data={data.payment}/>
        )
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("FSettleView")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.props;
            const {items = [], ...initValues} = $inited;
            let values = Ux.clone(initValues);
            values = Ex.inSettlement(values);
            const form = Ex.yoForm(this, null, values);
            const $form = {};
            const inherit = Ex.yoAmbient(this);

            // 配置处理（标题替换）
            let tabs = Ux.fromHoc(this, "tabs");
            const page = Ux.fromHoc(this, "page");
            tabs = Ux.clone(tabs);
            tabs = Ux.configTab(this, tabs)
            tabs.items.filter(item => "keyRelated" === item.key)
                .forEach(item => item.tab = page[values.linked])
            return (
                <div>
                    <ExForm {...form} $height={"300px"}
                            $form={$form}/>
                    <ExTab config={tabs}>
                        <FSettleItems {...inherit} data={items}/>
                        {renderView(this, values)}
                    </ExTab>
                </div>
            );
        }, Ex.parserOfColor("FSettleView").view())
    }
}

export default Component