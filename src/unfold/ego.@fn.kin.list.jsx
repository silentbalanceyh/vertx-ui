import Ux from "ux";
import {Col, Row, Spin} from "antd";
import {ExAction, ExSearch} from "./aero-extenion";
import React from "react";
import __Zn from './zero.module.dependency';
import renderContent from './ego.__.@fn.kin.list.table';

/**
 * ## 「标准」`Ex.kinComponent`
 *
 * @method kinComponent
 * @memberOf module:kin/unfold
 * @param reference
 * @param item
 * @return {*}
 */
export default (reference, item = {}) => {
    const {
        css = {}
    } = reference.props;


    /*
     * ExAction中数据结构
     * props 结构分析
     * {
         *     $app,                应用配置：DataObject
         *     $menus,              菜单数据：DataArray
         *     $router,             路由处理：DataRouter
         *     $setting,            Ant Pro专用设置数据，从模板中继承
         *     $user,               登录用户数据：DataObject
         *     $collapsed,          菜单是否关闭（保留）
         *     $myDefault: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $myView: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $options: {}         列表配置
         *     $synonym,            同义语义
         *     config: [
         *         {
         *              category,
         *              icon,
         *              id,
         *              key,
         *              onClick,
         *              plugin,
         *              text,
         *              type
         *         }
         *     ]
         *     fnApp / fnOut        Redux状态函数
         *     react,               顶层组件引用
         *     reference,           父组件引用
         *     skin,                皮肤数据
         *     store,               Redux存储器
     * }
     */
    const opens = __Zn.yoListOpen(reference);


    /*
     * ExAction中数据结构
     * props 结构分析
     * {
         *     $app,                应用配置：DataObject
         *     $menus,              菜单数据：DataArray
         *     $router,             路由处理：DataRouter
         *     $setting,            Ant Pro专用设置数据，从模板中继承
         *     $user,               登录用户数据：DataObject
         *     $collapsed,          菜单是否关闭（保留）
         *     $myDefault: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $myView: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $options: {}         列表配置
         *     $synonym,            同义语义
         *     config: [
         *         {
         *              category,
         *              icon,
         *              id,
         *              key,
         *              onClick,
         *              plugin,
         *              text,
         *              type
         *         }
         *     ]
         *     fnApp / fnOut        Redux状态函数
         *     react,               顶层组件引用
         *     reference,           父组件引用
         *     skin,                皮肤数据
         *     store,               Redux存储器
         * 多出来的函数配置
         *     rxMyViewV            保存个人视图
         *     rxDirty              脏标记
         *     rxExport             导出处理
         *     rxImport             导入处理
         *     rxViewV         列变更
     * }
     */
    const extra = __Zn.yoListExtra(reference);


    /*
     * ExAction中数据结构
     * props 结构分析
     * {
         *     $app,                应用配置：DataObject
         *     $menus,              菜单数据：DataArray
         *     $router,             路由处理：DataRouter
         *     $setting,            Ant Pro专用设置数据，从模板中继承
         *     $user,               登录用户数据：DataObject
         *     $collapsed,          菜单是否关闭（保留）
         *     $myDefault: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $myView: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $options: {}         列表配置
         *     $synonym,            同义语义
         *     config: [
         *         {
         *              category,
         *              icon,
         *              id,
         *              key,
         *              onClick,
         *              plugin,
         *              text,
         *              type
         *         }
         *     ]
         *     fnApp / fnOut        Redux状态函数
         *     react,               顶层组件引用
         *     reference,           父组件引用
         *     skin,                皮肤数据
         *     store,               Redux存储器
         *     $category: "LINK",               链接类型
         *     $selected: [] 表格选择行数据
         *     $submitting:  是否在提交
         *
         * 多出来的函数配置
         *     doDirty
         *     rxSubmitting
         *     rxBatchEdit
     * }
     */
    const batch = __Zn.yoListBatch(reference);


    /*
     * ExSearch中数据结构
     * props 结构分析
     * {
         *     $app,                应用配置：DataObject
         *     $menus,              菜单数据：DataArray
         *     $router,             路由处理：DataRouter
         *     $setting,            Ant Pro专用设置数据，从模板中继承
         *     $user,               登录用户数据：DataObject
         *     $collapsed,          菜单是否关闭（保留）
         *     $myDefault: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $myView: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $options: {}         列表配置
         *     $synonym,            同义语义
         *     config: [
         *         {
         *              category,
         *              icon,
         *              id,
         *              key,
         *              onClick,
         *              plugin,
         *              text,
         *              type
         *         }
         *     ]
         *     fnApp / fnOut        Redux状态函数
         *     react,               顶层组件引用
         *     reference,           父组件引用
         *     skin,                皮肤数据
         *     store,               Redux存储器
         *
         *     $disableClear:       禁用清除
         *     $fabric:             配置特殊配置
         *     $form:               表单配置（主要处理 FormFilter）
         *     $inited:             初始化值
         *
         *
         * 多出来的函数配置
         *     rxViewQ
         *     rxViewQData
         *     rxMyViewQ
     * }
     */
    const search = __Zn.yoListSearch(reference);


    /*
     * ExAction中数据结构
     * props 结构分析
     * {
         *     $app,                应用配置：DataObject
         *     $menus,              菜单数据：DataArray
         *     $router,             路由处理：DataRouter
         *     $setting,            Ant Pro专用设置数据，从模板中继承
         *     $user,               登录用户数据：DataObject
         *     $collapsed,          菜单是否关闭（保留）
         *     $myDefault: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $myView: {
         *         name: "视图名称",
         *         position: "视图位置"
         *     },
         *     $options: {}         列表配置
         *     $synonym,            同义语义
         *     fnApp / fnOut        Redux状态函数
         *     react,               顶层组件引用
         *     reference,           父组件引用
         *     skin,                皮肤数据
         *     store,               Redux存储器
         *
         *     $batch:              开启批量
         *     $condition:          条件变更
         *     $dirty:              脏更新
         *     $dirtyAsync:         异步脏更新
         *     $loading:            是否加载表格
         *     $query:              新的查询参数
         *     $selected:           选择的值
         *     $terms:              可查询的列
         *
         * 多出来的函数配置
         *     rxCondition
         *     rxDelete
         *     rxOpen
         *     rxSearch
         *     rxSelected
         *     rxView
     * }
     */
    // const table = __Zn.yoTable(reference);

    const cssGrid = __Zn.yoListGrid(reference, {
        extra, opens, batch, search
    });
    const {clsRow = Ux.Env.ECONOMY.ROW_HEAD} = css;
    const {$spinning = false} = reference.state;
    return (
        <Spin spinning={$spinning}>
            <Row className={clsRow}>
                <Col {...cssGrid.open}>
                    {0 < opens.config.length ? (<ExAction {...opens}/>) : false}
                </Col>
                <Col {...cssGrid.batch}>
                    {0 < batch.config.length ? (<ExAction {...batch}/>) : false}
                </Col>
                <Col {...cssGrid.search}>
                    {!Ux.isEmpty(search) ? (<ExSearch {...search}/>) : false}
                </Col>
                <Col {...cssGrid.extra}>
                    {0 < extra.config.length ? (<ExAction {...extra} // 只有 Extra 部分会调用 rxMyViewAt 函数
                                                          rxMyViewAt={__Zn.irViewAt(reference)}/>) : false}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {renderContent(reference)}
                </Col>
            </Row>
        </Spin>
    )
}
