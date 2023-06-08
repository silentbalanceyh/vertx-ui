import React from 'react';
import Ex from 'ex';
import {Space, Tabs} from "antd";
import Ux from "ux";
import Op from "./OxList.Op";
import Plugin from "plugin";
import Sk from "skin";
import {ExListComplex} from "ei";
import UI_UNLOCK from "../index.entry.UNLOCK";
import "./OxList.norm.scss";

/**
 * ## 「组件」`OxList`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method OxList
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const initOxList = (reference) => {
    const {$form, $controls = {}} = reference.props;
    if ($form) {
        const {FormAdd, FormEdit, FormFilter} = $form;
        /*
         * 提取 三个核心的 control 数据
         */
        return Ux.promise({
            FormAdd: $controls[FormAdd],
            FormEdit: $controls[FormEdit],
            FormFilter: $controls[FormFilter]
        }).then(response => {
            const $form = {};
            Object.keys(response).forEach(field => $form[field] =
                (props) => Ex.xuiDecorator(response[field], UI, props));
            const state = {};
            state.$form = $form;
            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        });
    }
};

class OxList extends React.PureComponent {
    state = {};

    componentDidMount() {
        initOxList(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, $record = {}} = this.props;  // 基本配置
            let $config = Ux.clone(config);
            if ($config.options) {
                // 动静切换（由于OxList外置已经处理过 Op了，所以此处仅强制 dynamic.op = false;
                $config.options[Ex.Opt.DYNAMIC_OP] = false;
                // 编辑按钮在 EXTRA 中不呈现
                $config.options[Ex.Opt.TABS_EXTRA_EDIT] = false;
            }
            const {$form = {}, $tree = []} = this.state;   // 表单配置
            const inherit = Ex.yoDynamic(this); // 新方法
            /*
             * 处理 $config 中的 $query
             */
            $config = Op.yoQuery(this, $config);
            /*
             * pluginField 转入 ExListComplex
             */
            if (!inherit.$plugins) {
                inherit.$plugins = {};
            }
            inherit.$plugins.pluginFieldFn = Plugin.pluginField;
            const attrsOx = Sk.mixOx("OxList");
            return (
                <div {...attrsOx}>
                    <ExListComplex {...inherit}
                                   config={$config}
                                   $form={$form}            // 增删改专用Form注入
                                   $record={$record}        // 复杂表单专用的记录，替换 $inited 的第二原始数据
                                   $forbidden={$config.$forbidden} // 关闭 options 专用
                                   $query={$config.query}   // 外置专用的 query 读取
                                   $tree={$tree}
                                   rxPostSelected={Op.rxPostSelected(this)}
                                   rxPostOpen={() => Ux.activeTreeOff()}
                                   rxPostClose={() => Ux.activeTreeOn()}
                    />
                </div>
            );
        }, Ex.parserOfColor("OxList").list());
    }
}

/**
 * ## 「组件」`OxTab`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method OxTab
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const initOxTab = (reference) => {
    const state = {};
    state.$ready = true;
    /*
     * 配置处理
     * 1.主配置
     * 2.子配置
     */
    const {config = {}, $controls = {}} = reference.props;
    /*
     * 主界面处理
     */
    const normalized = Ux.configTab(reference, config);
    const {controls = {}, ...$tabs} = normalized;
    /*
     * 处理 fnRender 部分
     */
    if (Ux.isArray($tabs.items)) {
        $tabs.items.forEach(item => {
            const controlId = controls[item.key];
            if (controlId) {
                const controlData = $controls[controlId];
                if (controlData) {
                    item.forceRender = true;
                    item.fnRender = (props) =>
                        /* controlData, props, state */
                        Ex.xuiDecorator(controlData, UI, props, reference.state);
                }
            }
        })
    }
    $tabs.className = "ux_tab";
    $tabs.type = "card";
    $tabs.onTabClick = () => {
        /* $switcher 变更 */
        const $switcher = Ux.randomString(32);
        Ux.of(reference).in({$switcher}).done();
        // reference.?etState({$switcher});
    };
    state.$tabs = $tabs;
    const {$inited = {}} = reference.props;
    if (!Ux.isEmpty($inited)) {
        state.$inited = $inited;
    }
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
};

class OxTab extends React.PureComponent {
    componentDidMount() {
        initOxTab(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * inherit 处理
             */
            const inherit = Ex.yoDynamic(this);

            const {$tabs = {}} = this.state;
            const {items = [], ...rest} = $tabs;

            // v4
            const $items = Ux.v4Items(items, {
                // itemFn: 取默认
                childFn: (item = {}) => {
                    const {fnRender} = item;
                    return Ux.isFunction(fnRender) ? fnRender(inherit) : (
                        <Space className={"ux_error"}>
                            fnRender 函数不存在
                        </Space>
                    )
                }
            }, this);
            /*
                    {items.map(item => {
                        const {fnRender, ...itemRest} = item;
                        return (
                            <Tabs.?abPane {...itemRest}>
                                {Ux.isFunction(fnRender) ? fnRender(inherit) : false}
                            </Tabs.?abPane>
                        )
                    })}
             */
            return (
                <Tabs {...rest} items={$items}/>
            );
        }, Ex.parserOfColor("OxTab").container())
    }
}

const UI = {
    ...UI_UNLOCK,
    OxList,
    OxTab,
}

export {
    OxTab,
    OxList
}