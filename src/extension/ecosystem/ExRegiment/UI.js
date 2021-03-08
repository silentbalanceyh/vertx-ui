import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {Col, Icon, Input, Row, Table, Tag} from 'antd';
import './Cab.less';
import Ux from 'ux';
import ExArbor from '../ExArbor/UI';

/**
 * ## 「组件」`ExRegiment`
 *
 * ```js
 * import { ExRegiment } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|Ok|
 *
 * @memberOf module:web-component
 * @method ExRegiment
 */
// =====================================================
// componentInit/componentUp
// =====================================================

const componentInit = (reference) => {
    const {config = {}, $selected = []} = reference.props;
    const configuration = Ux.fromHoc(reference, "regiment");
    if (!Ux.isEmpty(config)) {
        Object.assign(configuration, config);
    }
    /*
     * 三个组件的专用配置处理
     */
    const {
        search = {},
        table = {}, divider = {},
        submit = {}, category = {}
    } = configuration;
    const $search = {};
    {
        /*
         * 搜索专用
         */
        const {condition = [], ...restSearch} = search;
        Object.assign($search, restSearch);
        /* 必须支持清空 */
        $search.allowClear = true;
        $search.onSearch = Op.onSearch(reference, {condition})
    }
    const $query = Op.yoQuery(reference, configuration);

    const $table = {};
    const $tabulation = {};
    const $divider = {};
    {
        /*
         * 表格专用
         */
        const {columns = {}, ...restTable} = table;
        Object.assign($table, restTable);
        $table.columns = Ux.configColumn(reference, columns);
        $table.className = "regiment-table";
        $table.pagination = {simple: true, size: "small", pageSize: 6};
        /*
         * 选择项
         */
        Object.assign($tabulation, Ux.clone($table));
        /*
         * $tabulation 需要追加: 删除选项额按钮
         */
        if (configuration.remove) {
            $tabulation.columns = [{
                dataIndex: "key",
                className: "row-remove",
                render: (text, record) => (
                    // eslint-disable-next-line
                    <a onClick={Op.onRemove(reference, record)}>
                        <Icon type={"delete"}/>
                        &nbsp;&nbsp;
                        {configuration.remove}
                    </a>
                )
            }].concat($tabulation.columns);
        }
        if (!Ux.isEmpty(divider)) {
            Object.assign($divider, divider);
        }


        $table.rowSelection = Op.onSelection(reference);
    }
    const $submit = {};
    {
        const {validation = "", ...rest} = submit;
        Object.assign($submit, rest);
        $submit.onClick = Op.onSubmit(reference, {validation});
    }
    /*
     * $category 专用
     */
    const $category = {};
    const $path = {};
    if (category.source) {
        const dataSource = Ux.onDatum(reference, category.source);
        const config = category.tree;
        $category.data = dataSource;
        $category.config = config;
        $category.fnSelect = Op.onSelect(reference, category.selected);
        /*
         * 处理 $path
         */
        const path = Ux.treeFlip(dataSource, {parent: "parentId", keyField: "key"});
        if (path) {
            Object.assign($path, path);
        }
    }
    /*
     * 专用 $ready = true
     * 状态更新
     */
    const state = {
        $table, $search, $query, $path,
        $tabulation, $divider,
        $category,
        $submit, $ready: true,
        config: configuration,
        $selected
    };
    reference.setState(state);
};
const componentUp = (reference, virtualRef = {}) => {
    const {$query = {}} = reference.state;
    const previous = virtualRef.state.$query;
    if (Ux.isDiff($query, previous)) {
        Op.onRefresh(reference);
    }
};

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExRegiment")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {
            props: prevProps,
            state: prevState
        })
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                /* 选择后的操作 */
                $submit = {},
                /* 数据、加载 */
                $loading = false,
                /* 左边树，搜索框，表格 */
                $category = {}, $search = {}, $table = {},
                /* 选中项 */
                $divider = {}, $tabulation = {}, $selected = [],
                /* 和category 相关的选中 */
                $clean
            } = this.state;
            const dataSource = Op.yoUnSelected(this);
            Ux.configScroll($table, dataSource, this);
            /*
             * 选择列表和清单
             */
            const {$isCategory = true} = this.props;
            const divide = {};
            if ($isCategory) {
                divide.left = 4;
                divide.right = 20;
            } else {
                divide.left = 0;
                divide.right = 24;
            }
            return (
                <div className={"ex-regiment"}>
                    <Row>
                        <Col span={4}>
                            <div className={"row-search"}>
                                <Input.Search {...$search}/>
                            </div>
                        </Col>
                        <Col span={20} className={"row-tag"}>
                            {$clean ? (
                                <Tag color={"volcano"} closable
                                     visible={!Ux.isEmpty($clean)} className={"tag"}
                                     onClose={Op.onClean(this, $clean.query)}>
                                    {$clean.label}
                                </Tag>
                            ) : false}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={divide.left}>
                            <div className={"row-left"}>
                                <ExArbor {...$category}/>
                            </div>
                        </Col>
                        <Col span={divide.right}>
                            <Table {...$table} loading={$loading}
                                   dataSource={dataSource}/>
                            <div className={"row-divider"}>
                                <Tag color={$divider.color} className={"tag"}>
                                    <Icon type={"caret-down"}/>&nbsp;
                                    {$divider.text}
                                </Tag>
                            </div>
                            <Table {...$tabulation}
                                   dataSource={$selected}/>
                        </Col>
                    </Row>
                    {Ux.aiButton(this, $submit)}
                </div>
            );
        }, Ex.parserOfColor("ExRegiment").component())
    }
}

export default Component;