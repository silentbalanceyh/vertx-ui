import React from 'react';
import {Col, Row} from 'antd';

import IxOpOpen from '../IxOpOpen/UI';
import IxOpBatch from '../IxOpBatch/UI';
import IxOpSearch from '../IxOpSearch/UI';
import IxOpExtra from '../IxOpExtra/UI';

import IxTable from '../IxTable/UI';

import Ux from "ux";
import Fx from '../Fx';
/* 添加按钮 */
const renderAdd = (reference) => {
    const {options = {}} = reference.state;
    return (<IxOpOpen reference={reference} $options={options}/>);
};
/* 批量按钮：编辑/删除 */
const renderBatch = (reference) => {
    const {options = {}, $keys = []} = reference.state;
    if (Fx.testBatch(options)) {
        return (<IxOpBatch reference={reference} $options={options} $keys={$keys}/>);
    } else return false;
};
/* 搜索/高级搜索 */
const renderSearch = (reference) => {
    const {options = {}} = reference.state;
    return (<IxOpSearch reference={reference} $options={options}/>);
};
/* 列变更/导入/导出 */
const renderExtra = (reference) => {
    const {options = {}} = reference.state;
    return (<IxOpExtra reference={reference} $options={options}/>);
};
/* 表格 */
const renderTable = (reference) => {
    const {options = {}, table = {}, data = {}} = reference.state;
    return (<IxTable reference={reference} $options={options}
                     $table={table} $data={data}/>);
};
const renderPageList = (reference, item = {}) => {
    return (
        <Row>
            <Row className={Ux.ECONOMY.ROW_HEAD}>
                <Col span={5} xl={5} xxl={4}>
                    {renderAdd(reference)}
                </Col>
                <Col span={8} xl={8} xxl={11}>
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
export default renderPageList;