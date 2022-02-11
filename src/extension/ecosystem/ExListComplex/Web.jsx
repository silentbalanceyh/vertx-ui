import Ex from 'ex';
import React from "react";
import Ux from "ux";
import {Col, Row} from "antd";
import ExAction from "../ExAction/UI";
import ExSearch from "../ExSearch/UI";
import ExTable from "../ExTable/UI";
import './Cab.less';

const PageList = (reference, item = {}) => {
    const {
        css = {}
    } = reference.props;
    /*
     * 处理 op 相关信息
     */
    const opens = Ex.yoListOpen(reference);
    const extra = Ex.yoListExtra(reference);
    /*
     * 处理 batch 批量
     */
    const batch = Ex.yoListBatch(reference);
    /*
     * 局部变量
     */
    const search = Ex.yoListSearch(reference);
    /*
     * 处理 table 相关信息
     */
    const table = Ex.yoTable(reference);
    /*
     * 处理 plugins
     */
    const exchange = Ex.yoListGrid(reference, {
        extra, opens, batch, search
    });
    const {clsRow = Ux.Env.ECONOMY.ROW_HEAD} = css;
    return (
        <div>
            <Row className={clsRow}>
                <Col {...exchange.open} className={"ex-open"}>
                    {0 < opens.config.length ? (<ExAction {...opens}/>) : false}
                </Col>
                <Col {...exchange.batch}>
                    {0 < batch.config.length ? (<ExAction {...batch}/>) : false}
                </Col>
                <Col {...exchange.search}>
                    {!Ux.isEmpty(search) ? (<ExSearch {...search}/>) : false}
                </Col>
                <Col {...exchange.extra}>
                    {0 < extra.config.length ? (<ExAction {...extra} // 只有 Extra 部分会调用 rxViewMy 函数
                                                          rxViewMy={($myView) => reference.setState({$myView})}/>) : false}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <ExTable {...table}/>
                </Col>
            </Row>
        </div>
    )
}
const exported = {};
exported[Ex.Mode.LIST] = PageList;
exported[Ex.Mode.ADD] = (reference, item = {}) => {
    const {$form = {}} = reference.props;
    /*
     * 表单提取
     */
    const {FormAdd} = $form;
    if (FormAdd) {
        /*
         * 添加表单处理，设置添加表单相关信息
         */
        const formAttrs = Ex.yoFormAdd(reference, item);
        return (<FormAdd {...formAttrs}/>)
    } else {
        console.error("`FormAdd`表单组件未设置，无任何界面呈现！");
        return false;
    }
};
exported[Ex.Mode.EDIT] = (reference, item = {}) => {
    const {$form = {}} = reference.props;
    /*
     * 表单提取
     */
    const {FormEdit} = $form;
    if (FormEdit) {
        /*
         * 添加表单处理，设置添加表单相关信息
         */
        const formAttrs = Ex.yoFormEdit(reference, item);
        return (<FormEdit {...formAttrs}/>)
    } else {
        console.error("`FormEdit`表单组件未设置，无任何界面呈现！");
        return false;
    }
};
export default exported;