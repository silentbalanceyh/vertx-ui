import func_arrange_value_complex from './fn.arrange.value.complex';
import func_arrange_value_stdn from './fn.arrange.value.stdn';
import func_arrange_element_tree from './fn.arrange.element.tree';

import func_assemble_amb_form from './fn.assemble.amb.form';
import func_assemble_amb_polysemy from './fn.assemble.amb.polysemy';
import func_assemble_element_calculate from './fn.assemble.element.calculate';
import func_assemble_element_change from './fn.assemble.element.change';
import func_assemble_element_qr from './fn.assemble.element.qr';

import func_assort_value_typed from './fn.assort.value.typed';
import func_assort_value_datetime from './fn.assort.value.datetime';
import func_assort_value_expr from './fn.assort.value.expr';

import func_atomic_async from './fn.atomic.async';
import func_atomic_foundation from './fn.atomic.foundation';

import func_under_is_business from './fn.under.is.business';
import func_under_is_complex from './fn.under.is.complex';
import func_under_is_decision from './fn.under.is.decision';
import func_under_is_rule from './fn.under.is.rule';

import func_under_it_complex from './fn.under.it.complex';
import func_under_it_spread from './fn.under.it.spread';

import func_under_kv_future from './fn.under.kv.future';
import func_under_to_business from './fn.under.to.business';
import func_under_to_expr from './fn.under.to.expr';
import func_under_to_typed from './fn.under.to.typed';

import func_under_way_io from './fn.under.way.io';

import func_debug_fx_error from './fn.debug.fx.error';
import func_debug_dg_develop from './fn.debug.dg.develop';
import func_debug_dg_logging from './fn.debug.dg.logging';
import func_debug_dgl_complex from './fn.debug.dgl.complex';

import func_web_compile_store from './fn.web.compile.store';
import func_web_connect_event from './fn.web.connect.event';
import func_web_from_react from './fn.web.from.react';
import func_web_on_react from './fn.web.on.react';

import func_unity_format from './fn.unity.format';
import func_unity_random from './fn.unity.random';
import func_unity_sorter from './fn.unity.sorter';
import func_unity_sorter_fn from './fn.unity.sorter.fn';
import func_unity_encrypt from './fn.unity.encrypt';
import func_unity_math from './fn.unity.math';

import o_bullet_fn from './o.silver.bullet.fn';
import o_bullet_of from './o.silver.bullet.of';

import value_env from './v.environment';

import value_modello_type from "./v.modello.type";
import value_modello_op from './v.modello.op';

import value_feature_key from './v.feature.key';
import value_feature_http from './v.feature.http';
import value_feature_symbol from './v.feature.symbol';
import value_feature_develop from './v.feature.develop';

import value_web_layout from './v.web.layout';
import value_web_theme from './v.web.theme';

import func_ant4_v4_icon from './fn.antd4.v4.icon';

import o_v4_component from './variant-v4-hook';

export default {

    /**
     *
     * # Zone 底座：值处理函数
     *
     *
     *
     * <hr/>
     *
     * @module value/zone
     */
    ...func_arrange_value_complex,  // $DOC
    ...func_arrange_value_stdn, // $DOC
    ...func_assort_value_typed, // $DOC
    ...func_assort_value_datetime, // $DOC
    ...func_assort_value_expr,  // $DOC
    /**
     * # Zone 底座：集合计算
     *
     * <hr/>
     *
     * @module element/zone
     */
    ...func_arrange_element_tree,   // $DOC
    /**
     * # Zone 底座：二义性处理
     *
     * <hr/>
     *
     * @module amb/zone
     */
    ...func_assemble_amb_form,   // $DOC
    ...func_assemble_amb_polysemy, // $DOC
    ...func_assemble_element_calculate, // $DOC
    ...func_assemble_element_change, // $DOC
    ...func_assemble_element_qr, // $DOC

    /**
     * # Zone 底座：原子函数
     *
     * <hr/>
     *
     * @module atomic/zone
     */
    ...func_atomic_async,   // $DOC
    ...func_atomic_foundation, // $DOC

    /**
     * # Zone 底座：判断函数
     *
     * <hr/>
     *
     * @module is/zone
     */
    ...func_under_is_business, // $DOC
    ...func_under_is_decision, // $DOC
    ...func_under_is_complex,  // $DOC
    ...func_under_is_rule,     // $DOC

    /**
     * # Zone 底座：迭代函数
     *
     * <hr/>
     *
     * @module it/zone
     */
    ...func_under_it_complex,   // $DOC
    ...func_under_it_spread,    // $DOC
    /**
     * # Zone 底座：转换函数
     *
     * <hr/>
     *
     * @module to/zone
     */
    ...func_under_kv_future,   // $DOC
    ...func_under_to_business, // $DOC
    ...func_under_to_expr,     // $DOC
    ...func_under_to_typed,    // $DOC
    ...func_under_way_io,      // $DOC

    /**
     * # Zone 底座：V4修正函数
     *
     * <hr/>
     *
     * @module v4/zone
     */
    ...func_ant4_v4_icon,       // $DOC

    /**
     * # Zone 底座：调试函数（开发专用）
     *
     * <hr/>
     *
     * @module development/zone
     */
    ...func_debug_fx_error,     // $DOC
    ...func_debug_dg_develop,   // $DOC
    ...func_debug_dg_logging,   // $DOC
    ...func_debug_dgl_complex,  // $DOC

    // React / Html
    ...func_web_compile_store,  // $DOC

    /**
     * # Zone 底座：资源函数
     *
     * <hr/>
     *
     * @module in/zone
     */
    ...func_web_connect_event,  // $DOC
    /**
     * # Zone 底座：资源函数（旧）
     *
     * <hr/>
     *
     * @module from/zone
     * @deprecated
     */
    ...func_web_from_react,     // $DOC
    /**
     * # Zone 底座：提取函数
     * <hr/>
     *
     * @module on/zone
     */
    ...func_web_on_react,       // $DOC

    // ---- Unity
    /**
     * # Zone 底座：格式化函数
     *
     * <hr/>
     *
     * @module format/zone
     */
    ...func_unity_format,       // $DOC
    /**
     * # Zone 底座：加解密函数
     *
     * <hr/>
     *
     * @module crypto/zone
     */
    ...func_unity_encrypt,      // $DOC
    /**
     * # Zone 底座：随机函数
     *
     * <hr/>
     *
     * @module random/zone
     */
    ...func_unity_random,       // $DOC
    /**
     * # Zone 底座：排序函数
     *
     * <hr/>
     *
     * @module sorter/zone
     */
    ...func_unity_sorter,   // $DOC
    ...func_unity_sorter_fn,// $DOC
    /**
     * # Zone 底座：数学函数
     *
     * <hr/>
     * @module math/zone
     */
    ...func_unity_math,

    /**
     * # Zone 底座：高阶对象
     *
     * <hr/>
     *
     * @module hoc/zone
     *
     */
    ...o_bullet_fn, // $DOC
    ...o_bullet_of, // $DOC

    ...o_v4_component, // $DOC
    /**
     *
     * # Zone 底座：常量定义
     *
     * ## 使用
     *
     * ```js
     * import Ux from 'ux';
     *
     * const value = Ux.Env.xxx;
     * ```
     *
     * ## 常量分类
     *
     * 1. **系统变量**：配置在 **开发** 和 **生产** 中的系统环境变量。
     * 2. **调试变量**：配置在环境变量文件中以 `Z_DEV` 开头的变量。
     * 3. **类型常量**：直接定义的用于类型定义的常量，部分类型常量和业务组件相关。
     *
     * ## 核心点：
     *
     * - 没有在API文档中追加注释的环境变量您可以直接从云端白皮书中查看。
     * - 和环境变量相关的常量您可以直接在标题中看到环境变量名，左侧目录中是 `Ux.Env.XXX` 中的 `XXX` 部分，针对环境变量的常量引用不考虑 `Z_` 前缀。
     * - `Meta` 前缀的变量存储的都是名称元数据，您可以使用该名称从浏览器中的 `SessionStorage` 和 `LocalStorage` 中直接提取对应键值中包含的数据。
     * - `Value` 前缀的变量为全局值，Zero UI扩展框架中的核心值相关信息。
     *
     * <hr/>
     *
     * @module constant/zone
     *
     */
    Env: {
        // $DOC
        ...value_env,
        // $DOC
        ...value_modello_type,
        // $DOC
        ...value_modello_op,
        // $DOC
        ...value_feature_key,
        // $DOC
        ...value_feature_http,
        ...value_feature_symbol,
        // $DOC
        ...value_feature_develop,
        // $DOC
        ...value_web_layout,
        // $DOC
        ...value_web_theme,
    }
}