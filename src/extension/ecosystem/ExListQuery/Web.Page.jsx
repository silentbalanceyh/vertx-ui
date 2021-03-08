import Ex from 'ex';
import React from "react";
import Ux from "ux";
import {Col, Row} from "antd";
import ExAction from "../ExAction/UI";
import ExTable from "../ExTable/UI";
import './Cab.less';

const renderSearch = (reference) => {
    const {$form = {}} = reference.props;
    const Component = $form.FormSearch;
    if (Component) {
        const attrs = Ex.yoListSearch(reference);
        return (
            <Component {...attrs}/>
        )
    } else return false;
}

const renderList = (reference, {
    css: {
        clsRow = Ux.Env.ECONOMY.ROW_HEAD
    },
    opens = {},  // Open区域
    extra = {},  // Extra区域
    table = {},  // Table专用
}) => {
    const layout = {};
    if (0 === opens.config.length) {
        layout.left = {
            span: 0,
            xl: 0,
            xxl: 0
        }
    } else {
        layout.left = {
            span: 1,
            xl: 1,
            xxl: 2
        }
    }
    if (0 === extra.config.length) {
        layout.right = {
            span: 0,
            xl: 0,
            xxl: 0
        }
    } else {
        layout.right = {
            span: 2,
            xl: 2,
            xxl: 3
        }
    }
    layout.middle = {
        span: 24 - layout.left.span - layout.right.span,
        xl: 24 - layout.left.xl - layout.right.xl,
        xxl: 24 - layout.left.xxl - layout.right.xxl,
    }
    return (
        <Row>
            <Row className={clsRow}>
                <Col {...layout.left}>
                    {0 < opens.config.length ? (<ExAction {...opens}/>) : false}
                </Col>
                <Col {...layout.middle}>
                    {renderSearch(reference)}
                </Col>
                <Col {...layout.right} className={"ex-extra"}>
                    {0 < extra.config.length ? (<ExAction {...extra}/>) : false}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <ExTable {...table}/>
                </Col>
            </Row>
        </Row>
    )
}
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
     * 处理 table 相关信息
     */
    const table = Ex.yoTable(reference);
    /*
     * 处理 plugins
     */
    return renderList(reference, {
        css,
        opens,
        table,
        extra,
    });
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