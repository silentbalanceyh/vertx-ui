import React from 'react';
import Ex from 'ex';
import Ux from "ux";
import Op from "./Op";
import {Tabs} from "antd";
import {ExAction} from "zei";

const UCA_NAME = "ExListComplex";

const Page = {};
Page[Ex.Mode.LIST] = (reference, item = {}) => Ex.kinComponent(reference, item);
Page[Ex.Mode.ADD] = (reference, item = {}) => Ex.kinForm(reference, item, true);
Page[Ex.Mode.EDIT] = (reference, item = {}) => Ex.kinForm(reference, item);

/**
 * ## 「组件」`ExListComplex`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 核心
 *
 * React属性props:
 *
 * ```js
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      config:{
 *          query: （静态默认 query，主要包含四个键：projection, pager, sorter, criteria）,
 *          options: （选项处理）,
 *          mock: {},
 *          component: {},
 *          table: {}
 *      },
 *      $query：从外层传入的查询条件
 *
 *      rxInject: 注入函数用于修改 options（工具专用）
 *      rxSearch: 函数用于调用搜索方法，传入参数
 * }
 * ```
 *
 * React状态state:
 *
 * ```js
 * {
 *      options: （原始选项）
 *      query：（核心query）
 *      $submitting: 提交
 *      $loading：加载
 * }
 * ```
 *
 * 步骤处理：
 * 0. Verify, ./specification/verify.js
 * 1. Init, ./specification/workflow.js
 *
 * @memberOf module:uca/extension
 * @method ExListComplex
 */
// =====================================================
// componentInit/componentUp
// =====================================================

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = Op.componentState(this);
    }

    componentDidMount() {
        /* Promise处理 */
        Op.componentInit(this)
            .then(state => Ux.of(this).in(state).ready().done());
        /*
         * state 结构分析
         * {
         *     $columns: [],        当前列表所拥有的列信息
         *     $columnsMy: [],      当前视图所拥有的列信息（个人部分）
         *     $dirty,              脏更新
         *     $ready,              配置加载完成
         *     $synonym,            同义语义
         *     $terms,              支持搜索的列
         *     $view,               视图：list / edit / add
         *     $key,                键值
         *     $myView: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     op,                  当前列表支持的所有 op 列表
         *     options,             当前列表支持的所有 options 配置
         *     plugins,             插件配置
         *     query,               当前系统中的配置
         *     table,               表格专用配置
         *     tabs,                页签容器配置
         * }
         * props 结构分析
         * {
         *     $app,                应用配置：DataObject
         *     $menus,              菜单数据：DataArray
         *     $router,             路由处理：DataRouter
         *     $setting,            Ant Pro专用设置数据，从模板中继承
         *     $user,               登录用户数据：DataObject
         *     $collapsed,          菜单是否关闭（保留）
         *     $executor,           执行器配置
         *     $form,               表单配置：FormEdit, FormAdd, FormFilter
         *     $myDefault: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $options: {}         可传递选项信息
         *     config: {            配置数据，对应上层 Grid
         *         component:       组件配置（五种）
         *         options:         选项信息
         *         query:           默认查询信息
         *         table:           默认表格配置 {
         *             total,
         *             row,
         *             columns
         *         }
         *     }
         *     fnApp / fnOut        Redux状态函数
         *     react,               顶层组件引用
         *     reference,           父组件引用
         *     skin,                皮肤数据
         *     store,               Redux存储器
         * }
         */
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ex.kinUp(this, {
            prevProps,
            prevState,
            pageFn: Op.componentAtom,       // 初始化函数
        });
    }

    render() {
        return Ex.yoRender(this, () => {
                const {tabs = {}, options = {}} = this.state;
                /*
                 * 当前组件不调用 ExTab 来处理 Tab
                 * 页签行为，而是直接使用 antd 中的 Tabs，主要是防止和原始的
                 * ComplexList / ExListComplex 产生冲突
                 */
                const isSingle = options[Ex.Opt.TABS_DISABLED];
                if (isSingle) {
                    // 单页面
                    return Page[Ex.Mode.LIST](this, {});
                } else {
                    const {items = [], ...rest} = tabs;
                    const tabAttrs = Ux.clone(rest);
                    // v4
                    let $items = [];
                    if (options[Ex.Opt.TABS_TITLE]) {
                        $items.push({
                            key: "disabled",
                            label: (
                                <div className={"ux_tab_title_icon"}>
                                    {Ux.v4Icon("caret-right")}
                                    {options[Ex.Opt.TABS_TITLE]}
                                </div>
                            ),
                            disabled: true,
                            closable: false
                        })
                    }
                    $items = $items.concat(Ux.v4Items(items, {
                        // itemFn: 默认
                        childFn: (item, ref, index) => {
                            const {type, ...rest} = item;
                            /*
                             * 禁用第一项处理
                             */
                            const $item = Ex.yoTabPage(ref, {
                                items, index, item,
                            });
                            const fnRender = Page[type];
                            return $item ? Ux.isFunction(fnRender) ? fnRender(ref, rest) : (
                                <span className={"ux_error"}>`fnRender` Function not Found</span>
                            ) : false
                        }
                    }, this));
                    /*
                            {(() => {
                                if (options[Ex.Opt.TABS_TITLE]) {
                                    return (
                                        <Tabs.?abPane tab={
                                            <div className={"web-tab-title-icon"}>
                                                {Ux.v4Icon("caret-right")}
                                                {options[Ex.Opt.TABS_TITLE]}
                                            </div>
                                        }
                                                      disabled={true}
                                                      closable={false}/>
                                    );
                                }
                            })()}
                            {items.map((item, index) => {
                                const {type, ...rest} = item;
                                const $item = Ex.yoTabPage(this, {
                                    items, index, item,
                                });
                                const fnRender = Page[type];
                                return $item ? (
                                    <Tabs.?abPane {...item}>
                                        {Ux.isFunction(fnRender) ? fnRender(this, rest) : (
                                            <span className={"ex-error"}>`fnRender` Function not Found</span>
                                        )}
                                    </Tabs.?abPane>
                                ) : false
                            })}
                     */
                    return (
                        <Tabs {...tabAttrs}
                              tabBarExtraContent={Ex.ylTabExtra(this, tabAttrs, ExAction)}
                              items={$items}/>
                    );
                }
            }, Ex.parserOfColor(UCA_NAME).list()
        )
    }
}

export default Component;