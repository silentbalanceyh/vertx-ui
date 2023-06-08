import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {Button, Modal} from 'antd';
import FSettleItems from '../FSettleItems/UI';
import ExTab from '../ExTab/UI';
import FRefundForm from '../FRefundForm/UI';
import FPaymentList from '../FPaymentList/UI';
import FPaymentForm from "../FPaymentForm/UI";

const UCA_NAME = "FRefundView";
const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        const {$inited = {}} = reference.props;
        const {payment = []} = $inited;
        state.$payment = payment;
        state.$inited = $inited;
        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    })
}

const renderForm = (reference, $inited = {}) => {
    const window = Ux.fromHoc(reference, "window");
    const config = Ux.configDialog(reference, window);
    const {$visible = false} = reference.state;
    const inherit = Ex.inDebt(reference, $inited, false);
    return (
        // v4
        <Modal {...config}
               className={"ux_dialog"}
               open={$visible}>
            <FPaymentForm {...inherit}/>
        </Modal>
    )
}

const rxTab = (reference, initValues = {}) => {
    const {$activeKey} = reference.state;
    const tabs = Ux.fromHoc(reference, "tabs");
    tabs.onTabClick = ($activeKey) =>
        Ux.of(reference).in({$activeKey}).done();
    // reference.?etState({$activeKey});
    tabs.activeKey = $activeKey;
    tabs.fnExtra = () => {
        if ("keyPayment" === $activeKey) {
            const action = Ux.fromHoc(reference, "action");
            return (
                <Button icon={Ux.v4Icon("plus")} type={"primary"}
                        disabled={initValues.finished}
                        onClick={event => {
                            Ux.prevent(event);
                            Ux.of(reference).open().done();
                            // reference.?etState({$visible: true});
                        }}>
                    {action.text}
                </Button>
            );
        } else return false;
    }
    return tabs;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $activeKey: "keyPayment"
    }

    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.state;
            const {items = [], payment = [], ...initValues} = $inited;
            const inherit = Ex.yoAmbient(this);
            const tabs = rxTab(this, initValues);
            return (
                <div>
                    <FRefundForm {...inherit} $inited={{
                        ...initValues,
                        amount: Math.abs(initValues.amount)        // 扶正
                    }}/>
                    <ExTab config={tabs}>
                        <FSettleItems {...inherit} data={items}/>
                        <FPaymentList {...inherit} data={payment}
                                      $assist={false}
                                      rxPayment={(keys = []) => {
                                          if (0 < keys.length) {
                                              const {$inited = {}} = this.state;
                                              let {payment = []} = $inited;
                                              payment = payment.filter(item => !keys.includes(item.key));
                                              const updated = Ux.clone($inited);
                                              updated.finished = false;
                                              updated.payment = payment;
                                              Ux.of(this).in({
                                                  $inited: updated
                                              }).done();
                                              // this.?etState({$inited: updated});
                                          }
                                      }}/>
                    </ExTab>
                    {renderForm(this, $inited)}
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).view())
    }
}

export default Component