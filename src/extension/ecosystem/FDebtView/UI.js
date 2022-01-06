import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {Button, Modal} from 'antd';
import FSettleItems from '../FSettleItems/UI';
import ExTab from '../ExTab/UI';
import FDebtForm from '../FDebtForm/UI';
import FPaymentList from '../FPaymentList/UI';
import FPaymentForm from "../FPaymentForm/UI";

const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        state.$ready = true;
        const {$inited = {}} = reference.props;
        const {payment = []} = $inited;
        state.$payment = payment;
        reference.setState(state);
    })
}

const renderForm = (reference, $inited) => {
    const window = Ux.fromHoc(reference, "window");
    const config = Ux.configDialog(reference, window);
    const {$visible = false} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.$synonym = Ux.fromHoc(reference, "synonym");
    const initValue = {};
    if ($inited) {
        initValue.serial = $inited.serial;              // 应收单/退款单 号
        initValue.amountRequired = $inited.amount;      // 总金额
        initValue.amount = $inited.amount;              // 合计金额
        initValue.payMethod = "Cash"                    // 默认方式现金
        initValue.payName = $inited['signName'];
        initValue.payMobile = $inited['signMobile'];
        initValue.settlementId = $inited.settlementId;  // 关联结算单
        initValue.indent = "NUM.PAYMENT.DEBT"
    }
    inherit.doSubmitting = Ex.rsSubmitting(reference);
    inherit.rxClose = (payment = []) => {
        const state = {};
        state.$submitting = false;
        state.$visible = false;
        let {$payment = []} = reference.state;
        $payment = Ux.clone($payment);
        Ux.elementSave($payment, payment);
        state.$payment = $payment;
        reference.setState(state);
    }
    return (
        <Modal {...config}
               className={"web-dialog"}
               visible={$visible}>
            <FPaymentForm {...inherit} $inited={initValue}/>
        </Modal>
    )
}

const rxTab = (reference, initValues = {}) => {
    const {$activeKey} = reference.state;
    const tabs = Ux.fromHoc(reference, "tabs");
    tabs.onTabClick = ($activeKey) => reference.setState({$activeKey});
    tabs.activeKey = $activeKey;
    tabs.fnExtra = () => {
        if ("keyPayment" === $activeKey) {
            const action = Ux.fromHoc(reference, "action");
            return (
                <Button icon={"plus"} type={"primary"}
                        disabled={initValues.finished}
                        onClick={event => {
                            Ux.prevent(event);
                            reference.setState({$visible: true});
                        }}>
                    {action.text}
                </Button>
            )
        } else return false;
    }
    return tabs;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("FDebtView")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $activeKey: "keyPayment"
    }

    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$inited = {}} = this.props;
            const {items = [], ...initValues} = $inited;
            const inherit = Ex.yoAmbient(this);
            const {$payment = []} = this.state;
            /*
             * 是否处理
             */
            let sum = 0;
            $payment.forEach(payment => sum += payment.amount);
            initValues.finished = initValues.amount <= sum;
            const tabs = rxTab(this, initValues);

            return (
                <div>
                    <FDebtForm {...inherit} $inited={initValues}/>
                    <ExTab config={tabs}>
                        <FSettleItems {...inherit} data={items}/>
                        <FPaymentList {...inherit} data={$payment}
                                      $assist={false}
                                      rxPayment={(keys = []) => {
                                          if (0 < keys.length) {
                                              let {$payment = []} = this.state;
                                              $payment = Ux.clone($payment);
                                              $payment = $payment.filter(item => !keys.includes(item.key));
                                              this.setState({$payment});
                                          }
                                      }}/>
                    </ExTab>
                    {renderForm(this, $inited)}
                </div>
            );
        }, Ex.parserOfColor("FDebtView").view())
    }
}

export default Component