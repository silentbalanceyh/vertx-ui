import func_annotation_anno_util from './annotation.fn.anno.util';
import func_annotation_anno_error from './annotation.fn.anno.error';

import func_debugger_dev_switcher from './debugger.fn.dev.switcher';

import func_lkway_on_web_prop from './lkway.fn.on.web.prop';
import func_lighting_ajax_uca from './lighting.fn.ajax.uca';
import func_lighting_async_commerce from './lighting.fn.async.commerce';

import func_page_ai_layout_norm from './page.fn.ai.layout.norm';
import func_page_to_rect from './page.fn.to.rect';
import func_page_to_theme from './page.fn.to.theme';

import func_query_qr_interact_form from './query.fn.qr.interact.form';
import func_query_qr_interact_element from './query.fn.qr.interact.element';
import func_query_qr_operation_unit from './query.fn.qr.operation.unit';
import func_query_qr_syntax_calculate from './query.fn.ir.syntax.calculate';
import func_query_qr_syntax_parser from './query.fn.qr.syntax.parser';

import func_redux_$_epic_observable from './redux.fn._.epic.observable';
import func_redux_data_reducer from './redux.fn.data.reducer';
import func_redux_fixbug from './redux.fn.is.fixbug';
import func_redux_rx_observable from './redux.fn.rx.observable';

import func_router_is_locate from './router.fn.is.locate';
import func_router_to_location from './router.fn.to.location';
import func_router_to_parameter from './router.fn.to.parameter';

import func_uca_xt_control_form from './uca.fn.xt.control.form';
import func_uca_xt_control_row from './uca.fn.xt.control.row';
import func_uca_xt_control_upload from './uca.fn.xt.control.upload';

import func_uca_xt_economy_dialog from './uca.fn.xt.economy.dialog';
import func_uca_xt_economy_search from './uca.fn.xt.economy.search';
import func_uca_xt_economy_table from './uca.fn.xt.economy.table';

import func_uca_xt_expr_parser from './uca.fn.xt.expr.parser';
import func_uca_xt_init_typed from './uca.fn.xt.init.typed';
import func_uca_xt_inited_values from './uca.fn.xt.inited.values';
import func_uca_xt_lazy_loading from './uca.fn.xt.lazy.loading';
import func_uca_xt_lazy_ready from './uca.fn.xt.lazy.ready';
import func_uca_xt_op_event from './uca.fn.xt.op.event';
import func_uca_xt_op_primary from './uca.fn.xt.op.primary';

import func_verify_valve_validator from './verify.fn.valve.validator';

import func_web_pin_active_in from './web-pin.fn.active.in';
import func_web_pin_anchor_out from './web-pin.fn.anchor.out';

import func_window_rx_event from './window.fn.rx.event';
import o_window_bullet from './window.o.silver.bullet.wl';

import v_web_icon_set from './v.web.icon.set';
import v_verify_constant from './v.verify.constant';
import v_limitation from './v.uca.limitation';
import v_economy_business from './v.economy.business';

import future from './web-loader.@fn.future';

export default {
    ...func_annotation_anno_util,   // $DOC
    ...func_annotation_anno_error,  // $DOC
    /**
     * # 交互接口：调试器
     *
     * <hr/>
     *
     * @module dev/zion
     */
    ...func_debugger_dev_switcher,  // $DOC
    /**
     * # 交互接口：通道挂载
     *
     * <hr/>
     *
     * @module on/zion
     */
    ...func_lkway_on_web_prop,      // $DOC
    /**
     * # 交互接口：远程调用
     *
     * <hr/>
     *
     * @module remote/zion
     */
    ...func_lighting_ajax_uca,      // $DOC
    ...func_lighting_async_commerce,// $DOC
    /**
     * # 交互接口：查询引擎
     *
     * <hr/>
     *
     * @module qr/zion
     */
    ...func_query_qr_interact_form,     // $DOC
    ...func_query_qr_interact_element,  // $DOC
    ...func_query_qr_operation_unit,    // $DOC
    ...func_query_qr_syntax_calculate,  // $DOC
    ...func_query_qr_syntax_parser,     // $DOC
    /**
     * # 交互接口：Redux
     *
     * <hr/>
     *
     * @module data/zion
     */
    ...func_redux_$_epic_observable,    // $DOC
    ...func_redux_data_reducer,         // $DOC
    ...func_redux_fixbug,               // $DOC
    /**
     * # 交互接口：函数
     *
     * <hr/>
     *
     * @module rx/zion
     */
    ...func_redux_rx_observable,        // $DOC

    /**
     * # 交互接口：判断函数
     *
     * <hr/>
     *
     * @module is/zion
     */
    ...func_router_is_locate,           // $DOC
    /**
     * # 交互接口：转换函数
     *
     * <hr/>
     *
     * @module to/zion
     */
    ...func_router_to_location,         // $DOC
    ...func_router_to_parameter,        // $DOC

    /**
     * # 交互接口：组件事件
     *
     * <hr/>
     *
     * @module xt/zion
     */
    ...func_uca_xt_control_form,        // $DOC
    ...func_uca_xt_control_row,         // $DOC
    ...func_uca_xt_control_upload,      // $DOC

    ...func_uca_xt_economy_dialog,      // $DOC
    ...func_uca_xt_economy_search,      // $DOC
    ...func_uca_xt_economy_table,       // $DOC

    ...func_uca_xt_expr_parser,        // $DOC
    ...func_uca_xt_init_typed,        // $DOC
    /**
     * # 交互接口：智能化
     * <hr/>
     * @module ai/zion
     */
    ...func_uca_xt_inited_values,    // $DOC
    ...func_uca_xt_lazy_loading,    // $DOC
    ...func_uca_xt_lazy_ready,      // $DOC
    ...func_uca_xt_op_event,        // $DOC
    ...func_uca_xt_op_primary,      // $DOC

    ...func_verify_valve_validator, // $DOC

    ...func_page_ai_layout_norm,// $DOC
    ...func_page_to_rect,       // $DOC
    ...func_page_to_theme,      // $DOC

    /**
     * # 交互接口：锚点交互函数
     * <hr/>
     * @module a/zion
     */
    ...func_web_pin_active_in,// $DOC
    ...func_web_pin_anchor_out,// $DOC

    ...func_window_rx_event,
    /**
     * # 交互接口：高阶对象
     *
     * <hr/>
     * @module hoc/zion
     */
    ...o_window_bullet,// $DOC

    future,

    Env: {
        /**
         * # 交互接口：中间常量
         *
         * <hr/>
         * @module constant/zion
         */
        ...v_verify_constant,
        ...v_web_icon_set,
        ...v_limitation,
        ...v_economy_business,
    }
}