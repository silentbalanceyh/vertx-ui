import React from 'react';
import Ex from "ex";
import Ux from "ux";
import {Transfer} from "antd";
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "QxProjection";
const componentInit = (reference) => {
    const state = reference.state ? Ux.clone(reference.state) : {};
    /* 构造Transfer专用属性 */
    const {config = {}, value} = reference.props;
    /* $transfer */
    const $transfer = {};
    const {field = [], ...rest} = config;
    Object.assign($transfer, rest);
    $transfer.render = (item) => Ux.aiItemTransfer(item, reference);
    $transfer.onChange = Ux.xtTransfer(reference,
        ($selectedKeys = []) => {
            Ux.of(reference).in({$selectedKeys}).handle(() => {

                Ux.fn(reference).onChange($selectedKeys);
            })
            // Abs.fn(reference).onChange($selectedKeys);
            // reference.?etState({$selectedKeys});
        });
    const $source = [];
    field.filter(each => "key" !== each.dataIndex).forEach(each => {
        $source.push({
            label: each.title,
            key: each.dataIndex,
            value: each.dataIndex
        })
    })
    state.$transfer = $transfer;
    state.$source = $source;
    state.$selectedKeys = value;
    if (!value) {
        Ux.fn(reference).onChange([]);
    }
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$source = [], $transfer = {}} = this.state;
            const {value = []} = this.props;
            const jsx = Ux.toLimit(this.props, [
                "reference",
                "config"
            ])
            const WebField = Ux.V4InputGroup;
            return (
                <WebField {...jsx} className={"ux_op_transfer"}>
                    <Transfer {...$transfer} dataSource={$source}
                              targetKeys={value}/>
                </WebField>
            );
        }, Ex.parserOfColor(UCA_NAME).control())
    }
}

export default Component