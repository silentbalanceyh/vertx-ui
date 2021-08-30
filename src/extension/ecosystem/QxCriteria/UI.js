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
        op = [], info = {}, ignores = {}
    } = combine;
    const $metadata = {};
    $metadata.pattern = pattern;
    $metadata.mapping = {};
    $metadata.messageConnect = info.connector;
    const options = [];
    field.filter(each => "key" !== each.dataIndex).forEach(each => {
        // 基础列构造
        $metadata.mapping[each.dataIndex] = each.title
        // 选项处理（组件配置）
        const item = {};
        item.value = each.dataIndex;
        item.key = each.dataIndex;
        item.label = each.title;
        item.control = each['$render'] ? each['$render'] : "TEXT";
        // 配置专用
        const config = {};
        if (each['$format']) {
            config.format = each['$format'];
        }
        if (each['$mapping']) {
            config.mapping = each['$mapping'];
        }
        item.config = config;
        options.push(item);
    });
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