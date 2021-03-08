import {Col, Popconfirm, Row, Table, Tabs, Tag} from "antd";
import Ux from "ux";
import Op from "./Op";
import {LoadingAlert} from "web";
import React from "react";
import Ex from "ex";
import ExRegiment from '../ExRegiment/UI';

const renderTool = (reference, data, key) => Ux.sexModal(reference, `${key}Op`, () => {
    /*
     * ExRegiment 专用的配置信息
     */
    const inherit = Ex.yoAmbient(reference);
    inherit.rxSubmit = Op.rxSave(reference, key);
    inherit.$isCategory = false;
    /*
     * 构造 ExRegiment 的 $query 条件
     */
    inherit.$query = Op.rxQuery(reference, key);
    return (
        <ExRegiment {...inherit}/>
    );
});

const renderBatch = (reference, data = [], key) => {
    const state = reference.state ? reference.state : {};
    let $selected = [];
    if ("up" === key) {
        $selected = state['$selectedUp'];
    } else {
        $selected = state['$selectedDown'];
    }
    if (!$selected) {
        $selected = [];
    }
    const batch = Ux.fromHoc(reference, "batch");
    if (batch) {
        const attrs = {};
        attrs.disabled = 0 === $selected.length;
        if (batch.confirm) {
            const confirmAttrs = {};
            if (0 < $selected.length) {
                confirmAttrs.onConfirm = (event) => {
                    Ux.prevent(event);
                    Op.rxRemove(reference, $selected, key);
                };
                confirmAttrs.title = batch.confirm;
            }
            attrs.onClick = Ux.prevent;
            return (
                <Popconfirm {...confirmAttrs}>
                    {/* eslint-disable-next-line */}
                    <a href={"#"} {...attrs}>
                        {batch.text}
                    </a>
                </Popconfirm>
            )
        } else {
            if (0 < $selected.length) {
                attrs.onClick = (event) => {
                    Ux.prevent(event);
                    Op.rxRemove(reference, $selected, key);
                }
            }
            return (
                // eslint-disable-next-line
                <a href={"#"} {...attrs}>
                    {batch.text}
                </a>
            )
        }
    } else {
        return false;
    }
}

const renderTag = (reference, tips = {}) => {
    const {config = {}} = reference.props;
    const colAttrs = {};
    if (config.editable) {
        colAttrs.style = {paddingTop: 4};
    }
    colAttrs.className = "row-right";
    colAttrs.span = 4;
    return (
        <Col {...colAttrs}>
            {/** 标签用于表示关系相关处理 **/}
            <Tag color={tips.color} style={{fontSize: 15}}>
                {tips.title}
            </Tag>
        </Col>
    )
};
const _renderPage = (reference, data, key, combine) => {
    let relation = Ux.fromHoc(reference, "relation");
    if (!relation) relation = {};
    if (relation[key]) {
        const {table = {}, tips = {}} = relation[key];
        const $table = Op.yoTable(reference, table, key, combine);
        if (4 < data.length) {
            $table.scroll = {};
            $table.scroll.y = 240;
        }
        const editable = Op.isEditable(reference);  // 是否开启编辑视图
        return (
            <div className={"ex-relation-body"}>
                <Row className={"row"}>
                    {editable ? (
                        <Col span={20} className={"row-op"}>
                            {renderTool(reference, data, key)}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {renderBatch(reference, data, key)}
                        </Col>
                    ) : (
                        <Col span={20} className={"row-empty"}>
                            {(() => {
                                const empty = Ux.fromHoc(reference, "empty");
                                const {edit = {}} = empty;
                                const {config = {}} = reference.props;
                                if (config.editable) {
                                    return edit.data;
                                } else {
                                    return edit.view;
                                }
                            })()}
                        </Col>
                    )}
                    {renderTag(reference, tips)}
                </Row>
                <Row>
                    <Col span={24}>
                        <Table {...$table} dataSource={data}/>
                    </Col>
                </Row>
            </div>
        )
    } else return false;
};
const _renderIf = (reference, key, fnRender) => {
    const {$selectedCategory = [], $defineMap = []} = reference.state;
    const empty = Ux.fromHoc(reference, "empty");
    if (0 < $selectedCategory.length) {
        /*
         * 有选择
         */
        const identifiers = Ux.immutable($defineMap[key]);
        if (identifiers.contains($selectedCategory[0])) {
            return fnRender();
        } else {
            const config = empty[key];
            return <LoadingAlert $alert={config} $icon={`arrow-${key}`}/>
        }
    } else {
        /*
         * 上游关系处理，前提是 $defineMap.up > 0
         */
        if ($defineMap[key] && 0 < $defineMap[key].length) {
            return fnRender();
        } else {
            const config = empty[key];
            return <LoadingAlert $alert={config} $icon={`arrow-${key}`}/>
        }
    }
};
const _renderUp = (reference, fnRender) => _renderIf(reference, "up", fnRender);
const _renderUpPage = (reference, up, combine) => _renderPage(reference, up, "up", combine);
const _renderDown = (reference, fnRender) => _renderIf(reference, "down", fnRender);
const _renderDownPage = (reference, down, combine) => _renderPage(reference, down, "down", combine);

export default {
    renderPage: (reference, tabs = {}) => {
        const {items = [], ...rest} = tabs;
        /*
         * Tab页签添加滚动条
         */
        let height = document.body.clientHeight;
        height = height * 0.618;
        return 0 < items.length ? (
            <Tabs {...rest} style={{height}}>
                {items.map(item => {
                    const {up = [], down = [], combine, ...rest} = item;
                    return (
                        <Tabs.TabPane {...rest}>
                            {_renderUp(reference, () => _renderUpPage(reference, up, combine))}
                            {_renderDown(reference, () => _renderDownPage(reference, down, combine))}
                        </Tabs.TabPane>
                    )
                })}
            </Tabs>
        ) : Ux.aiEmpty()
    },
    renderHeader: (data = {}, header = {}) => (
        <Row className={"ex-relation-header"}>
            <Col span={6}>
                <span className={"prefix"}>{header.category}：</span>
                <Tag color={"geekblue"}
                     style={{fontSize: 15}}>
                    {data.category}
                </Tag>
            </Col>
            <Col span={6}>
                <span className={"prefix"}>{header.identifier}：</span>
                {data.identifier}
            </Col>
            <Col span={6}>
                <span className={"prefix"}>{header.code}：</span>
                {data.code}
            </Col>
            <Col span={6}>
                <span className={"prefix"}>{header.name}：</span>
                {data.name}
            </Col>
        </Row>
    )
}