import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {Select} from 'antd';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "QxQBE";
const componentInit = (reference) => {
    const state = {};
    const {data = {}, value} = reference.props;
    const params = Ux.clone(data);
    params.type = "Workflow";           // 工作流类型
    params.view = Ux.toVis("DEFAULT", data.position);
    Ux.ajaxGet("/api/ui/views/:id/:position", params)
        .then($qbe => Ux.promise(Op.configQr($qbe, state)))
        .then(Ux.ready)
        .then(state => {
            // 还原选项
            if (value) {
                state.$qbeValue = value;
            }
            Ux.of(reference).in(state).handle(() => {

                Ux.fn(reference).rxQBE(state.$qbeValue);
            })
            // Ux.fn(reference).rxQBE(state.$qbeValue);
            // reference.?etState(state);
        })
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$qbe = []} = this.state;
            const {value} = this.props;
            const attrQBE = Sk.mixQx(UCA_NAME);
            return (
                <Select {...attrQBE}
                        value={value}
                        onChange={Op.rxChange(this)}>
                    {$qbe.map(item => (
                        <Select.Option key={item.key} value={item.value}>
                            {item.icon ? (Ux.v4Icon(item.icon)) : false}
                            {item.icon ? (<span>&nbsp;&nbsp;</span>) : false}
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
            );
        }, Ex.parserOfColor(UCA_NAME).private({off: true}));
    }
}

export default Component