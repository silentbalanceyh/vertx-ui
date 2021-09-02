import React from 'react';
import Ex from "ex";
import Ux from "ux";
import {Col, Input, Row} from "antd";
import Jsx from './Web';
import './Cab.less';
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * metadata definition
     */
    const {value} = reference.props;
    const combine = Ex.yiCombine(reference,
        Ux.dataCab(require('./Cab.json'), "QxCriteria"));

    const {
        pattern = {}, field = [],
        label = {},
        op = [], info = {}, ignores = {},
        query = {}
    } = combine;
    const $metadata = {};
    $metadata.pattern = pattern;
    $metadata.mapping = {};
    $metadata.messageConnect = info.connector;
    const options = [];
    /* 锁定条件相关信息 */
    const locked = Ux.qrMessage(query.criteria, $metadata);
    const lockedFields = locked.message
        .map(item => item.field)
        .filter(item => !!item);
    const normalized = Ux.parseColumn(field, reference);
    normalized
        .filter(each => !lockedFields.includes(each.dataIndex))
        .forEach(each => {
            // Label
            $metadata.mapping[each.dataIndex] = each.label;
            // The Whole
            options.push(each);
        })
    state.$locked = locked;
    state.$metadata = $metadata;
    /*
     * 基础表单信息
     */
    const formInput = {
        op: []
    }
    if (op) {
        op.forEach(item => {
            const kv = item.split(',');
            formInput.op.push({key: kv[0], label: kv[1], value: kv[0]});
        });
    }
    state.$form = {
        formLabel: label,
        formInput,
        info,
        options,
        ignores,
    };
    state.$combine = combine;
    if (!value) {
        Ux.fn(reference).onChange({});
    }
    reference.setState(state);
}

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            $waiting: {
                op: "="
            }
        };
    }

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$metadata, $form = {}} = this.state;
            const {value = []} = this.props;
            const jsx = Ux.toLimit(this.props, [
                "reference",
                "config"
            ])
            const qrMessage = Ux.qrMessage(value, $metadata);
            return (
                <Input.Group {...jsx} className={"qx-criteria"}>
                    <Row>
                        <Col span={12}>
                            {Jsx.renderNotice(this, qrMessage)}
                        </Col>
                        <Col span={12}>
                            {Jsx.renderForm(this, $form, {
                                // 连接符
                                connector: qrMessage.connector,
                            })}
                        </Col>
                    </Row>
                </Input.Group>
            );
        }, Ex.parserOfColor("QxCriteria").control())
    }
}

export default Component