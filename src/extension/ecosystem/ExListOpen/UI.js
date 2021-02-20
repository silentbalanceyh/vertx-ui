import React from 'react';
import Op from './Op';
import Ex from "ex";
import Ux from 'ux';
import {Col, Row, Table} from 'antd';
import jsx from './Web';

/*
 * 属性 props;
 * {
 *     "config": {
 *          "query": "默认查询",
 *          "options": "配置项处理",
 *          "component": "核心组件配置",
 *          "table": "表格配置"
 *     }
 * }
 */
class Component extends React.PureComponent {
    state = {
        $visible: false,
    }

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $options = {},
                $data = {}, $table = {},
                $submitting = false,
            } = this.state;
            const {css = {}} = $options;

            const $tableConfig = Ux.clone($table);
            Op.yoPagination(this, $tableConfig);
            const {list = []} = $data;
            return (
                <div className={css.content}>
                    <Row className={css.toolbar}>
                        <Col {...css.extra}>
                            {jsx.jsxExtra(this)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={css.table}>
                            <Table {...$tableConfig} dataSource={list}
                                   loading={$submitting}/>
                        </Col>
                    </Row>
                    {jsx.jsxWindow(this)}
                </div>
            )
        }, Ex.parserOfColor("ExListOpen").list());
    }
}

export default Component