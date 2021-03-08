import React from 'react';
import Op from './Op';
import Ex from "ex";
import Ux from 'ux';
import {Col, Row, Table} from 'antd';
import Jsx from './Web';

/**
 * ## 「组件」`ExListOpen`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 核心
 *
 * 属性 props
 *
 * ```js
 * {
 *     "config": {
 *          "query": "默认查询",
 *          "options": "配置项处理",
 *          "component": "核心组件配置",
 *          "table": "表格配置"
 *     }
 * }
 * ```
 *
 * @memberOf module:web-component
 * @method ExListOpen
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const rxWinOpen = (reference) => (config = {}, data = {}) => () => {
    // 打开窗口
    const state = {};
    const {$window = {}} = reference.state;
    const $dialog = $window[config.key];
    state.$visible = true;
    state.$inited = data;
    if ($dialog) state.$dialog = $dialog;
    reference.setState(state);
}
const rxExecutor = (reference) => (item = {}, data = {}) => () => {
    // 提取 executor 函数名称，item -> config 中配置 executor
    const {config = {}} = item;
    const key = config.executor;
    const {$executor = {}} = reference.props;
    if ($executor.hasOwnProperty(key)) {
        const fnExecutor = $executor[key];
        if (Ux.isFunction(fnExecutor)) {
            /*
             * 配置和数据交换，函数签名的最终规范执行：
             * 1. 首参：data
             * 2. 二参：config
             * 3. 三参：callback
             */
            fnExecutor(data, config, {
                // 更新专用函数（更新当前界面）
                rxRefresh: () => {
                    const stateRef = reference.state;
                    const {$query = {}} = reference.state;
                    rxRefresh(reference, stateRef, $query);
                },
            });
        }
    } else {
        console.error(`对不起，未注入 executor 到 $executor 变量中，key = ${key}`);
    }
}
const rxRefresh = (reference, stateRef = {}, query = {}) => {
    const {rxSearch} = reference.props;
    if (Ux.isFunction(rxSearch)) {
        Dsl.of(reference).bind(rxSearch).ok(response => {
            stateRef.$data = response;
            stateRef.$ready = true;
            reference.setState(stateRef);
        }).async(query);
    } else {
        console.error("对不起，API核心方法 rxSearch 不存在！");
    }
}
/*
 * 按钮解析专用函数
 */
const yiAction = (reference, button = {}) => {
    const normalized = {};
    const {text, config = {}, ...rest} = button;
    normalized.key = Ux.encryptBase64(text);
    normalized.text = text;
    if (config.confirm) {
        normalized.confirm = config.confirm;
    }
    if (config.window) {
        // 窗口类型
        normalized.onClick = rxWinOpen(reference);
    } else if (config.executor) {
        // 执行类型
        normalized.onClick = rxExecutor(reference);
    }
    normalized.config = config;
    Object.assign(normalized, rest);
    return normalized;
}

const yiSearch = (reference, stateRef = {}) => (query = {}) =>
    rxRefresh(reference, stateRef, query);

const yiWindow = (reference, configData = {}) => {
    const {connect = []} = configData;
    const $window = {};
    connect.forEach(item => {
        const {config = {}} = item;
        if (config.window) {
            const windowConfig = Ux.configDialog(reference, config.window);

            const key = Ux.encryptBase64(item.text);
            $window[key] = windowConfig;
        }
    });
    return $window;
}
const componentInit = (reference) => {
    const {config = {}, /* 基本配置 */} = reference.props;
    const {
        table = {},
        query = {},
        options = {},
        connect = [],
    } = config;
    // 表格配置
    const $table = Ux.clone(table);
    $table.columns = Ux.configColumn(reference, $table.columns);
    // rowClassName 计算
    const {css = {}} = options;
    $table.size = "small";      // 必须是小的
    if (css.row) {
        $table.rowClassName = (record, index) => {
            if (0 === index % 2) {
                return "";
            } else {
                return css.row;
            }
        }
    }
    const state = {};
    state.$table = $table;

    // 执行 onChange 事件的注入流程
    const $query = Ux.clone(query);
    state.$queryDefault = $query;
    state.$query = $query;

    // 执行 options 部分的构造
    state.$options = Ux.clone(options);

    state.$extra = connect.filter(item => {
        const {config = {}} = item;
        return "EXTRA" === config.pos;
    }).map(item => yiAction(reference, item));

    // window 专用配置
    state.$window = yiWindow(reference, config);
    state.$connect = connect.filter(item => {
        const {config = {}} = item;
        return "EXTRA" !== config.pos;
    }).map(item => yiAction(reference, item));

    // 执行 extra 部分的注入
    yiSearch(reference, state)($query);
}

class Component extends React.PureComponent {
    state = {
        $visible: false,
    }

    componentDidMount() {
        componentInit(this);
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
                            {Jsx.renderExtra(this)}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} className={css.table}>
                            <Table {...$tableConfig} dataSource={list}
                                   loading={$submitting}/>
                        </Col>
                    </Row>
                    {Jsx.renderWindow(this)}
                </div>
            )
        }, Ex.parserOfColor("ExListOpen").list());
    }
}

export default Component