import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import './Cab.less';
import {Col, Row, Select, Spin} from 'antd';
import Op from './Op';
import History from "./UI.Each";

/**
 * ## 「组件」`ExTrackField`
 *
 * ```js
 * import { ExTrackField } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:web-component
 * @method ExTrackField
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    const table = Ux.fromHoc(reference, "table");
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, table.columns);
    $table.pagination = false;
    $table.className = "ex-history ex-field-history";
    state.$table = $table;
    reference.setState(state);
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExTrackField")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$fields = []} = this.props;
            const selection = Ux.fromHoc(this, "selection");
            return (
                <div className={"ex-track-field"}>
                    <Row>
                        <Col span={5} className={"select-prefix"}>
                            {selection.prefix}
                        </Col>
                        <Col span={7}>
                            <Select {...selection.select} onChange={Op.rxSelect(this)}
                                    className={"select-input"}>
                                {$fields.map(field => (
                                    <Select.Option key={field.key} value={field.value}>
                                        {field.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {(() => {
                                const {
                                    $loading = false,
                                    $data = {items: []},
                                    $table = {}
                                } = this.state;
                                const {$dict = {}} = this.props;
                                return (
                                    <Spin spinning={$loading}>
                                        <History {...Ex.yoAmbient(this)}
                                                 $table={$table}
                                                 data={$data} $dict={$dict}/>
                                    </Spin>
                                )
                            })()}
                        </Col>
                    </Row>
                </div>
            );
        }, Ex.parserOfColor("ExTrackField").component())
    }
}

export default Component;