import React from 'react';
import {Col, Row, Table, Tabs, Tag} from 'antd';
import Ux from 'ux';
import Op from './Op';
import renderTool from './Web.Tab.Op';
import renderBatch from './Web.Tab.Batch';
import {LoadingAlert} from 'web';

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
        return (
            <div className={"ex-relation-body"}>
                <Row className={"row"}>
                    {renderTool(reference, data, key)}
                    {renderBatch(reference, data, key)}
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
        ;
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
export default (reference, tabs = {}) => {
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
}