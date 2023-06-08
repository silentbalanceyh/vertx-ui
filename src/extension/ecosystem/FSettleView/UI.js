import React from 'react';
import Ux from "ux";
import Ex from "ex";
import ExForm from '../ExForm/UI';
import ExTab from '../ExTab/UI';
import FDebtForm from "../FDebtForm/UI";
import FRefundForm from "../FRefundForm/UI";
import FSettleItems from '../FSettleItems/UI';
import FPaymentList from '../FPaymentList/UI';

const UCA_NAME = "FSettleView";
const componentInit = (reference) => {
    const state = {};
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
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
        const adjust = Ux.clone(data.record);
        adjust.amount = Math.abs(adjust.amount);
        inherit.$inited = adjust;
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
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.props;
            const {items = [], ...initValues} = $inited;
            let values = Ux.clone(initValues);
            values = Ex.inSettlement(values);
            const {record = {}} = values;
            if (Ux.isEmpty(record)) {
                // Pure
                values.linked = "Pure";
            } else {
                if (0 < record.amount) {
                    values.linked = "Debt";
                } else {
                    values.linked = "Refund";
                }
            }
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
        }, Ex.parserOfColor(UCA_NAME).view())
    }
}

export default Component