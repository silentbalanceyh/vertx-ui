import React from 'react';
import {Col, Row} from 'antd';

import IxOpOpen from '../IxOpOpen/UI';
import IxOpBatch from '../IxOpBatch/UI';
import IxOpSearch from '../IxOpSearch/UI';
import IxOpExtra from '../IxOpExtra/UI';

import IxTable from '../IxTable/UI';

import Ux from "ux";
import Fx from '../Fx';
import Op from './Op';

/* 添加按钮 */
const renderAdd = (reference) => (<IxOpOpen {...Op.inAdd(reference)}/>);
/* 批量按钮：编辑/删除 */
const renderBatch = (reference) => {
    const {options = {}} = reference.state;
    if (Fx.testBatch(options)) {
        return (<IxOpBatch {...Op.inBatch(reference)}/>);
    } else return false;
};
/* 搜索/高级搜索 */
const renderSearch = (reference) => (<IxOpSearch {...Op.inSearch(reference)}/>);
/* 列变更/导入/导出 */
const renderExtra = (reference) => (<IxOpExtra {...Op.inExtra(reference)}/>);
/* 表格 */
const renderTable = (reference) => (<IxTable {...Op.inTable(reference)}/>);
export default (reference, item = {}) => {
    return (
        <Row>
            <Row className={Ux.ECONOMY.ROW_HEAD}>
                <Col span={3} xl={3} xxl={2}>
                    {renderAdd(reference)}
                </Col>
                <Col span={10} xl={10} xxl={13}>
                    {renderBatch(reference)}
                </Col>
                <Col span={8} xl={8} xxl={7}>
                    {renderSearch(reference)}
                </Col>
                <Col span={3} xl={3} xxl={2}>
                    {renderExtra(reference)}
                </Col>

            </Row>
            <Row>
                <Col span={24}>
                    {renderTable(reference)}
                </Col>
            </Row>
        </Row>
    );
};