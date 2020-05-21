import React from 'react';
import {component} from "web";
import Op from './op';
import Ux from 'ux';
import {Button, Col, Row} from 'antd';
import Event from './event';

import renderSelection from './Web.Select';
import renderSelected from './Web.Selected';
import Ex from "ex";

@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "IxRuleTerm"
})
class RuleTerm extends React.PureComponent {
    componentDidMount() {
        Op.yiPageTerm(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return (
                <Row className={"ix-rule-term"}>
                    <Col span={15}>
                        {renderSelected(this)}
                    </Col>
                    <Col span={1} className={"operation"}>
                        <Button icon={"double-left"} className={"ux-red"}
                                onClick={Event.onYes(this)}
                                disabled={Event.isDisabled(this)}/>
                    </Col>
                    <Col span={8}>
                        {renderSelection(this)}
                    </Col>
                </Row>
            )
        }, Ex.parserOfColor("IxRuleTerm").component({off: true}))
    }
}

const renderField = (field, filter = () => true) => (reference, jsx) => {
    const {config = {}} = jsx;
    let options = Ux.Ant.toOptions(reference, config);
    const {value = {}} = reference.props;
    options = options.filter(item => filter(item, reference));
    return (<RuleTerm reference={reference} {...jsx}
                      $source={options.sort(Ux.sorterAscFn('key'))}
                      onChange={Event.onRule(reference, field)}
                      config={config}
                      value={value[field]}/>);
}
const elementFlat = (array = []) => {
    let normalized = [];
    if (Ux.isArray(array)) {
        array.forEach(item => {
            if (Ux.isArray(item)) {
                normalized = normalized.concat(elementFlat(item));
            } else {
                normalized.push(item);
            }
        });
    }
    return normalized;
}
const elementFields = (priority = [], other = []) => {
    const all = elementFlat(priority);
    const except = Ux.immutable(elementFlat(other));
    return Ux.immutable(all.filter(item => !except.contains(item)));
}
export default {
    /* 推送规则 */
    record: renderField('record'),
    /* 集成规则 */
    integration: renderField('integration'),
    /* 规则优先级 */
    priority: renderField('priority'),
    /* 强连接 */
    strong: renderField('strong', (item, ref) => {
        const {value = {}} = ref.props;
        if (value.priority && 0 < value.priority.length) {
            const {weak = []} = value;
            return elementFields(value.priority, weak).contains(item.key);
        } else return false;
    }),
    /* 弱连接 */
    weak: renderField('weak', (item, ref) => {
        const {value = {}} = ref.props;
        if (value.priority && 0 < value.priority.length) {
            const {strong = []} = value;
            return elementFields(value.priority, strong).contains(item.key);
        } else return false;
    })
}