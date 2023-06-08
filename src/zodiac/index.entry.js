import func_antd4_html_effective from './antd4.fn.html.effective';
import func_antd4_message_reply from './antd4.fn.message.reply';
import func_antd4_v4_patch from './antd4.fn.v4.patch';
import func_antd4_v4_patch_form from './antd4.fn.v4.patch.form';

import func_form_form_action from './form.fn.form.action';
import func_form_to_setting from './form.fn.to.setting';
import func_form_write_dependency from './form.fn.write.dependency';

import func_lighting_ajax_callback from './lighting.fn.ajax.callbak';
import func_lighting_ajax_standard from './lighting.fn.ajax.standard';
import func_lighting_ajax_stream from './lighting.fn.ajax.stream';
import func_lighting_async_callback from './lighting.fn.async.callback';
import func_lighting_micro_legacy from './lighting.fn.micro.legacy';
import func_lighting_sock_stomp from './lighting.fn.sock.stomp';

import func_lkway_amb_polysemy from './lkway.fn.amb.polysemy';
import func_lkway_on_under_prop from './lkway.fn.on.under.prop';
import func_lkway_yo_under_prop from './lkway.fn.yo.under.prop';
import func_lkway_rx_event from './lkway.fn.rx.event';

import func_secure_acl_authorization from './secure.fn.acl.authorization';
import func_secure_digit_signature from './secure.fn.digit.signature';

import func_source_datum_assist_io from './source.datum.fn.assist.io';
import func_source_datum_element_qr from './source.datum.fn.element.qr';
import func_source_datum_on_consumer from './source.datum.fn.on.consumer';
import func_source_datum_parse_data from './source.datum.fn.parse.data';
import func_source_datum_value_fabric from './source.datum.fn.value.fabric';
import func_source_parse_expression from './source.fn.parse.expression';
import func_source_parse_extension from './source.fn.parse.extension';
import func_source_parse_transformer from './source.fn.parse.transformer';
import func_source_write_redux from "./source.fn.write.redux";

import func_store_is_configuration from './store.fn.is.configuration';
import func_store_store_application from './store.fn.store.application';

import func_syntax_expr_action from './syntax.fn.ai.expr.action';
import func_syntax_expr_container from './syntax.fn.ai.expr.container';
import func_syntax_expr_content from './syntax.fn.ai.expr.content';
import func_syntax_expr_control from './syntax.fn.ai.expr.control';
import func_syntax_apply_attribute from './syntax.fn.apply.attribute';
import func_syntax_apply_component from './syntax.fn.apply.component';
import func_syntax_apply_rule from './syntax.fn.apply.rule';
import func_syntax_parse_component from './syntax.fn.parse.component';

import func_tree_forest_build from './tree.fn.forest.build';
import func_tree_to_configuration from './tree.fn.to.configuration';
import func_tree_tree_selection from './tree.fn.tree.selection';

import func_vow_dsl_definition from './vow.fn.dsl.definition';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /**
     * # 起源组件：原生HTML
     *
     * <hr/>
     * @module html/zodiac
     */
    // AntV4属性兼容器
    ...func_antd4_html_effective,       // $DOC 效果
    /**
     * # 起源：消息提示
     *
     * <hr/>
     *
     * @module message/zodiac
     */
    ...func_antd4_message_reply,        // $DOC 提示消息
    /**
     * # 起源：V4 补丁
     *
     * <hr/>
     *
     * @module v4/zodiac
     */
    ...func_antd4_v4_patch,             // $DOC V4 升级补丁
    ...func_antd4_v4_patch_form,        // $DOC V4 表单升级补丁
    /**
     * # 起源：表单行为
     *
     * <hr/>
     *
     * @module form/zodiac
     */
    ...func_form_form_action,           // $DOC 表单行为
    /**
     * # 起源：表单配置
     *
     * <hr/>
     *
     * @module to/zodiac
     */
    ...func_form_to_setting,            // $DOC 表单设置
    /**
     * # 起源：表单依赖
     *
     * <hr/>
     *
     * @module write/zodiac
     */
    ...func_form_write_dependency,      // $DOC 表单依赖
    // 远程通信
    /**
     * # 起源：远程函数
     *
     * <hr/>
     *
     * @module remote/zodiac
     */
    ...func_lighting_ajax_callback,     // $DOC 回调
    ...func_lighting_ajax_standard,     // $DOC 标准
    ...func_lighting_ajax_stream,       // $DOC 二进制
    ...func_lighting_async_callback,    // $DOC 回调功能
    ...func_lighting_micro_legacy,      // $DOC 微服务
    ...func_lighting_sock_stomp,        // $DOC 主动
    // 通道层
    /**
     * # 起源：二义性通道
     *
     * <hr/>
     *
     * @module amb/zodiac
     */
    ...func_lkway_amb_polysemy,        // $DOC

    /**
     * # 起源：挂载通道
     *
     * <hr/>
     *
     * @module on/zodiac
     */
    ...func_lkway_on_under_prop,    // $DOC
    /**
     * # 起源：值通道
     *
     * <hr/>
     *
     * @module value/zodiac
     */
    ...func_lkway_yo_under_prop,    // $DOC
    /**
     * # 起源：rx函数通道
     *
     * <hr/>
     *
     * @module rx/zodiac
     */
    ...func_lkway_rx_event,     // $DOC

    // 数字签名模块
    /**
     * # 起源：安全函数
     *
     * <hr/>
     *
     * @module secure/zodiac
     */
    ...func_secure_acl_authorization,   // $DOC
    ...func_secure_digit_signature,     // $DOC
    // 数据字典计算器

    // 数字签名模块
    /**
     * # 起源：辅助数据
     *
     * <hr/>
     *
     * @module assist/zodiac
     */
    ...func_source_datum_assist_io, // $DOC
    /**
     * # 起源：集合运算
     *
     * <hr/>
     *
     * @module element/zodiac
     */
    ...func_source_datum_element_qr,  // $DOC
    ...func_source_datum_on_consumer, // $DOC
    /**
     * # 起源：解析器
     *
     * <hr/>
     *
     * @module parse/zodiac
     */
    ...func_source_datum_parse_data, // $DOC
    ...func_source_parse_expression, // $DOC
    ...func_source_datum_value_fabric,  // $DOC
    ...func_source_parse_extension, // $DOC
    ...func_source_parse_transformer,   // $DOC
    /**
     * # 起源：专用写入数据
     *
     * <hr/>
     *
     * @module write/zodiac
     */
    ...func_source_write_redux, // $DOC
    /**
     * # 起源：配置检查
     *
     * <hr/>
     *
     * @module is/zodiac
     */
    // 浏览器存储
    ...func_store_is_configuration, // $DOC
    /**
     * # 起源：配置存储
     *
     * <hr/>
     *
     * @module store/zodiac
     */
    ...func_store_store_application, // $DOC
    // 属性解析（语法解析）
    /**
     * # 起源：属性解析器
     *
     * <hr/>
     *
     * @module ai-expr/zodiac
     */
    ...func_syntax_expr_action,     // $DOC
    ...func_syntax_expr_container,  // $DOC
    ...func_syntax_expr_content,    // $DOC
    ...func_syntax_expr_control,    // $DOC
    ...func_syntax_parse_component, // $DOC
    /**
     * # 起源：属性适配器
     *
     * <hr/>
     *
     * @module apply/zodiac
     */
    ...func_syntax_apply_attribute, // $DOC
    ...func_syntax_apply_component, // $DOC
    ...func_syntax_apply_rule,      // $DOC
    /**
     * # 起源：树计算
     *
     * <hr/>
     *
     * @module tree/zodiac
     */
    // 树型计算
    ...func_tree_forest_build,      // $DOC
    ...func_tree_to_configuration,  // $DOC
    ...func_tree_tree_selection,    // $DOC
    /**
     * # 起源：即将移除
     *
     * @module deprecated/zodiac
     * @deprecated
     */
    // 未来放弃
    ...func_vow_dsl_definition
}