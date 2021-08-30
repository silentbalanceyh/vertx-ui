import React from 'react';
import Ex from "ex";
import Ux from "ux";
import {Input, Transfer} from "antd";
import Abs from "../../../ux/abyss";
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = reference.state ? Ux.clone(reference.state) : {};
    state.$ready = true;
    /* 构造Transfer专用属性 */
    const {config = {}, value} = reference.props;
    /* $transfer */
    const $transfer = {};
    const {field = [], ...rest} = config;
    Object.assign($transfer, rest);
    $transfer.render = (item) => Ux.aiItemTransfer(item, reference);
    $transfer.onChange = Ux.xtTransfer(reference,
        ($selectedKeys = []) => {
            Abs.fn(reference).onChange($selectedKeys);
            reference.setState({$selectedKeys});
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
    reference.setState(state);
}

class Component extends React.PureComponent {
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
            return (
                <Input.Group {...jsx} className={"ux-transfer"}>
                    <Transfer {...$transfer} dataSource={$source}
                              targetKeys={value}/>
                </Input.Group>
            );
        }, Ex.parserOfColor("QxProjection").control())
    }
}

export default Component